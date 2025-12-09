import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { generateCacheKey, getCachedResponse, setCachedResponse } from "@/lib/cache"
import { mealFormSchema, type MealFormInput } from "@/lib/validations"
import { 
  validateResponse, 
  validateMealCompleteness, 
  sanitizeObject, 
  safeJsonParse,
  withRetry 
} from "@/lib/api/response-validator"
import { 
  generateRequestKey, 
  hasPendingRequest, 
  cancelPendingRequest,
  registerPendingRequest 
} from "@/lib/api/request-dedup"
import { checkUsageLimit, recordUsage } from "@/lib/services/usageService"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const apiKey = process.env.GROQ_API_KEY
let groq: Groq | null = null

if (apiKey) {
  groq = new Groq({ apiKey })
}

const mealPlanSchema = z.object({
  summary: z.object({
    goal: z.string(),
    calories: z.number(),
    dietType: z.string(),
    mealsPerDay: z.number(),
    restrictions: z.string(),
    cuisine: z.string().optional(),
    complexity: z.string().optional(),
    includeDesserts: z.boolean().optional(),
    allergies: z.string().optional(),
    budget: z.string().optional(),
    cookingTime: z.string().optional(),
    seasonalPreference: z.string().optional(),
    healthConditions: z.string().optional(),
    proteinPreference: z.string().optional(),
    mealPrepOption: z.string().optional(),
    includeSnacks: z.boolean().optional(),
    snackFrequency: z.string().optional(),
    snackType: z.string().optional(),
  }),
  overview: z.string(),
  macros: z.object({ protein: z.number(), carbs: z.number(), fat: z.number() }),
  meals: z.record(
    z.array(
      z.object({
        name: z.string(),
        foods: z.array(z.object({ 
          name: z.string(), 
          amount: z.string(), 
          protein: z.number(), 
          carbs: z.number(), 
          fat: z.number(), 
          calories: z.number() 
        })),
        totals: z.object({ protein: z.number(), carbs: z.number(), fat: z.number(), calories: z.number() }),
        notes: z.string().optional(),
        cookingTime: z.string().optional(),
        isSnack: z.boolean().optional(),
      })
    )
  ),
})

function mapMealFormToContext(formData: MealFormInput) {
  const goalMap = { muscleGain: "Muscle Gain", fatLoss: "Fat Loss", maintenance: "Maintenance", performance: "Performance", healthyEating: "Healthy Eating" }
  const dietTypeMap: Record<string, string> = { balanced: "Balanced", highProtein: "High Protein", lowCarb: "Low Carb", keto: "Keto", mediterranean: "Mediterranean", paleo: "Paleo" }
  const restrictionsMap = { none: "None", vegetarian: "Vegetarian", vegan: "Vegan", glutenFree: "Gluten Free", dairyFree: "Dairy Free", pescatarian: "Pescatarian" }
  const cuisineMap = { any: "Any", indonesian: "Indonesian", asian: "Asian", mediterranean: "Mediterranean", western: "Western", mexican: "Mexican", indian: "Indian" }

  return {
    goal: goalMap[formData.nutritionGoal],
    calories: formData.dailyCalories,
    dietType: dietTypeMap[formData.dietType],
    mealsPerDay: formData.mealsPerDay,
    restrictions: restrictionsMap[formData.dietaryRestrictions],
    cuisine: formData.cuisinePreference ? cuisineMap[formData.cuisinePreference] : "Any",
    includeSnacks: formData.includeSnacks || false,
  }
}

function getMacros(dietType: string, calories: number) {
  const macroMap: Record<string, [number, number, number]> = {
    highProtein: [40, 30, 30], 
    lowCarb: [35, 15, 50], 
    keto: [20, 5, 75], 
    mediterranean: [15, 55, 30], 
    paleo: [30, 25, 45], 
    balanced: [25, 50, 25],
  }
  const [p, c, f] = macroMap[dietType] || macroMap.balanced
  return { 
    protein: Math.round((calories * p / 100) / 4), 
    carbs: Math.round((calories * c / 100) / 4), 
    fat: Math.round((calories * f / 100) / 9), 
    proteinPercent: p, 
    carbsPercent: c, 
    fatPercent: f 
  }
}

