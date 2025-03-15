import Groq from "groq-sdk"
import { z } from "zod"

// Mock data for development purposes
import { mockWorkoutPlan, mockMealPlan } from "./mock-data"

// Initialize Groq client with browser compatibility
const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
console.log("GROQ API Key available:", !!apiKey, "Length:", apiKey?.length || 0)

// Create a Groq client instance if API key is available
let groq = null
if (apiKey) {
  try {
    groq = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Required for browser usage
    })
    console.log("Groq client initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Groq client:", error)
  }
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

// Define the meal plan schema
const mealPlanSchema = z.object({
  summary: z.object({
    goal: z.string(),
    calories: z.number(),
    dietType: z.string(),
    mealsPerDay: z.number(),
    restrictions: z.string(),
  }),
  overview: z.string(),
  macros: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  meals: z.record(
    z.array(
      z.object({
        name: z.string(),
        foods: z.array(
          z.object({
            name: z.string(),
            amount: z.string(),
            protein: z.number(),
            carbs: z.number(),
            fat: z.number(),
            calories: z.number(),
          }),
        ),
        totals: z.object({
          protein: z.number(),
          carbs: z.number(),
          fat: z.number(),
          calories: z.number(),
        }),
        notes: z.string().optional(),
      }),
    ),
  ),
})

// Helper function to map form values to human-readable descriptions
function mapWorkoutFormToContext(formData) {
  // Map fitness goal
  const goalMap = {
    muscleGain: "Muscle Gain",
    fatLoss: "Fat Loss",
    strength: "Strength",
    endurance: "Endurance",
  }

  // Map experience level
  const levelMap = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }

  // Map focus areas
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

  // Map equipment
  const equipmentMap = {
    fullGym: "Full Gym",
    homeBasic: "Home Basic (Dumbbells, Resistance Bands)",
    bodyweight: "Bodyweight Only",
  }

  return {
    goal: goalMap[formData.fitnessGoal] || formData.fitnessGoal,
    level: levelMap[formData.experienceLevel] || formData.experienceLevel,
    daysPerWeek: formData.daysPerWeek,
    sessionLength: formData.sessionLength,
    focusAreas: formData.focusAreas.map((area) => focusAreaMap[area] || area),
    equipment: equipmentMap[formData.equipment] || formData.equipment,
  }
}

function mapMealFormToContext(formData) {
  // Map nutrition goal
  const goalMap = {
    muscleGain: "Muscle Gain",
    fatLoss: "Fat Loss",
    maintenance: "Maintenance",
    performance: "Performance",
  }

  // Map diet type
  const dietTypeMap = {
    balanced: "Balanced",
    highProtein: "High Protein",
    lowCarb: "Low Carb",
    keto: "Keto",
  }

  // Map dietary restrictions
  const restrictionsMap = {
    none: "None",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten Free",
    dairyFree: "Dairy Free",
  }

  return {
    goal: goalMap[formData.nutritionGoal] || formData.nutritionGoal,
    calories: formData.dailyCalories,
    dietType: dietTypeMap[formData.dietType] || formData.dietType,
    mealsPerDay: formData.mealsPerDay,
    restrictions: restrictionsMap[formData.dietaryRestrictions] || formData.dietaryRestrictions,
  }
}

// Function to verify if Groq client can actually connect
async function verifyGroqConnection() {
  if (!groq) return false;
  
  try {
    console.log("Verifying Groq connection...")
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 5
    })
    
    console.log("Groq verification result:", !!completion?.choices?.[0]?.message?.content)
    return !!completion?.choices?.[0]?.message?.content
  } catch (error) {
    console.error("Groq verification failed:", error)
    return false
  }
}

