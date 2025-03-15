"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { generateMealPlan } from "@/lib/ai-service"
import MealPlanDisplay from "./meal-plan-display"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ApiTestButton from "./api-test-button"

const formSchema = z.object({
  nutritionGoal: z.string().min(1, { message: "Please select a nutrition goal" }),
  dailyCalories: z.coerce.number().min(1200).max(5000),
  dietType: z.string().min(1, { message: "Please select a diet type" }),
  mealsPerDay: z.number().min(3).max(6),
  dietaryRestrictions: z.string(),
})

export default function MealPlanForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [mealPlan, setMealPlan] = useState<any>(null)
  const [hasGroqKey, setHasGroqKey] = useState<boolean | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // First check if we have the environment variable from next.config.js
    if (typeof window !== "undefined" && window.process?.env?.HAS_GROQ_KEY !== undefined) {
      setHasGroqKey(!!window.process.env.HAS_GROQ_KEY)
      console.log("Using environment variable from next.config.js:", !!window.process.env.HAS_GROQ_KEY)
    } else {
      // Fallback to API route
      fetch("/api/env")
        .then((res) => res.json())
        .then((data) => {
          console.log("API route response:", data)
          setHasGroqKey(data.hasGroqKey)
        })
        .catch((err) => {
          console.error("Error checking API key:", err)
          setHasGroqKey(false)
        })
    }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nutritionGoal: "",
      dailyCalories: 2000,
      dietType: "",
      mealsPerDay: 3,
      dietaryRestrictions: "none",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setApiError(null)
    try {
      // Scroll to top for better UX when loading
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Generate meal plan
      const plan = await generateMealPlan(values)
      setMealPlan(plan)
    } catch (error: any) {
      console.error("Error generating meal plan:", error)
      setApiError(error.message || "Failed to generate meal plan. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (mealPlan) {
    return <MealPlanDisplay plan={mealPlan} onBack={() => setMealPlan(null)} />
  }

  return (
    <Form {...form}>
      {hasGroqKey === false && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>API Key Missing</AlertTitle>
          <AlertDescription>
            GROQ_API_KEY is not set. The app will use mock data instead of generating real plans.
          </AlertDescription>
        </Alert>
      )}

      {apiError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {/* Add API test button */}
      <ApiTestButton />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nutritionGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nutrition Goal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                    <SelectItem value="fatLoss">Fat Loss</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dailyCalories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Calories</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2000" className="bg-gray-800 border-gray-700" {...field} />
                </FormControl>
                <FormDescription>Target daily calorie intake</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dietType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diet Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select diet type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="highProtein">High Protein</SelectItem>
                  <SelectItem value="lowCarb">Low Carb</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mealsPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meals Per Day: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={3}
                  max={6}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-4"
                />
              </FormControl>
              <FormDescription>How many meals do you want per day?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryRestrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Restrictions</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select any restrictions" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="glutenFree">Gluten Free</SelectItem>
                  <SelectItem value="dairyFree">Dairy Free</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 mt-8" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Your Personalized Meal Plan...
            </>
          ) : (
            "Generate Meal Plan"
          )}
        </Button>
      </form>
    </Form>
  )
}

