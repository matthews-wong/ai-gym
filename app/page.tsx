"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, type ReactNode } from "react"
import { ArrowRight, Dumbbell, Utensils, Zap, Trophy, Heart, ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Simplified animation keyframes
const animationKeyframes = `
@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

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

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

@keyframes scale-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
`

// Enhanced background elements with more dynamic visuals
const StaticElements = () => {
  return (
    <>
      {/* Dynamic glowing orbs with subtle animation */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${300 + i * 50}px`,
            height: `${300 + i * 50}px`,
            left: `${(i * 15) % 100}%`,
            top: `${(i * 20) % 100}%`,
            opacity: 0.15,
            background: `radial-gradient(circle at center, ${
              ["rgba(16,185,129,0.4)", "rgba(6,182,212,0.4)", "rgba(59,130,246,0.4)", "rgba(124,58,237,0.3)"][i % 4]
            }, transparent)`,
            filter: `blur(${80 + i * 10}px)`,
            animation: `float ${8 + i}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Enhanced grid lines with subtle glow effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Enhanced particle effect with subtle pulse */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />
    </>
  )
}

// Enhanced background component with more dynamic elements
const EnhancedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
      <div className="absolute inset-0 bg-black bg-[radial-gradient(circle_at_center,rgba(0,220,130,0.15),transparent_80%)]" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,200,255,0.10),transparent_70%)]" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(100,0,255,0.05),transparent_70%)]" />
      <div className="absolute inset-0 overflow-hidden">
        <StaticElements />
      </div>
    </div>
  )
}

// Enhanced animation component with more options and smoother transitions
interface EnhancedAnimationProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  className?: string
}

