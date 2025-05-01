"use client"

import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { CustomTooltip } from "@/components/ui/tooltip"
import {
  Loader2,
  AlertTriangle,
  Calendar,
  Sparkles,
  Info,
  Flame,
  Apple,
  ChevronDown,
  ChevronUp,
  Settings,
  Calculator,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { generateMealPlan, type MealPlan, getApiStatus } from "@/lib/ai-service"
import MealPlanDisplay from "./meal-plan-display"
import LoadingModal from "./loading-modal"
import CalorieCalculatorModal from "./calorie-calculator-modal"

const formSchema = z.object({
  nutritionGoal: z.string().min(1, { message: "Please select a nutrition goal" }),
  dailyCalories: z.coerce.number().min(1200).max(5000),
  dietType: z.string().min(1, { message: "Please select a diet type" }),
  mealsPerDay: z.number().min(2).max(6),
  dietaryRestrictions: z.string(),
  cuisinePreference: z.string().optional(),
  mealComplexity: z.string().optional(),
  includeDesserts: z.boolean().optional().default(false),
  allergies: z.string().optional(),
  budgetLevel: z.string().optional(),
  cookingTime: z.string().optional(),
  seasonalPreference: z.string().optional(),
  healthConditions: z.string().optional(),
  proteinPreference: z.string().optional(),
  mealPrepOption: z.string().optional(),
  includeSnacks: z.boolean().optional().default(false),
  snackFrequency: z.string().optional(),
  snackType: z.string().optional(),
})

export default function MealPlanForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [apiStatus, setApiStatus] = useState<{ available: boolean; message: string } | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showCalorieCalculator, setShowCalorieCalculator] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const formRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check API status on component mount
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const status = await getApiStatus()
      setApiStatus({
        available: status.responseStatus.serviceAvailable,
        message: status.responseStatus.message,
      })
    } catch (error) {
      console.error("Error checking API status:", error)
      setApiStatus({
        available: false,
        message: "Unable to connect to AI service. Please check your API key.",
      })
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nutritionGoal: "",
      dailyCalories: 2000,
      dietType: "",
      mealsPerDay: 3,
      dietaryRestrictions: "none",
      cuisinePreference: "any",
      mealComplexity: "moderate",
      includeDesserts: false,
      allergies: "none",
      budgetLevel: "medium",
      cookingTime: "moderate",
      seasonalPreference: "any",
      healthConditions: "none",
      proteinPreference: "balanced",
      mealPrepOption: "daily",
      includeSnacks: false,
      snackFrequency: "twice",
      snackType: "balanced",
    },
  })

  // Watch for includeSnacks to conditionally show snack options
  const includeSnacks = form.watch("includeSnacks")
  // Add proper type checking for form values
  const formValues = form.watch() as z.infer<typeof formSchema>

  // Scroll to first error field when validation fails
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      // Show a more user-friendly message for form errors
      const firstErrorKey = Object.keys(form.formState.errors)[0]
      const errorElement = document.getElementById(`form-field-${firstErrorKey}`)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
        // Add a subtle highlight animation
        errorElement.classList.add("error-highlight")
        setTimeout(() => {
          errorElement.classList.remove("error-highlight")
        }, 1000)
      }
    }
  }, [form.formState.errors])

  // Handle form submission with better error handling
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!apiStatus?.available) {
      setApiError("AI service is not available. Please check your API key and try again later.")
      return
    }

    setIsLoading(true)
    setApiError(null)

    try {
      // Scroll to top for better UX when loading
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Generate meal plan with better error handling
      const plan = await generateMealPlan(values)
      setMealPlan(plan)
      setRetryCount(0) // Reset retry count on success
    } catch (error: any) {
      console.error("Error generating meal plan:", error)

      let errorMessage = "Failed to generate meal plan. Please try again."

      if (error.message) {
        if (error.message.includes("JSON")) {
          errorMessage = "There was an issue with the meal plan format. Please try again."
        } else {
          errorMessage = error.message
        }
      }

      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle retry when service is temporarily down
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    checkApiStatus()
    if (apiError) {
      setApiError(null)
    }
  }

  // Handle calculated calories from the calculator
  const handleCaloriesCalculated = (calories: number) => {
    form.setValue("dailyCalories", calories)
  }

  if (mealPlan) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-700/30 rounded-lg p-4 shadow-md mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="h-6 w-6 text-emerald-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-emerald-300">Weekly Meal Plan</h3>
              <p className="text-emerald-200/80 text-sm">
                This is your meal plan for the next 7 days. Make sure to plan again next week for continued success!
              </p>
            </div>
          </div>
        </div>
        <MealPlanDisplay plan={mealPlan} onBack={() => setMealPlan(null)} />
      </div>
    )
  }

  return (
    <div ref={formRef}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {apiError && (
            <div className="bg-red-900/50 border border-red-800 rounded-md p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-200">{apiError}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="border-red-700 bg-red-900/30 hover:bg-red-800/50 text-red-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          )}

          {apiStatus && !apiStatus.available && (
            <div className="bg-amber-900/50 border border-amber-800 rounded-md p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <p className="text-amber-200">
                  {apiStatus.message || "AI service is currently unavailable. Please try again later."}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="border-amber-700 bg-amber-900/30 hover:bg-amber-800/50 text-amber-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Status {retryCount > 0 && `(${retryCount})`}
              </Button>
            </div>
          )}

          {/* Essential Fields Section */}
          <div className="space-y-5 bg-gray-850/30 p-5 rounded-lg">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-medium text-white">Essential Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nutritionGoal"
                render={({ field }) => (
                  <FormItem id="form-field-nutritionGoal">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-white">Nutrition Goal</FormLabel>
                      <CustomTooltip content="Select your primary nutritional objective">
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                      </CustomTooltip>
                    </div>
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
                        <SelectItem value="healthyEating">Healthy Eating</SelectItem>
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
                  <FormItem id="form-field-dailyCalories">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-white">Daily Calories</FormLabel>
                      <CustomTooltip content="Your target daily calorie intake">
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                      </CustomTooltip>
                    </div>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="number" placeholder="2000" className="bg-gray-800 border-gray-700" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className="whitespace-nowrap border-gray-700 bg-gray-800/70 hover:bg-gray-700/70"
                        onClick={() => setShowCalorieCalculator(true)}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate
                      </Button>
                    </div>
                    <FormDescription className="text-gray-400">Target daily calorie intake</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dietType"
                render={({ field }) => (
                  <FormItem id="form-field-dietType">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-white">Diet Type</FormLabel>
                      <CustomTooltip content="Select your preferred macronutrient distribution">
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                      </CustomTooltip>
                    </div>
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
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
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
                  <FormItem id="form-field-mealsPerDay">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-white">Meals Per Day: {field.value}</FormLabel>
                      <CustomTooltip content="How many main meals do you want per day? (Snacks are separate)">
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                      </CustomTooltip>
                    </div>
                    <FormControl>
                      <Slider
                        min={2}
                        max={6}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">Number of main meals per day</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dietaryRestrictions"
                render={({ field }) => (
                  <FormItem id="form-field-dietaryRestrictions">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-white">Dietary Restrictions</FormLabel>
                      <CustomTooltip content="Select any dietary restrictions you follow">
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                      </CustomTooltip>
                    </div>
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
                        <SelectItem value="pescatarian">Pescatarian</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cuisinePreference"
                render={({ field }) => (
                  <FormItem id="form-field-cuisinePreference">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-white">Cuisine Preference</FormLabel>
                      <CustomTooltip content="Select your preferred cuisine style">
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                      </CustomTooltip>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select cuisine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="any">Any / No Preference</SelectItem>
                        <SelectItem value="indonesian">Indonesian</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="western">Western</SelectItem>
                        <SelectItem value="mexican">Mexican</SelectItem>
                        <SelectItem value="indian">Indian</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Snacks & Extras Section */}
          <div className="space-y-5 bg-gray-850/30 p-5 rounded-lg">
            <div className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-medium text-white">Snacks & Extras</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="includeSnacks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Include Snacks</FormLabel>
                        <CustomTooltip content="Add snacks between main meals">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <FormDescription className="text-gray-400">Add healthy snacks between main meals</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeDesserts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Include Desserts</FormLabel>
                        <CustomTooltip content="Add occasional desserts to your meal plan">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <FormDescription className="text-gray-400">
                        Add occasional desserts to your meal plan
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {includeSnacks && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-in fade-in-0 slide-in-from-top-5">
                <FormField
                  control={form.control}
                  name="snackFrequency"
                  render={({ field }) => (
                    <FormItem id="form-field-snackFrequency">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Snack Frequency</FormLabel>
                        <CustomTooltip content="How many snacks do you want per day?">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select snack frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="once">Once a day</SelectItem>
                          <SelectItem value="twice">Twice a day</SelectItem>
                          <SelectItem value="thrice">Three times a day</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="snackType"
                  render={({ field }) => (
                    <FormItem id="form-field-snackType">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Snack Type</FormLabel>
                        <CustomTooltip content="What kind of snacks do you prefer?">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select snack type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="protein">High Protein</SelectItem>
                          <SelectItem value="lowCalorie">Low Calorie</SelectItem>
                          <SelectItem value="sweet">Sweet</SelectItem>
                          <SelectItem value="savory">Savory</SelectItem>
                          <SelectItem value="fruit">Fruit-based</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Advanced Options Section */}
          <div className="space-y-5 bg-gray-850/30 p-5 rounded-lg">
            <div className="flex items-center justify-between" onClick={() => setShowAdvanced(!showAdvanced)}>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-medium text-white">Advanced Options</h3>
              </div>
              <button type="button" className="w-9 p-0 bg-transparent border-none text-gray-400 hover:text-gray-300">
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            <div className={`space-y-6 pt-2 ${showAdvanced ? "block" : "hidden"} transition-all duration-300`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem id="form-field-allergies">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Allergies/Intolerances</FormLabel>
                        <CustomTooltip content="Select any food allergies or intolerances">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select allergies" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="nuts">Nuts</SelectItem>
                          <SelectItem value="shellfish">Shellfish</SelectItem>
                          <SelectItem value="eggs">Eggs</SelectItem>
                          <SelectItem value="soy">Soy</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="dairy">Dairy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="healthConditions"
                  render={({ field }) => (
                    <FormItem id="form-field-healthConditions">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Health Considerations</FormLabel>
                        <CustomTooltip content="Select any health conditions to consider">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select health condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="diabetes">Diabetes-Friendly</SelectItem>
                          <SelectItem value="heartHealth">Heart Health</SelectItem>
                          <SelectItem value="lowSodium">Low Sodium</SelectItem>
                          <SelectItem value="lowFodmap">Low FODMAP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="proteinPreference"
                  render={({ field }) => (
                    <FormItem id="form-field-proteinPreference">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Protein Preference</FormLabel>
                        <CustomTooltip content="Select your preferred protein sources">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select protein preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="balanced">Balanced (All Sources)</SelectItem>
                          <SelectItem value="poultry">Poultry-Focused</SelectItem>
                          <SelectItem value="seafood">Seafood-Focused</SelectItem>
                          <SelectItem value="redMeat">Red Meat-Focused</SelectItem>
                          <SelectItem value="plantBased">Plant-Based Proteins</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cookingTime"
                  render={({ field }) => (
                    <FormItem id="form-field-cookingTime">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Cooking Time</FormLabel>
                        <CustomTooltip content="How much time do you want to spend cooking?">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select cooking time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="minimal">Minimal (15 min or less)</SelectItem>
                          <SelectItem value="moderate">Moderate (15-30 min)</SelectItem>
                          <SelectItem value="extended">Extended (30+ min)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mealComplexity"
                  render={({ field }) => (
                    <FormItem id="form-field-mealComplexity">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Meal Complexity</FormLabel>
                        <CustomTooltip content="How complex should the recipes be?">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select complexity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="simple">Simple (Quick & Easy)</SelectItem>
                          <SelectItem value="moderate">Moderate (Balanced)</SelectItem>
                          <SelectItem value="complex">Complex (Gourmet)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mealPrepOption"
                  render={({ field }) => (
                    <FormItem id="form-field-mealPrepOption">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Meal Prep Style</FormLabel>
                        <CustomTooltip content="How would you like to prepare your meals?">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select meal prep style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="daily">Daily Cooking</SelectItem>
                          <SelectItem value="batchCook">Batch Cooking (2-3 days)</SelectItem>
                          <SelectItem value="weeklyPrep">Weekly Meal Prep</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budgetLevel"
                  render={({ field }) => (
                    <FormItem id="form-field-budgetLevel">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Budget Level</FormLabel>
                        <CustomTooltip content="Select your budget level for ingredients">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="low">Budget-Friendly</SelectItem>
                          <SelectItem value="medium">Moderate</SelectItem>
                          <SelectItem value="high">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seasonalPreference"
                  render={({ field }) => (
                    <FormItem id="form-field-seasonalPreference">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-white">Seasonal Preference</FormLabel>
                        <CustomTooltip content="Select seasonal ingredient preferences">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                        </CustomTooltip>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="any">Any / No Preference</SelectItem>
                          <SelectItem value="spring">Spring</SelectItem>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="fall">Fall</SelectItem>
                          <SelectItem value="winter">Winter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 mt-8 py-6 text-lg font-medium shadow-lg border border-emerald-600/30 rounded-lg transition-all duration-300"
            disabled={isLoading || !apiStatus?.available}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Your Personalized Meal Plan...
              </>
            ) : !apiStatus?.available ? (
              <>
                <AlertTriangle className="mr-2 h-5 w-5" />
                AI Service Unavailable
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate 7-Day Meal Plan
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Loading Modal */}
      <LoadingModal isOpen={isLoading} formData={formValues} />

      {/* Calorie Calculator Modal */}
      <CalorieCalculatorModal
        isOpen={showCalorieCalculator}
        onClose={() => setShowCalorieCalculator(false)}
        onCalculated={handleCaloriesCalculated}
      />
    </div>
  )
}

