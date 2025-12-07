import Groq from "groq-sdk"
import { z } from "zod"

// Define interfaces for form data
interface WorkoutFormData {
  fitnessGoal: "muscleGain" | "fatLoss" | "strength" | "endurance"
  experienceLevel: "beginner" | "intermediate" | "advanced"
  daysPerWeek: number
  sessionLength: number
  focusAreas: Array<"fullBody" | "upperBody" | "lowerBody" | "core" | "arms" | "back" | "chest" | "shoulders" | "legs">
  equipment: "fullGym" | "homeBasic" | "bodyweight"
}

// Update the MealFormData interface to include the new fields
interface MealFormData {
  nutritionGoal: "muscleGain" | "fatLoss" | "maintenance" | "performance" | "healthyEating"
  dailyCalories: number
  dietType: "balanced" | "highProtein" | "lowCarb" | "keto" | "mediterranean" | "paleo"
  mealsPerDay: number
  dietaryRestrictions: "none" | "vegetarian" | "vegan" | "glutenFree" | "dairyFree" | "pescatarian"
  cuisinePreference?: "any" | "indonesian" | "asian" | "mediterranean" | "western" | "mexican" | "indian"
  mealComplexity?: "simple" | "moderate" | "complex"
  includeDesserts?: boolean
  allergies?: "none" | "nuts" | "shellfish" | "eggs" | "soy" | "wheat" | "dairy"
  budgetLevel?: "low" | "medium" | "high"
  cookingTime?: "minimal" | "moderate" | "extended"
  seasonalPreference?: "any" | "spring" | "summer" | "fall" | "winter"
  healthConditions?: "none" | "diabetes" | "heartHealth" | "lowSodium" | "lowFodmap"
  proteinPreference?: "balanced" | "poultry" | "seafood" | "redMeat" | "plantBased"
  mealPrepOption?: "daily" | "batchCook" | "weeklyPrep"
  includeSnacks?: boolean
  snackFrequency?: "once" | "twice" | "thrice"
  snackType?: "balanced" | "protein" | "lowCalorie" | "sweet" | "savory" | "fruit"
}

// Initialize Groq client with browser compatibility
const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
let groq: Groq | null = null

if (apiKey) {
  try {
    groq = new Groq({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for browser usage
    })
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

// Update the meal plan schema to include the new fields
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
        cookingTime: z.string().optional(),
        isSnack: z.boolean().optional(),
      }),
    ),
  ),
})

// Export types derived from schemas
export type WorkoutPlan = z.infer<typeof workoutPlanSchema>
export type MealPlan = z.infer<typeof mealPlanSchema>

// Helper function to map form values to human-readable descriptions
function mapWorkoutFormToContext(formData: WorkoutFormData) {
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
    goal: goalMap[formData.fitnessGoal],
    level: levelMap[formData.experienceLevel],
    daysPerWeek: formData.daysPerWeek,
    sessionLength: formData.sessionLength,
    focusAreas: formData.focusAreas.map((area) => focusAreaMap[area]),
    equipment: equipmentMap[formData.equipment],
  }
}

