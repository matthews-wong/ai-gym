"use client"

import { useState, useEffect } from "react"
import { Calculator, X, Info, ArrowRight, Zap } from "lucide-react"

interface CalorieCalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  onCalculated: (calories: number) => void
}

export default function CalorieCalculatorModal({ isOpen, onClose, onCalculated }: CalorieCalculatorModalProps) {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [age, setAge] = useState<number>(30)
  const [weight, setWeight] = useState<number>(70)
  const [height, setHeight] = useState<number>(170)
  const [activityLevel, setActivityLevel] = useState<string>("moderate")
  const [goal, setGoal] = useState<string>("maintain")
  const [calculatedBMR, setCalculatedBMR] = useState<number>(0)
  const [calculatedTDEE, setCalculatedTDEE] = useState<number>(0)
  const [calculatedCalories, setCalculatedCalories] = useState<number>(0)
  const [showResults, setShowResults] = useState<boolean>(false)

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  }

  const goalAdjustments = {
    lose: -500,
    maintain: 0,
    gain: 500,
  }

  const activityLabels = {
    sedentary: "Sedentary (desk job)",
    light: "Light (1-3 days/week)",
    moderate: "Moderate (3-5 days/week)",
    active: "Active (6-7 days/week)",
    veryActive: "Very Active (athlete)",
  }

  useEffect(() => {
    if (isOpen) setShowResults(false)
  }, [isOpen])

  const calculateBMR = () => {
    if (gender === "male") {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
    }
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
  }

  const calculateTDEE = (bmr: number) => {
    const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers]
    return Math.round(bmr * multiplier)
  }

  const calculateCalorieTarget = (tdee: number) => {
    const adjustment = goalAdjustments[goal as keyof typeof goalAdjustments]
    return Math.round(tdee + adjustment)
  }

  const handleCalculate = () => {
    const bmr = calculateBMR()
    const tdee = calculateTDEE(bmr)
    const calorieTarget = calculateCalorieTarget(tdee)
    setCalculatedBMR(bmr)
    setCalculatedTDEE(tdee)
    setCalculatedCalories(calorieTarget)
    setShowResults(true)
  }

  const handleApply = () => {
    onCalculated(calculatedCalories)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Calorie Calculator</h2>
              <p className="text-xs text-stone-500">Mifflin-St Jeor Formula</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {!showResults ? (
            <div className="space-y-4">
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["male", "female"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                        gender === g
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300 border"
                          : "bg-stone-800/50 border-stone-700/50 text-stone-400 border hover:border-stone-600"
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age & Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                >
                  {Object.entries(activityLabels).map(([key, label]) => (
                    <option key={key} value={key} className="bg-stone-900">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "lose", label: "Lose", desc: "-500 cal" },
                    { id: "maintain", label: "Maintain", desc: "0 cal" },
                    { id: "gain", label: "Gain", desc: "+500 cal" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`py-2 rounded-xl text-center transition-all ${
                        goal === g.id
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300 border"
                          : "bg-stone-800/50 border-stone-700/50 text-stone-400 border hover:border-stone-600"
                      }`}
                    >
                      <span className="text-sm font-medium block">{g.label}</span>
                      <span className="text-xs text-stone-500">{g.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
              >
                <Zap className="w-4 h-4" />
                Calculate Calories
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results */}
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="text-center mb-4">
                  <p className="text-stone-400 text-sm">Your Daily Target</p>
                  <p className="text-4xl font-bold text-white mt-1">{calculatedCalories}</p>
                  <p className="text-amber-400 text-sm">calories/day</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-stone-900/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-stone-500">BMR</p>
                    <p className="text-lg font-semibold text-white">{calculatedBMR}</p>
                  </div>
                  <div className="bg-stone-900/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-stone-500">TDEE</p>
                    <p className="text-lg font-semibold text-white">{calculatedTDEE}</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 p-3 bg-stone-800/30 rounded-lg">
                <Info className="w-4 h-4 text-stone-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-stone-400">
                  BMR is your base metabolism. TDEE includes activity. Your target is adjusted for your goal.
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowResults(false)}
                  className="py-3 text-sm font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
                >
                  Recalculate
                </button>
                <button
                  onClick={handleApply}
                  className="py-3 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                >
                  Apply
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
