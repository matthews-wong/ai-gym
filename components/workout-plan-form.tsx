"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { generateWorkoutPlan } from "@/lib/ai-service"
import WorkoutPlanDisplay from "./workout-plan-display"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ApiTestButton from "./api-test-button"

const formSchema = z.object({
  fitnessGoal: z.string().min(1, { message: "Please select a fitness goal" }),
  experienceLevel: z.string().min(1, { message: "Please select your experience level" }),
  daysPerWeek: z.number().min(1).max(7),
  sessionLength: z.number().min(15).max(120),
  focusAreas: z.array(z.string()).min(1, { message: "Please select at least one focus area" }),
  equipment: z.string().min(1, { message: "Please select available equipment" }),
})

const focusAreaOptions = [
  { id: "fullBody", label: "Full Body" },
  { id: "upperBody", label: "Upper Body" },
  { id: "lowerBody", label: "Lower Body" },
  { id: "core", label: "Core" },
  { id: "arms", label: "Arms" },
  { id: "back", label: "Back" },
  { id: "chest", label: "Chest" },
  { id: "shoulders", label: "Shoulders" },
  { id: "legs", label: "Legs" },
]

export default function WorkoutPlanForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [workoutPlan, setWorkoutPlan] = useState<any>(null)
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
      fitnessGoal: "",
      experienceLevel: "",
      daysPerWeek: 3,
      sessionLength: 60,
      focusAreas: ["fullBody"],
      equipment: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setApiError(null)
    try {
      // Scroll to top for better UX when loading
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Generate workout plan
      const plan = await generateWorkoutPlan(values)
      setWorkoutPlan(plan)
    } catch (error: any) {
      console.error("Error generating workout plan:", error)
      setApiError(error.message || "Failed to generate workout plan. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (workoutPlan) {
    return <WorkoutPlanDisplay plan={workoutPlan} onBack={() => setWorkoutPlan(null)} />
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
            name="fitnessGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fitness Goal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                    <SelectItem value="fatLoss">Fat Loss</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="daysPerWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days Per Week: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={7}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-4"
                />
              </FormControl>
              <FormDescription>How many days per week can you commit to working out?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sessionLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Length: {field.value} minutes</FormLabel>
              <FormControl>
                <Slider
                  min={15}
                  max={120}
                  step={5}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-4"
                />
              </FormControl>
              <FormDescription>How long can each workout session be?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="focusAreas"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Focus Areas</FormLabel>
                <FormDescription>Select the areas you want to focus on in your workouts</FormDescription>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {focusAreaOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="focusAreas"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.id])
                                  : field.onChange(field.value?.filter((value) => value !== option.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">{option.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="equipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Equipment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select available equipment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="fullGym">Full Gym</SelectItem>
                  <SelectItem value="homeBasic">Home Basic (Dumbbells, Resistance Bands)</SelectItem>
                  <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
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
              Creating Your Personalized Workout Plan...
            </>
          ) : (
            "Generate Workout Plan"
          )}
        </Button>
      </form>
    </Form>
  )
}

