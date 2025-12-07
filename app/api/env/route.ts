import { NextResponse } from "next/server"

export async function GET() {
  // Check both server-side and public env vars
  const hasGroqKey = !!(process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY)

  return NextResponse.json(
    {
      hasGroqKey: hasGroqKey,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

