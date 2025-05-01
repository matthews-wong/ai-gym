#!/bin/bash
# Deploy hook script - runs after each certificate is issued/renewed
# Path: renewal-hooks/deploy/sync_certs.sh

# Log file path
LOG_FILE="/var/log/certbot-logs/certbot-$(date '+%Y-%m-%d').log"
mkdir -p /var/log/certbot-logs

# SMTP Email Configuration
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@commsult.id"
SMTP_PASS="eZNDk766L2c6dUxq"
SMTP_FROM="noreply@commsult.id"
SMTP_TO="matthews.wong@commsult.id"
SMTP_CC="matthewswong2610@gmail.com" 

# Function to log messages (to stdout and file)
log_message() {
    local level="$1"
    local message="$2"
    local log_entry="[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message"
    echo "$log_entry" | tee -a "$LOG_FILE"
}

# Function to send email notifications
send_email() {
    local subject="$1"
    local body="$2"
    local cc_recipient="${3:-$SMTP_CC}"  # Optional third parameter, defaults to SMTP_CC
    
    log_message "INFO" "Attempting to send email notification: $subject"
    
    # Prepare email payload with CC support
    email_payload=$(echo -e "From: $SMTP_FROM\nTo: $SMTP_TO\nCc: $cc_recipient\nSubject: $subject\nMIME-Version: 1.0\nContent-Type: text/plain; charset=UTF-8\n\n$body")
    
    # Send email using curl with multiple recipients
    curl -s --url "smtp://$SMTP_SERVER:$SMTP_PORT" \
         --ssl-reqd \
         --mail-from "$SMTP_FROM" \
         --mail-rcpt "$SMTP_TO" \
         --mail-rcpt "$cc_recipient" \
         --user "$SMTP_USER:$SMTP_PASS" \
         --upload-file <(echo "$email_payload") \
         && log_message "SUCCESS" "Email sent successfully to $SMTP_TO and $cc_recipient" \
         || {
             log_message "ERROR" "Failed to send email via SMTP"
             # Optional fallback method
             echo "$body" | mail -s "$subject" -c "$cc_recipient" "$SMTP_TO"
         }
}

# Function to convert domain to safe directory name
get_safe_dirname() {
    local domain="$1"
    # Replace wildcard with "wildcard" text or just remove the asterisk and dot
    echo "$domain" | sed 's/\*\./_wildcard_/g'
}

# Read forced renewal domains (if any)
FORCE_SYNC_FILE="/etc/certbot-sync/force_sync_domains.txt"
FORCE_RENEW_DOMAINS=""

if [[ -f "$FORCE_SYNC_FILE" ]]; then
    FORCE_RENEW_DOMAINS=$(cat "$FORCE_SYNC_FILE" | xargs)  # Read and remove spaces/newlines
    if [[ -n "$FORCE_RENEW_DOMAINS" ]]; then
        log_message "INFO" "Forcing renewal for domains: $FORCE_RENEW_DOMAINS"
        RENEWED_DOMAINS="$FORCE_RENEW_DOMAINS"  # Override renewed domains
        echo -n "" > "$FORCE_SYNC_FILE"  # Clear file after use
    fi
fi

log_message "INFO" "Certificate deploy hook triggered for: $RENEWED_DOMAINS"
log_message "INFO" "Certificate path: $RENEWED_LINEAGE"

# Define domains and their associated servers - all users will have sudo
declare -A DOMAIN_SERVERS
DOMAIN_SERVERS["*.commsult.dev"]="matthews@cs-gcp-cafe-ng-as-test-11.commsult.id"
# Add more domains and servers as needed
# DOMAIN_SERVERS["example.com"]="user@server1.example.com user@server2.example.com"

SSH_KEY="/root/.ssh/id_rsaa"

PROCESSED_DOMAINS=0
FAILED_DOMAINS=0
FAILURE_DETAILS=""
read -ra DOMAINS_ARRAY <<< "$RENEWED_DOMAINS"

