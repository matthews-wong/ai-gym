"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, X, Info, ArrowRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
  const [bodyFat, setBodyFat] = useState<number>(20)
  const [activityLevel, setActivityLevel] = useState<string>("moderate")
  const [goal, setGoal] = useState<string>("maintain")
  const [calculationMethod, setCalculationMethod] = useState<string>("mifflin")
  const [calculatedBMR, setCalculatedBMR] = useState<number>(0)
  const [calculatedTDEE, setCalculatedTDEE] = useState<number>(0)
  const [calculatedCalories, setCalculatedCalories] = useState<number>(0)
  const [showResults, setShowResults] = useState<boolean>(false)

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  }

  // Goal adjustments
  const goalAdjustments = {
    lose: -500,
    maintain: 0,
    gain: 500,
  }

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setShowResults(false)
    }
  }, [isOpen])

  // Calculate BMR based on selected method
  const calculateBMR = () => {
    let bmr = 0

    switch (calculationMethod) {
      case "mifflin":
        // Mifflin-St Jeor Equation
        if (gender === "male") {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161
        }
        break
      case "harris":
        // Revised Harris-Benedict Equation
        if (gender === "male") {
          bmr = 13.397 * weight + 4.799 * height - 5.677 * age + 88.362
        } else {
          bmr = 9.247 * weight + 3.098 * height - 4.33 * age + 447.593
        }
        break
      case "katch":
        // Katch-McArdle Formula (requires body fat percentage)
        const leanMass = weight * (1 - bodyFat / 100)
        bmr = 370 + 21.6 * leanMass
        break
    }

    return Math.round(bmr)
  }

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = (bmr: number) => {
    const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers]
    return Math.round(bmr * multiplier)
  }

  // Calculate final calorie target based on goal
  const calculateCalorieTarget = (tdee: number) => {
    const adjustment = goalAdjustments[goal as keyof typeof goalAdjustments]
    return Math.round(tdee + adjustment)
  }

  // Handle calculation
  const handleCalculate = () => {
    const bmr = calculateBMR()
    const tdee = calculateTDEE(bmr)
    const calorieTarget = calculateCalorieTarget(tdee)

    setCalculatedBMR(bmr)
    setCalculatedTDEE(tdee)
    setCalculatedCalories(calorieTarget)
    setShowResults(true)
  }

  // Apply calculated calories to the main form
  const handleApply = () => {
    onCalculated(calculatedCalories)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-2xl w-full text-white p-4 sm:p-6 shadow-xl border border-gray-700/50 overflow-y-auto max-h-[95vh]"
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-400" />
            Daily Calorie Calculator
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {!showResults ? (
            <>
              <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                <p className="text-gray-300 text-sm">
                  This calculator estimates your daily calorie needs based on your body metrics and activity level.
                  Choose a calculation method below and enter your details to get started.
                </p>
              </div>

              <Tabs defaultValue="mifflin" onValueChange={setCalculationMethod} className="w-full">
                <TabsList className="w-full flex flex-wrap mb-4 bg-gray-800/70">
                  <TabsTrigger value="mifflin" className="flex-1 text-xs sm:text-sm">
                    Mifflin-St Jeor
                  </TabsTrigger>
                  <TabsTrigger value="harris" className="flex-1 text-xs sm:text-sm">
                    Harris-Benedict
                  </TabsTrigger>
                  <TabsTrigger value="katch" className="flex-1 text-xs sm:text-sm">
                    Katch-McArdle
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mifflin" className="bg-gray-800/30 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-300">
                      The Mifflin-St Jeor Equation is considered the most accurate for most people. It calculates your
                      Basal Metabolic Rate (BMR) based on gender, weight, height, and age.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="harris" className="bg-gray-800/30 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-300">
                      The Revised Harris-Benedict Equation is a classic formula updated in 1984. It tends to estimate
                      slightly higher calorie needs than the Mifflin-St Jeor equation.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="katch" className="bg-gray-800/30 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-300">
                      The Katch-McArdle Formula is most accurate for lean individuals who know their body fat
                      percentage. It accounts for lean body mass rather than total weight.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gender" className="text-white mb-2 block">
                      Gender
                    </Label>
                    <RadioGroup
                      defaultValue="male"
                      onValueChange={(value) => setGender(value as "male" | "female")}
                      className="flex gap-4"
                    >
                      <RadioGroupItem value="male">
                        <span className="text-gray-300">Male</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="female">
                        <span className="text-gray-300">Female</span>
                      </RadioGroupItem>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="age" className="text-white mb-2 block">
                      Age (years)
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="15"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(Number.parseInt(e.target.value) || 0)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight" className="text-white mb-2 block">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      min="30"
                      max="300"
                      value={weight}
                      onChange={(e) => setWeight(Number.parseInt(e.target.value) || 0)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="height" className="text-white mb-2 block">
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      min="100"
                      max="250"
                      value={height}
                      onChange={(e) => setHeight(Number.parseInt(e.target.value) || 0)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  {calculationMethod === "katch" && (
                    <div>
                      <Label htmlFor="bodyFat" className="text-white mb-2 block">
                        Body Fat (%)
                      </Label>
                      <Input
                        id="bodyFat"
                        type="number"
                        min="3"
                        max="60"
                        value={bodyFat}
                        onChange={(e) => setBodyFat(Number.parseInt(e.target.value) || 0)}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="activityLevel" className="text-white mb-2 block">
                      Activity Level
                    </Label>
                    <Select defaultValue="moderate" onValueChange={setActivityLevel}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="light">Lightly Active (1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderately Active (3-5 days/week)</SelectItem>
                        <SelectItem value="active">Very Active (6-7 days/week)</SelectItem>
                        <SelectItem value="veryActive">Extra Active (physical job/twice daily)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="goal" className="text-white mb-2 block">
                      Goal
                    </Label>
                    <Select defaultValue="maintain" onValueChange={setGoal}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="lose">Lose Weight (-500 calories)</SelectItem>
                        <SelectItem value="maintain">Maintain Weight</SelectItem>
                        <SelectItem value="gain">Gain Weight (+500 calories)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 mt-4 py-4 sm:py-5 text-base sm:text-lg font-medium shadow-lg border border-emerald-600/30 rounded-lg transition-all duration-300"
              >
                <Calculator className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Calculate Calories
              </Button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-900/30 border border-emerald-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-emerald-300 mb-2">Your Results</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 text-center">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm">Basal Metabolic Rate</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{calculatedBMR}</p>
                    <p className="text-xs text-gray-400">calories/day</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm">Total Daily Energy</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{calculatedTDEE}</p>
                    <p className="text-xs text-gray-400">calories/day</p>
                  </div>
                  <div className="bg-emerald-900/30 p-3 rounded-lg border border-emerald-800/50">
                    <p className="text-emerald-400 text-xs sm:text-sm">Recommended Intake</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{calculatedCalories}</p>
                    <p className="text-xs text-gray-400">calories/day</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3">How We Calculated This</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
                  <p>
                    <span className="text-emerald-400 font-medium">Step 1:</span> We calculated your Basal Metabolic
                    Rate (BMR) using the{" "}
                    {calculationMethod === "mifflin"
                      ? "Mifflin-St Jeor"
                      : calculationMethod === "harris"
                        ? "Revised Harris-Benedict"
                        : "Katch-McArdle"}{" "}
                    equation.
                  </p>
                  <div className="bg-gray-800/50 p-2 sm:p-3 rounded text-xs font-mono overflow-x-auto whitespace-nowrap">
                    {calculationMethod === "mifflin" &&
                      (gender === "male"
                        ? `BMR = 10 × ${weight}kg + 6.25 × ${height}cm - 5 × ${age}years + 5 = ${calculatedBMR} calories/day`
                        : `BMR = 10 × ${weight}kg + 6.25 × ${height}cm - 5 × ${age}years - 161 = ${calculatedBMR} calories/day`)}
                    {calculationMethod === "harris" &&
                      (gender === "male"
                        ? `BMR = 13.397 × ${weight}kg + 4.799 × ${height}cm - 5.677 × ${age}years + 88.362 = ${calculatedBMR} calories/day`
                        : `BMR = 9.247 × ${weight}kg + 3.098 × ${height}cm - 4.330 × ${age}years + 447.593 = ${calculatedBMR} calories/day`)}
                    {calculationMethod === "katch" &&
                      `BMR = 370 + 21.6 × (1 - ${bodyFat}/100) × ${weight}kg = ${calculatedBMR} calories/day`}
                  </div>

                  <p>
                    <span className="text-emerald-400 font-medium">Step 2:</span> We multiplied your BMR by an activity
                    factor based on your activity level.
                  </p>
                  <div className="bg-gray-800/50 p-3 rounded text-xs font-mono">
                    TDEE = {calculatedBMR} × {activityMultipliers[activityLevel as keyof typeof activityMultipliers]} ={" "}
                    {calculatedTDEE} calories/day
                  </div>

                  <p>
                    <span className="text-emerald-400 font-medium">Step 3:</span> We adjusted your TDEE based on your
                    goal.
                  </p>
                  <div className="bg-gray-800/50 p-3 rounded text-xs font-mono">
                    Target Calories = {calculatedTDEE}{" "}
                    {goalAdjustments[goal as keyof typeof goalAdjustments] >= 0 ? "+" : ""}{" "}
                    {goalAdjustments[goal as keyof typeof goalAdjustments]} = {calculatedCalories} calories/day
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={() => setShowResults(false)}
                  variant="outline"
                  className="flex-1 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 py-2 sm:py-3"
                >
                  Recalculate
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 font-medium shadow-lg border border-emerald-600/30 rounded-lg transition-all duration-300 py-2 sm:py-3"
                >
                  Use This Value
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-400 overflow-x-auto">
            <p className="mb-2 font-medium">About the Calculation Methods:</p>
            <p className="mb-1">
              <span className="text-emerald-400">Mifflin-St Jeor Equation:</span> For men: BMR = 10W + 6.25H - 5A + 5,
              For women: BMR = 10W + 6.25H - 5A - 161
            </p>
            <p className="mb-1">
              <span className="text-emerald-400">Revised Harris-Benedict Equation:</span> For men: BMR = 13.397W +
              4.799H - 5.677A + 88.362, For women: BMR = 9.247W + 3.098H - 4.330A + 447.593
            </p>
            <p className="mb-1">
              <span className="text-emerald-400">Katch-McArdle Formula:</span> BMR = 370 + 21.6(1 - F)W
            </p>
            <p className="mt-2">
              Where W is weight in kg, H is height in cm, A is age, and F is body fat percentage as a decimal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

