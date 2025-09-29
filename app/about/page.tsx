"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Dumbbell,
  Utensils,
  Zap,
  Trophy,
  Heart,
  Target,
  Users,
  Award,
  Lightbulb,
  Brain,
  Rocket,
  CheckCircle,
  Sparkles,
} from "lucide-react"

// Animation hook
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false)
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, threshold])

  return [setElement, isInView] as const
}

// Animation component
const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => {
  const [ref, isInView] = useInView()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{ transitionDelay: hasAnimated ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  )
}

// Enhanced Background
const EnhancedBackground = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-gray-950 to-emerald-900" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-emerald-400/3 via-transparent to-transparent" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/8 to-cyan-500/8 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/6 to-emerald-500/6 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/15 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-8">
              <Heart className="w-4 h-4" />
              About AI GymBRO
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">
                Revolutionizing
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-100 to-gray-300">
                Fitness & Nutrition
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
              We're on a mission to democratize personalized fitness and nutrition through the power of artificial
              intelligence, making world-class coaching accessible to everyone.
            </p>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/workout-plan"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#story"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900/50 hover:bg-gray-800/50 text-white font-semibold rounded-lg border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 hover:scale-105"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Our Story
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// Story Section
function StorySection() {
  return (
    <section id="story" className="relative py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={100}>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Our Story
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Born from frustration with one-size-fits-all fitness solutions, AI GymBRO represents a new era of
                personalized health and wellness.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <FadeIn delay={200}>
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">The Problem We Saw</h3>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Traditional fitness and nutrition advice treats everyone the same. Generic workout plans,
                  cookie-cutter meal plans, and one-size-fits-all approaches that ignore individual needs, preferences,
                  and lifestyles.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  We realized that true transformation requires personalization at a level that was previously only
                  available to elite athletes with personal trainers and nutritionists.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-8 hover:border-emerald-500/50 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <Lightbulb className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-emerald-400">The Solution</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    AI-powered personalization that adapts to your unique body, goals, preferences, and lifestyle. Every
                    recommendation is tailored specifically for you, backed by science, and continuously optimized for
                    better results.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

// Values Section
function ValuesSection() {
  const values = [
    {
      icon: Target,
      title: "Personalization First",
      description: "Every recommendation is tailored to your unique needs, goals, and lifestyle. No generic solutions.",
    },
    {
      icon: Rocket,
      title: "Innovation Driven",
      description: "We're constantly pushing the boundaries of what's possible in AI-powered fitness and nutrition.",
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Building a supportive community where everyone can achieve their health and fitness goals.",
    },
    {
      icon: Award,
      title: "Results Oriented",
      description: "We measure success by your progress. Our algorithms continuously optimize for better outcomes.",
    },
  ]

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={100}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Our Values
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The principles that guide everything we do at AI GymBRO
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <FadeIn key={index} delay={200 + index * 100}>
                <div className="group relative">
                  <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 group-hover:border-emerald-500/40 transition-all duration-500 p-8 h-full hover:shadow-2xl hover:shadow-emerald-500/10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{value.title}</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg">{value.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// How It Works Section with Completely Redesigned Animations
function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [animationStates, setAnimationStates] = useState<boolean[]>([false, false, false])
  const [sectionInView, setSectionInView] = useState(false)

  const steps = [
    {
      number: "01",
      title: "Fill Your Inputs",
      description:
        "Tell us about your goals - whether you're looking for deficit or bulking for meal planning, or your fitness objectives for workout planning.",
      icon: Target,
      color: "emerald",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      number: "02",
      title: "AI Processing",
      description:
        "Our advanced AI algorithms analyze your inputs using machine learning models trained on thousands of successful fitness and nutrition plans.",
      icon: Brain,
      color: "cyan",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      number: "03",
      title: "Get Your Plan",
      description:
        "Receive a comprehensive, personalized plan that includes detailed workout routines or meal plans with nutritional information.",
      icon: Rocket,
      color: "violet",
      gradient: "from-violet-500 to-purple-600",
    },
  ]

  // Completely Redesigned Animation Components
  const FormFillingAnimation = ({ isActive }: { isActive: boolean }) => {
    const [progress, setProgress] = useState(0)
    const [completedFields, setCompletedFields] = useState<number[]>([])
    const [showSuccess, setShowSuccess] = useState(false)

    const fields = [
      { name: "Fitness Goals", icon: "🎯" },
      { name: "Body Stats", icon: "📊" },
      { name: "Diet Preferences", icon: "🥗" },
      { name: "Schedule", icon: "⏰" },
    ]

    useEffect(() => {
      if (isActive && sectionInView) {
        let currentField = 0
        const interval = setInterval(() => {
          if (currentField < fields.length) {
            setCompletedFields((prev) => [...prev, currentField])
            setProgress((currentField + 1) * 25)
            currentField++
          } else {
            setShowSuccess(true)
            clearInterval(interval)
          }
        }, 800)

        return () => {
          clearInterval(interval)
          setProgress(0)
          setCompletedFields([])
          setShowSuccess(false)
        }
      }
    }, [isActive, sectionInView])

    return (
      <div className="w-full max-w-sm mx-auto">
        {/* Mobile-optimized form mockup */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-emerald-400 font-semibold text-sm">Personal Info</h4>
            <div className="text-xs text-gray-400">{progress}%</div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50">
                <div className="text-lg">{field.icon}</div>
                <div className="flex-1">
                  <div className="text-sm text-gray-300">{field.name}</div>
                  <div
                    className={`h-1 rounded-full mt-1 transition-all duration-500 ${
                      completedFields.includes(index) ? "bg-emerald-500 w-full" : "bg-gray-600 w-1/3"
                    }`}
                  />
                </div>
                {completedFields.includes(index) && <CheckCircle className="w-4 h-4 text-emerald-500 animate-bounce" />}
              </div>
            ))}
          </div>

          {showSuccess && (
            <div className="mt-4 p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30 text-center">
              <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-1 animate-pulse" />
              <div className="text-emerald-300 text-sm font-medium">Form Complete!</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const AIProcessingAnimation = ({ isActive }: { isActive: boolean }) => {
    const [stage, setStage] = useState(0)
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

    const stages = [
      { name: "Analyzing", icon: "🔍", color: "text-cyan-400" },
      { name: "Processing", icon: "🧠", color: "text-blue-400" },
      { name: "Optimizing", icon: "⚡", color: "text-purple-400" },
      { name: "Complete", icon: "✨", color: "text-green-400" },
    ]

    useEffect(() => {
      if (isActive && sectionInView) {
        const interval = setInterval(() => {
          setStage((prev) => (prev + 1) % stages.length)
        }, 1200)

        // Generate floating particles
        const particleInterval = setInterval(() => {
          setParticles((prev) => [
            ...prev.slice(-10), // Keep only last 10 particles
            {
              id: Date.now(),
              x: Math.random() * 100,
              y: Math.random() * 100,
            },
          ])
        }, 300)

        return () => {
          clearInterval(interval)
          clearInterval(particleInterval)
          setStage(0)
          setParticles([])
        }
      }
    }, [isActive, sectionInView])

    return (
      <div className="w-full max-w-sm mx-auto relative">
        {/* AI Brain Center */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center border-2 border-cyan-500/30 relative overflow-hidden">
            <Brain className="w-12 h-12 text-cyan-400 animate-pulse" />

            {/* Floating particles */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDuration: "2s",
                }}
              />
            ))}

            {/* Rotating ring */}
            <div className="absolute inset-0 border-2 border-transparent border-t-cyan-500 rounded-full animate-spin" />
          </div>

          {/* Processing stages */}
          <div className="mt-6 space-y-2">
            {stages.map((stageItem, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-500 ${
                  stage >= index ? "bg-gray-800/50 scale-105" : "bg-gray-900/30"
                }`}
              >
                <div className="text-lg">{stageItem.icon}</div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium transition-colors ${
                      stage >= index ? stageItem.color : "text-gray-500"
                    }`}
                  >
                    {stageItem.name}
                  </div>
                </div>
                {stage > index && <CheckCircle className="w-4 h-4 text-green-500" />}
                {stage === index && (
                  <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const PlanGenerationAnimation = ({ isActive }: { isActive: boolean }) => {
    const [generatedItems, setGeneratedItems] = useState<number[]>([])
    const [showCelebration, setShowCelebration] = useState(false)

    const planItems = [
      { name: "Workout Routine", icon: "💪", color: "bg-violet-500" },
      { name: "Meal Plan", icon: "🍽️", color: "bg-emerald-500" },
      { name: "Progress Tracking", icon: "📈", color: "bg-cyan-500" },
      { name: "Tips & Guidance", icon: "💡", color: "bg-yellow-500" },
    ]

    useEffect(() => {
      if (isActive && sectionInView) {
        planItems.forEach((_, index) => {
          setTimeout(
            () => {
              setGeneratedItems((prev) => [...prev, index])
              if (index === planItems.length - 1) {
                setTimeout(() => setShowCelebration(true), 500)
              }
            },
            (index + 1) * 600,
          )
        })

        return () => {
          setGeneratedItems([])
          setShowCelebration(false)
        }
      }
    }, [isActive, sectionInView])

    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-violet-500/20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-violet-400 font-semibold text-sm">Your Plan</h4>
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>

          <div className="space-y-3">
            {planItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-700 ${
                  generatedItems.includes(index) ? "bg-gray-800/70 scale-105 shadow-lg" : "bg-gray-900/30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm transition-all duration-500 ${
                    generatedItems.includes(index) ? item.color : "bg-gray-700"
                  }`}
                >
                  {generatedItems.includes(index) ? "✓" : item.icon}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium transition-colors ${
                      generatedItems.includes(index) ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </div>
                </div>
                {generatedItems.includes(index) && <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />}
              </div>
            ))}
          </div>

          {showCelebration && (
            <div className="mt-4 p-3 bg-gradient-to-r from-violet-500/20 to-purple-600/20 rounded-lg border border-violet-500/30 text-center">
              <div className="text-2xl mb-1">🎉</div>
              <div className="text-violet-300 text-sm font-medium">Plan Ready!</div>
              <div className="text-xs text-gray-400 mt-1">Personalized just for you</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Auto-cycle through animations
  useEffect(() => {
    if (sectionInView) {
      const interval = setInterval(() => {
        setAnimationStates((prev) => {
          const newStates = [false, false, false]
          const currentActive = prev.findIndex((state) => state)
          const nextActive = (currentActive + 1) % 3
          newStates[nextActive] = true
          return newStates
        })
      }, 5000)

      // Start with first animation
      setTimeout(() => {
        setAnimationStates([true, false, false])
      }, 500)

      return () => clearInterval(interval)
    }
  }, [sectionInView])

  // Section visibility observer
  const [sectionRef, isSectionInView] = useInView(0.3)

  useEffect(() => {
    setSectionInView(isSectionInView)
  }, [isSectionInView])

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Simplified Header */}
          <FadeIn delay={100}>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                How It Works
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
                  Simple Process
                </span>
                <br />
                <span className="text-white">Powerful Results</span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Our AI-powered system creates personalized plans in just 3 easy steps
              </p>
            </div>
          </FadeIn>

          {/* Mobile Step Indicators */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeStep === index ? "bg-gradient-to-r from-emerald-400 to-cyan-400 scale-125" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-12 lg:space-y-20">
            {steps.map((step, index) => (
              <FadeIn key={index} delay={200 + index * 100}>
                <div className={`block lg:block ${activeStep === index ? "block" : "hidden lg:block"}`}>
                  <div
                    className={`flex flex-col lg:flex-row ${
                      index % 2 === 0 ? "" : "lg:flex-row-reverse"
                    } gap-8 lg:gap-16 items-center`}
                  >
                    {/* Content Side - Simplified */}
                    <div className="w-full lg:w-1/2">
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`text-4xl md:text-6xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
                        >
                          {step.number}
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{step.title}</h3>
                          <div className="flex items-center gap-2">
                            <step.icon
                              className={`w-5 h-5 ${
                                step.color === "emerald"
                                  ? "text-emerald-400"
                                  : step.color === "cyan"
                                    ? "text-cyan-400"
                                    : "text-violet-400"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                step.color === "emerald"
                                  ? "text-emerald-400"
                                  : step.color === "cyan"
                                    ? "text-cyan-400"
                                    : "text-violet-400"
                              }`}
                            >
                              Step {step.number}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 leading-relaxed text-base md:text-lg">{step.description}</p>
                    </div>

                    {/* Animation Side - Completely Redesigned */}
                    <div className="w-full lg:w-1/2">
                      <div className="flex justify-center">
                        {index === 0 && <FormFillingAnimation isActive={animationStates[index]} />}
                        {index === 1 && <AIProcessingAnimation isActive={animationStates[index]} />}
                        {index === 2 && <PlanGenerationAnimation isActive={animationStates[index]} />}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-between items-center mt-8 lg:hidden">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg disabled:opacity-50 text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Previous
            </button>

            <span className="text-gray-400 text-sm">
              {activeStep + 1} of {steps.length}
            </span>

            <button
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg disabled:opacity-50 text-sm"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Enhanced Footer
function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeIn delay={100}>
            <div>
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">
                  AI Gym
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-100 to-gray-300">
                    BRO
                  </span>
                </span>
              </h2>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Your personal AI trainer and nutritionist. Generate customized workout and meal plans tailored to your
                specific goals and lifestyle.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Get Started</h3>
              <div className="space-y-3">
                <Link
                  href="/workout-plan"
                  className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors group"
                >
                  <Dumbbell className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  Generate Workout Plan
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/meal-plan"
                  className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group"
                >
                  <Utensils className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
                  Generate Meal Plan
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={300}>
          <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AI GymBRO. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              Built by{" "}
              <a
                href="https://www.matthewswong.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Matthews Wong
              </a>
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}

// Main component
export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      <EnhancedBackground />
      <HeroSection />
      <HowItWorksSection />
      <StorySection />
      <ValuesSection />
      <Footer />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </div>
  )
}
