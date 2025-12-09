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

// Define the meal plan schema
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

// Helper function to map form values to human-readable descriptions
function mapMealFormToContext(formData: MealFormData) {
  const goalMap = {
    muscleGain: "Muscle Gain",
    fatLoss: "Fat Loss",
    maintenance: "Maintenance",
    performance: "Performance",
    healthyEating: "Healthy Eating",
  }

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

  const restrictionsMap = {
    none: "None",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten Free",
    dairyFree: "Dairy Free",
    pescatarian: "Pescatarian",
  }

  const cuisineMap = {
    any: "Any / No Preference",
    indonesian: "Indonesian",
    asian: "Asian",
    mediterranean: "Mediterranean",
    western: "Western",
    mexican: "Mexican",
    indian: "Indian",
  }

  const complexityMap = {
    simple: "Simple",
    moderate: "Moderate",
    complex: "Complex",
  }

  const allergiesMap = {
    none: "None",
    nuts: "Nuts",
    shellfish: "Shellfish",
    eggs: "Eggs",
    soy: "Soy",
    wheat: "Wheat",
    dairy: "Dairy",
  }

  const budgetMap = {
    low: "Budget-Friendly",
    medium: "Moderate",
    high: "Premium",
  }

  const cookingTimeMap = {
    minimal: "Minimal (15 min or less)",
    moderate: "Moderate (15-30 min)",
    extended: "Extended (30+ min)",
  }

  const seasonalMap = {
    any: "Any / No Preference",
    spring: "Spring",
    summer: "Summer",
    fall: "Fall",
    winter: "Winter",
  }

  const healthConditionsMap = {
    none: "None",
    diabetes: "Diabetes-Friendly",
    heartHealth: "Heart Health",
    lowSodium: "Low Sodium",
    lowFodmap: "Low FODMAP",
  }

  const proteinPreferenceMap = {
    balanced: "Balanced (All Sources)",
    poultry: "Poultry-Focused",
    seafood: "Seafood-Focused",
    redMeat: "Red Meat-Focused",
    plantBased: "Plant-Based Proteins",
  }

  const mealPrepMap = {
    daily: "Daily Cooking",
    batchCook: "Batch Cooking (2-3 days)",
    weeklyPrep: "Weekly Meal Prep",
  }

  const snackFrequencyMap = {
    once: "Once a day",
    twice: "Twice a day",
    thrice: "Three times a day",
  }

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

export async function POST(request: Request) {
  try {
    if (!groq) {
      return NextResponse.json(
        { error: "AI service is not available. Please check server configuration." },
        { status: 500 }
      )
    }

    const formData: MealFormData = await request.json()

    // Validate required fields
    if (!formData.nutritionGoal || !formData.dailyCalories || !formData.dietType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

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
      default:
        proteinPercent = 25
        carbsPercent = 50
        fatPercent = 25
    }

    const targetCalories = formData.dailyCalories
    const targetProteinGrams = Math.round((targetCalories * (proteinPercent / 100)) / 4)
    const targetCarbsGrams = Math.round((targetCalories * (carbsPercent / 100)) / 4)
    const targetFatGrams = Math.round((targetCalories * (fatPercent / 100)) / 9)
    const caloriesPerMeal = Math.round(targetCalories / context.mealsPerDay)

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
  
  CRITICAL VARIETY REQUIREMENTS (MUST FOLLOW):
  - EACH DAY MUST HAVE COMPLETELY DIFFERENT MEALS - NO REPETITION
  - Day 1, Day 2, Day 3, Day 4, Day 5, Day 6, Day 7 must all be unique
  - Do NOT copy the same breakfast/lunch/dinner across multiple days
  - Use different proteins each day (chicken, beef, fish, eggs, tofu, etc.)
  - Use different cooking methods (grilled, baked, stir-fried, steamed, etc.)
  - Provide variety in vegetables, grains, and sides
  
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

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional nutritionist with expertise in global cuisines, especially Indonesian cuisine. Generate detailed meal plans in JSON format that strictly follow the requested structure. CRITICAL: Each of the 7 days MUST have completely different meals - never repeat the same meal across different days. Create diverse, varied meals using different proteins, cooking methods, and ingredients each day. When Indonesian cuisine is requested, incorporate authentic Indonesian dishes with accurate nutritional information. Do not include any explanations or comments in your response, only the JSON object.",
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
    const validatedPlan = mealPlanSchema.parse(parsedResponse)
    return NextResponse.json({ plan: validatedPlan })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate meal plan. Please try again." },
      { status: 500 }
    )
  }
}