const EnhancedAnimation = ({
  children,
  delay = 0,
  duration = 800,
  direction = "up",
  distance = 8,
  className = "",
}: EnhancedAnimationProps) => {
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

// Enhanced button component with more visual effects and animations
interface EnhancedButtonProps {
  children: ReactNode
  primary?: boolean
  href: string
  className?: string
  size?: "default" | "lg" | "xl"
  onClick?: () => void
}

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
    lg: "text-base py-2.5 px-6",
    xl: "text-lg py-3 px-8",
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <Link href={href} className={`group relative w-full sm:w-auto ${className}`} onClick={handleClick}>
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

// Enhanced feature card with more interactive elements and animations
interface EnhancedFeatureCardProps {
  title: string
  description: string
  icon: React.ElementType
  delay?: number
  accentColor?: string
}

function EnhancedFeatureCard({
  title,
  description,
  icon,
  delay = 0,
  accentColor = "from-emerald-500 to-cyan-500",
}: EnhancedFeatureCardProps) {
  const Icon = icon
  const [isHovered, setIsHovered] = useState(false)

  return (
    <EnhancedAnimation delay={delay}>
      <div
        className="relative group h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r ${accentColor} rounded-2xl opacity-0 group-hover:opacity-50 transition duration-500 blur-md`}
        />
        <div className="relative bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 group-hover:border-emerald-500/30 transition-all duration-300 h-full flex flex-col">
          <div
            className={`h-16 w-16 rounded-xl bg-gradient-to-br ${accentColor.replace("500", "500/30").replace("to-cyan-500", "to-cyan-500/30")} flex items-center justify-center mb-6 transition-all duration-500 group-hover:${accentColor.replace("500", "500/40").replace("to-cyan-500", "to-cyan-500/40")}`}
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

          {/* Enhanced interactive indicator with animation */}
          <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 group-hover:w-full" />
        </div>
      </div>
    </EnhancedAnimation>
  )
}

// Improved Image Modal Component that maintains aspect ratio
function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  altText,
  accentColor = "from-emerald-500 to-cyan-500",
}: {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  altText: string
  accentColor?: string
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-0 bg-transparent max-w-[min(90vw,500px)] mx-auto" onClose={onClose}>
        <div className="relative w-full">
          {/* Close button with enhanced styling */}
          <button
            onClick={onClose}
            className={`absolute -top-10 right-0 z-50 p-2 rounded-full bg-gray-900/80 border border-gray-700 hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-${accentColor.split(" ")[0].replace("from-", "")}/50`}
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>

          {/* Image container with gradient border */}
          <div className="relative rounded-xl overflow-hidden">
            {/* Animated gradient border */}
            <div
              className={`absolute -inset-0.5 bg-gradient-to-r ${accentColor} animate-pulse blur-sm opacity-70`}
            ></div>

            {/* Image with maintained aspect ratio */}
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl border-2 border-gray-700/50">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={altText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 500px"
                priority
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Redesigned Hero Section with enhanced visuals, animations, and modal functionality
function EnhancedHeroSection() {
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false)
  const [mealModalOpen, setMealModalOpen] = useState(false)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left side - Text content with enhanced animations */}
        <div className="w-full lg:w-2/5 text-left">
          <EnhancedAnimation delay={100}>
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 cursor-pointer">
              <span className="flex items-center">
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Powered by Advanced AI
              </span>
            </div>
          </EnhancedAnimation>

          <EnhancedAnimation delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">
                AI Gym<span className="text-white">BRO</span>
              </span>
            </h1>
          </EnhancedAnimation>

          <EnhancedAnimation delay={300}>
            <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
              Your personal AI trainer and nutritionist. Generate customized workout and meal plans tailored to your
              specific goals and preferences.
            </p>
          </EnhancedAnimation>

          <EnhancedAnimation delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <EnhancedButton
                primary
                href="/workout-plan"
                size="lg"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                Create Workout Plan{" "}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </EnhancedButton>
              <EnhancedButton
                href="/meal-plan"
                size="lg"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                Create Meal Plan <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </EnhancedButton>
            </div>
          </EnhancedAnimation>
        </div>

        {/* Right side - Screenshots with enhanced animations and effects */}
        <div className="w-full lg:w-3/5">
          <EnhancedAnimation delay={500} direction="left">
            <div className="relative flex justify-center items-center gap-4 md:gap-6">
              {/* Workout Plan Screenshot with enhanced effects */}
              <div
                className="relative w-1/2 max-w-[250px] md:max-w-[300px] transform hover:scale-110 transition-all duration-300 hover:z-10 cursor-pointer"
                onClick={() => setWorkoutModalOpen(true)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl opacity-70 blur-md animate-pulse"></div>
                <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden border-2 border-emerald-500/30 shadow-xl hover:border-emerald-500/70 transition-colors duration-300">
                  <Image
                    src="/placeholder.svg?height=1600&width=900"
                    alt="Workout Plan Example"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, 300px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">Workout Plan</h3>
                    <div className="inline-flex items-center text-sm text-emerald-400 font-medium group">
                      View example{" "}
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Plan Screenshot with enhanced effects */}
              <div
                className="relative w-1/2 max-w-[250px] md:max-w-[300px] transform hover:scale-110 transition-all duration-300 hover:z-10 cursor-pointer"
                onClick={() => setMealModalOpen(true)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-70 blur-md animate-pulse"></div>
                <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-xl hover:border-cyan-500/70 transition-colors duration-300">
                  <Image
                    src="/placeholder.svg?height=1600&width=900"
                    alt="Meal Plan Example"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, 300px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">Meal Plan</h3>
                    <div className="inline-flex items-center text-sm text-cyan-400 font-medium group">
                      View example{" "}
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EnhancedAnimation>
        </div>
      </div>

      {/* Improved Image Modals */}
      <ImageModal
        isOpen={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
        imageSrc="/placeholder.svg?height=1600&width=900"
        altText="Workout Plan Example"
        accentColor="from-emerald-500 to-cyan-500"
      />
      <ImageModal
        isOpen={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        imageSrc="/placeholder.svg?height=1600&width=900"
        altText="Meal Plan Example"
        accentColor="from-cyan-500 to-blue-500"
      />
    </div>
  )
}

// Enhanced "Why Use This Platform" Section with more interactive elements and animations
function EnhancedPlatformSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const benefits = [
    {
      title: "Personalized Workouts",
      description: "Custom exercise plans that adapt to your fitness level, equipment, and time constraints",
      icon: Dumbbell,
      color: "from-emerald-500 to-emerald-400",
      hoverColor: "group-hover:from-emerald-400 group-hover:to-emerald-300",
    },
    {
      title: "Tailored Nutrition",
      description: "Meal plans that match your dietary preferences while supporting your health and fitness goals",
      icon: Utensils,
      color: "from-cyan-500 to-cyan-400",
      hoverColor: "group-hover:from-cyan-400 group-hover:to-cyan-300",
    },
    {
      title: "Consistent Progress",
      description: "Structured approach that ensures steady improvement and helps maintain motivation",
      icon: Zap,
      color: "from-blue-500 to-blue-400",
      hoverColor: "group-hover:from-blue-400 group-hover:to-blue-300",
    },
    {
      title: "Achievable Goals",
      description: "Realistic targets that build confidence and create sustainable long-term habits",
      icon: Trophy,
      color: "from-purple-500 to-purple-400",
      hoverColor: "group-hover:from-purple-400 group-hover:to-purple-300",
    },
  ]

  return (
    <div className="mt-24 z-10 w-full max-w-7xl mx-auto px-4">
      <EnhancedAnimation delay={400}>
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 cursor-pointer transform hover:scale-105">
            <span className="flex items-center justify-center">
              <Heart className="w-4 h-4 mr-2 text-pink-400 animate-pulse" />
              Fitness & Nutrition
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Why You Should Use This Platform
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            A balanced approach to nutrition and exercise is the cornerstone of a healthy lifestyle
          </p>
        </div>
      </EnhancedAnimation>

      <EnhancedAnimation delay={500}>
        <div className="relative bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 md:p-12 mb-12 overflow-hidden shadow-xl shadow-emerald-900/20 hover:border-emerald-500/30 transition-all duration-500">
          {/* Enhanced background decorative elements with animations */}
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-48 -mt-48"
            style={{ animation: "float 15s ease-in-out infinite" }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -ml-48 -mb-48"
            style={{ animation: "float 18s ease-in-out infinite reverse" }}
          ></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="max-w-4xl mx-auto relative">
            <div className="flex flex-col items-center justify-center mb-16">
              <div className="relative w-32 h-32 mb-8 transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 backdrop-blur-sm border border-emerald-500/40 flex items-center justify-center hover:from-emerald-500/40 hover:to-cyan-500/40 transition-colors duration-300">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <div
                  className="absolute -inset-4 rounded-full border-2 border-dashed border-emerald-500/20"
                  style={{ animation: "spin-slow 20s linear infinite" }}
                ></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 transition-colors duration-300">
                Healthy Lifestyle
              </h3>
              <p className="text-lg text-gray-300 text-center max-w-2xl">
                AI GymBRO helps you achieve balance with personalized plans that work for your unique body and goals
              </p>
            </div>

            {/* Enhanced Interactive Benefits Grid with animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`group relative rounded-xl transition-all duration-500 cursor-pointer ${
                    activeIndex === index ? "scale-105 z-10 shadow-xl shadow-emerald-500/10" : "hover:scale-[1.05]"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  style={{
                    boxShadow: activeIndex === index ? "0 0 30px rgba(16, 185, 129, 0.1)" : "none",
                  }}
                >
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}
                  ></div>
                  <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 group-hover:border-emerald-500/30 p-6 h-full transition-all duration-300 overflow-hidden">
                    {/* Enhanced decorative corner accent with animation */}
                    <div className="absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12">
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${benefit.color} opacity-10 blur-xl transition-all duration-300 ${
                          activeIndex === index ? "scale-125" : "scale-100"
                        }`}
                      ></div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center mr-5 transition-all duration-300 ${
                          activeIndex === index ? "scale-110" : ""
                        }`}
                        style={{
                          boxShadow: activeIndex === index ? "0 0 15px rgba(16, 185, 129, 0.2)" : "none",
                        }}
                      >
                        <benefit.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`text-xl font-bold mb-2 transition-all duration-300 ${
                            activeIndex === index
                              ? `text-transparent bg-clip-text bg-gradient-to-r ${benefit.color}`
                              : "text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:" +
                                benefit.color
                          }`}
                        >
                          {benefit.title}
                        </h4>
                        <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced stats callout with animations */}
            <div className="mt-16 p-6 rounded-xl bg-gradient-to-br from-emerald-900/30 to-cyan-900/20 backdrop-blur-sm border border-emerald-500/20 shadow-lg shadow-emerald-900/10 hover:shadow-emerald-500/20 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full bg-emerald-500/20"
                      style={{ animation: "pulse-glow 2s infinite" }}
                    ></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition-colors duration-300 cursor-pointer">
                      3x
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-200">
                    Research shows that individuals with structured fitness and nutrition plans are{" "}
                    <span className="text-emerald-400 font-medium">3x more likely</span> to achieve their health goals
                    and maintain results long-term.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EnhancedAnimation>
    </div>
  )
}

