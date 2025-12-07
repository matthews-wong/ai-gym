"use client"

import { useState, useEffect } from "react"
import { Dumbbell, Utensils, Sparkles } from "lucide-react"

interface LoadingModalProps {
  isOpen: boolean
  type?: "meal" | "workout"
}

export default function LoadingModal({ isOpen, type = "meal" }: LoadingModalProps) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  const mealSteps = [
    "Analyzing your nutrition goals...",
    "Calculating optimal macros...",
    "Selecting recipes...",
    "Building your 7-day plan...",
    "Finalizing meal plan...",
  ]

  const workoutSteps = [
    "Analyzing your fitness goals...",
    "Selecting exercises...",
    "Building your routine...",
    "Optimizing sets and reps...",
    "Finalizing workout plan...",
  ]

  const steps = type === "meal" ? mealSteps : workoutSteps
  const accentColor = type === "meal" ? "amber" : "teal"
  const Icon = type === "meal" ? Utensils : Dumbbell

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setStepIndex(0)
      return
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95
        return prev + 2
      })
    }, 150)

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) return steps.length - 1
        return prev + 1
      })
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [isOpen, steps.length])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 p-8 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`relative w-16 h-16 rounded-2xl bg-${accentColor}-500/20 flex items-center justify-center`}>
            <div className={`absolute inset-0 rounded-2xl bg-${accentColor}-500/20 animate-ping`} />
            <Icon className={`w-8 h-8 text-${accentColor}-400 relative z-10`} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Generating Your Plan
          </h3>
          <p className={`text-sm text-${accentColor}-400 h-5`}>
            {steps[stepIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full bg-gradient-to-r from-${accentColor}-500 to-${accentColor === "amber" ? "orange" : "emerald"}-500 transition-all duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <p className="text-center text-sm text-stone-500">
          {progress}% complete
        </p>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx <= stepIndex ? `bg-${accentColor}-500` : "bg-stone-700"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}
