import Groq from "groq-sdk"
import { z } from "zod"

const indonesianFoods = [
  {
    name: "Ketoprak (Less Peanut Sauce)",
    description: "Rice noodles with tofu, bean sprouts, and lighter peanut sauce",
    components: "100g rice noodles, 50g tofu, 50g bean sprouts, 25g peanut sauce",
    servingSize: "225g",
    protein: 11,
    carbs: 32,
    fat: 7,
    calories: 235,
    healthBenefits: "Lower fat, plant protein, and fiber-rich.",
  },
  {
    name: "Nasi Goreng (Brown Rice, Less Oil)",
    description: "Brown rice stir-fried with egg and vegetables, cooked with minimal oil",
    components: "180g brown rice, 1 egg, 50g vegetables, 5g soy sauce",
    servingSize: "280g",
    protein: 13,
    carbs: 42,
    fat: 6,
    calories: 270,
    healthBenefits: "High fiber, balanced carbs and protein.",
  },
  {
    name: "Mie Goreng (Whole Wheat, Less Oil)",
    description: "Whole wheat noodles stir-fried with chicken and vegetables using less oil",
    components: "150g whole wheat noodles, 50g chicken breast, 70g vegetables",
    servingSize: "275g",
    protein: 18,
    carbs: 38,
    fat: 6,
    calories: 265,
    healthBenefits: "More fiber and lean protein, lower fat.",
  },
  {
    name: "Gado-Gado (Less Peanut Sauce)",
    description: "Vegetable salad with tofu, egg, and reduced peanut sauce",
    components: "150g vegetables, 50g tofu, 1 egg, 25g peanut sauce",
    servingSize: "275g",
    protein: 16,
    carbs: 20,
    fat: 9,
    calories: 230,
    healthBenefits: "Vitamin-rich, plant protein, reduced calories.",
  },
  {
    name: "Bakso (Less Noodles, More Vegetables)",
    description: "Lean beef meatball soup with vegetables and fewer noodles",
    components: "120g beef meatballs, 30g noodles, 70g vegetables, 200ml broth",
    servingSize: "300g",
    protein: 22,
    carbs: 18,
    fat: 7,
    calories: 235,
    healthBenefits: "High protein, lighter broth, nutrient-dense.",
  },
  {
    name: "Soto Ayam (Clear Broth, Less Oil)",
    description: "Turmeric chicken soup with vegetables in clear broth",
    components: "80g chicken breast, 100g vegetables, 200ml clear broth, 30g rice noodles",
    servingSize: "310g",
    protein: 19,
    carbs: 20,
    fat: 5,
    calories: 205,
    healthBenefits: "Light soup, anti-inflammatory spices, lean protein.",
  },
  {
    name: "Nasi Uduk (Less Coconut Milk)",
    description: "Fragrant coconut rice with lean protein and vegetables, less coconut milk",
    components: "120g coconut rice, 40g chicken breast, 30g tempeh, 40g vegetables",
    servingSize: "230g",
    protein: 16,
    carbs: 35,
    fat: 8,
    calories: 260,
    healthBenefits: "Lower fat, balanced protein and carbs.",
  },
  {
    name: "Lontong Sayur (Less Coconut Milk)",
    description: "Rice cakes served with light vegetable curry using less coconut milk",
    components: "100g lontong, 120g light curry vegetables, 30g tofu",
    servingSize: "250g",
    protein: 10,
    carbs: 32,
    fat: 6,
    calories: 215,
    healthBenefits: "Lower in fat, fiber-rich, plant protein.",
  },
  {
    name: "Ayam Bakar (Grilled, No Skin)",
    description: "Grilled chicken breast without skin, served with sambal and vegetables",
    components: "120g chicken breast, 50g vegetables, 20g sambal",
    servingSize: "190g",
    protein: 24,
    carbs: 5,
    fat: 4,
    calories: 175,
    healthBenefits: "High protein, low fat, heart-friendly.",
  },
  {
    name: "Pecel (Less Peanut Sauce)",
    description: "Steamed vegetables with lighter peanut sauce",
    components: "150g vegetables, 25g peanut sauce, 20g tempeh",
    servingSize: "195g",
    protein: 12,
    carbs: 18,
    fat: 8,
    calories: 200,
    healthBenefits: "Rich in vitamins, plant protein, lower calorie.",
  }
]



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
  const dietTypeMap = {
    balanced: "Balanced",
    highProtein: "High Protein",
    lowCarb: "Low Carb",
    keto: "Keto",
    mediterranean: "Mediterranean",
    paleo: "Paleo",
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

// Function to validate calorie totals and adjust if needed
function validateCalorieTotals(mealPlan: Partial<MealPlan>, targetCalories: number): Partial<MealPlan> {
  // Clone the response to avoid modifying the original
  const validatedPlan = JSON.parse(JSON.stringify(mealPlan)) as Partial<MealPlan>

  // Check each day's total calories
  for (let day = 1; day <= 7; day++) {
    const dayKey = `day${day}` as keyof typeof validatedPlan.meals

    if (validatedPlan.meals?.[dayKey]) {
      let dayTotal = 0

      // Sum up all meal calories for the day
      validatedPlan.meals[dayKey]?.forEach((meal) => {
        dayTotal += meal.totals.calories
      })

      // If the day's total is significantly off target, adjust the data
      if (Math.abs(dayTotal - targetCalories) > 100) {
        console.warn(
          `Day ${day} calories (${dayTotal}) significantly different from target (${targetCalories}). Adjusting calories.`,
        )

        // Adjust the existing data
        if (validatedPlan.meals[dayKey] && validatedPlan.meals[dayKey]?.length > 0) {
          const adjustmentFactor = targetCalories / dayTotal

          validatedPlan.meals[dayKey]?.forEach((meal) => {
            // Adjust each meal's calories proportionally
            const originalCalories = meal.totals.calories
            const newCalories = Math.round(originalCalories * adjustmentFactor)
            const calorieRatio = newCalories / originalCalories

            // Adjust macros proportionally
            meal.totals.calories = newCalories
            meal.totals.protein = Math.round(meal.totals.protein * calorieRatio)
            meal.totals.carbs = Math.round(meal.totals.carbs * calorieRatio)
            meal.totals.fat = Math.round(meal.totals.fat * calorieRatio)

            // Adjust each food item proportionally
            meal.foods.forEach((food) => {
              food.calories = Math.round(food.calories * calorieRatio)
              food.protein = Math.round(food.protein * calorieRatio)
              food.carbs = Math.round(food.carbs * calorieRatio)
              food.fat = Math.round(food.fat * calorieRatio)
            })
          })
        }
      }
    }
  }

  return validatedPlan
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
      model: "llama-3.3-70b-versatile",
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

  // Get Indonesian food suggestions based on nutritional goals if Indonesian cuisine is selected
  let indonesianDishesPrompt = ""
  if (context.cuisine === "Indonesian") {
    const breakfastSuggestions = getIndonesianFoodSuggestions(
      context.goal,
      context.dietType,
      targetCalories,
      "breakfast",
    ).slice(0, 4)
    const mainMealSuggestions = getIndonesianFoodSuggestions(
      context.goal,
      context.dietType,
      targetCalories,
      "lunch",
    ).slice(0, 8)
    const snackSuggestions = getIndonesianFoodSuggestions(
      context.goal,
      context.dietType,
      targetCalories,
      "snack",
    ).slice(0, 4)

    indonesianDishesPrompt = `
Here are some authentic Indonesian dishes you can include in the meal plan but dont repeat the same order wit:

Breakfast Options:
${breakfastSuggestions.map((dish) => `- ${dish.name} (${dish.components}): ${dish.protein}g protein, ${dish.carbs}g carbs, ${dish.fat}g fat, ${dish.calories} calories per serving`).join("\n")}

Main Meal Options:
${mainMealSuggestions.map((dish) => `- ${dish.name} (${dish.components}): ${dish.protein}g protein, ${dish.carbs}g carbs, ${dish.fat}g fat, ${dish.calories} calories per serving`).join("\n")}

Snack Options:
${snackSuggestions.map((dish) => `- ${dish.name} (${dish.components}): ${dish.protein}g protein, ${dish.carbs}g carbs, ${dish.fat}g fat, ${dish.calories} calories per serving`).join("\n")}
`
  }

  // Create a simplified prompt
  const prompt = `
  Create a 7-day meal plan with the following parameters:
  - Nutrition Goal: ${context.goal}
  - Daily Calories: ${targetCalories}
  - Diet Type: ${context.dietType}
  - Meals Per Day: ${context.mealsPerDay}
  - Dietary Restrictions: ${context.restrictions}
  - Cuisine Preference: ${context.cuisine}
  - Include Snacks: ${context.includeSnacks ? "Yes" : "No"}
  
  Macronutrient Targets:
  - Protein: ${targetProteinGrams}g (${proteinPercent}%)
  - Carbs: ${targetCarbsGrams}g (${carbsPercent}%)
  - Fat: ${targetFatGrams}g (${fatPercent}%)
  
  ${indonesianDishesPrompt}
  
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
      model: "llama-3.3-70b-versatile",
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

      // Additional validation to ensure calorie targets are met
      const validatedResponse = validateCalorieTotals(parsedResponse, targetCalories)

      return mealPlanSchema.parse(validatedResponse)
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

// Function to get Indonesian food suggestions based on nutritional goals
export function getIndonesianFoodSuggestions(
  nutritionGoal: string,
  dietType: string,
  calorieTarget: number,
  mealType?: "breakfast" | "lunch" | "dinner" | "snack",
): Array<{
  name: string
  description: string
  components: string
  servingSize: string
  protein: number
  carbs: number
  fat: number
  calories: number
}> {
  let suggestions: typeof indonesianFoods = []

  // Filter based on meal type if specified
  let filteredByMeal = [...indonesianFoods]
  if (mealType) {
    switch (mealType) {
      case "breakfast":
        filteredByMeal = indonesianFoods.filter(
          (food) =>
            food.name.includes("Bubur") ||
            food.name.includes("Lontong") ||
            food.name.includes("Nasi Uduk") ||
            food.name.includes("Ketoprak"),
        )
        break
      case "lunch":
      case "dinner":
        filteredByMeal = indonesianFoods.filter(
          (food) =>
            food.name.includes("Nasi") ||
            food.name.includes("Ikan") ||
            food.name.includes("Ayam") ||
            food.name.includes("Sayur") ||
            food.name.includes("Soto") ||
            food.name.includes("Rawon") ||
            food.name.includes("Sup"),
        )
        break
      case "snack":
        filteredByMeal = indonesianFoods.filter(
          (food) =>
            food.name.includes("Rujak") ||
            food.name.includes("Pisang") ||
            food.name.includes("Kue") ||
            food.name.includes("Kolak") ||
            food.name.includes("Perkedel"),
        )
        break
    }
  }

  // Filter based on nutrition goal
  switch (nutritionGoal.toLowerCase()) {
    case "muscle gain":
      suggestions = filteredByMeal.filter((food) => food.protein > 15)
      break
    case "fat loss":
      suggestions = filteredByMeal.filter((food) => food.calories < 250 && food.fat < 10)
      break
    case "maintenance":
      suggestions = filteredByMeal
      break
    case "performance":
      suggestions = filteredByMeal.filter((food) => food.carbs > 20 || food.protein > 15)
      break
    case "healthy eating":
      suggestions = filteredByMeal.filter(
        (food) => food.protein > 10 || food.description.includes("vegetable") || food.description.includes("fruit"),
      )
      break
    default:
      suggestions = filteredByMeal
  }

  // Further filter based on diet type
  if (dietType.toLowerCase().includes("high protein")) {
    suggestions = suggestions.filter((food) => food.protein > 15)
  } else if (dietType.toLowerCase().includes("low carb")) {
    suggestions = suggestions.filter((food) => food.carbs < 20)
  } else if (dietType.toLowerCase().includes("keto")) {
    suggestions = suggestions.filter((food) => food.carbs < 15 && food.fat > 10)
  } else if (dietType.toLowerCase().includes("vegetarian")) {
    suggestions = suggestions.filter(
      (food) =>
        !food.description.toLowerCase().includes("chicken") &&
        !food.description.toLowerCase().includes("beef") &&
        !food.description.toLowerCase().includes("fish") &&
        !food.description.toLowerCase().includes("shrimp") &&
        !food.description.toLowerCase().includes("squid") &&
        !food.description.toLowerCase().includes("oxtail"),
    )
  }

  // Sort by relevance to goals
  if (nutritionGoal.toLowerCase() === "muscle gain") {
    suggestions.sort((a, b) => b.protein - a.protein)
  } else if (nutritionGoal.toLowerCase() === "fat loss") {
    suggestions.sort((a, b) => a.calories - b.calories)
  }

  return suggestions
}

