import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import { z } from "zod"

// Initialize Groq client with server-only key
const apiKey = process.env.GROQ_API_KEY
let groq: Groq | null = null

if (apiKey) {
  groq = new Groq({ apiKey })
}

// Define interfaces for form data
interface WorkoutFormData {
  fitnessGoal: "muscleGain" | "fatLoss" | "strength" | "endurance"
  experienceLevel: "beginner" | "intermediate" | "advanced"
  daysPerWeek: number
  sessionLength: number
  focusAreas: Array<"fullBody" | "upperBody" | "lowerBody" | "core" | "arms" | "back" | "chest" | "shoulders" | "legs">
  equipment: "fullGym" | "homeBasic" | "bodyweight"
}

// Define the workout plan schema
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

// Helper function to map form values to human-readable descriptions
function mapWorkoutFormToContext(formData: WorkoutFormData) {
  const goalMap = {
    muscleGain: "Muscle Gain",
    fatLoss: "Fat Loss",
    strength: "Strength",
    endurance: "Endurance",
  }

  const levelMap = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }

  const focusAreaMap = {
    fullBody: "Full Body",
    upperBody: "Upper Body",
    lowerBody: "Lower Body",
    core: "Core",
    arms: "Arms",
    back: "Back",
    chest: "Chest",
    shoulders: "Shoulders",
    legs: "Legs",
  }

  const equipmentMap = {
    fullGym: "Full Gym",
    homeBasic: "Home Basic (Dumbbells, Resistance Bands)",
    bodyweight: "Bodyweight Only",
  }

  return {
    goal: goalMap[formData.fitnessGoal],
    level: levelMap[formData.experienceLevel],
    daysPerWeek: formData.daysPerWeek,
    sessionLength: formData.sessionLength,
    focusAreas: formData.focusAreas.map((area) => focusAreaMap[area]),
    equipment: equipmentMap[formData.equipment],
  }
}

export async function POST(request: Request) {
  try {
    if (!groq) {
      return NextResponse.json(
        { error: "AI service is not available. Please check server configuration." },
        { status: 500 }
      )
    }

    const formData: WorkoutFormData = await request.json()

    // Validate required fields
    if (!formData.fitnessGoal || !formData.experienceLevel || !formData.daysPerWeek) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const context = mapWorkoutFormToContext(formData)
    const dayKeys = Array.from({ length: context.daysPerWeek }, (_, i) => `day${i + 1}`)

    const prompt = `Create a ${context.daysPerWeek}-day workout plan.

PARAMETERS:
- Goal: ${context.goal}
- Level: ${context.level}
- Days: ${context.daysPerWeek} (MUST create exactly ${context.daysPerWeek} workout days)
- Session: ${context.sessionLength} minutes
- Focus: ${context.focusAreas.join(", ")}
- Equipment: ${context.equipment}

CRITICAL REQUIREMENTS:
1. You MUST create EXACTLY ${context.daysPerWeek} workout days (${dayKeys.join(", ")})
2. Each day MUST have 5-8 exercises appropriate for ${context.sessionLength} minutes
3. Each exercise needs: name, sets (number), reps (string like "8-12"), rest (string like "60-90 sec")
4. Include 2-3 notes per day with tips
5. Make each day focus on different muscle groups for variety

Return ONLY valid JSON:
{
  "summary": {
    "goal": "${context.goal}",
    "level": "${context.level}",
    "daysPerWeek": ${context.daysPerWeek},
    "sessionLength": ${context.sessionLength},
    "focusAreas": ${JSON.stringify(context.focusAreas)},
    "equipment": "${context.equipment}"
  },
  "overview": "Brief 2-3 sentence plan overview",
  "workouts": {
    ${dayKeys.map((key, i) => `"${key}": {
      "focus": "Day ${i + 1} focus area",
      "description": "Brief workout description",
      "exercises": [
        {"name": "Exercise Name", "sets": 3, "reps": "8-12", "rest": "60 sec"}
      ],
      "notes": ["Tip 1", "Tip 2"]
    }`).join(",\n    ")}
  }
}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional fitness trainer. Generate a complete ${context.daysPerWeek}-day workout plan in JSON format. CRITICAL: You MUST include exactly ${context.daysPerWeek} days (${dayKeys.join(", ")}). Never return fewer days than requested. Each day must have complete exercises with sets, reps, and rest times.`,
        },
        { role: "user", content: prompt },
      ],
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      return NextResponse.json(
        { error: "Received empty response from AI service" },
        { status: 500 }
      )
    }

    const parsedResponse = JSON.parse(responseContent)
    
    const workoutDays = Object.keys(parsedResponse.workouts || {})
    if (workoutDays.length < context.daysPerWeek) {
      return NextResponse.json(
        { error: `Incomplete plan: expected ${context.daysPerWeek} days, got ${workoutDays.length}` },
        { status: 500 }
      )
    }
    
    const validatedPlan = workoutPlanSchema.parse(parsedResponse)
    return NextResponse.json({ plan: validatedPlan })
  } catch (error) {
    console.error("Workout generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate workout plan. Please try again.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
