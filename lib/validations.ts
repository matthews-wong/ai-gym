import { z } from "zod"

export const workoutFormSchema = z.object({
  fitnessGoal: z.enum(["muscleGain", "fatLoss", "strength", "endurance"]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  daysPerWeek: z.number().min(1).max(7),
  sessionLength: z.number().min(15).max(180),
  focusAreas: z.array(
    z.enum(["fullBody", "upperBody", "lowerBody", "core", "arms", "back", "chest", "shoulders", "legs"])
  ).min(1),
  equipment: z.enum(["fullGym", "homeBasic", "bodyweight"]),
})

export type WorkoutFormInput = z.infer<typeof workoutFormSchema>

export const mealFormSchema = z.object({
  nutritionGoal: z.enum(["muscleGain", "fatLoss", "maintenance", "performance", "healthyEating"]),
  dailyCalories: z.number().min(1000).max(6000),
  dietType: z.enum(["balanced", "highProtein", "lowCarb", "keto", "mediterranean", "paleo"]),
  mealsPerDay: z.number().min(2).max(6),
  dietaryRestrictions: z.enum(["none", "vegetarian", "vegan", "glutenFree", "dairyFree", "pescatarian"]),
  cuisinePreference: z.enum(["any", "indonesian", "asian", "mediterranean", "western", "mexican", "indian"]).optional(),
  mealComplexity: z.enum(["simple", "moderate", "complex"]).optional(),
  includeDesserts: z.boolean().optional(),
  allergies: z.enum(["none", "nuts", "shellfish", "eggs", "soy", "wheat", "dairy"]).optional(),
  budgetLevel: z.enum(["low", "medium", "high"]).optional(),
  cookingTime: z.enum(["minimal", "moderate", "extended"]).optional(),
  seasonalPreference: z.enum(["any", "spring", "summer", "fall", "winter"]).optional(),
  healthConditions: z.enum(["none", "diabetes", "heartHealth", "lowSodium", "lowFodmap"]).optional(),
  proteinPreference: z.enum(["balanced", "poultry", "seafood", "redMeat", "plantBased"]).optional(),
  mealPrepOption: z.enum(["daily", "batchCook", "weeklyPrep"]).optional(),
  includeSnacks: z.boolean().optional(),
  snackFrequency: z.enum(["once", "twice", "thrice"]).optional(),
  snackType: z.enum(["balanced", "protein", "lowCalorie", "sweet", "savory", "fruit"]).optional(),
})

export type MealFormInput = z.infer<typeof mealFormSchema>

export const blogGenerateSchema = z.object({
  topic: z.string().min(3).max(200).optional(),
})

export type BlogGenerateInput = z.infer<typeof blogGenerateSchema>
