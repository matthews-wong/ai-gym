type PendingRequest<T> = {
  promise: Promise<T>
  timestamp: number
  abortController: AbortController
}

const pendingRequests = new Map<string, PendingRequest<unknown>>()
const REQUEST_TTL = 60000 // 1 minute TTL for pending requests

// Generate a unique key for a request
export function generateRequestKey(endpoint: string, params: Record<string, unknown>): string {
  const sortedParams = JSON.stringify(params, Object.keys(params).sort())
  return `${endpoint}:${sortedParams}`
}

// Check if a request is already in flight
export function hasPendingRequest(key: string): boolean {
  const pending = pendingRequests.get(key)
  if (!pending) return false
  
  // Check if expired
  if (Date.now() - pending.timestamp > REQUEST_TTL) {
    pendingRequests.delete(key)
    return false
  }
  
  return true
}

// Get pending request promise
export function getPendingRequest<T>(key: string): Promise<T> | null {
  const pending = pendingRequests.get(key)
  if (!pending || Date.now() - pending.timestamp > REQUEST_TTL) {
    return null
  }
  return pending.promise as Promise<T>
}

// Register a new pending request
export function registerPendingRequest<T>(
  key: string,
  promise: Promise<T>,
  abortController: AbortController
): void {
  pendingRequests.set(key, {
    promise,
    timestamp: Date.now(),
    abortController,
  })

  // Clean up when promise resolves or rejects
  promise.finally(() => {
    // Only delete if it's still the same request
    const current = pendingRequests.get(key)
    if (current?.promise === promise) {
      pendingRequests.delete(key)
    }
  })
}

// Cancel a pending request
export function cancelPendingRequest(key: string): boolean {
  const pending = pendingRequests.get(key)
  if (!pending) return false
  
  pending.abortController.abort()
  pendingRequests.delete(key)
  return true
}

// Cancel all pending requests for a specific endpoint
export function cancelAllPendingForEndpoint(endpoint: string): number {
  let cancelled = 0
  for (const [key, pending] of pendingRequests.entries()) {
    if (key.startsWith(`${endpoint}:`)) {
      pending.abortController.abort()
      pendingRequests.delete(key)
      cancelled++
    }
  }
  return cancelled
}

// Cleanup expired requests
export function cleanupExpiredRequests(): number {
  let cleaned = 0
  const now = Date.now()
  
  for (const [key, pending] of pendingRequests.entries()) {
    if (now - pending.timestamp > REQUEST_TTL) {
      pendingRequests.delete(key)
      cleaned++
    }
  }
  
  return cleaned
}

// Get stats about pending requests
export function getRequestStats(): { total: number; byEndpoint: Record<string, number> } {
  const byEndpoint: Record<string, number> = {}
  
  for (const key of pendingRequests.keys()) {
    const endpoint = key.split(":")[0]
    byEndpoint[endpoint] = (byEndpoint[endpoint] || 0) + 1
  }
  
  return {
    total: pendingRequests.size,
    byEndpoint,
  }
}

// Deduplicated fetch wrapper
export async function deduplicatedRequest<T>(
  key: string,
  requestFn: (signal: AbortSignal) => Promise<T>
): Promise<T> {
  // Check for existing request
  const existing = getPendingRequest<T>(key)
  if (existing) {
    return existing
  }

  // Create new request
  const abortController = new AbortController()
  const promise = requestFn(abortController.signal)
  
  registerPendingRequest(key, promise, abortController)
  
  return promise
}