// Revamped explanatory section with enhanced visuals and animations
function EnhancedExplanatorySection() {
  return (
    <div className="mt-24 z-10 w-full max-w-7xl mx-auto px-4">
      <EnhancedAnimation delay={600}>
        <h2 className="text-4xl font-bold mb-10 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Transform Your Fitness Journey
          </span>
        </h2>
      </EnhancedAnimation>

      <EnhancedAnimation delay={700}>
        <div className="relative bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 md:p-12 mb-12 overflow-hidden shadow-xl shadow-emerald-900/20 hover:border-emerald-500/30 transition-all duration-500">
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-48 -mt-48"
            style={{ animation: "float 20s ease-in-out infinite" }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -ml-48 -mb-48"
            style={{ animation: "float 25s ease-in-out infinite reverse" }}
          ></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="max-w-4xl mx-auto relative">
            <div className="text-center mb-10">
              <p className="text-xl text-gray-200 leading-relaxed">
                AI GymBRO is a revolutionary fitness platform that uses advanced artificial intelligence to create
                personalized workout and meal plans tailored to your unique needs, preferences, and goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-6 md:p-8 shadow-lg shadow-emerald-900/10 hover:shadow-emerald-500/10 transition-all duration-300 hover:border-emerald-500/30 group transform hover:scale-[1.03]">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center mr-4 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Dumbbell className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-emerald-300 transition-all duration-300">
                    Workout Plans
                  </h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Our AI analyzes your fitness level, available equipment, time constraints, and goals to create a
                  customized workout routine that maximizes results while fitting into your lifestyle.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Personalized exercise selection based on your goals</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Adaptive progression that evolves as you improve</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Detailed instructions and form guidance</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6 md:p-8 shadow-lg shadow-cyan-900/10 hover:shadow-cyan-500/10 transition-all duration-300 hover:border-cyan-500/30 group transform hover:scale-[1.03]">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center mr-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Utensils className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-cyan-300 transition-all duration-300">
                    Meal Plans
                  </h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Our nutrition AI creates meal plans that align with your dietary preferences, restrictions, and
                  macronutrient goals while ensuring your meals are delicious, varied, and sustainable.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Customized macronutrient calculations</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Accommodates dietary restrictions and preferences</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Simple, delicious recipes with shopping lists</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 md:p-8 shadow-lg shadow-purple-900/10 hover:shadow-purple-500/10 transition-all duration-300 hover:border-purple-500/30 transform hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center mr-4 shadow-lg shadow-purple-500/20 hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-300 transition-colors duration-300">
                  How It Works
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                  <div className="absolute top-0 left-0 w-8 h-8 -mt-2 -ml-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <div className="pl-8 transform group-hover:translate-y-[-5px] transition-transform duration-300">
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      Answer Questions
                    </h4>
                    <p className="text-gray-300">Tell us about your goals, preferences, and constraints</p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute top-0 left-0 w-8 h-8 -mt-2 -ml-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <div className="pl-8 transform group-hover:translate-y-[-5px] transition-transform duration-300">
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      AI Generation
                    </h4>
                    <p className="text-gray-300">Our AI creates your personalized plans using RAG technology</p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute top-0 left-0 w-8 h-8 -mt-2 -ml-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div className="pl-8 transform group-hover:translate-y-[-5px] transition-transform duration-300">
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      Get Results
                    </h4>
                    <p className="text-gray-300">Follow your custom plans and track your progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EnhancedAnimation>
    </div>
  )
}

// Modern Footer with enhanced visuals and animations
function ModernFooter() {
  return (
    <footer className="mt-24 w-full z-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo and description with animations */}
            <EnhancedAnimation delay={800}>
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
            </EnhancedAnimation>

            {/* Generate Plans with animations */}
            <EnhancedAnimation delay={900}>
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
                      className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center group p-2 hover:bg-gray-800/50 rounded-lg"
                    >
                      <Utensils className="h-4 w-4 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" />
                      Generate Meal Plan
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                </ul>
              </div>
            </EnhancedAnimation>
          </div>
        </div>

        {/* Bottom bar with animations */}
        <EnhancedAnimation delay={1000}>
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
        </EnhancedAnimation>
      </div>
    </footer>
  )
}

// Main component with enhanced loading and animations
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
      <EnhancedBackground />

      <main className="flex-grow w-full py-16 px-4">
        {/* Hero Section */}
        <EnhancedHeroSection />

        {/* Why Use This Platform Section */}
        {isMounted && <EnhancedPlatformSection />}

        {/* Explanatory Section */}
        {isMounted && <EnhancedExplanatorySection />}
      </main>

      {/* Modern Footer */}
      {isMounted && <ModernFooter />}
    </div>
  )
}
