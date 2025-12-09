// Workout Plan Types
export interface WorkoutPlan {
  summary: {
    goal: string
    level: string
    daysPerWeek: number
    sessionLength: number
    focusAreas: string[]
    equipment: string
  }
  overview: string
  workouts: Record<
    string,
    {
      focus: string
      description: string
      exercises: {
        name: string
        sets: number
        reps: string
        rest: string
      }[]
      notes: string[]
    }
  >
}

// Meal Plan Types
export interface MealPlan {
  summary: {
    goal: string
    calories: number
    dietType: string
    mealsPerDay: number
    restrictions: string
    cuisine?: string
    complexity?: string
    includeDesserts?: boolean
    allergies?: string
    budget?: string
    cookingTime?: string
    seasonalPreference?: string
    healthConditions?: string
    proteinPreference?: string
    mealPrepOption?: string
    includeSnacks?: boolean
    snackFrequency?: string
    snackType?: string
  }
  overview: string
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  meals: Record<
    string,
    {
      name: string
      foods: {
        name: string
        amount: string
        protein: number
        carbs: number
        fat: number
        calories: number
      }[]
      totals: {
        protein: number
        carbs: number
        fat: number
        calories: number
      }
      notes?: string
      cookingTime?: string
      isSnack?: boolean
    }[]
  >
}

// Workout Form Data
export interface WorkoutFormData {
  fitnessGoal: "muscleGain" | "fatLoss" | "strength" | "endurance"
  experienceLevel: "beginner" | "intermediate" | "advanced"
  daysPerWeek: number
  sessionLength: number
  focusAreas: Array<"fullBody" | "upperBody" | "lowerBody" | "core" | "arms" | "back" | "chest" | "shoulders" | "legs">
  equipment: "fullGym" | "homeBasic" | "bodyweight"
}

// Meal Form Data
export interface MealFormData {
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
