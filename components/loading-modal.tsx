"use client"

import { useState, useEffect } from "react"
import { Dumbbell, Utensils, Sparkles, Zap } from "lucide-react"

interface LoadingModalProps {
  isOpen: boolean
  type?: "meal" | "workout"
}

export default function LoadingModal({ isOpen, type = "meal" }: LoadingModalProps) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [dots, setDots] = useState("")

  const mealSteps = [
    { text: "Analyzing nutrition goals", icon: "analyze" },
    { text: "Calculating macros", icon: "calculate" },
    { text: "Curating recipes", icon: "recipe" },
    { text: "Building 7-day plan", icon: "build" },
    { text: "Finalizing your plan", icon: "finalize" },
  ]

  const workoutSteps = [
    { text: "Analyzing fitness goals", icon: "analyze" },
    { text: "Selecting exercises", icon: "exercise" },
    { text: "Building routine", icon: "build" },
    { text: "Optimizing intensity", icon: "optimize" },
    { text: "Finalizing your plan", icon: "finalize" },
  ]

  const steps = type === "meal" ? mealSteps : workoutSteps
  const isMeal = type === "meal"
  const Icon = isMeal ? Utensils : Dumbbell

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setStepIndex(0)
      setDots("")
      return
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95
        const increment = Math.random() * 3 + 1
        return Math.min(prev + increment, 95)
      })
    }, 200)

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev >= steps.length - 1 ? steps.length - 1 : prev + 1))
    }, 2500)

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 400)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearInterval(dotsInterval)
    }
  }, [isOpen, steps.length])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" />
      
      {/* Ambient glow */}
      <div 
        className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${
          isMeal ? "bg-amber-500" : "bg-teal-500"
        }`}
        style={{ animation: "pulse 4s ease-in-out infinite" }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <div className={`relative overflow-hidden rounded-3xl border ${
          isMeal ? "border-amber-500/20" : "border-teal-500/20"
        } bg-gradient-to-b from-stone-900 to-stone-950 shadow-2xl`}>
          
          {/* Top gradient line */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${
            isMeal 
              ? "from-transparent via-amber-500 to-transparent" 
              : "from-transparent via-teal-500 to-transparent"
          }`} />

          <div className="p-8 sm:p-10">
            {/* Icon with animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Outer ring */}
                <div 
                  className={`absolute inset-0 rounded-full ${
                    isMeal ? "bg-amber-500/20" : "bg-teal-500/20"
                  }`}
                  style={{ 
                    animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                    transform: "scale(1.5)"
                  }}
                />
                {/* Inner glow */}
                <div className={`relative w-20 h-20 rounded-full ${
                  isMeal 
                    ? "bg-gradient-to-br from-amber-500/30 to-orange-600/30" 
                    : "bg-gradient-to-br from-teal-500/30 to-emerald-600/30"
                } flex items-center justify-center backdrop-blur-sm border ${
                  isMeal ? "border-amber-500/30" : "border-teal-500/30"
                }`}>
                  <Icon className={`w-9 h-9 ${isMeal ? "text-amber-400" : "text-teal-400"}`} 
                    style={{ animation: "bounce 2s ease-in-out infinite" }}
                  />
                </div>
                {/* Sparkle */}
                <Sparkles 
                  className={`absolute -top-1 -right-1 w-5 h-5 ${isMeal ? "text-amber-400" : "text-teal-400"}`}
                  style={{ animation: "sparkle 1.5s ease-in-out infinite" }}
                />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
                Creating Your {isMeal ? "Meal" : "Workout"} Plan
              </h3>
              <div className="flex items-center justify-center gap-2">
                <Zap className={`w-4 h-4 ${isMeal ? "text-amber-500" : "text-teal-500"}`} />
                <p className={`text-sm font-medium ${isMeal ? "text-amber-400/90" : "text-teal-400/90"}`}>
                  {steps[stepIndex].text}{dots}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative mb-6">
              <div className="h-2 bg-stone-800/80 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isMeal 
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" 
                      : "bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"
                  }`}
                  style={{ 
                    width: `${progress}%`,
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s linear infinite"
                  }}
                />
              </div>
              {/* Progress glow */}
              <div 
                className={`absolute top-0 h-2 rounded-full blur-sm opacity-50 ${
                  isMeal ? "bg-amber-500" : "bg-teal-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500 font-medium">Progress</span>
              <span className={`font-bold tabular-nums ${isMeal ? "text-amber-400" : "text-teal-400"}`}>
                {Math.round(progress)}%
              </span>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx <= stepIndex 
                      ? `w-6 ${isMeal ? "bg-amber-500" : "bg-teal-500"}` 
                      : "w-1.5 bg-stone-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${
            isMeal 
              ? "from-transparent via-amber-500/50 to-transparent" 
              : "from-transparent via-teal-500/50 to-transparent"
          }`} />
        </div>

        {/* Floating particles (optional decorative) */}
        <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${isMeal ? "bg-amber-500/40" : "bg-teal-500/40"}`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8) rotate(15deg);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
