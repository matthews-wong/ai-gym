"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Brain, Book, Salad, ChefHat, Heart } from "lucide-react"

interface LoadingModalProps {
  isOpen: boolean
  formData: any
}

// Custom Progress component to avoid dependencies
const Progress = ({ value = 0, className = "", indicatorClassName = "" }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-700/50 ${className}`}>
    <div
      className={`h-full w-full flex-1 transition-transform duration-700 ease-out ${indicatorClassName}`}
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
      }}
    />
  </div>
)

export default function LoadingModal({ isOpen, formData }: LoadingModalProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setProgress(0)
      setCurrentStep(0)
      setIsComplete(false)
    } else {
      // Add exit animation
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Simplified progress handling - moves every 5 seconds
  useEffect(() => {
    if (!isOpen || !isVisible) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      return
    }

    // Start the timer for progress updates every 5 seconds
    timerRef.current = setInterval(() => {
      setProgress(prevProgress => {
        // If already at 100%, maintain at 100%
        if (prevProgress >= 100) {
          setIsComplete(true)
          return 100
        }
        
        // Calculate new progress value - approximately 20% each time
        // This ensures we reach 100% after 5 steps (5 * 20 = 100)
        const newProgress = Math.min(prevProgress + 20, 100)
        
        // Update step based on the new progress value
        const stepThresholds = [15, 32, 49, 66, 83]
        for (let i = stepThresholds.length - 1; i >= 0; i--) {
          if (newProgress >= stepThresholds[i] && currentStep !== i + 1) {
            setCurrentStep(i + 1)
            break
          }
        }
        
        return newProgress
      })
    }, 3000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isOpen, isVisible, currentStep])

  // Get personalized messages based on form data
  const getNutritionGoalText = () => {
    const goalMap: Record<string, string> = {
      muscleGain: "muscle gain",
      fatLoss: "fat loss",
      maintenance: "maintenance",
      performance: "performance",
      healthyEating: "healthy eating",
    }
    return goalMap[formData?.nutritionGoal] || "healthy eating"
  }

  const getDietTypeText = () => {
    const dietMap: Record<string, string> = {
      balanced: "balanced",
      highProtein: "high protein",
      lowCarb: "low carb",
      keto: "keto",
      mediterranean: "mediterranean",
      paleo: "paleo",
    }
    return dietMap[formData?.dietType] || "balanced"
  }

  const getCuisineText = () => {
    const cuisineMap: Record<string, string> = {
      any: "global cuisines",
      indonesian: "Indonesian cuisine",
      asian: "Asian cuisine",
      mediterranean: "Mediterranean cuisine",
      western: "Western cuisine",
      mexican: "Mexican cuisine",
      indian: "Indian cuisine",
    }
    return cuisineMap[formData?.cuisinePreference] || "global cuisines"
  }

  // Steps content with dynamic background colors
  const steps = [
    {
      icon: <Sparkles className="h-10 w-10 text-emerald-400" />,
      title: "Initializing your personalized meal plan",
      description: `We're creating a ${getNutritionGoalText()} focused plan just for you!`,
      gradient: "from-emerald-900/30 to-emerald-700/20",
      color: "emerald",
    },
    {
      icon: <Brain className="h-10 w-10 text-blue-400" />,
      title: "Analyzing nutritional requirements",
      description: `Calculating optimal macros for your ${getDietTypeText()} diet with ${formData?.dailyCalories || 2000} calories.`,
      gradient: "from-blue-900/30 to-blue-700/20",
      color: "blue",
    },
    {
      icon: <Book className="h-10 w-10 text-amber-400" />,
      title: "Researching recipe options",
      description: `Exploring ${getCuisineText()} for delicious and nutritious meal ideas.`,
      gradient: "from-amber-900/30 to-amber-700/20",
      color: "amber",
    },
    {
      icon: <ChefHat className="h-10 w-10 text-purple-400" />,
      title: "Crafting balanced meals",
      description: `Creating ${formData?.mealsPerDay || 3} perfectly portioned meals per day with ${formData?.includeSnacks ? "healthy snacks" : "optimal nutrition"}.`,
      gradient: "from-purple-900/30 to-purple-700/20",
      color: "purple",
    },
    {
      icon: <Salad className="h-10 w-10 text-green-400" />,
      title: "Finalizing your weekly plan",
      description: "Ensuring variety and balance across your 7-day meal schedule.",
      gradient: "from-green-900/30 to-green-700/20",
      color: "green",
    },
    {
      icon: <Heart className="h-10 w-10 text-red-400" />,
      title: isComplete ? "Please wait" : "Almost ready!",
      description: isComplete ? "Your personalized meal plan is being prepared. Please wait..." : "Putting the finishing touches on your personalized meal plan.",
      gradient: "from-red-900/30 to-red-700/20",
      color: "red",
    },
  ]

  // Get current step's progress bar color
  const getProgressBarColor = () => {
    const colorMap: Record<string, string> = {
      emerald: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      blue: "bg-gradient-to-r from-blue-500 to-blue-600",
      amber: "bg-gradient-to-r from-amber-500 to-amber-600",
      purple: "bg-gradient-to-r from-purple-500 to-purple-600",
      green: "bg-gradient-to-r from-green-500 to-green-600",
      red: "bg-gradient-to-r from-red-500 to-red-600",
    }
    return colorMap[steps[currentStep]?.color || "emerald"]
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        transition: "opacity 500ms ease",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div
        ref={modalRef}
        className={`bg-gradient-to-br ${steps[currentStep].gradient} border border-gray-700/50 rounded-xl max-w-md w-full text-white p-4 sm:p-6 backdrop-blur-md`}
        style={{
          transition: "all 500ms ease",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative">
              <div
                style={{
                  position: "absolute",
                  inset: "-4px",
                  borderRadius: "9999px",
                  background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                  opacity: 0.7,
                  filter: "blur(8px)",
                  animation: "pulse 3s infinite ease-in-out",
                }}
              ></div>
              <div
                style={{
                  position: "relative",
                  animation: "float 6s infinite ease-in-out",
                }}
              >
                {steps[currentStep].icon}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">{steps[currentStep].title}</h3>
            <p className="text-gray-200/90">{steps[currentStep].description}</p>
          </div>

          <div className="space-y-2">
            <Progress value={progress} indicatorClassName={getProgressBarColor()} />
            <p className="text-sm text-gray-300 text-center">
              {isComplete ? "Loading... Please wait" : `${Math.round(progress)}% complete`}
            </p>
          </div>

          <div className="flex justify-center space-x-3 sm:space-x-6 pt-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{
                  transition: "opacity 700ms ease",
                  opacity: currentStep >= index ? 1 : 0.3,
                }}
              >
                <div
                  className={`relative rounded-full p-1.5 ${currentStep >= index ? "bg-gray-800/50 backdrop-blur-sm" : "bg-gray-900/30"}`}
                  style={{
                    transition: "background 700ms ease",
                  }}
                >
                  {React.cloneElement(step.icon, {
                    className: `h-4 w-4 sm:h-5 sm:w-5 ${
                      currentStep >= index
                        ? step.icon.props.className
                            .split(" ")
                            .filter((c) => c.includes("text-"))
                            .join(" ")
                        : "text-gray-500"
                    }`,
                    style: {
                      transition: "color 700ms ease",
                    },
                  })}
                  {currentStep === index && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "9999px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        animation: "ripple 2s infinite ease-out",
                      }}
                    ></div>
                  )}
                </div>
                <span className="text-xs mt-1 hidden sm:inline">
                  {index === 0 ? "Start" : index === steps.length - 1 ? "Finish" : `Step ${index}`}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-300/80 italic">
            <p>
              {isComplete 
                ? "Your meal plan is almost ready. Just a moment longer..."
                : "Creating your perfect meal plan takes a moment. Please don't close this window."}
            </p>
            <div className="flex justify-center mt-3 space-x-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    display: "inline-block",
                    animation: "fadeInOut 1.5s infinite ease-in-out",
                    animationDelay: `${i * 0.5}s`,
                  }}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.2; }
  }
  
  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.2); opacity: 0; }
  }
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 0.8; transform: scale(1); }
  }
`}</style>
    </div>
  )
}