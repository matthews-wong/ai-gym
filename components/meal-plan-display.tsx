"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomTooltip } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Info,
  Utensils,
  Clock,
  Leaf,
  Heart,
  Flame,
  Brain,
  Salad,
  Sparkles,
  AlertCircle,
  Apple,
} from "lucide-react"
import type { MealPlan } from "@/lib/ai-service"
import { generatePDF } from "@/lib/pdf-service"

// Add proper type definitions for the meal plan data
interface MealFood {
  name: string
  amount: string
  protein: number
  carbs: number
  fat: number
  calories: number
}

interface MealTotals {
  protein: number
  carbs: number
  fat: number
  calories: number
}

interface Meal {
  name: string
  foods: MealFood[]
  totals: MealTotals
  notes?: string
  cookingTime?: string
  isSnack?: boolean
}

interface MealPlanDisplayProps {
  plan: MealPlan
  onBack: () => void
}

export default function MealPlanDisplay({ plan, onBack }: MealPlanDisplayProps) {
  const [currentDay, setCurrentDay] = useState(1)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const totalDays = 7 // Assuming a 7-day meal plan

  // Add a more elegant loading state and error handling
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Loading your meal plan...")
  const [error, setError] = useState<string | null>(null)

  const handlePrevDay = () => {
    setCurrentDay((prev) => (prev === 1 ? totalDays : prev - 1))
  }

  const handleNextDay = () => {
    setCurrentDay((prev) => (prev === totalDays ? 1 : prev + 1))
  }

  // Enhance the PDF generation with better error handling
  const handleGeneratePDF = async () => {
    setIsLoading(true)
    setIsGeneratingPDF(true)
    setLoadingMessage("Generating your PDF...")

    try {
      await generatePDF(plan, "meal")
    } catch (error) {
      console.error("Error generating PDF:", error)
      setError("There was an issue generating your PDF. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsGeneratingPDF(false)
      setIsLoading(false)
    }
  }

  // Use useMemo to optimize calculations for the current day's data
  const { mainMeals, snacks, mainMealTotals, snackTotals, dailyTotals, caloriePercentage } = useMemo(() => {
    // Separate meals and snacks
    const mainMeals = plan.meals[`day${currentDay}`]?.filter((meal) => !meal.isSnack) || []
    const snacks = plan.meals[`day${currentDay}`]?.filter((meal) => meal.isSnack) || []

    // Calculate daily totals for the current day (excluding snacks for main meal calculations)
    const mainMealTotals = mainMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.totals.calories
        acc.protein += meal.totals.protein
        acc.carbs += meal.totals.carbs
        acc.fat += meal.totals.fat
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )

    // Calculate snack totals
    const snackTotals = snacks.reduce(
      (acc, snack) => {
        acc.calories += snack.totals.calories
        acc.protein += snack.totals.protein
        acc.carbs += snack.totals.carbs
        acc.fat += snack.totals.fat
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )

    // Calculate overall totals
    const dailyTotals = {
      calories: mainMealTotals.calories + snackTotals.calories,
      protein: mainMealTotals.protein + snackTotals.protein,
      carbs: mainMealTotals.carbs + snackTotals.carbs,
      fat: mainMealTotals.fat + snackTotals.fat,
    }

    // Calculate percentage of target calories
    const caloriePercentage = Math.round((dailyTotals.calories / plan.summary.calories) * 100)

    return {
      mainMeals,
      snacks,
      mainMealTotals,
      snackTotals,
      dailyTotals,
      caloriePercentage,
    }
  }, [currentDay, plan.meals, plan.summary.calories])

  // Helper function to calculate macro percentages
  const calculateMacroPercentage = (macroCalories: number, totalCalories: number): number => {
    return totalCalories > 0 ? Math.round((macroCalories / totalCalories) * 100) : 0
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Form
        </Button>
        <CustomTooltip content="Download a printable version of your meal plan">
          <Button
            variant="outline"
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </CustomTooltip>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-3 mb-4 text-red-200 flex items-center gap-2 animate-in fade-in-0 slide-in-from-top-5">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 rounded-xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-800/50 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="md:col-span-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 text-xs font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Your Personalized Nutrition Plan
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                {plan.summary.goal} Meal Plan
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base mb-4">{plan.overview}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-gray-800/70 hover:bg-gray-800/90 transition-colors p-2 sm:p-3 rounded-lg flex items-center gap-2 group border border-gray-700/50">
                <div className="bg-amber-900/30 p-1.5 rounded-md group-hover:bg-amber-900/40 transition-colors">
                  <Flame className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Daily Target</p>
                  <p className="text-sm font-medium text-white">{plan.summary.calories} calories</p>
                </div>
              </div>

              <div className="bg-gray-800/70 hover:bg-gray-800/90 transition-colors p-2 sm:p-3 rounded-lg flex items-center gap-2 group border border-gray-700/50">
                <div className="bg-blue-900/30 p-1.5 rounded-md group-hover:bg-blue-900/40 transition-colors">
                  <Brain className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Diet Style</p>
                  <p className="text-sm font-medium text-white">{plan.summary.dietType}</p>
                </div>
              </div>

              <div className="bg-gray-800/70 hover:bg-gray-800/90 transition-colors p-2 sm:p-3 rounded-lg flex items-center gap-2 group border border-gray-700/50">
                <div className="bg-emerald-900/30 p-1.5 rounded-md group-hover:bg-emerald-900/40 transition-colors">
                  <Utensils className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Meals Per Day</p>
                  <p className="text-sm font-medium text-white">{plan.summary.mealsPerDay}</p>
                </div>
              </div>

              <div className="bg-gray-800/70 hover:bg-gray-800/90 transition-colors p-2 sm:p-3 rounded-lg flex items-center gap-2 group border border-gray-700/50">
                <div className="bg-green-900/30 p-1.5 rounded-md group-hover:bg-green-900/40 transition-colors">
                  <Leaf className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Restrictions</p>
                  <p className="text-sm font-medium text-white">{plan.summary.restrictions}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-inner border border-gray-800/80">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-400" />
              Your Macro Breakdown
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-300 text-sm flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                    Protein
                  </span>
                  <span className="text-gray-300 text-sm font-medium">{plan.macros.protein}g</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full"
                    style={{
                      width: `${calculateMacroPercentage(plan.macros.protein * 4, plan.summary.calories)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {calculateMacroPercentage(plan.macros.protein * 4, plan.summary.calories)}% of calories
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-300 text-sm flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                    Carbs
                  </span>
                  <span className="text-gray-300 text-sm font-medium">{plan.macros.carbs}g</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full"
                    style={{
                      width: `${calculateMacroPercentage(plan.macros.carbs * 4, plan.summary.calories)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {calculateMacroPercentage(plan.macros.carbs * 4, plan.summary.calories)}% of calories
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-300 text-sm flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
                    Fat
                  </span>
                  <span className="text-gray-300 text-sm font-medium">{plan.macros.fat}g</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full"
                    style={{
                      width: `${calculateMacroPercentage(plan.macros.fat * 9, plan.summary.calories)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {calculateMacroPercentage(plan.macros.fat * 9, plan.summary.calories)}% of calories
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-700/50">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Plan Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {plan.summary.cuisine && (
                  <div className="bg-gray-800/50 hover:bg-gray-800/70 transition-colors p-2 rounded-md border border-gray-700/30">
                    <p className="text-gray-400">Cuisine Style</p>
                    <p className="text-white font-medium">{plan.summary.cuisine}</p>
                  </div>
                )}
                {plan.summary.complexity && (
                  <div className="bg-gray-800/50 hover:bg-gray-800/70 transition-colors p-2 rounded-md border border-gray-700/30">
                    <p className="text-gray-400">Recipe Complexity</p>
                    <p className="text-white font-medium">{plan.summary.complexity}</p>
                  </div>
                )}
                {plan.summary.budget && (
                  <div className="bg-gray-800/50 hover:bg-gray-800/70 transition-colors p-2 rounded-md border border-gray-700/30">
                    <p className="text-gray-400">Budget Level</p>
                    <p className="text-white font-medium">{plan.summary.budget}</p>
                  </div>
                )}
                {plan.summary.cookingTime && (
                  <div className="bg-gray-800/50 hover:bg-gray-800/70 transition-colors p-2 rounded-md border border-gray-700/30">
                    <p className="text-gray-400">Prep Time</p>
                    <p className="text-white font-medium">{plan.summary.cookingTime}</p>
                  </div>
                )}
                {plan.summary.includeSnacks && (
                  <div className="bg-gray-800/50 hover:bg-gray-800/70 transition-colors p-2 rounded-md border border-gray-700/30">
                    <p className="text-gray-400">Snacks</p>
                    <p className="text-white font-medium">
                      {plan.summary.snackFrequency ? plan.summary.snackFrequency : "Included"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-800/50">
        <div className="p-4 sm:p-5 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-700/30 to-emerald-600/20 p-2 rounded-full shadow-inner border border-emerald-700/30">
              <Calendar className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Your 7-Day Meal Plan</h2>
              <p className="text-xs text-gray-400 hidden sm:block">Balanced nutrition for your entire week</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-gray-800/80 rounded-lg p-1 flex items-center border border-gray-700/50 shadow-inner">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevDay}
                className="h-8 w-8 p-0 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-white"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="px-3 py-1">
                <div className="text-white font-medium text-center">Day {currentDay}</div>
                <div className="text-xs text-gray-400 text-center">{dayNames[currentDay - 1]}</div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextDay}
                className="h-8 w-8 p-0 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-white"
                aria-label="Next day"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-800/50 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-gray-300">Daily Totals:</span>
              <span
                className={`text-sm font-medium ${
                  caloriePercentage > 110 || caloriePercentage < 90 ? "text-amber-300" : "text-emerald-300"
                }`}
              >
                {dailyTotals.calories} kcal ({caloriePercentage}% of target)
              </span>
              <span className="text-sm text-gray-300 hidden sm:inline">|</span>
              <span className="text-sm text-gray-300 hidden sm:inline">
                P: {dailyTotals.protein}g • C: {dailyTotals.carbs}g • F: {dailyTotals.fat}g
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {caloriePercentage > 110 && (
                <div className="flex items-center gap-1 text-amber-400">
                  <AlertCircle className="h-3 w-3" />
                  <span>Exceeds daily target</span>
                </div>
              )}
              {caloriePercentage < 90 && (
                <div className="flex items-center gap-1 text-amber-400">
                  <AlertCircle className="h-3 w-3" />
                  <span>Below daily target</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 sm:hidden">
            <span className="text-sm text-gray-300">
              P: {dailyTotals.protein}g • C: {dailyTotals.carbs}g • F: {dailyTotals.fat}g
            </span>
          </div>

          {/* Improve the calorie adjustment message with more helpful tips */}
          {(caloriePercentage > 110 || caloriePercentage < 90) && (
            <div
              className={`mt-3 p-4 rounded-lg text-sm ${
                caloriePercentage > 110
                  ? "bg-amber-900/30 border border-amber-800/50"
                  : "bg-blue-900/30 border border-blue-800/50"
              }`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Info className="h-5 w-5 text-amber-400" />
                </div>
                <div className="space-y-2">
                  <p className={caloriePercentage > 110 ? "text-amber-200" : "text-blue-200"}>
                    {caloriePercentage > 110
                      ? `Since our AI generated a meal plan that's ${caloriePercentage - 100}% above your target of ${plan.summary.calories} calories, you may want to reduce portion sizes slightly.`
                      : `Since our AI generated a meal plan that's ${100 - caloriePercentage}% below your target of ${plan.summary.calories} calories, you may want to increase portion sizes slightly.`}
                  </p>
                  <div className="text-gray-300 text-xs space-y-1">
                    <p className="font-medium">Adjustment tips:</p>
                    <ul className="list-disc list-inside space-y-0.5 pl-1">
                      {caloriePercentage > 110 ? (
                        <>
                          <li>Reduce oils and fats by 1/2 to 1 tbsp (-60 to -120 calories)</li>
                          <li>Decrease starchy carbs by 1/4 to 1/3 cup (-50 to -80 calories)</li>
                          <li>Use leaner protein cuts to save 30-50 calories per serving</li>
                        </>
                      ) : (
                        <>
                          <li>Add 1/2 to 1 tbsp of healthy oils (+60 to +120 calories)</li>
                          <li>Increase portion sizes of carbs by 1/4 cup (+50 to +80 calories)</li>
                          <li>Add 1/4 avocado (+80 calories) or 15g nuts (+90 calories)</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="meals" className="p-6">
          <TabsList className="mb-4 bg-gray-900/50">
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-6">
            {/* Main Meals */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Utensils className="h-5 w-5 text-emerald-400" />
                Main Meals
              </h3>

              {mainMeals.length === 0 ? (
                <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                  <p className="text-gray-400">No meals available for this day.</p>
                </div>
              ) : (
                mainMeals.map((meal, index) => (
                  <Card
                    key={index}
                    className="mb-6 bg-gradient-to-br from-gray-900/80 to-gray-850/80 overflow-hidden border border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <CardHeader className="pb-2 bg-gradient-to-r from-gray-900/90 to-gray-850/90 border-b border-gray-800/70">
                      <CardTitle className="text-lg text-white flex flex-wrap items-center gap-2">
                        <span className="bg-gradient-to-r from-emerald-700/30 to-emerald-600/20 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-md border border-emerald-700/30 shadow-sm">
                          Meal {index + 1}
                        </span>
                        <span className="font-medium">{meal.name}</span>
                        {meal.cookingTime && (
                          <span className="ml-auto flex items-center text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md">
                            <Clock className="h-3 w-3 mr-1" />
                            {meal.cookingTime}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap gap-2 items-center mt-1">
                        <span className="font-medium text-emerald-300">{meal.totals.calories} kcal</span>
                        <span className="text-gray-500">|</span>
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                          <span className="text-blue-200/80">P: {meal.totals.protein}g</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-green-200/80">C: {meal.totals.carbs}g</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                          <span className="text-yellow-200/80">F: {meal.totals.fat}g</span>
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                          <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden shadow-sm ring-1 ring-gray-800 sm:rounded-lg">
                              <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-gray-900/80">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-400 sm:pl-6"
                                    >
                                      Food
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                                      Amount
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-400">
                                      Protein
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-400">
                                      Carbs
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-400">
                                      Fat
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-400">
                                      Calories
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                  {meal.foods.map((food, foodIndex) => (
                                    <tr key={foodIndex} className="hover:bg-gray-800/30 transition-colors">
                                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                                        {food.name}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-300">
                                        {food.amount}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-3 text-sm text-right text-blue-200/80">
                                        {food.protein}g
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-3 text-sm text-right text-green-200/80">
                                        {food.carbs}g
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-3 text-sm text-right text-yellow-200/80">
                                        {food.fat}g
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-3 text-sm text-right text-emerald-200/80">
                                        {food.calories}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {meal.notes && (
                          <div className="mt-3 text-sm bg-gray-800/40 p-3 rounded-md border border-gray-700/30">
                            <p className="text-gray-300 font-medium flex items-center gap-1.5">
                              <Utensils className="h-3.5 w-3.5 text-emerald-400" />
                              Preparation Tips:
                            </p>
                            <p className="text-gray-300/90 mt-1.5 leading-relaxed">{meal.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Snacks Section */}
            {snacks.length > 0 && (
              <div className="space-y-5 mt-10 pt-8 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-amber-700/30 to-amber-600/20 p-1.5 rounded-md shadow-inner border border-amber-700/30">
                      <Apple className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Healthy Snacks</h3>
                      <p className="text-xs text-gray-400">Keep energized between meals</p>
                    </div>
                  </div>
                  <div className="bg-amber-900/20 px-2.5 py-1 rounded-full border border-amber-800/30">
                    <span className="text-sm font-medium text-amber-300">{snackTotals.calories} kcal total</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {snacks.map((snack, index) => (
                    <Card
                      key={index}
                      className="bg-gradient-to-br from-gray-900/70 to-gray-850/70 overflow-hidden border border-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <CardHeader className="pb-2 bg-gradient-to-r from-amber-900/10 to-amber-800/5 border-b border-gray-800/70">
                        <CardTitle className="text-md text-white flex items-center gap-2">
                          <span className="bg-gradient-to-r from-amber-700/30 to-amber-600/20 text-amber-400 text-xs font-medium px-2 py-0.5 rounded-md border border-amber-700/30 shadow-sm">
                            Snack {index + 1}
                          </span>
                          <span className="font-medium">{snack.name}</span>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-1.5 items-center mt-1">
                          <span className="font-medium text-amber-300">{snack.totals.calories} kcal</span>
                          <span className="text-gray-500">|</span>
                          <span className="text-blue-200/80">P: {snack.totals.protein}g</span>
                          <span className="text-green-200/80">C: {snack.totals.carbs}g</span>
                          <span className="text-yellow-200/80">F: {snack.totals.fat}g</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-3">
                        <div className="space-y-2">
                          <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <div className="inline-block min-w-full align-middle">
                              <div className="overflow-hidden shadow-sm ring-1 ring-gray-800 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-800">
                                  <thead className="bg-gray-900/80">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-400 sm:pl-6"
                                      >
                                        Food
                                      </th>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                                        Amount
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3 text-right text-xs font-medium text-gray-400"
                                      >
                                        Calories
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                    {snack.foods.map((food, foodIndex) => (
                                      <tr key={foodIndex} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                                          {food.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-300">
                                          {food.amount}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm text-right text-amber-200/80">
                                          {food.calories}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          {snack.notes && (
                            <div className="text-xs text-gray-300 mt-2 bg-gray-800/40 p-2 rounded-md border border-gray-700/30">
                              <span className="text-amber-400 font-medium">Tip:</span> {snack.notes}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nutrition">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-850/80 border border-gray-800/50 shadow-lg">
              <CardHeader className="border-b border-gray-800/50 bg-gradient-to-r from-gray-900/90 to-gray-850/90">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="bg-gradient-to-br from-emerald-700/30 to-emerald-600/20 p-1.5 rounded-md shadow-inner border border-emerald-700/30">
                        <Salad className="h-5 w-5 text-emerald-400" />
                      </div>
                      <span>Nutritional Analysis</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Day {currentDay} - {dayNames[currentDay - 1]}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 text-xs bg-gray-800/50 px-3 py-1.5 rounded-md border border-gray-700/30 self-start sm:self-auto">
                    <span className="text-gray-400">Target:</span>
                    <span className="text-white font-medium">{plan.summary.calories} calories</span>
                    <span className="text-gray-500">|</span>
                    <span
                      className={`font-medium ${caloriePercentage > 110 || caloriePercentage < 90 ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {caloriePercentage}% match
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-8">
                  {/* Calorie adjustment message if needed */}
                  {(caloriePercentage > 110 || caloriePercentage < 90) && (
                    <div
                      className={`p-4 rounded-lg text-sm ${
                        caloriePercentage > 110
                          ? "bg-amber-900/20 border border-amber-800/40"
                          : "bg-blue-900/20 border border-blue-800/40"
                      }`}
                    >
                      <p
                        className={`flex items-start gap-2 ${
                          caloriePercentage > 110 ? "text-amber-200" : "text-blue-200"
                        }`}
                      >
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {caloriePercentage > 110
                          ? `This day's meal plan provides ${dailyTotals.calories} calories, which is ${caloriePercentage - 100}% above your target of ${plan.summary.calories} calories. For a more precise match, consider reducing portion sizes of higher-calorie ingredients like oils, nuts, or starches while maintaining protein portions.`
                          : `This day's meal plan provides ${dailyTotals.calories} calories, which is ${100 - caloriePercentage}% below your target of ${plan.summary.calories} calories. To reach your calorie goal, consider increasing portion sizes or adding healthy fats (like olive oil, avocado, or nuts) to your meals.`}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 p-5 rounded-lg border border-gray-700/30 shadow-inner">
                      <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-amber-400" />
                        Total Calories
                      </h4>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-white">{dailyTotals.calories}</p>
                        <p className="text-sm text-gray-400 mb-1">calories</p>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-400">Target: {plan.summary.calories} calories</span>
                          <span
                            className={`font-medium ${caloriePercentage > 110 || caloriePercentage < 90 ? "text-amber-400" : "text-emerald-400"}`}
                          >
                            {caloriePercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              caloriePercentage > 110
                                ? "bg-gradient-to-r from-amber-600 to-amber-500"
                                : caloriePercentage < 90
                                  ? "bg-gradient-to-r from-blue-600 to-blue-500"
                                  : "bg-gradient-to-r from-emerald-600 to-emerald-500"
                            }`}
                            style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 p-5 rounded-lg border border-gray-700/30 shadow-inner">
                      <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-0.5"></div>
                        Total Protein
                      </h4>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-white">{dailyTotals.protein}</p>
                        <p className="text-sm text-gray-400 mb-1">grams</p>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-400">Target: {plan.macros.protein}g</span>
                          <span className="text-blue-400 font-medium">
                            {Math.round((dailyTotals.protein / plan.macros.protein) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full"
                            style={{
                              width: `${Math.min(Math.round((dailyTotals.protein / plan.macros.protein) * 100), 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 p-5 rounded-lg border border-gray-700/30 shadow-inner">
                      <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
                        <Utensils className="h-4 w-4 text-emerald-400" />
                        Meal Breakdown
                      </h4>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-white">{mainMeals.length + snacks.length}</p>
                        <p className="text-sm text-gray-400 mb-1">total</p>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-400">
                            {mainMeals.length} meals, {snacks.length} snacks
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                          <div className="flex h-full">
                            <div
                              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full"
                              style={{
                                width: `${Math.round((mainMeals.length / (mainMeals.length + snacks.length || 1)) * 100)}%`,
                              }}
                            ></div>
                            <div
                              className="bg-gradient-to-r from-amber-600 to-amber-400 h-full"
                              style={{
                                width: `${Math.round((snacks.length / (mainMeals.length + snacks.length || 1)) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs mt-1.5">
                          <span className="text-emerald-400 flex items-center">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
                            Main Meals
                          </span>
                          <span className="text-amber-400 flex items-center">
                            <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                            Snacks
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 p-5 rounded-lg border border-gray-700/30 shadow-inner">
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-1.5">
                        <Brain className="h-4 w-4 text-purple-400" />
                        Macronutrient Distribution
                      </h4>
                      <div className="space-y-4">
                        {plan.meals[`day${currentDay}`] && (
                          <>
                            <div>
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-gray-300 flex items-center">
                                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span>
                                  Protein
                                  <CustomTooltip content="4 calories per gram">
                                    <Info className="h-3 w-3 ml-1 text-gray-500 hover:text-gray-400 transition-colors" />
                                  </CustomTooltip>
                                </span>
                                <span className="text-blue-300 font-medium">
                                  {calculateMacroPercentage(dailyTotals.protein * 4, dailyTotals.calories)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full"
                                  style={{
                                    width: `${calculateMacroPercentage(dailyTotals.protein * 4, dailyTotals.calories)}%`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {dailyTotals.protein * 4} calories from protein
                              </p>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-gray-300 flex items-center">
                                  <span className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></span>
                                  Carbohydrates
                                  <CustomTooltip content="4 calories per gram">
                                    <Info className="h-3 w-3 ml-1 text-gray-500 hover:text-gray-400 transition-colors" />
                                  </CustomTooltip>
                                </span>
                                <span className="text-green-300 font-medium">
                                  {calculateMacroPercentage(dailyTotals.carbs * 4, dailyTotals.calories)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full"
                                  style={{
                                    width: `${calculateMacroPercentage(dailyTotals.carbs * 4, dailyTotals.calories)}%`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{dailyTotals.carbs * 4} calories from carbs</p>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-gray-300 flex items-center">
                                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></span>
                                  Fats
                                  <CustomTooltip content="9 calories per gram">
                                    <Info className="h-3 w-3 ml-1 text-gray-500 hover:text-gray-400 transition-colors" />
                                  </CustomTooltip>
                                </span>
                                <span className="text-yellow-300 font-medium">
                                  {calculateMacroPercentage(dailyTotals.fat * 9, dailyTotals.calories)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full"
                                  style={{
                                    width: `${calculateMacroPercentage(dailyTotals.fat * 9, dailyTotals.calories)}%`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{dailyTotals.fat * 9} calories from fat</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 p-5 rounded-lg border border-gray-700/30 shadow-inner">
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-1.5">
                        <Utensils className="h-4 w-4 text-emerald-400" />
                        Meal Distribution
                      </h4>
                      <div className="space-y-3.5">
                        {mainMeals.map((meal, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-gray-300 flex items-center">
                                <span
                                  className="w-2 h-2 rounded-full mr-1.5"
                                  style={{ backgroundColor: `hsl(${150 + index * 30}, 70%, 50%)` }}
                                ></span>
                                {meal.name}
                              </span>
                              <span className="text-gray-300">
                                <span className="font-medium text-emerald-300">{meal.totals.calories}</span> cal
                                <span className="text-gray-500 ml-1">
                                  ({Math.round((meal.totals.calories / (mainMealTotals.calories || 1)) * 100)}%)
                                </span>
                              </span>
                            </div>
                            <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.round((meal.totals.calories / (mainMealTotals.calories || 1)) * 100)}%`,
                                  background: `linear-gradient(to right, hsl(${150 + index * 30}, 70%, 40%), hsl(${150 + index * 30}, 70%, 50%))`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}

                        {snacks.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-gray-700/50">
                            <div className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1.5">
                              <Apple className="h-3.5 w-3.5" />
                              Snacks ({snackTotals.calories} calories total)
                            </div>
                            <div className="space-y-2">
                              {snacks.map((snack, index) => (
                                <div
                                  key={`snack-${index}`}
                                  className="flex justify-between text-xs p-1.5 bg-gray-800/50 rounded-md hover:bg-gray-800/70 transition-colors"
                                >
                                  <span className="text-gray-300">{snack.name}</span>
                                  <span className="text-amber-300 font-medium">{snack.totals.calories} cal</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

