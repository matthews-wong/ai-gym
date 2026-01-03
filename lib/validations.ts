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
  nutritionGoal: z.string().min(1),
  dailyCalories: z.coerce.number().min(1000).max(6000),
  dietType: z.string().min(1),
  mealsPerDay: z.coerce.number().min(2).max(6),
  dietaryRestrictions: z.string().optional(),
  cuisinePreference: z.string().optional(),
  mealComplexity: z.string().optional(),
  includeDesserts: z.boolean().optional(),
  allergies: z.string().optional(),
  budgetLevel: z.string().optional(),
  cookingTime: z.string().optional(),
  seasonalPreference: z.string().optional(),
  healthConditions: z.string().optional(),
  proteinPreference: z.string().optional(),
  mealPrepOption: z.string().optional(),
  includeSnacks: z.boolean().optional(),
  snackFrequency: z.string().optional(),
  snackType: z.string().optional(),
  availableIngredients: z.string().optional(),
})

export type MealFormInput = z.infer<typeof mealFormSchema>

export const blogGenerateSchema = z.object({
  topic: z.string().min(3).max(200).optional(),
})

export type BlogGenerateInput = z.infer<typeof blogGenerateSchema>
