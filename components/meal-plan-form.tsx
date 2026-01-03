"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Loader2, AlertTriangle, ArrowRight, ArrowLeft, Check, RotateCcw, Sparkles, LogIn, Calculator, ChevronDown, ChevronUp } from "lucide-react"
import MealPlanDisplay from "./meal-plan-display"
import LoadingModal from "./loading-modal"
import CalorieCalculatorModal from "./calorie-calculator-modal"
import { useStreamingFetch } from "@/lib/hooks/useStreamingFetch"
import { supabase } from "@/lib/supabase"

type Step = 1 | 2 | 3

export default function MealPlanForm() {
  const [step, setStep] = useState<Step>(1)
  const [mealPlan, setMealPlan] = useState<unknown | null>(null)
  const [hasGroqKey, setHasGroqKey] = useState<boolean | null>(null)
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [showCalorieCalculator, setShowCalorieCalculator] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const getAuthToken = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.access_token || null
    } catch {
      return null
    }
  }, [])

  const {
    isLoading,
    isStreaming,
    error: apiError,
    canResume,
    fetchStream,
    resume,
    reset,
    clearIncomplete,
  } = useStreamingFetch<unknown>({
    type: "meal",
    onComplete: (plan) => setMealPlan(plan),
    onError: (_, needsAuth) => setRequiresAuth(needsAuth || false),
    getAuthToken,
  })

  const [formData, setFormData] = useState({
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
  })

  useEffect(() => {
    fetch("/api/env")
      .then((res) => res.json())
      .then((data) => setHasGroqKey(data.hasGroqKey))
      .catch(() => setHasGroqKey(false))
  }, [])

  const updateField = useCallback((field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const canProceed = () => {
    if (step === 1) return formData.nutritionGoal && formData.dietType
    if (step === 2) return formData.dailyCalories >= 1200 && formData.dailyCalories <= 5000
    return true
  }

  const handleSubmit = async () => {
    try {
      await fetchStream("/api/meal/generate", formData)
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

  const handleCaloriesCalculated = (calories: number) => {
    updateField("dailyCalories", calories)
  }

  if (mealPlan) {
    return (
      <MealPlanDisplay
        plan={mealPlan as Parameters<typeof MealPlanDisplay>[0]["plan"]}
        onBack={handleBack}
      />
    )
  }

  return (
    <>
      <LoadingModal isOpen={isLoading || isStreaming} type="meal" />

      {/* Calorie Calculator Modal */}
      <CalorieCalculatorModal
        isOpen={showCalorieCalculator}
        onClose={() => setShowCalorieCalculator(false)}
        onCalculated={handleCaloriesCalculated}
      />

      {/* Resume banner */}
      {canResume && !isLoading && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-emerald-300">You have an incomplete generation. Resume where you left off?</p>
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
              className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors"
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {apiError && (
        <div className={`mb-6 p-4 ${requiresAuth ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20"} border rounded-xl flex items-start gap-3`}>
          {requiresAuth ? (
            <LogIn className="w-5 h-5 text-amber-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-sm ${requiresAuth ? "text-amber-300" : "text-red-300"}`}>{apiError}</p>
            {requiresAuth ? (
              <Link
                href="/auth/login"
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign in to continue
              </Link>
            ) : (
              <button
                onClick={handleSubmit}
                className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {hasGroqKey === false && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300">API key missing. Some features may not work.</p>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s <= step ? "bg-emerald-500 text-white" : "bg-stone-800 text-stone-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${s < step ? "bg-emerald-500" : "bg-stone-800"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Goal & Diet Type */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">What&apos;s your nutrition goal?</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "muscleGain", label: "Build Muscle" },
                { id: "fatLoss", label: "Lose Fat" },
                { id: "maintenance", label: "Maintain Weight" },
                { id: "performance", label: "Performance" },
                { id: "healthyEating", label: "Healthy Eating" },
              ].map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => updateField("nutritionGoal", goal.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    formData.nutritionGoal === goal.id
                      ? "bg-emerald-500/20 border-emerald-500/50 border-2"
                      : "bg-stone-800/50 border-stone-700/50 border hover:border-stone-600"
                  }`}
                >
                  <span className={`font-medium ${formData.nutritionGoal === goal.id ? "text-emerald-300" : "text-stone-300"}`}>
                    {goal.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Diet type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "balanced", label: "Balanced" },
                { id: "highProtein", label: "High Protein" },
                { id: "lowCarb", label: "Low Carb" },
                { id: "keto", label: "Keto" },
                { id: "mediterranean", label: "Mediterranean" },
                { id: "paleo", label: "Paleo" },
              ].map((diet) => (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => updateField("dietType", diet.id)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    formData.dietType === diet.id
                      ? "bg-emerald-500/20 border-emerald-500/50 border-2"
                      : "bg-stone-800/50 border-stone-700/50 border hover:border-stone-600"
                  }`}
                >
                  <span className={`text-sm font-medium ${formData.dietType === diet.id ? "text-emerald-300" : "text-stone-300"}`}>
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
              <label className="text-sm font-medium text-stone-300">Daily Calories</label>
              <span className="text-lg font-bold text-white">{formData.dailyCalories} <span className="text-sm font-normal text-stone-500">kcal</span></span>
            </div>
            <input
              type="range"
              min={1200}
              max={5000}
              step={50}
              value={formData.dailyCalories}
              onChange={(e) => updateField("dailyCalories", Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowCalorieCalculator(true)}
              className="mt-3 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculate my calories
            </button>
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
              className="w-full h-2 bg-stone-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Dietary restrictions</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "none", label: "None" },
                { id: "vegetarian", label: "Vegetarian" },
                { id: "vegan", label: "Vegan" },
                { id: "glutenFree", label: "Gluten Free" },
                { id: "dairyFree", label: "Dairy Free" },
                { id: "pescatarian", label: "Pescatarian" },
              ].map((restriction) => (
                <button
                  key={restriction.id}
                  type="button"
                  onClick={() => updateField("dietaryRestrictions", restriction.id)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                    formData.dietaryRestrictions === restriction.id
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 border"
                      : "bg-stone-800/50 border-stone-700/50 text-stone-400 border hover:border-stone-600"
                  }`}
                >
                  {formData.dietaryRestrictions === restriction.id && <Check className="w-3.5 h-3.5" />}
                  {restriction.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includeSnacks}
                onChange={(e) => updateField("includeSnacks", e.target.checked)}
                className="w-4 h-4 rounded border-stone-600 bg-stone-800 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-sm text-stone-300">Include snacks</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includeDesserts}
                onChange={(e) => updateField("includeDesserts", e.target.checked)}
                className="w-4 h-4 rounded border-stone-600 bg-stone-800 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-sm text-stone-300">Include desserts</span>
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Preferences */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Cuisine preference</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "any", label: "Any" },
                { id: "indonesian", label: "Indonesian" },
                { id: "asian", label: "Asian" },
                { id: "mediterranean", label: "Mediterranean" },
                { id: "western", label: "Western" },
                { id: "mexican", label: "Mexican" },
                { id: "indian", label: "Indian" },
              ].map((cuisine) => (
                <button
                  key={cuisine.id}
                  type="button"
                  onClick={() => updateField("cuisinePreference", cuisine.id)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    formData.cuisinePreference === cuisine.id
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 border"
                      : "bg-stone-800/50 border-stone-700/50 text-stone-400 border hover:border-stone-600"
                  }`}
                >
                  {cuisine.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Cooking time</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "minimal", label: "Quick (15 min)" },
                { id: "moderate", label: "Moderate (30 min)" },
                { id: "extended", label: "Extended (45+ min)" },
              ].map((time) => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => updateField("cookingTime", time.id)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    formData.cookingTime === time.id
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 border"
                      : "bg-stone-800/50 border-stone-700/50 text-stone-400 border hover:border-stone-600"
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div 
            className="flex items-center justify-between cursor-pointer p-3 bg-stone-800/30 rounded-xl"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span className="text-sm font-medium text-stone-300">Advanced Options</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
          </div>

          {showAdvanced && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Allergies</label>
                <select
                  value={formData.allergies}
                  onChange={(e) => updateField("allergies", e.target.value)}
                  className="w-full p-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-300"
                >
                  <option value="none">None</option>
                  <option value="nuts">Nuts</option>
                  <option value="shellfish">Shellfish</option>
                  <option value="eggs">Eggs</option>
                  <option value="soy">Soy</option>
                  <option value="wheat">Wheat</option>
                  <option value="dairy">Dairy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Budget Level</label>
                <select
                  value={formData.budgetLevel}
                  onChange={(e) => updateField("budgetLevel", e.target.value)}
                  className="w-full p-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-300"
                >
                  <option value="low">Budget-Friendly</option>
                  <option value="medium">Moderate</option>
                  <option value="high">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Protein Preference</label>
                <select
                  value={formData.proteinPreference}
                  onChange={(e) => updateField("proteinPreference", e.target.value)}
                  className="w-full p-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-300"
                >
                  <option value="balanced">Balanced (All Sources)</option>
                  <option value="poultry">Poultry-Focused</option>
                  <option value="seafood">Seafood-Focused</option>
                  <option value="redMeat">Red Meat-Focused</option>
                  <option value="plantBased">Plant-Based</option>
                </select>
              </div>
            </div>
          )}
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
            className="flex-1 py-4 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:from-stone-800 disabled:to-stone-800 disabled:text-stone-500 disabled:border-stone-700 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !canProceed()}
            className="flex-1 py-4 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:from-stone-800 disabled:to-stone-800 disabled:text-stone-500 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Meal Plan
              </>
            )}
          </button>
        )}
      </div>
    </>
  )
}
