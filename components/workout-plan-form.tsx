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
import { Loader2, AlertTriangle, CheckCircle2, Dumbbell, Timer, CalendarDays } from "lucide-react"
import { generateWorkoutPlan } from "@/lib/ai-service"
import WorkoutPlanDisplay from "./workout-plan-display"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface WorkoutPlan {
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
    if (typeof window !== "undefined" && window.process?.env?.HAS_GROQ_KEY !== undefined) {
      setHasGroqKey(!!window.process.env.NEXT_PUBLIC_GROQ_API_KEY)
    } else {
      fetch("/api/env")
        .then((res) => res.json())
        .then((data) => setHasGroqKey(data.hasGroqKey))
        .catch((err) => setHasGroqKey(false))
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
      window.scrollTo({ top: 0, behavior: "smooth" })
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
    // Added px-4 for mobile spacing and py-6 to ensure it's not flush with the top/bottom
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {apiError && (
        <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {hasGroqKey === false && (
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10 text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500">API Key Missing</AlertTitle>
          <AlertDescription>
            The GROQ API key is missing. Some features may not work correctly.
          </AlertDescription>
        </Alert>
      )}

      {/* Adjusted padding: p-5 on mobile, p-8 on desktop */}
      <div className="bg-gray-950/50 border border-gray-800 backdrop-blur-sm rounded-xl p-5 md:p-8 shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section: Basics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fitnessGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-400 font-medium">Fitness Goal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-gray-900/50 border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all">
                          <SelectValue placeholder="What's your main goal?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-900 border-gray-800">
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
                    <FormLabel className="text-emerald-400 font-medium">Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-gray-900/50 border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all">
                          <SelectValue placeholder="How experienced are you?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-900 border-gray-800">
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

            {/* Section: Time Constraints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 bg-gray-900/30 rounded-xl border border-gray-800/50">
              <FormField
                control={form.control}
                name="daysPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-2">
                      <FormLabel className="text-emerald-400 font-medium flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" /> Days Per Week
                      </FormLabel>
                      <span className="text-2xl font-bold text-white">{field.value}</span>
                    </div>
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
                    <FormDescription className="text-gray-500 text-xs">Weekly commitment frequency</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionLength"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-2">
                      <FormLabel className="text-emerald-400 font-medium flex items-center gap-2">
                        <Timer className="w-4 h-4" /> Duration
                      </FormLabel>
                      <span className="text-2xl font-bold text-white">{field.value} <span className="text-sm text-gray-400 font-normal">min</span></span>
                    </div>
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
                    <FormDescription className="text-gray-500 text-xs">Length of each workout session</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Section: Focus Areas */}
            <FormField
              control={form.control}
              name="focusAreas"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-emerald-400 font-medium flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" /> Target Muscles
                    </FormLabel>
                    <FormDescription className="text-gray-400">
                      Select the areas you want to prioritize.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {focusAreaOptions.map((option) => {
                        const isChecked = field.value?.includes(option.id);
                        return (
                          <div 
                            key={option.id}
                            className={cn(
                              "relative flex items-center justify-center px-2 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group",
                              isChecked 
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-4px_rgba(16,185,129,0.5)]" 
                                : "border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-600 hover:bg-gray-800"
                            )}
                            onClick={() => {
                              if (isChecked) {
                                field.onChange(field.value?.filter((value) => value !== option.id));
                              } else {
                                field.onChange([...field.value, option.id]);
                              }
                            }}
                          >
                            {isChecked && <CheckCircle2 className="w-3 h-3 mr-2 animate-in zoom-in" />}
                            <span className="text-sm font-medium text-center select-none">{option.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 mt-2" />
                </FormItem>
              )}
            />

            {/* Section: Equipment */}
            <FormField
              control={form.control}
              name="equipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-400 font-medium">Available Equipment</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-gray-900/50 border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all">
                        <SelectValue placeholder="What equipment do you have access to?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="fullGym">Full Gym (Commercial Gym)</SelectItem>
                      <SelectItem value="homeBasic">Home Gym (Dumbbells, Bands, Bench)</SelectItem>
                      <SelectItem value="bodyweight">No Equipment (Bodyweight Only)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white mt-6 py-6 text-lg font-bold shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:scale-[1.01]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Designing Your Program...
                </>
              ) : (
                "Generate My Plan"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}