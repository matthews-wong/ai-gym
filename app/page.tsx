"use client"

import type React from "react"
import type { EnhancedButtonProps } from "@/components/enhanced-button" // Declare EnhancedButtonProps import

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Dumbbell, Utensils, Zap, Trophy, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

// Simplified animation keyframes
const animationKeyframes = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scale-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`

// Update the BackgroundElements component to provide a more consistent background
const BackgroundElements = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Unified base gradient for the entire page */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/95 to-gray-950" />

      {/* Subtle radial gradients with consistent opacity */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_70%)]" />
      <div className="absolute top-0 right-0 w-full h-full opacity-25 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.05),transparent_60%)]" />
      <div className="absolute bottom-0 left-0 w-full h-full opacity-25 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.03),transparent_60%)]" />

      {/* Consistent grid lines */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Consistent particle effect */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
          animation: "pulse 12s ease-in-out infinite",
        }}
      />

      {/* Softer glowing orbs with consistent styling */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${400 + i * 50}px`,
            height: `${400 + i * 50}px`,
            left: `${(i * 20) % 100}%`,
            top: `${(i * 25) % 100}%`,
            opacity: 0.03,
            background: `radial-gradient(circle at center, ${
              ["rgba(16,185,129,0.3)", "rgba(6,182,212,0.3)", "rgba(59,130,246,0.3)", "rgba(124,58,237,0.2)"][i % 4]
            }, transparent)`,
            filter: `blur(${100 + i * 15}px)`,
            animation: `float ${12 + i}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

// Enhanced animation component
interface AnimationProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  className?: string
}

const Animation = ({
  children,
  delay = 0,
  duration = 800,
  direction = "up",
  distance = 8,
  className = "",
}: AnimationProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const getTransformValue = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return `translate-y-[${distance}px] opacity-0`
        case "down":
          return `translate-y-[-${distance}px] opacity-0`
        case "left":
          return `translate-x-[${distance}px] opacity-0`
        case "right":
          return `translate-x-[-${distance}px] opacity-0`
        default:
          return `translate-y-[${distance}px] opacity-0`
      }
    }
    return "translate-y-0 translate-x-0 opacity-100"
  }

  return (
    <div
      className={`transition-all ease-out ${getTransformValue()} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

// Update the EnhancedButton component to make CTAs more concise
const EnhancedButton = ({
  children,
  primary = false,
  href,
  className = "",
  size = "default",
  onClick,
}: EnhancedButtonProps) => {
  const sizeClasses = {
    default: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-5",
    xl: "text-lg py-3 px-6",
  }

  return (
    <Link href={href} className={`group relative w-full sm:w-auto ${className}`} onClick={onClick}>
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50 blur-sm transition-all duration-500 group-hover:opacity-80 group-hover:blur-md" />
      <Button
        className={`relative w-full font-semibold ${sizeClasses[size]} ${
          primary
            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0"
            : "bg-gray-900/80 hover:bg-gray-800 text-white border border-emerald-500/30 hover:border-emerald-400"
        } transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 overflow-hidden`}
      >
        <span className="relative z-10 flex items-center justify-center">{children}</span>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </Button>
    </Link>
  )
}

// Feature card component
interface FeatureCardProps {
  title: string
  description: string
  icon: React.ElementType
  delay?: number
  accentColor?: string
}

