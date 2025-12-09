"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, Flame, Clock, Download, Loader2, Youtube } from "lucide-react"
import type { MealPlan } from "@/lib/types/plans"
import { generatePDF } from "@/lib/pdf-service"
import { savePlanToDatabase } from "@/lib/services/planService"

interface MealPlanDisplayProps {
  plan: MealPlan
  onBack: () => void
}

export default function MealPlanDisplay({ plan, onBack }: MealPlanDisplayProps) {
  const [currentDay, setCurrentDay] = useState(1)
  const [expandedMeal, setExpandedMeal] = useState<number | null>(0)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const totalDays = 7

  useEffect(() => {
    const saveToDb = async () => {
      await savePlanToDatabase({
        planType: "meal",
        planData: plan as unknown as Record<string, unknown>,
      })
    }
    saveToDb()
  }, [plan])

  const handlePrevDay = () => setCurrentDay((prev) => (prev === 1 ? totalDays : prev - 1))
  const handleNextDay = () => setCurrentDay((prev) => (prev === totalDays ? 1 : prev + 1))

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDF(plan, "meal")
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const currentDayMeals = plan.meals?.[`day${currentDay}`] || []
  const dailyTotals = currentDayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.totals?.calories || 0),
      protein: acc.protein + (meal.totals?.protein || 0),
      carbs: acc.carbs + (meal.totals?.carbs || 0),
      fat: acc.fat + (meal.totals?.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </button>
        </div>

        {/* Plan Header */}
        <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Your Meal Plan
          </h1>
          <p className="text-stone-400 text-sm mb-4">{plan.overview || "7-day personalized nutrition plan"}</p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-stone-300">{plan.summary?.calories || 2000} cal/day</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-stone-300">{plan.summary?.mealsPerDay || 3} meals/day</span>
            </div>
          </div>
        </div>

        {/* Day Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevDay}
            className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-stone-300" />
          </button>
          
          <div className="text-center">
            <p className="text-sm text-stone-500">Day {currentDay}</p>
            <p className="text-lg font-semibold text-white">{dayNames[currentDay - 1]}</p>
          </div>
          
          <button
            onClick={handleNextDay}
            className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
        </div>

        {/* Daily Macros */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Calories", value: dailyTotals.calories, unit: "", color: "amber" },
            { label: "Protein", value: dailyTotals.protein, unit: "g", color: "teal" },
            { label: "Carbs", value: dailyTotals.carbs, unit: "g", color: "blue" },
            { label: "Fat", value: dailyTotals.fat, unit: "g", color: "rose" },
          ].map((macro) => (
            <div key={macro.label} className="bg-stone-900/80 border border-stone-800/50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white">
                {Math.round(macro.value)}{macro.unit}
              </p>
              <p className="text-xs text-stone-500">{macro.label}</p>
            </div>
          ))}
        </div>

        {/* Meals */}
        <div className="space-y-3">
          {currentDayMeals.length === 0 ? (
            <div className="bg-stone-900/80 border border-stone-800/50 rounded-xl p-8 text-center">
              <p className="text-stone-400">No meals found for this day</p>
            </div>
          ) : (
            currentDayMeals.map((meal, idx) => (
              <div
                key={idx}
                className="bg-stone-900/80 border border-stone-800/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedMeal(expandedMeal === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-stone-800/30 transition-colors text-left"
                >
                  <div>
                    <h3 className="font-semibold text-white">{meal.name || `Meal ${idx + 1}`}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-amber-400">{meal.totals?.calories || 0} cal</span>
                      {meal.cookingTime && (
                        <span className="text-sm text-stone-500">{meal.cookingTime}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-stone-500 transition-transform ${expandedMeal === idx ? "rotate-90" : ""}`} />
                </button>

                {expandedMeal === idx && (
                  <div className="px-4 pb-4 border-t border-stone-800/50">
                    {meal.foods && meal.foods.length > 0 ? (
                      <div className="space-y-2 pt-4">
                        {meal.foods.map((food, foodIdx) => (
                          <div
                            key={foodIdx}
                            className="flex items-center justify-between py-2 border-b border-stone-800/30 last:border-0"
                          >
                            <div>
                              <p className="text-stone-200">{food.name}</p>
                              <p className="text-xs text-stone-600">{food.amount}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-stone-400">{food.calories} cal</p>
                              <p className="text-xs text-stone-600">
                                P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-stone-500 text-sm pt-4">No food details available</p>
                    )}
                    
                    {meal.notes && (
                      <p className="text-sm text-stone-500 mt-3 pt-3 border-t border-stone-800/30 italic">
                        {meal.notes}
                      </p>
                    )}

                    <a
                      href={`https://youtube.com/results?search_query=How+to+cook+${encodeURIComponent(meal.name || "meal")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      Watch on YouTube
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Day Selector */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              onClick={() => setCurrentDay(day)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                currentDay === day
                  ? "bg-amber-500 text-white"
                  : "bg-stone-800 text-stone-400 hover:bg-stone-700"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
