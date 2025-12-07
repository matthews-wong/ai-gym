import { z } from "zod";

// Workout Types
export interface WorkoutFormData {
  fitnessGoal: "muscleGain" | "fatLoss" | "strength" | "endurance";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  daysPerWeek: number;
  sessionLength: number;
  focusAreas: Array<
    | "fullBody"
    | "upperBody"
    | "lowerBody"
    | "core"
    | "arms"
    | "back"
    | "chest"
    | "shoulders"
    | "legs"
  >;
  equipment: "fullGym" | "homeBasic" | "bodyweight";
}

export const workoutPlanSchema = z.object({
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
        })
      ),
      notes: z.array(z.string()),
    })
  ),
});

export type WorkoutPlan = z.infer<typeof workoutPlanSchema>;

// Meal Types
export interface MealFormData {
  nutritionGoal:
    | "muscleGain"
    | "fatLoss"
    | "maintenance"
    | "performance"
    | "healthyEating";
  dailyCalories: number;
  dietType:
    | "balanced"
    | "highProtein"
    | "lowCarb"
    | "keto"
    | "mediterranean"
    | "paleo";
  mealsPerDay: number;
  dietaryRestrictions:
    | "none"
    | "vegetarian"
    | "vegan"
    | "glutenFree"
    | "dairyFree"
    | "pescatarian";
  cuisinePreference?:
    | "any"
    | "indonesian"
    | "asian"
    | "mediterranean"
    | "western"
    | "mexican"
    | "indian";
  mealComplexity?: "simple" | "moderate" | "complex";
  includeDesserts?: boolean;
  allergies?: "none" | "nuts" | "shellfish" | "eggs" | "soy" | "wheat" | "dairy";
  budgetLevel?: "low" | "medium" | "high";
  cookingTime?: "minimal" | "moderate" | "extended";
  seasonalPreference?: "any" | "spring" | "summer" | "fall" | "winter";
  healthConditions?:
    | "none"
    | "diabetes"
    | "heartHealth"
    | "lowSodium"
    | "lowFodmap";
  proteinPreference?:
    | "balanced"
    | "poultry"
    | "seafood"
    | "redMeat"
    | "plantBased";
  mealPrepOption?: "daily" | "batchCook" | "weeklyPrep";
  includeSnacks?: boolean;
  snackFrequency?: "once" | "twice" | "thrice";
  snackType?:
    | "balanced"
    | "protein"
    | "lowCalorie"
    | "sweet"
    | "savory"
    | "fruit";
}

export const mealPlanSchema = z.object({
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
          })
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
      })
    )
  ),
});

export type MealPlan = z.infer<typeof mealPlanSchema>;

// Coach Types
export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface CoachResponse {
  response: string;
  error?: string;
}
