type RateLimitRecord = {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return { success: true, remaining: config.maxRequests - 1, resetIn: config.windowMs }
  }

  if (record.count >= config.maxRequests) {
    return { success: false, remaining: 0, resetIn: record.resetTime - now }
  }

  record.count++
  return { success: true, remaining: config.maxRequests - record.count, resetIn: record.resetTime - now }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return "anonymous"
}
