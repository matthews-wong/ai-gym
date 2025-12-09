"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, AlertTriangle, Calculator, ArrowRight, ArrowLeft, RotateCcw, Sparkles } from "lucide-react"
import type { MealPlan } from "@/lib/services/ai"
import MealPlanDisplay from "./meal-plan-display"
import LoadingModal from "./loading-modal"
import CalorieCalculatorModal from "./calorie-calculator-modal"
import { useStreamingFetch } from "@/lib/hooks/useStreamingFetch"
import { usePrefetch, usePredictiveParams } from "@/lib/hooks/usePrefetch"

type Step = 1 | 2 | 3

export default function MealPlanForm() {
  const [step, setStep] = useState<Step>(1)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [apiStatus, setApiStatus] = useState<{ available: boolean } | null>(null)
  const [showCalorieCalculator, setShowCalorieCalculator] = useState(false)

  const {
    isLoading,
    isStreaming,
    error: apiError,
    canResume,
    fetchStream,
    resume,
    reset,
    clearIncomplete,
  } = useStreamingFetch<MealPlan>({
    type: "meal",
    onComplete: (plan) => setMealPlan(plan as MealPlan),
  })

  const { prefetch } = usePrefetch({
    type: "meal",
    url: "/api/meal/generate",
    debounceMs: 1500,
  })

  const { getPredictions } = usePredictiveParams("meal")

  const [formData, setFormData] = useState({
    nutritionGoal: "",
    dietType: "",
    dailyCalories: 2000,
    mealsPerDay: 3,
    dietaryRestrictions: "none",
    cuisinePreference: "any",
    allergies: "",
    includeSnacks: false,
  })

  useEffect(() => {
    fetch("/api/env")
      .then((res) => res.json())
      .then((data) => setApiStatus({ available: data.hasGroqKey }))
      .catch(() => setApiStatus({ available: false }))
  }, [])

  // Predictive prefetching when user reaches step 2
  useEffect(() => {
    if (step === 2 && formData.nutritionGoal && formData.dietType) {
      const predictions = getPredictions(formData)
      predictions.forEach((params, index) => {
        prefetch(params, 2 - index)
      })
    }
  }, [step, formData.nutritionGoal, formData.dietType, getPredictions, prefetch, formData])

  const updateField = useCallback((field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const canProceed = () => {
    if (step === 1) return formData.nutritionGoal && formData.dietType
    if (step === 2) return formData.dailyCalories >= 1200
    return true
  }

  const handleSubmit = async () => {
    if (!apiStatus?.available) {
      return
    }

    try {
      await fetchStream("/api/meal/generate", {
        ...formData,
        mealComplexity: "moderate",
        budgetLevel: "medium",
        cookingTime: "moderate",
        seasonalPreference: "any",
        healthConditions: "none",
        proteinPreference: "balanced",
        mealPrepOption: "daily",
        includeDesserts: false,
        snackFrequency: "twice",
        snackType: "balanced",
      })
    } catch {
      // Error handled by hook
    }
  }

  const handleResume = async () => {
    try {
      await resume("/api/meal/generate")
    } catch {
      // Error handled by hook
    }
  }

  const handleBack = () => {
    setMealPlan(null)
    reset()
  }

  if (mealPlan) {
    return <MealPlanDisplay plan={mealPlan} onBack={handleBack} />
  }

  return (
    <>
      <LoadingModal isOpen={isLoading || isStreaming} type="meal" />
      
      <CalorieCalculatorModal
        isOpen={showCalorieCalculator}
        onClose={() => setShowCalorieCalculator(false)}
        onCalculated={(cal) => {
          updateField("dailyCalories", cal)
          setShowCalorieCalculator(false)
        }}
      />

      {/* Resume banner */}
      {canResume && !isLoading && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <p className="text-sm text-amber-300">You have an incomplete generation. Resume where you left off?</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearIncomplete}
              className="px-3 py-1.5 text-xs text-stone-400 hover:text-white transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={handleResume}
              className="px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors"
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {apiError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-300">{apiError}</p>
            <button
              onClick={handleSubmit}
              className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s <= step ? "bg-amber-500 text-white" : "bg-stone-800 text-stone-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${s < step ? "bg-amber-500" : "bg-stone-800"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Goals */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">What&apos;s your goal?</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "fatLoss", label: "Lose Weight" },
                { id: "muscleGain", label: "Build Muscle" },
                { id: "maintenance", label: "Maintain" },
                { id: "healthyEating", label: "Eat Healthier" },
              ].map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => updateField("nutritionGoal", goal.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    formData.nutritionGoal === goal.id
                      ? "bg-amber-500/20 border-amber-500/50 border-2"
                      : "bg-stone-800/50 border-stone-700/50 border hover:border-stone-600"
                  }`}
                >
                  <span className={`font-medium ${formData.nutritionGoal === goal.id ? "text-amber-300" : "text-stone-300"}`}>
                    {goal.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Diet type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: "balanced", label: "Balanced" },
                { id: "highProtein", label: "High Protein" },
                { id: "lowCarb", label: "Low Carb" },
                { id: "vegetarian", label: "Vegetarian" },
                { id: "vegan", label: "Vegan" },
                { id: "keto", label: "Keto" },
              ].map((diet) => (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => updateField("dietType", diet.id)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    formData.dietType === diet.id
                      ? "bg-amber-500/20 border-amber-500/50 border-2"
                      : "bg-stone-800/50 border-stone-700/50 border hover:border-stone-600"
                  }`}
                >
                  <span className={`text-sm font-medium ${formData.dietType === diet.id ? "text-amber-300" : "text-stone-300"}`}>
                    {diet.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Calories & Meals */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-stone-300">Daily calories</label>
              <button
                type="button"
                onClick={() => setShowCalorieCalculator(true)}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300"
              >
                <Calculator className="w-3.5 h-3.5" />
                Calculate
              </button>
            </div>
            <input
              type="number"
              value={formData.dailyCalories}
              onChange={(e) => updateField("dailyCalories", Number(e.target.value))}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-stone-300">Meals per day</label>
              <span className="text-lg font-bold text-white">{formData.mealsPerDay}</span>
            </div>
            <input
              type="range"
              min={2}
              max={6}
              value={formData.mealsPerDay}
              onChange={(e) => updateField("mealsPerDay", Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-stone-600 mt-1">
              <span>2</span>
              <span>6</span>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.includeSnacks}
              onChange={(e) => updateField("includeSnacks", e.target.checked)}
              className="w-5 h-5 rounded bg-stone-800 border-stone-700 text-amber-500"
            />
            <span className="text-stone-300">Include snacks between meals</span>
          </label>
        </div>
      )}

      {/* Step 3: Preferences */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Dietary restrictions</label>
            <select
              value={formData.dietaryRestrictions}
              onChange={(e) => updateField("dietaryRestrictions", e.target.value)}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
            >
              <option value="none" className="bg-stone-900">None</option>
              <option value="glutenFree" className="bg-stone-900">Gluten Free</option>
              <option value="dairyFree" className="bg-stone-900">Dairy Free</option>
              <option value="nutFree" className="bg-stone-900">Nut Free</option>
              <option value="halal" className="bg-stone-900">Halal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Cuisine preference</label>
            <select
              value={formData.cuisinePreference}
              onChange={(e) => updateField("cuisinePreference", e.target.value)}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
            >
              <option value="any" className="bg-stone-900">Any cuisine</option>
              <option value="indonesian" className="bg-stone-900">Indonesian</option>
              <option value="asian" className="bg-stone-900">Asian</option>
              <option value="mediterranean" className="bg-stone-900">Mediterranean</option>
              <option value="american" className="bg-stone-900">American</option>
              <option value="mexican" className="bg-stone-900">Mexican</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Allergies (optional)</label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => updateField("allergies", e.target.value)}
              placeholder="e.g., peanuts, shellfish"
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-10">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((step - 1) as Step)}
            className="flex-1 py-4 text-sm font-medium text-stone-300 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/50 hover:border-stone-600 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((step + 1) as Step)}
            disabled={!canProceed()}
            className="flex-1 py-4 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-stone-800 disabled:to-stone-800 disabled:text-stone-500 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !apiStatus?.available}
            className="flex-1 py-4 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-stone-800 disabled:to-stone-800 disabled:text-stone-500 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Plan
              </>
            )}
          </button>
        )}
      </div>
    </>
  )
}
