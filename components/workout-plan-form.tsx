"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertTriangle, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { generateWorkoutPlan } from "@/lib/ai-service"
import WorkoutPlanDisplay from "./workout-plan-display"
import LoadingModal from "./loading-modal"

type Step = 1 | 2 | 3

const focusOptions = [
  { id: "fullBody", label: "Full Body" },
  { id: "upperBody", label: "Upper Body" },
  { id: "lowerBody", label: "Lower Body" },
  { id: "core", label: "Core" },
  { id: "arms", label: "Arms" },
  { id: "back", label: "Back" },
  { id: "chest", label: "Chest" },
  { id: "legs", label: "Legs" },
]

export default function WorkoutPlanForm() {
  const [step, setStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [workoutPlan, setWorkoutPlan] = useState<unknown | null>(null)
  const [hasGroqKey, setHasGroqKey] = useState<boolean | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fitnessGoal: "",
    experienceLevel: "",
    daysPerWeek: 3,
    sessionLength: 60,
    focusAreas: ["fullBody"] as string[],
    equipment: "",
  })

  useEffect(() => {
    fetch("/api/env")
      .then((res) => res.json())
      .then((data) => setHasGroqKey(data.hasGroqKey))
      .catch(() => setHasGroqKey(false))
  }, [])

  const updateField = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleFocus = (id: string) => {
    const current = formData.focusAreas
    if (current.includes(id)) {
      if (current.length > 1) {
        updateField("focusAreas", current.filter((f) => f !== id))
      }
    } else {
      updateField("focusAreas", [...current, id])
    }
  }

  const canProceed = () => {
    if (step === 1) return formData.fitnessGoal && formData.experienceLevel
    if (step === 2) return formData.focusAreas.length > 0
    return formData.equipment
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setApiError(null)

    try {
      const plan = await generateWorkoutPlan(formData)
      setWorkoutPlan(plan)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate workout plan"
      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (workoutPlan) {
    return <WorkoutPlanDisplay plan={workoutPlan as Parameters<typeof WorkoutPlanDisplay>[0]["plan"]} onBack={() => setWorkoutPlan(null)} />
  }

  return (
    <>
      <LoadingModal isOpen={isLoading} type="workout" />

      {apiError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{apiError}</p>
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
                s <= step ? "bg-teal-500 text-white" : "bg-stone-800 text-stone-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${s < step ? "bg-teal-500" : "bg-stone-800"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Goal & Level */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">What&apos;s your goal?</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "muscleGain", label: "Build Muscle" },
                { id: "fatLoss", label: "Lose Fat" },
                { id: "strength", label: "Get Stronger" },
                { id: "endurance", label: "Improve Endurance" },
              ].map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => updateField("fitnessGoal", goal.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    formData.fitnessGoal === goal.id
                      ? "bg-teal-500/20 border-teal-500/50 border-2"
                      : "bg-stone-800/50 border-stone-700/50 border hover:border-stone-600"
                  }`}
                >
                  <span className={`font-medium ${formData.fitnessGoal === goal.id ? "text-teal-300" : "text-stone-300"}`}>
                    {goal.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Experience level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "beginner", label: "Beginner" },
                { id: "intermediate", label: "Intermediate" },
                { id: "advanced", label: "Advanced" },
              ].map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => updateField("experienceLevel", level.id)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    formData.experienceLevel === level.id
                      ? "bg-teal-500/20 border-teal-500/50 border-2"
                      : "bg-stone-800/50 border-stone-700/50 border hover:border-stone-600"
                  }`}
                >
                  <span className={`text-sm font-medium ${formData.experienceLevel === level.id ? "text-teal-300" : "text-stone-300"}`}>
                    {level.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Focus & Schedule */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Target muscles</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {focusOptions.map((focus) => {
                const isSelected = formData.focusAreas.includes(focus.id)
                return (
                  <button
                    key={focus.id}
                    type="button"
                    onClick={() => toggleFocus(focus.id)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-500/50 text-teal-300 border"
                        : "bg-stone-800/50 border-stone-700/50 text-stone-400 border hover:border-stone-600"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {focus.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-stone-300">Days per week</label>
              <span className="text-lg font-bold text-white">{formData.daysPerWeek}</span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              value={formData.daysPerWeek}
              onChange={(e) => updateField("daysPerWeek", Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-full appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-stone-300">Session length</label>
              <span className="text-lg font-bold text-white">{formData.sessionLength} <span className="text-sm font-normal text-stone-500">min</span></span>
            </div>
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={formData.sessionLength}
              onChange={(e) => updateField("sessionLength", Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-full appearance-none cursor-pointer accent-teal-500"
            />
          </div>
        </div>
      )}

      {/* Step 3: Equipment */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Available equipment</label>
            <div className="space-y-3">
              {[
                { id: "fullGym", label: "Full Gym", desc: "Commercial gym with all equipment" },
                { id: "homeBasic", label: "Home Gym", desc: "Dumbbells, bands, bench" },
                { id: "bodyweight", label: "No Equipment", desc: "Bodyweight exercises only" },
              ].map((eq) => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => updateField("equipment", eq.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    formData.equipment === eq.id
                      ? "bg-teal-500/20 border-teal-500/50 border-2"
                      : "bg-stone-800/50 border-stone-700/50 border hover:border-stone-600"
                  }`}
                >
                  <span className={`font-medium block ${formData.equipment === eq.id ? "text-teal-300" : "text-stone-300"}`}>
                    {eq.label}
                  </span>
                  <span className="text-sm text-stone-500">{eq.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((step - 1) as Step)}
            className="flex-1 py-3.5 text-sm font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors flex items-center justify-center gap-2"
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
            className="flex-1 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:from-stone-700 disabled:to-stone-700 disabled:text-stone-500 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !canProceed()}
            className="flex-1 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:from-stone-700 disabled:to-stone-700 disabled:text-stone-500 rounded-xl shadow-lg shadow-teal-500/25 disabled:shadow-none transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Workout Plan"
            )}
          </button>
        )}
      </div>
    </>
  )
}