// Update the mapMealFormToContext function to include the new fields
function mapMealFormToContext(formData: MealFormData) {
  // Map nutrition goal
  const goalMap = {
    muscleGain: "Muscle Gain",
    fatLoss: "Fat Loss",
    maintenance: "Maintenance",
    performance: "Performance",
    healthyEating: "Healthy Eating",
  }

  // Map diet type
  const dietTypeMap: Record<string, string> = {
    balanced: "Balanced",
    highProtein: "High Protein",
    lowCarb: "Low Carb",
    keto: "Keto",
    mediterranean: "Mediterranean",
    paleo: "Paleo",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
  }

  // Map dietary restrictions
  const restrictionsMap = {
    none: "None",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten Free",
    dairyFree: "Dairy Free",
    pescatarian: "Pescatarian",
  }

  // Map cuisine preference
  const cuisineMap = {
    any: "Any / No Preference",
    indonesian: "Indonesian",
    asian: "Asian",
    mediterranean: "Mediterranean",
    western: "Western",
    mexican: "Mexican",
    indian: "Indian",
  }

  // Map meal complexity
  const complexityMap = {
    simple: "Simple",
    moderate: "Moderate",
    complex: "Complex",
  }

  // Map allergies
  const allergiesMap = {
    none: "None",
    nuts: "Nuts",
    shellfish: "Shellfish",
    eggs: "Eggs",
    soy: "Soy",
    wheat: "Wheat",
    dairy: "Dairy",
  }

  // Map budget level
  const budgetMap = {
    low: "Budget-Friendly",
    medium: "Moderate",
    high: "Premium",
  }

  // Map cooking time
  const cookingTimeMap = {
    minimal: "Minimal (15 min or less)",
    moderate: "Moderate (15-30 min)",
    extended: "Extended (30+ min)",
  }

  // Map seasonal preference
  const seasonalMap = {
    any: "Any / No Preference",
    spring: "Spring",
    summer: "Summer",
    fall: "Fall",
    winter: "Winter",
  }

  // Map health conditions
  const healthConditionsMap = {
    none: "None",
    diabetes: "Diabetes-Friendly",
    heartHealth: "Heart Health",
    lowSodium: "Low Sodium",
    lowFodmap: "Low FODMAP",
  }

  // Map protein preference
  const proteinPreferenceMap = {
    balanced: "Balanced (All Sources)",
    poultry: "Poultry-Focused",
    seafood: "Seafood-Focused",
    redMeat: "Red Meat-Focused",
    plantBased: "Plant-Based Proteins",
  }

  // Map meal prep option
  const mealPrepMap = {
    daily: "Daily Cooking",
    batchCook: "Batch Cooking (2-3 days)",
    weeklyPrep: "Weekly Meal Prep",
  }

  // Map snack frequency
  const snackFrequencyMap = {
    once: "Once a day",
    twice: "Twice a day",
    thrice: "Three times a day",
  }

  // Map snack type
  const snackTypeMap = {
    balanced: "Balanced",
    protein: "High Protein",
    lowCalorie: "Low Calorie",
    sweet: "Sweet",
    savory: "Savory",
    fruit: "Fruit-based",
  }

  return {
    goal: goalMap[formData.nutritionGoal],
    calories: formData.dailyCalories,
    dietType: dietTypeMap[formData.dietType],
    mealsPerDay: formData.mealsPerDay,
    restrictions: restrictionsMap[formData.dietaryRestrictions],
    cuisine: formData.cuisinePreference ? cuisineMap[formData.cuisinePreference] : "Any",
    complexity: formData.mealComplexity ? complexityMap[formData.mealComplexity] : "Moderate",
    includeDesserts: formData.includeDesserts || false,
    allergies: formData.allergies ? allergiesMap[formData.allergies] : "None",
    budget: formData.budgetLevel ? budgetMap[formData.budgetLevel] : "Moderate",
    cookingTime: formData.cookingTime ? cookingTimeMap[formData.cookingTime] : "Moderate",
    seasonalPreference: formData.seasonalPreference ? seasonalMap[formData.seasonalPreference] : "Any",
    healthConditions: formData.healthConditions ? healthConditionsMap[formData.healthConditions] : "None",
    proteinPreference: formData.proteinPreference ? proteinPreferenceMap[formData.proteinPreference] : "Balanced",
    mealPrepOption: formData.mealPrepOption ? mealPrepMap[formData.mealPrepOption] : "Daily Cooking",
    includeSnacks: formData.includeSnacks || false,
    snackFrequency: formData.snackFrequency ? snackFrequencyMap[formData.snackFrequency] : "Twice a day",
    snackType: formData.snackType ? snackTypeMap[formData.snackType] : "Balanced",
  }
}

// Generate workout plan function
export async function generateWorkoutPlan(formData: WorkoutFormData): Promise<WorkoutPlan> {
  if (!groq) {
    throw new Error("AI service is not available. Please check your API key and try again later.")
  }

  // Map form values to human-readable context
  const context = mapWorkoutFormToContext(formData)

  // Create the prompt for Groq with specific JSON structure guidance
  const prompt = `
    Create a detailed workout plan with the following parameters:
    - Fitness Goal: ${context.goal}
    - Experience Level: ${context.level}
    - Days Per Week: ${context.daysPerWeek}
    - Session Length: ${context.sessionLength} minutes
    - Focus Areas: ${context.focusAreas.join(", ")}
    - Available Equipment: ${context.equipment}
    
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
          ],
          "notes": ["string note 1", "string note 2"]
        },
        "day2": {
          // same structure as day1
        }
      }
    }
  `

  try {
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
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
    })

    // Parse and validate the response
    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      throw new Error("Received empty response from AI service")
    }

    const parsedResponse = JSON.parse(responseContent)
    return workoutPlanSchema.parse(parsedResponse)
  } catch (error) {
    console.error("Error generating workout plan:", error)
    throw new Error("Failed to generate workout plan. Please try again later.")
  }
}

