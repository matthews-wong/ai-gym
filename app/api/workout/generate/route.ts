import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import { z } from "zod"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { generateCacheKey, getCachedResponse, setCachedResponse } from "@/lib/cache"
import { workoutFormSchema, type WorkoutFormInput } from "@/lib/validations"
import { 
  validateResponse, 
  validateWorkoutCompleteness, 
  sanitizeObject, 
  safeJsonParse,
  withRetry 
} from "@/lib/api/response-validator"
import { 
  generateRequestKey, 
  hasPendingRequest, 
  getPendingRequest,
  registerPendingRequest,
  cancelPendingRequest 
} from "@/lib/api/request-dedup"

const apiKey = process.env.GROQ_API_KEY
let groq: Groq | null = null

if (apiKey) {
  groq = new Groq({ apiKey })
}

const workoutPlanSchema = z.object({
  summary: z.object({
    goal: z.string(),
    level: z.string(),
    daysPerWeek: z.number(),
    sessionLength: z.number(),
    focusAreas: z.array(z.string()),
    equipment: z.string(),
  }),
  overview: z.string(),
  workouts: z.record(
    z.object({
      focus: z.string(),
      description: z.string(),
      exercises: z.array(
        z.object({
          name: z.string(),
          sets: z.number(),
          reps: z.string(),
          rest: z.string(),
        }),
      ),
      notes: z.array(z.string()),
    }),
  ),
})

function mapWorkoutFormToContext(formData: WorkoutFormInput) {
  const goalMap = { muscleGain: "Muscle Gain", fatLoss: "Fat Loss", strength: "Strength", endurance: "Endurance" }
  const levelMap = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" }
  const focusAreaMap = { fullBody: "Full Body", upperBody: "Upper Body", lowerBody: "Lower Body", core: "Core", arms: "Arms", back: "Back", chest: "Chest", shoulders: "Shoulders", legs: "Legs" }
  const equipmentMap = { fullGym: "Full Gym", homeBasic: "Home Basic (Dumbbells, Resistance Bands)", bodyweight: "Bodyweight Only" }

  return {
    goal: goalMap[formData.fitnessGoal],
    level: levelMap[formData.experienceLevel],
    daysPerWeek: formData.daysPerWeek,
    sessionLength: formData.sessionLength,
    focusAreas: formData.focusAreas.map((area) => focusAreaMap[area]),
    equipment: equipmentMap[formData.equipment],
  }
}