function FeatureCard({
  title,
  description,
  icon,
  delay = 0,
  accentColor = "from-emerald-500 to-cyan-500",
}: FeatureCardProps) {
  const Icon = icon
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Animation delay={delay}>
      <div
        className="relative group h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r ${accentColor} rounded-2xl opacity-0 group-hover:opacity-50 transition duration-500 blur-md`}
        />
        <div className="relative bg-gray-900/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 group-hover:border-emerald-500/30 transition-all duration-300 h-full flex flex-col">
          <div
            className={`h-16 w-16 rounded-xl bg-gradient-to-br ${accentColor.replace("500", "500/30").replace("to-blue-500", "to-cyan-500/30")} flex items-center justify-center mb-6 transition-all duration-500 group-hover:${accentColor.replace("500", "500/40").replace("to-blue-500", "to-cyan-500/40")}`}
            style={{
              boxShadow: isHovered ? "0 0 20px rgba(16, 185, 129, 0.2)" : "none",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          >
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            {title}
          </h3>
          <p className="text-gray-300 flex-grow">{description}</p>

          {/* Interactive indicator */}
          <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 group-hover:w-full" />
        </div>
      </div>
    </Animation>
  )
}

function HeroSection() {
  return (
    <section className="relative w-full pt-16 pb-24 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text content */}
          <div className="w-full lg:w-1/2 text-left">
            <Animation delay={100}>
              <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 cursor-pointer">
                <span className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Powered by Advanced AI
                </span>
              </div>
            </Animation>

            <Animation delay={200}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">
                  AI Gym<span className="text-white">BRO</span>
                </span>
              </h1>
            </Animation>

            <Animation delay={300}>
              <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
                Your personal AI trainer and nutritionist. Generate customized workout and meal plans tailored to your
                specific goals and preferences.
              </p>
            </Animation>

            <Animation delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <EnhancedButton
                  primary
                  href="/workout-plan"
                  size="lg"
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  Start Workout Plan{" "}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </EnhancedButton>
                <EnhancedButton
                  href="/meal-plan"
                  size="lg"
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  Start Meal Plan <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </EnhancedButton>
              </div>
            </Animation>
          </div>

          {/* Bento Grid UI instead of hero image */}
          {/* Two layered images with metrics and CTAs */}
          <div className="w-full lg:w-1/2">
            <Animation delay={500} direction="left">
              <div className="grid grid-cols-1 gap-6">
                {/* Workout Plan Image with Metrics Layer */}
                <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group h-[280px] md:h-[320px] lg:h-[240px] xl:h-[280px]">
                  <img
                    src="/images/workout.webp"
                    alt="Workout Plan"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Metrics Layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-gray-900/30">
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <h3 className="text-2xl font-bold text-cyan-400 mb-3">Custom Workout Plans</h3>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Weekly Sessions</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-5 h-5 rounded-md ${i <= 4 ? "bg-gradient-to-br from-emerald-500 to-cyan-500" : "bg-gray-700"} group-hover:scale-110 transition-transform duration-300 delay-${i * 100} shadow-md`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Intensity</span>
                          <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-cyan-500 group-hover:w-full transition-all duration-700 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      {/* CTA Button */}
                      <a
                        href="#workout-plan-explanation"
                        className="inline-flex items-center justify-center w-full rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 shadow-lg shadow-emerald-500/20"
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById("workout-plan-explanation")?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        Learn More{" "}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Meal Plan Image with Calorie Count Layer */}
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group h-[280px] md:h-[320px] lg:h-[240px] xl:h-[280px]">
                  <img
                    src="/images/meal-plan.webp"
                    alt="Meal Plan"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Calorie Count Layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-gray-900/30">
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <h3 className="text-2xl font-bold text-emerald-400 mb-3">Tailored Meal Plans</h3>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-white text-2xl font-bold mr-2">2,100</span>
                            <span className="text-gray-300 text-sm">calories/day</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                            <span className="text-gray-300 text-xs">Personalized for your goals</span>
                          </div>
                        </div>
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <defs>
                              <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="8" />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="url(#calorieGradient)"
                              strokeWidth="8"
                              strokeDasharray="283"
                              strokeDashoffset="70"
                              className="transition-all duration-1000 group-hover:stroke-dashoffset-[100]"
                            />
                          </svg>
                        </div>
                      </div>
                      {/* CTA Button */}
                      <a
                        href="#meal-plan-explanation"
                        className="inline-flex items-center justify-center w-full rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 shadow-lg shadow-emerald-500/20"
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById("meal-plan-explanation")?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        Learn More{" "}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Animation>
          </div>
        </div>
      </div>
    </section>
  )
}

// Update the WorkoutPlanSection CTA
function WorkoutPlanSection() {
  const dailyCalorieIntake = 1850
  const maxCalorieIntake = 2200

  return (
    <section className="relative w-full py-24 overflow-hidden">
      {/* Remove the background gradient div that was here */}

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Animation delay={100}>
            <div
              id="workout-plan-explanation"
              className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6 shadow-lg shadow-emerald-500/5"
            >
              <span className="flex items-center justify-center">
                <Dumbbell className="w-4 h-4 mr-2" />
                Personalized Training
              </span>
            </div>
          </Animation>

          <Animation delay={200}>
            <h2 id="workout-plan-section" className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Custom Workout Plans
              </span>
            </h2>
          </Animation>

          <Animation delay={300}>
            <p className="text-xl text-gray-200 mb-8 drop-shadow-md">
              Get a personalized workout routine designed specifically for your fitness level, available equipment, and
              goals.
            </p>
          </Animation>
        </div>

        {/* Animated Workout Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Weekly Schedule */}
          <div className="md:col-span-2 bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Weekly Schedule</h3>
            <div className="grid grid-cols-7 gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-gray-400 mb-2">{day}</div>
                  <div
                    className={`h-24 rounded-lg ${index < 5 ? "bg-gradient-to-b from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30" : "bg-gray-800/60 border border-gray-700/30"} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {index < 5 && (
                      <div className="text-xs text-emerald-400 font-medium px-2 py-1 rounded-md bg-emerald-900/50">
                        {["Upper", "Lower", "Push", "Pull", "Core"][index]}
                      </div>
                    )}
                    {index >= 5 && <div className="text-xs text-gray-500">Rest</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Stats */}
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Exercise Stats</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300 text-sm">Strength</span>
                  <span className="text-emerald-400 text-sm font-medium">65%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-gradient-to-r from-emerald-500 to-cyan-500 group-hover:w-[70%] transition-all duration-700"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300 text-sm">Cardio</span>
                  <span className="text-emerald-400 text-sm font-medium">40%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-[40%] bg-gradient-to-r from-emerald-500 to-cyan-500 group-hover:w-[45%] transition-all duration-700"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300 text-sm">Flexibility</span>
                  <span className="text-emerald-400 text-sm font-medium">25%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-[25%] bg-gradient-to-r from-emerald-500 to-cyan-500 group-hover:w-[30%] transition-all duration-700"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Needed */}
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Equipment</h3>
            <ul className="space-y-2">
              {["Dumbbells", "Resistance Bands", "Yoga Mat", "Pull-up Bar"].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center text-gray-300 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
                  style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                >
                  <div
                    className="w-3 h-3 rounded-full bg-emerald-500 mr-2 group-hover:scale-125 transition-transform duration-300"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  ></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Workout Progress */}
          <div className="md:col-span-2 bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Daily Calorie Tracker</h3>
            <div className="h-40 w-full relative">
              <div className="flex flex-col justify-center h-full">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-gray-300">Today's Calories</span>
                  <span
                    className={`font-medium ${dailyCalorieIntake > maxCalorieIntake ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {dailyCalorieIntake} / {maxCalorieIntake} cal
                  </span>
                </div>

                <div className="h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                  {/* Background bar - max calories */}
                  <div className="absolute inset-0 border border-gray-700 rounded-lg"></div>

                  {/* Calorie intake bar */}
                  <div
                    className={`h-full ${dailyCalorieIntake > maxCalorieIntake ? "bg-gradient-to-r from-yellow-500 to-red-500" : "bg-gradient-to-r from-emerald-500 to-cyan-500"} rounded-lg transition-all duration-1000`}
                    style={{ width: `${Math.min(100, (dailyCalorieIntake / maxCalorieIntake) * 100)}%` }}
                  ></div>

                  {/* Max line indicator */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white/50 right-0 transform -translate-x-0"></div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                    <div className="text-sm text-gray-400">Remaining</div>
                    <div className="text-lg font-bold text-white">
                      {Math.max(0, maxCalorieIntake - dailyCalorieIntake)} cal
                    </div>
                  </div>
                  <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                    <div className="text-sm text-gray-400">Burned</div>
                    <div className="text-lg font-bold text-emerald-400">320 cal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Workout Plan Explanation and CTA */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl border border-emerald-500/20 overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              {/* Left side with content */}
              <div className="w-full md:w-2/3 p-8 md:p-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  AI-Generated Workout Plans
                </h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Our AI analyzes your fitness level, goals, available equipment, and time constraints to create a
                  personalized workout routine that maximizes your results. The plan adapts as you progress, ensuring
                  continuous improvement.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EnhancedButton
                    primary
                    href="/workout-plan"
                    size="lg"
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    Generate Workout Plan{" "}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </EnhancedButton>
                </div>
              </div>

              {/* Right side with decorative element */}
              <div className="w-full md:w-1/3 p-6 md:p-0 flex justify-center">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 backdrop-blur-sm border border-emerald-500/40 flex items-center justify-center">
                    <Dumbbell className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <div
                    className="absolute -inset-8 rounded-full border-2 border-dashed border-emerald-500/10"
                    style={{ animation: "spin-slow 20s linear infinite" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Update the MealPlanSection to include explanation about AI meal plan generation and a dedicated CTA
function MealPlanSection() {
  return (
    <section className="relative w-full py-24 overflow-hidden">
      {/* Remove the background gradient div that was here */}

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Animation delay={100}>
            <div
              id="meal-plan-explanation"
              className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6 shadow-lg shadow-emerald-500/5"
            >
              <span className="flex items-center justify-center">
                <Utensils className="w-4 h-4 mr-2" />
                Nutrition Planning
              </span>
            </div>
          </Animation>

          <Animation delay={200}>
            <h2 id="meal-plan-section" className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Tailored Meal Plans
              </span>
            </h2>
          </Animation>

          <Animation delay={300}>
            <p className="text-xl text-gray-200 mb-8 drop-shadow-md">
              Receive customized meal plans that match your dietary preferences while supporting your health and fitness
              goals.
            </p>
          </Animation>
        </div>

        {/* Animated Nutrition Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Improved Macronutrient Distribution */}
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Macros</h3>
            <div className="relative h-52 w-full mx-auto flex items-center justify-center">
              {/* Simplified and cleaner pie chart */}
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="45" fill="#1f2937" />

                  {/* Protein slice - 40% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#0ea5e9"
                    strokeWidth="45"
                    strokeDasharray="282.6"
                    strokeDashoffset="169.56"
                    transform="rotate(-90 50 50)"
                  />

                  {/* Carbs slice - 35% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#06b6d4"
                    strokeWidth="45"
                    strokeDasharray="282.6"
                    strokeDashoffset="183.69"
                    transform="rotate(54 50 50)"
                  />

                  {/* Fats slice - 25% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#0891b2"
                    strokeWidth="45"
                    strokeDasharray="282.6"
                    strokeDashoffset="211.95"
                    transform="rotate(180 50 50)"
                  />

                  {/* Center circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="25"
                    fill="#0c4a6e"
                    className="group-hover:r-[28] transition-all duration-300"
                  />

                  {/* Center text */}
                  <text x="50" y="48" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    2,100
                  </text>
                  <text x="50" y="58" textAnchor="middle" fill="white" fontSize="6">
                    calories
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="ml-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#0ea5e9] mr-2"></div>
                  <span className="text-white text-sm">Protein 40%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#06b6d4] mr-2"></div>
                  <span className="text-white text-sm">Carbs 35%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#0891b2] mr-2"></div>
                  <span className="text-white text-sm">Fats 25%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Schedule */}
          <div className="md:col-span-2 bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Daily Meal Schedule</h3>
            <div className="space-y-4">
              {[
                { time: "7:00 AM", meal: "Breakfast", description: "Protein oats with berries", calories: 450 },
                { time: "10:30 AM", meal: "Snack", description: "Greek yogurt with nuts", calories: 250 },
                { time: "1:00 PM", meal: "Lunch", description: "Grilled chicken salad", calories: 550 },
                { time: "4:00 PM", meal: "Snack", description: "Protein shake with banana", calories: 300 },
                { time: "7:00 PM", meal: "Dinner", description: "Salmon with quinoa and vegetables", calories: 550 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-lg bg-gray-800/60 border border-gray-700/50 group-hover:border-cyan-500/20 transition-all duration-300 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
                  style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                >
                  <div className="w-16 text-gray-400 text-sm">{item.time}</div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{item.meal}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </div>
                  <div className="text-cyan-400 font-medium">{item.calories} cal</div>
                </div>
              ))}
            </div>
          </div>

          {/* Food Categories */}
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Food Categories</h3>
            <div className="space-y-3">
              {[
                { category: "Proteins", items: ["Chicken", "Fish", "Eggs", "Tofu"] },
                { category: "Carbs", items: ["Rice", "Sweet Potato", "Quinoa"] },
                { category: "Fats", items: ["Avocado", "Nuts", "Olive Oil"] },
                { category: "Vegetables", items: ["Broccoli", "Spinach", "Bell Peppers"] },
              ].map((category, index) => (
                <div
                  key={index}
                  className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
                  style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                >
                  <div className="text-cyan-400 font-medium mb-1">{category.category}</div>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full border border-gray-700 group-hover:border-cyan-500/30 group-hover:bg-gray-800/80 transition-all duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Water & Supplements */}
          <div className="md:col-span-2 bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Water & Supplements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Water Intake */}
              <div>
                <h4 className="text-white font-medium mb-3">Daily Water Intake</h4>
                <div className="flex items-end space-x-1 h-32 mb-2">
                  {[65, 80, 90, 75, 85, 95, 70].map((level, i) => (
                    <div key={i} className="flex-1 bg-gray-800 rounded-t-md relative group">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t-md transition-all duration-700 group-hover:h-[calc(var(--h)+5%)]"
                        style={{ height: `${level}%`, "--h": `${level}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Supplements */}
              <div>
                <h4 className="text-white font-medium mb-3">Recommended Supplements</h4>
                <ul className="space-y-2">
                  {[
                    { name: "Protein Powder", timing: "Post-workout" },
                    { name: "Creatine", timing: "Daily" },
                    { name: "Vitamin D", timing: "Morning" },
                    { name: "Omega-3", timing: "With meals" },
                  ].map((supp, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 rounded-lg bg-gray-800/60 border border-gray-700/50 group-hover:border-cyan-500/20 transition-all duration-300 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
                      style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                    >
                      <span className="text-gray-300">{supp.name}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-cyan-900/50 text-cyan-400 border border-cyan-500/30">
                        {supp.timing}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AI Meal Plan Explanation and CTA */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl border border-cyan-500/20 overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              {/* Left side with content */}
              <div className="w-full md:w-2/3 p-8 md:p-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  AI-Generated Meal Plans
                </h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Our AI nutritionist creates personalized meal plans based on your dietary preferences, caloric needs,
                  and health goals. Each plan includes balanced macronutrients, meal timing, and even shopping lists to
                  make healthy eating simple.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EnhancedButton
                    primary
                    href="/meal-plan"
                    size="lg"
                    className="transform hover:scale-105 transition-transform duration-300 from-emerald-500 to-cyan-500"
                  >
                    Generate Meal Plan{" "}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </EnhancedButton>
                </div>
              </div>

              {/* Right side with decorative element */}
              <div className="w-full md:w-1/3 p-6 md:p-0 flex justify-center">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 backdrop-blur-sm border border-cyan-500/40 flex items-center justify-center">
                    <Utensils className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <div
                    className="absolute -inset-8 rounded-full border-2 border-dashed border-cyan-500/10"
                    style={{ animation: "spin-slow 20s linear infinite" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Platform Benefits Section
function PlatformBenefitsSection() {
  return (
    <section className="relative w-full py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Animation delay={100}>
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4 shadow-lg shadow-emerald-500/5">
              <span className="flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2 text-pink-400 animate-pulse" />
                Fitness & Nutrition
              </span>
            </div>
          </Animation>

          <Animation delay={200}>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Why You Should Use This Platform
            </h2>
          </Animation>

          <Animation delay={300}>
            <p className="text-xl text-gray-200">
              A balanced approach to nutrition and exercise is the cornerstone of a healthy lifestyle
            </p>
          </Animation>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Personalized Workouts"
            description="Custom exercise plans that adapt to your fitness level, equipment, and time constraints."
            icon={Dumbbell}
            delay={400}
            accentColor="from-emerald-500 to-cyan-500"
          />
          <FeatureCard
            title="Tailored Nutrition"
            description="Meal plans that match your dietary preferences while supporting your health and fitness goals."
            icon={Utensils}
            delay={500}
            accentColor="from-emerald-500 to-cyan-500"
          />
          <FeatureCard
            title="Consistent Progress"
            description="Structured approach that ensures steady improvement and helps maintain motivation."
            icon={Zap}
            delay={600}
            accentColor="from-emerald-500 to-cyan-500"
          />
          <FeatureCard
            title="Achievable Goals"
            description="Realistic targets that build confidence and create sustainable long-term habits."
            icon={Trophy}
            delay={700}
            accentColor="from-emerald-500 to-cyan-500"
          />
        </div>

        <Animation delay={800}>
          <div className="mt-16 p-6 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-emerald-500/20 shadow-lg shadow-emerald-900/10 hover:shadow-emerald-500/20 transition-all duration-300 transform hover:scale-[1.02] max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse"></div>
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/20">
                    3x
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg text-gray-200">
                  Research shows that individuals with structured fitness and nutrition plans are{" "}
                  <span className="text-emerald-400 font-medium">3x more likely</span> to achieve their health goals and
                  maintain results long-term.
                </p>
              </div>
            </div>
          </div>
        </Animation>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="w-full z-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo and description */}
            <Animation delay={100}>
              <div>
                <h2 className="text-3xl font-bold mb-4 transform hover:scale-105 transition-transform duration-300 inline-block">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">
                    AI Gym<span className="text-white">BRO</span>
                  </span>
                </h2>
                <p className="text-gray-400 mb-6 max-w-md">
                  Your personal AI trainer and nutritionist. Generate customized workout and meal plans tailored to your
                  specific goals and preferences.
                </p>
              </div>
            </Animation>

            {/* Generate Plans */}
            <Animation delay={200}>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-white mb-4">Generate Plans</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/workout-plan"
                      className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center group p-2 hover:bg-gray-800/50 rounded-lg"
                    >
                      <Dumbbell className="h-4 w-4 mr-2 text-emerald-500 group-hover:scale-110 transition-transform" />
                      Generate Workout Plan
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/meal-plan"
                      className="text-gray-400 hover:text-cyan-500 transition-colors flex items-center group p-2 hover:bg-gray-800/50 rounded-lg"
                    >
                      <Utensils className="h-4 w-4 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" />
                      Generate Meal Plan
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                </ul>
              </div>
            </Animation>
          </div>
        </div>

        {/* Bottom bar */}
        <Animation delay={300}>
          <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AI GymBRO. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500 text-sm">
                Built by{" "}
                <a
                  href="https://www.matthewswong.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors relative group"
                >
                  Matthews Wong
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              </p>
            </div>
          </div>
        </Animation>
      </div>
    </footer>
  )
}

// Update the main component to ensure the background is properly applied
export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Add the animation keyframes to the document
    if (typeof document !== "undefined") {
      const style = document.createElement("style")
      style.textContent = animationKeyframes
      document.head.appendChild(style)

      setIsMounted(true)

      return () => {
        if (style && document.head.contains(style)) {
          document.head.removeChild(style)
        }
      }
    } else {
      setIsMounted(true)
    }
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      <BackgroundElements />

      <main className="flex-grow w-full">
        {/* Main Hero Section */}
        <HeroSection />
    

        {/* Workout Plan Hero Section */}
        {isMounted && <WorkoutPlanSection />}

        {/* Meal Plan Hero Section */}
        {isMounted && <MealPlanSection />}

        {/* Platform Benefits Section */}
        {isMounted && <PlatformBenefitsSection />}
      </main>

      {/* Footer */}
      {isMounted && <Footer />}
    </div>
  )
}