for RENEWED_DOMAIN in "${DOMAINS_ARRAY[@]}"; do
    if [[ -v DOMAIN_SERVERS["$RENEWED_DOMAIN"] ]]; then
        log_message "INFO" "Processing renewed domain: $RENEWED_DOMAIN"
        
        # Create a safe directory name for the domain
        SAFE_DOMAIN_DIR=$(get_safe_dirname "$RENEWED_DOMAIN")
        log_message "INFO" "Using directory name: $SAFE_DOMAIN_DIR for domain: $RENEWED_DOMAIN"
        
        LOCAL_CERT="$RENEWED_LINEAGE/fullchain.pem"
        LOCAL_KEY="$RENEWED_LINEAGE/privkey.pem"
        
        if [[ ! -f "$LOCAL_CERT" || ! -f "$LOCAL_KEY" ]]; then
            log_message "ERROR" "Missing certificate or key for $RENEWED_DOMAIN! Skipping..."
            FAILED_DOMAINS=$((FAILED_DOMAINS + 1))
            FAILURE_DETAILS+="Domain $RENEWED_DOMAIN: Missing certificate or key files\n"
            continue
        fi
        
        ISSUE_DATE=$(openssl x509 -noout -startdate -in "$LOCAL_CERT" | cut -d= -f2)
        EXPIRY_DATE=$(openssl x509 -noout -enddate -in "$LOCAL_CERT" | cut -d= -f2)
        log_message "INFO" "Certificate details for $RENEWED_DOMAIN: Issued on $ISSUE_DATE, expires on $EXPIRY_DATE"
        
        IFS=' ' read -ra SERVERS <<< "${DOMAIN_SERVERS[$RENEWED_DOMAIN]}"
        for SERVER in "${SERVERS[@]}"; do
            log_message "INFO" "Syncing SSL certificate to $SERVER"
            
            # Using consistent approach for all servers with sudo access
            TARGET_DIR="/etc/certs/$SAFE_DOMAIN_DIR"
            TMP_DIR="/tmp/cert_sync_$SAFE_DOMAIN_DIR"
            
            # Create temp directory first
            ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i "$SSH_KEY" "$SERVER" \
                "mkdir -p $TMP_DIR" || {
                log_message "ERROR" "Failed to create temporary directory on $SERVER"
                FAILED_DOMAINS=$((FAILED_DOMAINS + 1))
                FAILURE_DETAILS+="Domain $RENEWED_DOMAIN on $SERVER: Failed to create temp directory\n"
                continue
            }
            
            # Upload certificates to temp directory
            rsync -avz -L -e "ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i $SSH_KEY" \
                "$LOCAL_CERT" "$SERVER:$TMP_DIR/fullchain.pem" || {
                log_message "ERROR" "Failed to sync certificate to $SERVER temporary directory"
                FAILED_DOMAINS=$((FAILED_DOMAINS + 1))
                FAILURE_DETAILS+="Domain $RENEWED_DOMAIN on $SERVER: Failed to sync certificate to temp directory\n"
                continue
            }
            
            rsync -avz -L -e "ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i $SSH_KEY" \
                "$LOCAL_KEY" "$SERVER:$TMP_DIR/privkey.pem" || {
                log_message "ERROR" "Failed to sync private key to $SERVER temporary directory"
                FAILED_DOMAINS=$((FAILED_DOMAINS + 1))
                FAILURE_DETAILS+="Domain $RENEWED_DOMAIN on $SERVER: Failed to sync private key to temp directory\n"
                continue
            }
            
            # Use sudo to create target directory, move files and set proper ownership
            ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i "$SSH_KEY" "$SERVER" \
                "sudo mkdir -p $TARGET_DIR && \
                 sudo mv $TMP_DIR/fullchain.pem $TARGET_DIR/fullchain.pem && \
                 sudo mv $TMP_DIR/privkey.pem $TARGET_DIR/privkey.pem && \
                 sudo chmod 644 $TARGET_DIR/fullchain.pem && \
                 sudo chmod 600 $TARGET_DIR/privkey.pem && \
                 sudo chown -R root:root $TARGET_DIR && \
                 rm -rf $TMP_DIR" || {
                log_message "ERROR" "Failed to move certificates from temporary directory to target on $SERVER"
                FAILED_DOMAINS=$((FAILED_DOMAINS + 1))
                FAILURE_DETAILS+="Domain $RENEWED_DOMAIN on $SERVER: Failed to install certificates using sudo\n"
                continue
            }
            
            # Verify the certificate on the remote server
            log_message "INFO" "Checking SSL Configuration on $SERVER"
            SSL_ERRORS=$(ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i "$SSH_KEY" "$SERVER" \
                "sudo openssl s_client -connect localhost:443 -servername $RENEWED_DOMAIN -showcerts </dev/null 2>&1 | grep -E 'error|cipher'")
            
            if [[ -z "$SSL_ERRORS" ]]; then
                log_message "INFO" "SSL configuration is valid for $SERVER"
            else
                log_message "ERROR" "SSL configuration issues detected on $SERVER: $SSL_ERRORS"
                FAILURE_DETAILS+="Domain $RENEWED_DOMAIN on $SERVER: SSL configuration issues: $SSL_ERRORS\n"
            fi
            
            # Reload Nginx
            if ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i "$SSH_KEY" "$SERVER" "sudo nginx -s reload" 2>/dev/null; then
                log_message "SUCCESS" "SSL Certificate updated and Nginx restarted on $SERVER"
            else
                log_message "WARNING" "Certificate updated but Nginx reload failed on $SERVER"
                FAILURE_DETAILS+="Domain $RENEWED_DOMAIN on $SERVER: Nginx reload failed\n"
            fi
        done
        
        log_message "INFO" "Certificate sync completed for $RENEWED_DOMAIN"
        PROCESSED_DOMAINS=$((PROCESSED_DOMAINS + 1))
    fi
done

# Send email notification if any failures occurred
if [[ $FAILED_DOMAINS -gt 0 ]]; then
    EMAIL_SUBJECT="[ALERT] SSL Certificate Renewal Failures"
    EMAIL_BODY="SSL Certificate renewal/sync process encountered $FAILED_DOMAINS failures.\n\nDetails:\n$FAILURE_DETAILS\n\nPlease check the logs at $LOG_FILE for more information."
    send_email "$EMAIL_SUBJECT" "$EMAIL_BODY"
    log_message "WARNING" "Sent failure notification email for $FAILED_DOMAINS domain(s)"
fi

if [[ $PROCESSED_DOMAINS -eq 0 ]]; then
    log_message "INFO" "No matching domain configurations found for: $RENEWED_DOMAINS. Exiting without action."
    exit 0
else
    log_message "INFO" "Successfully processed $PROCESSED_DOMAINS domain(s) with $FAILED_DOMAINS failure(s)"
fi