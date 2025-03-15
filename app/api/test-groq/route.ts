import { NextResponse } from "next/server"
import Groq from "groq-sdk"

export async function GET() {
  try {
    // Log environment variable status
    const apiKey = process.env.GROQ_API_KEY
    console.log("API route test-groq: GROQ_API_KEY is", apiKey ? "set" : "not set")
    console.log("API key length:", apiKey?.length || 0)

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GROQ_API_KEY is not set",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Initialize Groq client
    const groq = new Groq({
      apiKey: apiKey,
    })

    // Make a simple test call to Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Respond with a simple JSON object with a hello property that says 'world'" },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    })

    const responseContent = completion.choices[0]?.message?.content || "{}"

    // Ensure we're getting valid JSON
    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseContent)
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON response from Groq API",
          rawResponse: responseContent,
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Groq API is working correctly",
        response: parsedResponse,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error: any) {
    console.error("Error testing Groq API:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

