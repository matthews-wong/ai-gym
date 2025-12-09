import { supabase } from "./supabase"
import crypto from "crypto"

export function generateCacheKey(prefix: string, data: object): string {
  const hash = crypto.createHash("md5").update(JSON.stringify(data)).digest("hex")
  return `${prefix}_${hash}`
}

export async function getCachedResponse<T>(cacheKey: string): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from("api_cache")
      .select("response, expires_at")
      .eq("cache_key", cacheKey)
      .single()

    if (error || !data) return null

    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("api_cache").delete().eq("cache_key", cacheKey)
      return null
    }

    return data.response as T
  } catch {
    return null
  }
}

export async function setCachedResponse<T>(
  cacheKey: string,
  response: T,
  ttlMinutes: number = 60
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()
    
    await supabase.from("api_cache").upsert({
      cache_key: cacheKey,
      response,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
    })
  } catch {
    // Silently fail cache writes
  }
}
