import { NextResponse } from "next/server"

export async function GET() {
  // Only check server-side env var
  const hasGroqKey = !!process.env.GROQ_API_KEY

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

