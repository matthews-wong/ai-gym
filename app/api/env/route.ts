import { NextResponse } from "next/server"

export async function GET() {
  // Log the environment variable status (without exposing the actual key)
  const hasGroqKey = !!process.env.NEXT_PUBLIC_GROQ_API_KEY 
  console.log("API route: GROQ_API_KEY is", hasGroqKey ? "set" : "not set")

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

