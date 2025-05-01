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
import { generateWorkoutPlan } from "@/lib/ai-service"
import WorkoutPlanDisplay from "./workout-plan-display"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the type for the workout plan
interface WorkoutPlan {
  // Add appropriate fields based on your actual plan structure
  days: Array<{
    day: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest: string;
    }>;
  }>;
  notes?: string;
}

const formSchema = z.object({
  fitnessGoal: z.string().min(1, { message: "Please select a fitness goal" }),
  experienceLevel: z.string().min(1, { message: "Please select your experience level" }),
  daysPerWeek: z.number().min(1).max(7),
  sessionLength: z.number().min(15).max(120),
  focusAreas: z.array(z.string()).min(1, { message: "Please select at least one focus area" }),
  equipment: z.string().min(1, { message: "Please select available equipment" }),
})

type FormValues = z.infer<typeof formSchema>;

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
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [hasGroqKey, setHasGroqKey] = useState<boolean | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    // First check if we have the environment variable from next.config.js
    if (typeof window !== "undefined" && window.process?.env?.HAS_GROQ_KEY !== undefined) {
      setHasGroqKey(!!window.process.env.NEXT_PUBLIC_GROQ_API_KEY)
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

  const form = useForm<FormValues>({
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

  async function onSubmit(values: FormValues) {
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
    <div className="max-w-3xl mx-auto p-4 rounded-lg bg-gray-900 shadow-lg">
      {apiError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {hasGroqKey === false && (
        <Alert className="mb-6 border-amber-500 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500">API Key Missing</AlertTitle>
          <AlertDescription>
            The GROQ API key is missing. Some features may not work correctly.
          </AlertDescription>
        </Alert>
      )}

      <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">Create Your Custom Workout Plan</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fitnessGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-400">Fitness Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-emerald-500">
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
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-400">Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-emerald-500">
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="daysPerWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-400">Days Per Week: <span className="text-white font-semibold">{field.value}</span></FormLabel>
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
                <FormDescription className="text-gray-400">How many days per week can you commit to working out?</FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sessionLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-400">Session Length: <span className="text-white font-semibold">{field.value} minutes</span></FormLabel>
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
                <FormDescription className="text-gray-400">How long can each workout session be?</FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="focusAreas"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-emerald-400">Focus Areas</FormLabel>
                  <FormDescription className="text-gray-400">Select the areas you want to focus on in your workouts</FormDescription>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {focusAreaOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="focusAreas"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-3 hover:border-emerald-500 transition-colors"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.id])
                                    : field.onChange(field.value?.filter((value) => value !== option.id))
                                }}
                                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">{option.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage className="text-red-400 mt-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="equipment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-400">Available Equipment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-emerald-500">
                      <SelectValue placeholder="Select available equipment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="fullGym">Full Gym</SelectItem>
                    <SelectItem value="homeBasic">Home Basic (Dumbbells, Resistance Bands)</SelectItem>
                    <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 mt-8 py-6 text-lg font-medium transition-all duration-200 transform hover:scale-[1.02]" 
            disabled={isLoading}
          >
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
    </div>
  )
}