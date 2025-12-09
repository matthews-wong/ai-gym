import { supabase } from "@/lib/supabase"

export type PlanType = "workout" | "meal"

interface UsageLimits {
  workout: number
  meal: number
}

const ANONYMOUS_LIMITS: UsageLimits = { workout: 1, meal: 1 }
const AUTHENTICATED_LIMITS: UsageLimits = { workout: 2, meal: 2 }
const STORAGE_KEY = "aigym_usage"

interface LocalUsage {
  workout: number
  meal: number
  lastReset: string
}

function getToday(): string {
  return new Date().toISOString().split("T")[0]
}

// Local storage tracking for anonymous users
function getLocalUsage(): LocalUsage {
  if (typeof window === "undefined") {
    return { workout: 0, meal: 0, lastReset: getToday() }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { workout: 0, meal: 0, lastReset: getToday() }
    }
    
    const usage: LocalUsage = JSON.parse(stored)
    
    // Reset if it's a new day
    if (usage.lastReset !== getToday()) {
      const reset = { workout: 0, meal: 0, lastReset: getToday() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reset))
      return reset
    }
    
    return usage
  } catch {
    return { workout: 0, meal: 0, lastReset: getToday() }
  }
}

function setLocalUsage(usage: LocalUsage): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage))
  } catch {
    // Storage full or unavailable
  }
}

export function incrementLocalUsage(type: PlanType): void {
  const usage = getLocalUsage()
  usage[type]++
  setLocalUsage(usage)
}

export function getLocalUsageCount(type: PlanType): number {
  return getLocalUsage()[type]
}

export function canGenerateLocal(type: PlanType): boolean {
  const usage = getLocalUsage()
  return usage[type] < ANONYMOUS_LIMITS[type]
}

export function getRemainingLocal(type: PlanType): number {
  const usage = getLocalUsage()
  return Math.max(0, ANONYMOUS_LIMITS[type] - usage[type])
}

// Supabase tracking for authenticated users
export async function getUserUsage(userId: string): Promise<UsageLimits> {
  try {
    const today = getToday()
    
    const { data, error } = await supabase
      .from("user_usage")
      .select("workout_count, meal_count, usage_date")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .single()

    // If table doesn't exist or no data, return 0 usage
    if (error || !data) {
      return { workout: 0, meal: 0 }
    }

    return {
      workout: data.workout_count || 0,
      meal: data.meal_count || 0,
    }
  } catch (error) {
    console.warn("Failed to get user usage:", error)
    return { workout: 0, meal: 0 }
  }
}

export async function incrementUserUsage(userId: string, type: PlanType): Promise<boolean> {
  try {
    const today = getToday()
    
    // Try to get existing record
    const { data: existing } = await supabase
      .from("user_usage")
      .select("id, workout_count, meal_count")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .single()

    if (existing) {
      // Update existing record
      const field = type === "workout" ? "workout_count" : "meal_count"
      const { error } = await supabase
        .from("user_usage")
        .update({ [field]: (existing[field as keyof typeof existing] as number || 0) + 1 })
        .eq("id", existing.id)
      
      return !error
    } else {
      // Create new record
      const { error } = await supabase
        .from("user_usage")
        .insert({
          user_id: userId,
          usage_date: today,
          workout_count: type === "workout" ? 1 : 0,
          meal_count: type === "meal" ? 1 : 0,
        })
      
      return !error
    }
  } catch (error) {
    console.warn("Failed to increment user usage:", error)
    return false
  }
}

export async function canUserGenerate(userId: string, type: PlanType): Promise<boolean> {
  const usage = await getUserUsage(userId)
  return usage[type] < AUTHENTICATED_LIMITS[type]
}

export async function getUserRemaining(userId: string, type: PlanType): Promise<number> {
  const usage = await getUserUsage(userId)
  return Math.max(0, AUTHENTICATED_LIMITS[type] - usage[type])
}

// API helpers
export async function checkUsageLimit(
  userId: string | null,
  type: PlanType,
  clientIp: string
): Promise<{ allowed: boolean; remaining: number; requiresAuth: boolean }> {
  try {
    if (userId) {
      // Authenticated user
      const canGenerate = await canUserGenerate(userId, type)
      const remaining = await getUserRemaining(userId, type)
      return { allowed: canGenerate, remaining, requiresAuth: false }
    } else {
      // Anonymous user - use IP-based localStorage simulation for API
      // We'll track by IP on the server side for anonymous users
      const storageKey = `anon_${clientIp}_${type}_${getToday()}`
      
      const { data, error } = await supabase
        .from("anonymous_usage")
        .select("count")
        .eq("identifier", storageKey)
        .single()

      // If table doesn't exist or other error, allow generation
      if (error && error.code !== "PGRST116") {
        console.warn("Usage check failed, allowing generation:", error.message)
        return { allowed: true, remaining: 1, requiresAuth: false }
      }

      const count = data?.count || 0
      const limit = ANONYMOUS_LIMITS[type]
      
      return {
        allowed: count < limit,
        remaining: Math.max(0, limit - count),
        requiresAuth: count >= limit,
      }
    }
  } catch (error) {
    // If usage check fails, allow generation (fail open)
    console.warn("Usage check error, allowing generation:", error)
    return { allowed: true, remaining: 1, requiresAuth: false }
  }
}

export async function recordUsage(
  userId: string | null,
  type: PlanType,
  clientIp: string
): Promise<boolean> {
  try {
    if (userId) {
      return incrementUserUsage(userId, type)
    } else {
      // Track anonymous usage by IP
      const storageKey = `anon_${clientIp}_${type}_${getToday()}`
      
      const { data: existing } = await supabase
        .from("anonymous_usage")
        .select("id, count")
        .eq("identifier", storageKey)
        .single()

      if (existing) {
        const { error } = await supabase
          .from("anonymous_usage")
          .update({ count: existing.count + 1 })
          .eq("id", existing.id)
        return !error
      } else {
        const { error } = await supabase
          .from("anonymous_usage")
          .insert({ identifier: storageKey, count: 1 })
        return !error
      }
    }
  } catch (error) {
    // If recording fails, just log and continue
    console.warn("Failed to record usage:", error)
    return false
  }
}

export const LIMITS = {
  anonymous: ANONYMOUS_LIMITS,
  authenticated: AUTHENTICATED_LIMITS,
}
