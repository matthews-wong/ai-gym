import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getClientIp } from "@/lib/rate-limit"
import { checkUsageLimit, LIMITS } from "@/lib/services/usageService"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request)
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as "workout" | "meal" | null

    if (!type || !["workout", "meal"].includes(type)) {
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }

    // Check for auth token
    const authHeader = request.headers.get("authorization")
    let userId: string | null = null

    try {
      if (authHeader?.startsWith("Bearer ") && supabaseAnonKey) {
        const token = authHeader.slice(7)
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data: { user } } = await supabase.auth.getUser(token)
        userId = user?.id || null
      }
    } catch (e) {
      console.warn("Auth check failed:", e)
    }

    const result = await checkUsageLimit(userId, type, clientIp)

    return NextResponse.json({
      ...result,
      limits: userId ? LIMITS.authenticated : LIMITS.anonymous,
      isAuthenticated: !!userId,
    })
  } catch (error) {
    console.error("Usage check error:", error)
    return NextResponse.json({ error: "Failed to check usage" }, { status: 500 })
  }
}