// Update the generateMealPlan function to include Indonesian dishes in the prompt
export async function generateMealPlan(formData: MealFormData): Promise<MealPlan> {
  if (!groq) {
    throw new Error("AI service is not available. Please check your API key and try again later.")
  }

  // Map form values to human-readable context
  const context = mapMealFormToContext(formData)

  // Calculate macronutrient distribution based on diet type
  let proteinPercent, carbsPercent, fatPercent

  switch (formData.dietType) {
    case "highProtein":
      proteinPercent = 40
      carbsPercent = 30
      fatPercent = 30
      break
    case "lowCarb":
      proteinPercent = 35
      carbsPercent = 15
      fatPercent = 50
      break
    case "keto":
      proteinPercent = 20
      carbsPercent = 5
      fatPercent = 75
      break
    case "mediterranean":
      proteinPercent = 15
      carbsPercent = 55
      fatPercent = 30
      break
    case "paleo":
      proteinPercent = 30
      carbsPercent = 25
      fatPercent = 45
      break
    case "vegetarian":
      proteinPercent = 20
      carbsPercent = 55
      fatPercent = 25
      break
    case "vegan":
      proteinPercent = 18
      carbsPercent = 57
      fatPercent = 25
      break
    default: // balanced
      proteinPercent = 25
      carbsPercent = 50
      fatPercent = 25
  }

  // Calculate target macros in grams
  const targetCalories = formData.dailyCalories
  const targetProteinGrams = Math.round((targetCalories * (proteinPercent / 100)) / 4) // 4 calories per gram
  const targetCarbsGrams = Math.round((targetCalories * (carbsPercent / 100)) / 4) // 4 calories per gram
  const targetFatGrams = Math.round((targetCalories * (fatPercent / 100)) / 9) // 9 calories per gram

  // Calculate calories per meal
  const caloriesPerMeal = Math.round(targetCalories / context.mealsPerDay)
  
  // Create a simplified prompt
  const prompt = `
  Create a 7-day meal plan with the following parameters:
  - Nutrition Goal: ${context.goal}
  - Diet Type: ${context.dietType}
  - Meals Per Day: ${context.mealsPerDay}
  - Dietary Restrictions: ${context.restrictions}
  - Cuisine Preference: ${context.cuisine}
  - Include Snacks: ${context.includeSnacks ? "Yes" : "No"}
  
  CRITICAL CALORIE REQUIREMENTS (MUST FOLLOW EXACTLY):
  - Total Daily Calories: EXACTLY ${targetCalories} calories per day
  - Each meal should have approximately ${caloriesPerMeal} calories
  - The sum of all meals each day MUST equal ${targetCalories} calories (allow ±50 calories tolerance)
  - Use realistic portion sizes with accurate calorie counts
  
  Macronutrient Targets (per day):
  - Protein: ${targetProteinGrams}g (${proteinPercent}%)
  - Carbs: ${targetCarbsGrams}g (${carbsPercent}%)
  - Fat: ${targetFatGrams}g (${fatPercent}%)
  
  IMPORTANT: Calculate food calories accurately. For example:
  - 100g chicken breast = ~165 calories
  - 1 cup cooked rice = ~200 calories
  - 1 large egg = ~70 calories
  - 1 tablespoon olive oil = ~120 calories
  
  Return your response as a valid JSON object with EXACTLY the following structure:
  {
    "summary": {
      "goal": "${context.goal}",
      "calories": ${targetCalories},
      "dietType": "${context.dietType}",
      "mealsPerDay": ${context.mealsPerDay},
      "restrictions": "${context.restrictions}",
      "cuisine": "${context.cuisine}",
      "complexity": "${context.complexity}",
      "includeDesserts": ${context.includeDesserts},
      "allergies": "${context.allergies}",
      "budget": "${context.budget}",
      "cookingTime": "${context.cookingTime}",
      "seasonalPreference": "${context.seasonalPreference}",
      "healthConditions": "${context.healthConditions}",
      "proteinPreference": "${context.proteinPreference}",
      "mealPrepOption": "${context.mealPrepOption}",
      "includeSnacks": ${context.includeSnacks},
      "snackFrequency": "${context.includeSnacks ? context.snackFrequency : "None"}",
      "snackType": "${context.includeSnacks ? context.snackType : "None"}"
    },
    "overview": "string with overall plan description",
    "macros": {
      "protein": ${targetProteinGrams},
      "carbs": ${targetCarbsGrams},
      "fat": ${targetFatGrams}
    },
    "meals": {
      "day1": [
        {
          "name": "string with meal name",
          "cookingTime": "string with cooking time",
          "isSnack": false,
          "foods": [
            {
              "name": "string with food name",
              "amount": "string with amount",
              "protein": number (grams),
              "carbs": number (grams),
              "fat": number (grams),
              "calories": number (integer)
            }
          ],
          "totals": {
            "protein": number (sum of protein in grams),
            "carbs": number (sum of carbs in grams),
            "fat": number (sum of fat in grams),
            "calories": number (sum of calories)
          },
          "notes": "string with preparation notes"
        }
      ],
      "day2": [],
      "day3": [],
      "day4": [],
      "day5": [],
      "day6": [],
      "day7": []
    }
  }
`

  try {
    // Call Groq API with JSON response format
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional nutritionist with expertise in global cuisines, especially Indonesian cuisine. Generate detailed meal plans in JSON format that strictly follow the requested structure. When Indonesian cuisine is requested, incorporate authentic Indonesian dishes with accurate nutritional information and traditional preparation methods. Do not include any explanations or comments in your response, only the JSON object.",
        },
        { role: "user", content: prompt },
      ],
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      temperature: 0.2,
    })

    // Parse and validate the response
    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      throw new Error("Received empty response from AI service")
    }

    console.log("API Response:", responseContent.substring(0, 200) + "...") // Log the beginning of the response

    try {
      const parsedResponse = JSON.parse(responseContent)
      return mealPlanSchema.parse(parsedResponse)
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      throw new Error("Failed to parse API response as JSON. Please try again.")
    }
  } catch (error) {
    console.error("Error generating meal plan:", error)
    throw new Error("Failed to generate meal plan. Please try again later.")
  }
}

