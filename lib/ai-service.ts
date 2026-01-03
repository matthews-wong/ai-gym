import { MealPlan } from "@/lib/services/ai/types"
import { supabase } from "@/lib/supabase"

export type { MealPlan }

export async function getApiStatus() {
  try {
    const response = await fetch("/api/env")
    if (!response.ok) throw new Error("Failed to check API status")
    const data = await response.json()
    return {
      responseStatus: {
        serviceAvailable: data.hasGroqKey,
        message: data.hasGroqKey ? "Service available" : "API key missing",
      },
    }
  } catch (error) {
    console.error("API Status Check Error:", error)
    return {
      responseStatus: {
        serviceAvailable: false,
        message: "Service unavailable",
      },
    }
  }
}

export async function generateMealPlan(formData: any): Promise<MealPlan> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const response = await fetch("/api/meal/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to generate meal plan")
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error("Response body is not readable")

  const decoder = new TextDecoder()
  let result: MealPlan | null = null
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith("data: ")) {
        try {
          const data = JSON.parse(trimmedLine.slice(6))
          if (data.error) {
            throw new Error(data.error)
          }
          if (data.done && data.plan) {
            result = data.plan
          }
        } catch (e) {
          // If it's the error we threw, rethrow it
          if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
             if (lines.includes(line)) { // Only throw if it was a complete line
                 // Actually, if we manually threw "data.error", we want to propagate it.
                 // But JSON.parse might fail on partial data if logic is wrong.
                 // The "data.error" check is inside the try block.
             }
          }
          // If we threw an error from data.error, rethrow it
          if (e instanceof Error && !e.message.startsWith("Unexpected token") && !e.message.startsWith("JSON Parse error")) {
             throw e;
          }
          console.error("Error parsing SSE data:", e)
        }
      }
    }
  }

  if (!result) {
    throw new Error("No plan generated")
  }

  return result
}