async function generateMealWithRetry(
  groqClient: Groq,
  context: ReturnType<typeof mapMealFormToContext>,
  macros: ReturnType<typeof getMacros>
): Promise<z.infer<typeof mealPlanSchema>> {
  const prompt = `Create a 7-day meal plan.
PARAMETERS: Goal: ${context.goal}, Diet: ${context.dietType}, Meals/Day: ${context.mealsPerDay}, Restrictions: ${context.restrictions}, Cuisine: ${context.cuisine}
CALORIES: ${context.calories}/day, Protein: ${macros.protein}g, Carbs: ${macros.carbs}g, Fat: ${macros.fat}g

CRITICAL: You MUST create ALL 7 days (day1 through day7) with ${context.mealsPerDay} meals each.

Return JSON with summary, overview, macros, and meals (day1-day7). Each meal needs: name, foods array (name, amount, protein, carbs, fat, calories), totals, notes.`

  return withRetry(
    async () => {
      const completion = await groqClient.chat.completions.create({
        messages: [
          { role: "system", content: "You are a professional nutritionist. Generate complete 7-day meal plans in JSON format. ALWAYS include all 7 days with varied meals." },
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
      const completenessResult = validateMealCompleteness(parseResult.data)
      if (!completenessResult.success) {
        throw new Error(completenessResult.error)
      }

      // Validate schema
      const validationResult = validateResponse(parseResult.data, mealPlanSchema)
      if (!validationResult.success) {
        throw new Error(validationResult.error)
      }

      return validationResult.data!
    },
    {
      maxRetries: 2,
      delayMs: 1000,
      onRetry: (attempt, error) => {
        console.log(`Meal generation retry ${attempt}: ${error}`)
      },
    }
  )
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`meal_${clientIp}`, { maxRequests: 10, windowMs: 60000 })
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later.", resetIn: Math.ceil(rateLimitResult.resetIn / 1000) },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
      )
    }

    if (!groq) {
      return NextResponse.json({ error: "AI service is not available." }, { status: 500 })
    }

    let body
    try {
      body = await request.json()
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
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

    // Check usage limits (skip if check fails)
    try {
      const usageCheck = await checkUsageLimit(userId, "meal", clientIp)
      if (!usageCheck.allowed) {
        return NextResponse.json(
          { 
            error: usageCheck.requiresAuth 
              ? "You've reached your free limit. Please sign in to generate more meal plans."
              : "You've reached your daily limit for meal plans. Try again tomorrow.",
            requiresAuth: usageCheck.requiresAuth,
            remaining: usageCheck.remaining,
          },
          { status: 403 }
        )
      }
    } catch (e) {
      console.warn("Usage check failed, allowing generation:", e)
    }
    
    // Skip prefetch requests
    if (body._prefetch) {
      return NextResponse.json({ status: "prefetch_acknowledged" })
    }

    const validationResult = mealFormSchema.safeParse(body)
    if (!validationResult.success) {
      console.error("Meal validation failed:", validationResult.error.flatten())
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const formData = validationResult.data
    const cacheKey = generateCacheKey("meal", formData)
    
    // Check cache first
    const cachedPlan = await getCachedResponse<{ plan: z.infer<typeof mealPlanSchema> }>(cacheKey)
    if (cachedPlan) {
      return NextResponse.json(cachedPlan, { headers: { "X-Cache": "HIT" } })
    }

    // Request deduplication
    const requestKey = generateRequestKey("/api/meal/generate", formData)
    
    if (hasPendingRequest(requestKey)) {
      cancelPendingRequest(requestKey)
    }

    const context = mapMealFormToContext(formData)
    const macros = getMacros(formData.dietType, formData.dailyCalories)
    const encoder = new TextEncoder()

    const abortController = new AbortController()

    const streamPromise = (async () => {
      const stream = await groq!.chat.completions.create({
        messages: [
          { role: "system", content: "You are a professional nutritionist. Generate 7-day meal plans in JSON format with variety across all days." },
          { role: "user", content: `Create a 7-day meal plan.
PARAMETERS: Goal: ${context.goal}, Diet: ${context.dietType}, Meals/Day: ${context.mealsPerDay}, Restrictions: ${context.restrictions}, Cuisine: ${context.cuisine}
CALORIES: ${context.calories}/day, Protein: ${macros.protein}g, Carbs: ${macros.carbs}g, Fat: ${macros.fat}g
CRITICAL: Create ALL 7 days (day1-day7) with complete meals.` },
        ],
        model: "openai/gpt-oss-120b",
        response_format: { type: "json_object" },
        temperature: 0.7,
        stream: true,
      })

      let fullContent = ""
      for await (const chunk of stream) {
        if (abortController.signal.aborted) throw new Error("Request aborted")
        fullContent += chunk.choices[0]?.delta?.content || ""
      }
      return fullContent
    })()

    registerPendingRequest(requestKey, streamPromise, abortController)

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const stream = await groq!.chat.completions.create({
            messages: [
              { role: "system", content: "You are a professional nutritionist. Generate complete 7-day meal plans in JSON format. ALWAYS include all 7 days (day1-day7) with varied meals." },
              { role: "user", content: `Create a 7-day meal plan.
PARAMETERS: Goal: ${context.goal}, Diet: ${context.dietType}, Meals/Day: ${context.mealsPerDay}, Restrictions: ${context.restrictions}, Cuisine: ${context.cuisine}
CALORIES: ${context.calories}/day, Protein: ${macros.protein}g, Carbs: ${macros.carbs}g, Fat: ${macros.fat}g

CRITICAL: You MUST create ALL 7 days (day1, day2, day3, day4, day5, day6, day7) with ${context.mealsPerDay} meals each.

Return JSON with summary, overview, macros, and meals object containing day1 through day7.` },
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
          let validatedPlan: z.infer<typeof mealPlanSchema> | null = null
          
          while (retryCount <= maxRetries && !validatedPlan) {
            const parseResult = safeJsonParse(fullContent)
            
            if (!parseResult.success) {
              if (retryCount < maxRetries) {
                retryCount++
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ retry: retryCount, reason: "Invalid JSON" })}\n\n`))
                
                const retryPlan = await generateMealWithRetry(groq!, context, macros)
                validatedPlan = retryPlan
                break
              }
              throw new Error("Failed to parse response after retries")
            }

            const completenessResult = validateMealCompleteness(parseResult.data)
            if (!completenessResult.success) {
              if (retryCount < maxRetries) {
                retryCount++
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ retry: retryCount, reason: completenessResult.error })}\n\n`))
                
                const retryPlan = await generateMealWithRetry(groq!, context, macros)
                validatedPlan = retryPlan
                break
              }
              throw new Error(completenessResult.error)
            }

            const schemaResult = validateResponse(parseResult.data, mealPlanSchema)
            if (!schemaResult.success) {
              if (retryCount < maxRetries) {
                retryCount++
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ retry: retryCount, reason: schemaResult.error })}\n\n`))
                
                const retryPlan = await generateMealWithRetry(groq!, context, macros)
                validatedPlan = retryPlan
                break
              }
              throw new Error(schemaResult.error)
            }

            validatedPlan = schemaResult.data!
          }

          if (!validatedPlan) {
            throw new Error("Failed to generate valid meal plan")
          }

          // Sanitize and cache
          const sanitizedPlan = sanitizeObject(validatedPlan)
          await setCachedResponse(cacheKey, { plan: sanitizedPlan }, 1440)
          
          // Record usage after successful generation
          await recordUsage(userId, "meal", clientIp)
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, plan: sanitizedPlan })}\n\n`))
          controller.close()
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to generate plan"
          console.error("Meal generation error:", error)
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
    console.error("Meal generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate meal plan.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