// Update the getApiStatus function to provide more detailed information
export function getApiStatus() {
  return {
    apiKeyAvailable: !!apiKey,
    clientInitialized: !!groq,
    apiKeyLength: apiKey?.length || 0,
    modelAvailable: true,
    timestamp: new Date().toISOString(),
    responseStatus: {
      success: !!groq,
      message: groq ? "AI service is ready" : "AI service not available, please check your API key",
      serviceAvailable: !!groq,
    },
    formOptions: {
      nutritionGoals: ["Muscle Gain", "Fat Loss", "Maintenance", "Performance", "Healthy Eating"],
      dietTypes: ["Balanced", "High Protein", "Low Carb", "Keto", "Mediterranean", "Paleo"],
      cuisines: ["Any", "Indonesian", "Asian", "Mediterranean", "Western", "Mexican", "Indian"],
      complexities: ["Simple", "Moderate", "Complex"],
      budgetLevels: ["Budget-Friendly", "Moderate", "Premium"],
      cookingTimes: ["Minimal (15 min or less)", "Moderate (15-30 min)", "Extended (30+ min)"],
      mealPrepOptions: ["Daily Cooking", "Batch Cooking (2-3 days)", "Weekly Meal Prep"],
      healthConditions: ["None", "Diabetes-Friendly", "Heart Health", "Low Sodium", "Low FODMAP"],
      proteinPreferences: [
        "Balanced (All Sources)",
        "Poultry-Focused",
        "Seafood-Focused",
        "Red Meat-Focused",
        "Plant-Based Proteins",
      ],
      seasonalPreferences: ["Any", "Spring", "Summer", "Fall", "Winter"],
      snackFrequencies: ["Once a day", "Twice a day", "Three times a day"],
      snackTypes: ["Balanced", "High Protein", "Low Calorie", "Sweet", "Savory", "Fruit-based"],
    },
  }
}



