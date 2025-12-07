import { z } from "zod";

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required").max(100),
  description: z.string().max(500).optional(),
});

export const mealSchema = z.object({
  title: z.string().min(1, "Meal name is required").max(100),
  calories: z.number().min(0, "Calories must be positive").max(10000),
});

export const progressLogSchema = z.object({
  date: z.string().min(1, "Date is required"),
  weight: z.number().min(20, "Weight seems too low").max(500, "Weight seems too high"),
  notes: z.string().max(1000).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WorkoutInput = z.infer<typeof workoutSchema>;
export type MealInput = z.infer<typeof mealSchema>;
export type ProgressLogInput = z.infer<typeof progressLogSchema>;