async function generateWorkoutWithRetry(
  groqClient: Groq,
  context: ReturnType<typeof mapWorkoutFormToContext>,
  expectedDays: number
): Promise<z.infer<typeof workoutPlanSchema>> {
  const dayKeys = Array.from({ length: context.daysPerWeek }, (_, i) => `day${i + 1}`)

  const prompt = `Create a ${context.daysPerWeek}-day workout plan.

PARAMETERS:
- Goal: ${context.goal}
- Level: ${context.level}
- Days: ${context.daysPerWeek}
- Session: ${context.sessionLength} minutes
- Focus: ${context.focusAreas.join(", ")}
- Equipment: ${context.equipment}

CRITICAL: You MUST create EXACTLY ${context.daysPerWeek} workout days with at least 4 exercises each.

Return ONLY valid JSON:
{
  "summary": { "goal": "${context.goal}", "level": "${context.level}", "daysPerWeek": ${context.daysPerWeek}, "sessionLength": ${context.sessionLength}, "focusAreas": ${JSON.stringify(context.focusAreas)}, "equipment": "${context.equipment}" },
  "overview": "Brief 2-3 sentence plan overview",
  "workouts": { ${dayKeys.map((key, i) => `"${key}": { "focus": "Day ${i + 1} focus", "description": "Brief description", "exercises": [{"name": "Exercise", "sets": 3, "reps": "8-12", "rest": "60 sec"}], "notes": ["Tip 1"] }`).join(", ")} }
}`

  return withRetry(
    async () => {
      const completion = await groqClient.chat.completions.create({
        messages: [
          { role: "system", content: `You are a professional fitness trainer. Generate a complete ${context.daysPerWeek}-day workout plan in JSON format. Include exactly ${context.daysPerWeek} days with 4-6 exercises each.` },
          { role: "user", content: prompt },
        ],
        model: "openai/gpt-oss-120b",
        response_format: { type: "json_object" },
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error("Empty response from AI")
      }

      const parseResult = safeJsonParse(content)
      if (!parseResult.success) {
        throw new Error(`JSON parse error: ${parseResult.error}`)
      }

      // Validate completeness
      const completenessResult = validateWorkoutCompleteness(parseResult.data, expectedDays)
      if (!completenessResult.success) {
        throw new Error(completenessResult.error)
      }

      // Validate schema
      const validationResult = validateResponse(parseResult.data, workoutPlanSchema)
      if (!validationResult.success) {
        throw new Error(validationResult.error)
      }

      return validationResult.data!
    },
    {
      maxRetries: 2,
      delayMs: 1000,
      onRetry: (attempt, error) => {
        console.log(`Workout generation retry ${attempt}: ${error}`)
      },
    }
  )
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`workout_${clientIp}`, { maxRequests: 10, windowMs: 60000 })
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later.", resetIn: Math.ceil(rateLimitResult.resetIn / 1000) },
        { status: 429, headers: { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(rateLimitResult.resetIn) } }
      )
    }

    if (!groq) {
      return NextResponse.json({ error: "AI service is not available." }, { status: 500 })
    }

    const body = await request.json()
    
    // Skip prefetch requests
    if (body._prefetch) {
      return NextResponse.json({ status: "prefetch_acknowledged" })
    }

    const validationResult = workoutFormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const formData = validationResult.data
    const cacheKey = generateCacheKey("workout", formData)
    
    // Check cache first
    const cachedPlan = await getCachedResponse<{ plan: z.infer<typeof workoutPlanSchema> }>(cacheKey)
    if (cachedPlan) {
      return NextResponse.json(cachedPlan, { headers: { "X-Cache": "HIT" } })
    }

    // Request deduplication
    const requestKey = generateRequestKey("/api/workout/generate", formData)
    
    // Cancel any existing request for this key and start fresh
    if (hasPendingRequest(requestKey)) {
      cancelPendingRequest(requestKey)
    }

    const context = mapWorkoutFormToContext(formData)
    const encoder = new TextEncoder()

    // Create abort controller for deduplication
    const abortController = new AbortController()

    const streamPromise = (async () => {
      const stream = await groq!.chat.completions.create({
        messages: [
          { role: "system", content: `You are a professional fitness trainer. Generate a ${context.daysPerWeek}-day workout plan in JSON format.` },
          { role: "user", content: `Create a ${context.daysPerWeek}-day workout plan.

PARAMETERS:
- Goal: ${context.goal}
- Level: ${context.level}
- Days: ${context.daysPerWeek}
- Session: ${context.sessionLength} minutes
- Focus: ${context.focusAreas.join(", ")}
- Equipment: ${context.equipment}

CRITICAL: Create EXACTLY ${context.daysPerWeek} days with 4-6 exercises each.

Return valid JSON with summary, overview, and workouts object.` },
        ],
        model: "openai/gpt-oss-120b",
        response_format: { type: "json_object" },
        temperature: 0.7,
        stream: true,
      })

      let fullContent = ""
      const chunks: string[] = []

      for await (const chunk of stream) {
        if (abortController.signal.aborted) {
          throw new Error("Request aborted")
        }
        const content = chunk.choices[0]?.delta?.content || ""
        fullContent += content
        chunks.push(content)
      }

      return { fullContent, chunks }
    })()

    registerPendingRequest(requestKey, streamPromise, abortController)

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const stream = await groq!.chat.completions.create({
            messages: [
              { role: "system", content: `You are a professional fitness trainer. Generate a ${context.daysPerWeek}-day workout plan in JSON format.` },
              { role: "user", content: `Create a ${context.daysPerWeek}-day workout plan.

PARAMETERS:
- Goal: ${context.goal}
- Level: ${context.level}
- Days: ${context.daysPerWeek}
- Session: ${context.sessionLength} minutes
- Focus: ${context.focusAreas.join(", ")}
- Equipment: ${context.equipment}

CRITICAL: Create EXACTLY ${context.daysPerWeek} days with 4-6 exercises each.

Return valid JSON with summary, overview, and workouts object.` },
            ],
            model: "openai/gpt-oss-120b",
            response_format: { type: "json_object" },
            temperature: 0.7,
            stream: true,
          })

          let fullContent = ""
          let retryCount = 0
          const maxRetries = 2

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ""
            fullContent += content
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: content })}\n\n`))
          }

          // Validate and potentially retry
          let validatedPlan: z.infer<typeof workoutPlanSchema> | null = null
          
          while (retryCount <= maxRetries && !validatedPlan) {
            const parseResult = safeJsonParse(fullContent)
            
            if (!parseResult.success) {
              if (retryCount < maxRetries) {
                retryCount++
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ retry: retryCount, reason: "Invalid JSON" })}\n\n`))
                
                // Regenerate
                const retryPlan = await generateWorkoutWithRetry(groq!, context, formData.daysPerWeek)
                validatedPlan = retryPlan
                break
              }
              throw new Error("Failed to parse response after retries")
            }

            const completenessResult = validateWorkoutCompleteness(parseResult.data, formData.daysPerWeek)
            if (!completenessResult.success) {
              if (retryCount < maxRetries) {
                retryCount++
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ retry: retryCount, reason: completenessResult.error })}\n\n`))
                
                const retryPlan = await generateWorkoutWithRetry(groq!, context, formData.daysPerWeek)
                validatedPlan = retryPlan
                break
              }
              throw new Error(completenessResult.error)
            }

            const schemaResult = validateResponse(parseResult.data, workoutPlanSchema)
            if (!schemaResult.success) {
              if (retryCount < maxRetries) {
                retryCount++
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ retry: retryCount, reason: schemaResult.error })}\n\n`))
                
                const retryPlan = await generateWorkoutWithRetry(groq!, context, formData.daysPerWeek)
                validatedPlan = retryPlan
                break
              }
              throw new Error(schemaResult.error)
            }

            validatedPlan = schemaResult.data!
          }

          if (!validatedPlan) {
            throw new Error("Failed to generate valid workout plan")
          }

          // Sanitize and cache
          const sanitizedPlan = sanitizeObject(validatedPlan)
          await setCachedResponse(cacheKey, { plan: sanitizedPlan }, 1440)
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, plan: sanitizedPlan })}\n\n`))
          controller.close()
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to generate plan"
          console.error("Workout generation error:", error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Cache": "MISS",
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
      },
    })
  } catch (error) {
    console.error("Workout generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate workout plan.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
