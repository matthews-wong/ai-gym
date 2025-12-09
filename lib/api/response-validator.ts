import { z } from "zod"

const MAX_RETRIES = 2
const RETRY_DELAY_MS = 1000

interface ValidationResult<T> {
  success: boolean
  data?: T
  error?: string
  retryable: boolean
}

interface RetryConfig {
  maxRetries?: number
  delayMs?: number
  onRetry?: (attempt: number, error: string) => void
}

// Sanitize string content to prevent XSS
export function sanitizeString(str: string): string {
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;")
    .replace(/\${/g, "&#36;{") // Template literal injection
}

// Deep sanitize an object
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === "string") {
    return sanitizeString(obj) as T
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as T
  }
  
  if (obj !== null && typeof obj === "object") {
    const sanitized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized as T
  }
  
  return obj
}

// Validate response structure
export function validateResponse<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    const parsed = schema.parse(data)
    const sanitized = sanitizeObject(parsed)
    return { success: true, data: sanitized, retryable: false }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ")
      return { 
        success: false, 
        error: `Validation failed: ${issues}`,
        retryable: true // Schema errors are retryable - AI might generate better response
      }
    }
    return { 
      success: false, 
      error: "Unknown validation error",
      retryable: false 
    }
  }
}

// Check if workout plan has required days
export function validateWorkoutCompleteness(
  data: unknown,
  expectedDays: number
): ValidationResult<unknown> {
  if (!data || typeof data !== "object") {
    return { success: false, error: "Invalid response structure", retryable: true }
  }

  const plan = data as Record<string, unknown>
  const workouts = plan.workouts as Record<string, unknown> | undefined

  if (!workouts) {
    return { success: false, error: "Missing workouts object", retryable: true }
  }

  const dayCount = Object.keys(workouts).length
  if (dayCount < expectedDays) {
    return { 
      success: false, 
      error: `Incomplete plan: expected ${expectedDays} days, got ${dayCount}`,
      retryable: true 
    }
  }

  // Check each day has exercises
  for (const [day, workout] of Object.entries(workouts)) {
    const w = workout as Record<string, unknown>
    if (!Array.isArray(w.exercises) || w.exercises.length === 0) {
      return { 
        success: false, 
        error: `${day} has no exercises`,
        retryable: true 
      }
    }
  }

  return { success: true, data, retryable: false }
}

// Check if meal plan has all 7 days
export function validateMealCompleteness(data: unknown): ValidationResult<unknown> {
  if (!data || typeof data !== "object") {
    return { success: false, error: "Invalid response structure", retryable: true }
  }

  const plan = data as Record<string, unknown>
  const meals = plan.meals as Record<string, unknown> | undefined

  if (!meals) {
    return { success: false, error: "Missing meals object", retryable: true }
  }

  const expectedDays = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"]
  const missingDays = expectedDays.filter(day => !meals[day])

  if (missingDays.length > 0) {
    return { 
      success: false, 
      error: `Missing days: ${missingDays.join(", ")}`,
      retryable: true 
    }
  }

  // Check each day has meals
  for (const day of expectedDays) {
    const dayMeals = meals[day]
    if (!Array.isArray(dayMeals) || dayMeals.length === 0) {
      return { 
        success: false, 
        error: `${day} has no meals`,
        retryable: true 
      }
    }
  }

  return { success: true, data, retryable: false }
}

// Retry wrapper for async operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxRetries = MAX_RETRIES, delayMs = RETRY_DELAY_MS, onRetry } = config
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < maxRetries) {
        onRetry?.(attempt + 1, lastError.message)
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)))
      }
    }
  }

  throw lastError
}

// Parse JSON with error handling
export function safeJsonParse(content: string): { success: boolean; data?: unknown; error?: string } {
  try {
    // Try to fix common JSON issues
    let cleaned = content.trim()
    
    // Remove markdown code blocks if present
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7)
    }
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3)
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3)
    }
    
    cleaned = cleaned.trim()
    
    const data = JSON.parse(cleaned)
    return { success: true, data }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "JSON parse error" 
    }
  }
}