// Generate workout plan function with improved logging and fallbacks
export async function generateWorkoutPlan(formData) {
  console.log("Generating workout plan...")
  
  if (!groq) {
    console.log("Groq client not initialized, using mock data")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return mockWorkoutPlan
  }
  
  // Optional verification step - uncomment to use but this will add latency
  // const isConnected = await verifyGroqConnection()
  // if (!isConnected) {
  //   console.log("Groq connection verification failed, using mock data")
  //   return mockWorkoutPlan
  // }

  try {
    console.log("Calling Groq API for workout plan...")
    console.log("Form data:", JSON.stringify(formData))

    // Map form values to human-readable context
    const context = mapWorkoutFormToContext(formData)
    console.log("Mapped context:", JSON.stringify(context))

    // Create the prompt for Groq with more specific JSON structure guidance
    const prompt = `
      Create a detailed workout plan with the following parameters:
      - Fitness Goal: ${context.goal}
      - Experience Level: ${context.level}
      - Days Per Week: ${context.daysPerWeek}
      - Session Length: ${context.sessionLength} minutes
      - Focus Areas: ${context.focusAreas.join(", ")}
      - Available Equipment: ${context.equipment}
      
      The plan should include a summary, overview, and detailed workouts for each day with exercises, sets, reps, and rest periods.
      
      Return your response as a valid JSON object with EXACTLY the following structure:
      {
        "summary": {
          "goal": "${context.goal}",
          "level": "${context.level}",
          "daysPerWeek": ${context.daysPerWeek},
          "sessionLength": ${context.sessionLength},
          "focusAreas": ${JSON.stringify(context.focusAreas)},
          "equipment": "${context.equipment}"
        },
        "overview": "string with overall plan description",
        "workouts": {
          "day1": {
            "focus": "string describing focus",
            "description": "string describing workout",
            "exercises": [
              {
                "name": "string with exercise name",
                "sets": number (integer),
                "reps": "string with rep range",
                "rest": "string with rest time"
              }
              // more exercises...
            ],
            "notes": ["string note 1", "string note 2", "etc"]
          },
          "day2": {
            // same structure as day1
          }
          // more days as needed up to daysPerWeek
        }
      }
    `

    // Call Groq API with JSON response format
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional fitness trainer. Generate detailed workout plans in JSON format that strictly follow the requested structure.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    })

    // Parse the response
    const responseContent = completion.choices[0]?.message?.content || "{}"
    console.log("Groq API response received - first 100 chars:", responseContent.substring(0, 100))

    try {
      const parsedResponse = JSON.parse(responseContent)

      // Validate with zod schema
      const validatedData = workoutPlanSchema.parse(parsedResponse)
      console.log("Validation successful for workout plan")

      return validatedData
    } catch (parseError) {
      console.error("Error parsing Groq response:", parseError)
      console.error("Raw response:", responseContent)
      throw new Error("Failed to parse Groq API response")
    }
  } catch (error) {
    console.error("Error generating workout plan:", error)
    if (error.response) {
      console.error("API error details:", error.response.data)
    }
    // Fallback to mock data if there's an error
    return mockWorkoutPlan
  }
}

// Generate meal plan function with similar improvements
export async function generateMealPlan(formData) {
  console.log("Generating meal plan...")
  
  if (!groq) {
    console.log("Groq client not initialized, using mock data")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return mockMealPlan
  }

  try {
    console.log("Calling Groq API for meal plan...")
    console.log("Form data:", JSON.stringify(formData))

    // Map form values to human-readable context
    const context = mapMealFormToContext(formData)
    console.log("Mapped context:", JSON.stringify(context))

    // Create the prompt for Groq with more specific JSON structure guidance
    const prompt = `
      Create a detailed meal plan with the following parameters:
      - Nutrition Goal: ${context.goal}
      - Daily Calories: ${context.calories}
      - Diet Type: ${context.dietType}
      - Meals Per Day: ${context.mealsPerDay}
      - Dietary Restrictions: ${context.restrictions}
      
      The plan should include a summary, overview, macronutrient breakdown, and detailed meals for each day with foods, amounts, and nutritional information.
      
      Return your response as a valid JSON object with EXACTLY the following structure:
      {
        "summary": {
          "goal": "${context.goal}",
          "calories": ${context.calories},
          "dietType": "${context.dietType}",
          "mealsPerDay": ${context.mealsPerDay},
          "restrictions": "${context.restrictions}"
        },
        "overview": "string with overall plan description",
        "macros": {
          "protein": number (integer, grams),
          "carbs": number (integer, grams),
          "fat": number (integer, grams)
        },
        "meals": {
          "day1": [
            {
              "name": "string with meal name",
              "foods": [
                {
                  "name": "string with food name",
                  "amount": "string with amount",
                  "protein": number (grams),
                  "carbs": number (grams),
                  "fat": number (grams),
                  "calories": number (integer)
                }
                // more foods...
              ],
              "totals": {
                "protein": number (sum of protein in grams),
                "carbs": number (sum of carbs in grams),
                "fat": number (sum of fat in grams),
                "calories": number (sum of calories)
              },
              "notes": "string with preparation notes" (optional)
            }
            // more meals up to mealsPerDay...
          ]
        }
      }
    `

    // Call Groq API with JSON response format
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional nutritionist in Indonesia , if possible suggest Indonesian food.Generate detailed meal plans in JSON format that strictly follow the requested structure.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    })

    // Parse the response
    const responseContent = completion.choices[0]?.message?.content || "{}"
    console.log("Groq API response received - first 100 chars:", responseContent.substring(0, 100))

    try {
      const parsedResponse = JSON.parse(responseContent)

      // Validate with zod schema
      const validatedData = mealPlanSchema.parse(parsedResponse)
      console.log("Validation successful for meal plan")

      return validatedData
    } catch (parseError) {
      console.error("Error parsing Groq response:", parseError)
      console.error("Raw response:", responseContent)
      throw new Error("Failed to parse Groq API response")
    }
  } catch (error) {
    console.error("Error generating meal plan:", error)
    if (error.response) {
      console.error("API error details:", error.response.data)
    }
    // Fallback to mock data if there's an error
    return mockMealPlan
  }
}

// Export a function to test the connection
export function getApiStatus() {
  return {
    apiKeyAvailable: !!apiKey,
    clientInitialized: !!groq,
    apiKeyLength: apiKey?.length || 0
  }
}