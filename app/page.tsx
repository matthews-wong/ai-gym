"use client"

import React from "react"
import Image from 'next/image';
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Dumbbell,
  Utensils,
  Zap,
  Trophy,
  Heart,
  BarChart3,
  PieChart,
  Target,
  Clock,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Lightweight animation hook
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false)
  const [element, setElement] = useState(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only update state if we're in the browser
        if (typeof window !== "undefined") {
          setIsInView(entry.isIntersecting)
        }
      },
      { threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, threshold])

  return [setElement, isInView] as const
}

// Lightweight animation component
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

// Enhanced button component
const EnhancedButton = ({
  children,
  primary = false,
  href,
  className = "",
  size = "default",
  onClick,
}: {
  children: React.ReactNode
  primary?: boolean
  href: string
  className?: string
  size?: "default" | "lg" | "xl"
  onClick?: (e: React.MouseEvent) => void
}) => {
  const sizeClasses = {
    default: "px-4 py-2 text-sm sm:px-6 sm:py-3",
    lg: "px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base",
    xl: "px-8 py-4 text-base sm:px-10 sm:py-5 sm:text-lg",
  }

  return (
    <Link href={href} className={`group relative inline-block justify-center ${className}`} onClick={onClick}>
      <Button
        className={`relative font-semibold ${sizeClasses[size]} ${
          primary
            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 hover:shadow-xl hover:shadow-emerald-500/30"
            : "bg-gray-900/90 hover:bg-gray-800 text-white border border-emerald-500/30 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/25"
        } transition-all duration-300 rounded-lg hover:scale-105 hover:-translate-y-1`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </Button>
    </Link>
  )
}

// Enhanced background with emerald gradients
const EnhancedBackground = () => {
  const [mounted, setMounted] = useState(false)
  const [particleCount, setParticleCount] = useState(30)

  useEffect(() => {
    setMounted(true)
    setParticleCount(window.innerWidth < 768 ? 15 : 30)

    // Add animation styles
    const style = document.createElement("style")
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
        50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `
    document.head.appendChild(style)
    return () => {
      if (style.parentNode) {
        document.head.removeChild(style)
      }
    }
  }, [])

  if (!mounted) {
    return null // Return null on server-side to avoid hydration mismatch
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base emerald gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-gray-950 to-emerald-900" />

      {/* Subtle emerald accent gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-emerald-400/3 via-transparent to-transparent" />

      {/* Animated emerald orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/8 to-cyan-500/8 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/6 to-emerald-500/6 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Light floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: particleCount }).map((_, i) => (
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

const LottiePlayer = ({ src, className = "" }: { src: string; className?: string }) => {
  const [mounted, setMounted] = useState(false)
  const [key, setKey] = useState(0)
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setShowSpinner(true)
      // Short delay to show spinner, then reload
      setTimeout(() => {
        setKey(prev => prev + 1)
        setShowSpinner(false)
      }, 300)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!mounted) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-pulse">
          <Zap className="w-16 h-16 text-emerald-400" />
        </div>
      </div>
    )
  }

  if (showSpinner) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  const DotLottieReact = React.lazy(() =>
    import("@lottiefiles/dotlottie-react").then((module) => ({
      default: module.DotLottieReact,
    })),
  )

  return (
    <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center h-full w-full">
            <div className="animate-pulse">
              <Zap className="w-16 h-16 text-emerald-400" />
            </div>
          </div>
        }
      >
        <DotLottieReact 
          key={key}
          src={src} 
          loop 
          autoplay 
          style={{ width: "100%", height: "100%" }} 
        />
      </React.Suspense>
    </div>
  )
}


function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full background image - static for better performance */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero.jpg" 
          alt="Gym Background" 
          fill
          className="object-cover"
          priority
        />
        {/* Enhanced overlay with natural gradient transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/85 via-gray-900/75 to-gray-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/25 via-transparent to-cyan-900/25" />
      </div>

      {/* Smooth transition gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent z-10" />

      {/* Main content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium mb-8 shadow-2xl">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                Powered by Advanced AI Technology
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              {/* Enhanced title with compelling copywriting */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 filter brightness-110 relative font-black"
                  style={{
                    filter:
                      "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 40px rgba(16, 185, 129, 0.5))",
                    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Data-Driven Gains
                </span>
                <br />
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-100 to-gray-300 relative font-black"
                  style={{
                    filter:
                      "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 40px rgba(16, 185, 129, 0.5))",
                    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Just For You
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              {/* Enhanced copywriting with responsive highlights */}
              <div className="text-lg sm:text-xl md:text-2xl lg:text-xl mb-8 lg:mb-10 text-gray-100 leading-relaxed">
                <p className="mb-6 font-light">
                  Meet your{" "}
                  <span className="inline-block text-emerald-400 font-semibold bg-emerald-400/15 px-2 sm:px-2 py-1 sm:py-1 mx-1 my-1 rounded-lg border border-emerald-400/30 hover:bg-emerald-400/25 transition-colors text-lg sm:text-lg md:text-xl lg:text-xl whitespace-nowrap">
                    AI-powered fitness coach
                  </span>{" "}
                  and{" "}
                  <span className="inline-block text-cyan-400 font-semibold bg-cyan-400/15 px-2 sm:px-2 py-1 sm:py-1 mx-1 my-1 rounded-lg border border-cyan-400/30 hover:bg-cyan-400/25 transition-colors text-lg sm:text-lg md:text-xl lg:text-xl whitespace-nowrap">
                    nutrition expert
                  </span>
                </p>
              </div>
            </FadeIn>

            {/* Mobile Lottie - Only show on mobile */}
            <div className="lg:hidden mb-12">
              <FadeIn delay={350}>
                <LottiePlayer src="/lottie/hero.lottie" className="w-full h-[300px] mx-auto" />
              </FadeIn>
            </div>

            <FadeIn delay={400}>
              <div className="flex flex-col gap-4 justify-center lg:justify-start items-center lg:items-start max-w-lg mx-auto lg:mx-0">
                <EnhancedButton
                  primary
                  href="#products"
                  size="xl"
                  className="w-full sm:w-auto group"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById("products")
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  }}
                >
                  <span className="relative">
                    Start Your Transformation
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </EnhancedButton>
              </div>
            </FadeIn>

            {/* Hide bullet points on mobile */}
            <FadeIn delay={500}>
              <div className="hidden sm:flex mt-16 text-sm text-gray-400 items-center justify-center lg:justify-start gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Unlock Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Eat Smarter</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Real Results</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right side - Lottie animation (Desktop only) */}
          <div className="hidden lg:block">
            <FadeIn delay={600}>
              <div className="relative">
                <LottiePlayer src="/lottie/hero.lottie" className="w-full h-[600px]" />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

// Product cards section
function ProductsSection() {
  return (
    <section id="products" className="relative py-8 sm:py-12 md:py-16 lg:py-20" style={{ scrollMarginTop: "80px" }}>
      {/* Gradient background - solid at top, transparent from 50% down */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-transparent" style={{ background: 'linear-gradient(to bottom, rgb(3, 7, 18) 0%, rgb(3, 7, 18) 50%, transparent 100%)' }} />
      
      {/* Smooth transition gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-950 via-gray-950/80 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn delay={100}>
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                We Have These 2 Products
              </span>
              <br />
              <span className="text-white">To Help You Succeed</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your path to fitness success with our AI-powered solutions that adapt to your lifestyle
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Workout Plan Card */}
          <FadeIn delay={200}>
            <div className="group relative">
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 group-hover:border-emerald-500/40 transition-all duration-300 overflow-hidden h-full hover:shadow-2xl hover:shadow-emerald-500/20">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/images/workout.webp"
                    alt="Custom Workout Plans"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-emerald-500/25 backdrop-blur-md rounded-lg p-3 border border-emerald-500/40">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-semibold">4-6 Sessions/Week</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Custom Workout Plans
                  </h3>
                  <p className="text-gray-300 mb-6 text-base sm:text-lg leading-relaxed">
                    AI-generated workout routines tailored to your fitness level, available equipment, and specific
                    goals with progressive overload tracking.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Personalized exercise selection",
                      "Progressive overload tracking",
                      "Equipment-based customization",
                      "Goal-oriented programming",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="transform -translate-y-2">
                    <EnhancedButton
                      href="#workout-plan-preview"
                      size="lg"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("workout-plan-preview")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      Learn More
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </EnhancedButton>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Meal Plan Card */}
          <FadeIn delay={300}>
            <div className="group relative">
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 group-hover:border-cyan-500/40 transition-all duration-300 overflow-hidden h-full hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/images/meal-plan.webp"
                    alt="Tailored Meal Plans"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-cyan-500/25 backdrop-blur-md rounded-lg p-3 border border-cyan-500/40">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-semibold">2,100 Cal/Day</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                    Tailored Meal Plans
                  </h3>
                  <p className="text-gray-300 mb-6 text-base sm:text-lg leading-relaxed">
                    Personalized nutrition plans that match your dietary preferences while supporting your health goals
                    with complete macro tracking.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Macro-balanced meal planning",
                      "Dietary restriction support",
                      "Shopping lists included",
                      "Prep time optimization",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="transform -translate-y-2">
                    <EnhancedButton
                      href="#meal-plan-preview"
                      size="lg"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("meal-plan-preview")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      Learn More
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </EnhancedButton>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}


// Workout Plan Preview Section with enhanced explanations
function WorkoutPlanSection() {
  return (
    <section
      id="workout-plan-preview"
      className="relative py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden"
      style={{ scrollMarginTop: "80px" }}
    >
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <FadeIn delay={100}>
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-sm font-medium mb-6 shadow-lg shadow-emerald-500/10">
              <span className="flex items-center justify-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Advanced Workout Analytics
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Your Complete Workout Report
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="text-lg sm:text-xl text-gray-200 mb-8 space-y-4">
              <p className="drop-shadow-md">
                Get a comprehensive workout analysis that goes beyond basic exercise lists. Our AI generates detailed
                reports with <span className="text-emerald-400 font-semibold">progressive overload tracking</span>,{" "}
                <span className="text-cyan-400 font-semibold">performance metrics</span>, and{" "}
                <span className="text-emerald-400 font-semibold">personalized recommendations</span>.
              </p>
              <p className="text-lg text-gray-300">
                Each report includes weekly schedules, exercise breakdowns, calorie tracking, and adaptive programming
                that evolves with your progress.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Enhanced Bento Grid Layout */}
        <div className="max-w-7xl mx-auto">
          <FadeIn delay={400}>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-emerald-500/30 p-8 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
                {/* Enhanced Report Preview - Better 9:16 integration */}
                <div className="md:col-span-2">
                  <div className="h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-emerald-400 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                          <BarChart3 className="w-6 h-6" />
                        </div>
                        Workout Report
                      </h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-emerald-300 text-sm font-medium">Live Preview</span>
                      </div>
                    </div>
                    <div className="relative group">
                      <Image
                        src="/placeholder.svg?height=640&width=360"
                        alt="Workout Report Preview"
                        width={360}
                        height={640}
                        className="w-full rounded-lg group-hover:scale-[1.02] transition-all duration-500"
                        style={{ aspectRatio: "9/16" }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent rounded-xl" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-emerald-500/25 backdrop-blur-md rounded-xl p-4 border border-emerald-500/40">
                          <div className="text-emerald-300 font-semibold text-sm mb-1">Advanced Analytics</div>
                          <div className="text-white text-xs">Complete workout breakdown with progress tracking</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Target className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300 text-xs">Goal-oriented programming</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/30">
                        <div className="text-emerald-400 text-sm font-medium">Report Length</div>
                        <div className="text-white text-lg font-bold">12-15 Pages</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/30">
                        <div className="text-cyan-400 text-sm font-medium">Update Frequency</div>
                        <div className="text-white text-lg font-bold">Weekly</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section - Better organized */}
                <div className="md:col-span-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                    {/* Weekly Schedule */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-emerald-500/25 p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Weekly Schedule
                      </h3>
                      <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                          <div key={index} className="text-center">
                            <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2 font-medium">{day}</div>
                            <div
                              className={`h-12 sm:h-16 rounded-lg ${
                                index < 5
                                  ? "bg-gradient-to-b from-emerald-500/25 to-cyan-500/25 border border-emerald-500/40"
                                  : "bg-gray-700/60 border border-gray-600/40"
                              } flex items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer`}
                            >
                              {index < 5 && (
                                <div className="text-xs text-emerald-300 font-medium px-1 py-1 rounded-md bg-emerald-900/60 border border-emerald-500/30">
                                  {["Upper", "Lower", "Push", "Pull", "Core"][index]}
                                </div>
                              )}
                              {index >= 5 && <div className="text-xs text-gray-500 font-medium">Rest</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exercise Stats */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-emerald-500/25 p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Exercise Distribution
                      </h3>
                      <div className="space-y-4">
                        {[
                          { name: "Strength Training", value: 65, color: "from-emerald-500 to-cyan-500" },
                          { name: "Cardiovascular", value: 40, color: "from-cyan-500 to-emerald-500" },
                          { name: "Flexibility", value: 25, color: "from-emerald-400 to-cyan-400" },
                        ].map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-300 text-sm font-medium">{item.name}</span>
                              <span className="text-emerald-400 text-sm font-bold">{item.value}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-700/80 rounded-full overflow-hidden border border-gray-600/30">
                              <div
                                className={`h-full bg-gradient-to-r ${item.color} hover:scale-x-105 transition-transform duration-700 origin-left rounded-full`}
                                style={{ width: `${item.value}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Metrics */}
                    <div className="md:col-span-2 bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-emerald-500/25 p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Progress Tracking Dashboard
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            label: "Weekly Goal",
                            value: "4/5",
                            unit: "Sessions",
                            color: "text-emerald-400",
                            bg: "bg-emerald-500/10 border-emerald-500/30",
                          },
                          {
                            label: "Calories Burned",
                            value: "1,240",
                            unit: "This week",
                            color: "text-cyan-400",
                            bg: "bg-cyan-500/10 border-cyan-500/30",
                          },
                          {
                            label: "Active Streak",
                            value: "12",
                            unit: "Days",
                            color: "text-emerald-400",
                            bg: "bg-emerald-500/10 border-emerald-500/30",
                          },
                          {
                            label: "Completion Rate",
                            value: "89%",
                            unit: "Average",
                            color: "text-cyan-400",
                            bg: "bg-cyan-500/10 border-cyan-500/30",
                          },
                        ].map((metric, index) => (
                          <div
                            key={index}
                            className={`${metric.bg} rounded-lg p-3 sm:p-4 border hover:border-emerald-500/40 transition-all duration-300 cursor-pointer hover:scale-105`}
                          >
                            <div className="text-sm text-gray-400 mb-1 font-medium">{metric.label}</div>
                            <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                            <div className="text-xs text-gray-500">{metric.unit}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Enhanced CTA Section */}
        <FadeIn delay={500}>
          <div className="max-w-5xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-2/3 p-8 md:p-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Generate Your Workout Plan
                  </h2>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    Get a comprehensive workout report with detailed analytics, progressive overload tracking,
                    performance metrics, and personalized recommendations that evolve with your fitness journey.
                  </p>
                  <div className="flex flex-col gap-4 justify-center lg:justify-start items-center lg:items-start max-w-lg mx-auto lg:mx-0">
                    <EnhancedButton primary href="/workout-plan" size="lg">
                      Generate Workout Plan
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </EnhancedButton>
                  </div>
                </div>
                <div className="w-full md:w-1/3 p-6 md:p-0 flex justify-center">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25"></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 backdrop-blur-sm border border-emerald-500/40 flex items-center justify-center">
                      <Dumbbell className="h-16 w-16 text-white opacity-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// Meal Plan Preview Section with fixed macro chart
function MealPlanSection() {
  return (
    <section
      id="meal-plan-preview"
      className="relative py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden"
      style={{ scrollMarginTop: "80px" }}
    >
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <FadeIn delay={100}>
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-sm font-medium mb-6 shadow-lg shadow-cyan-500/10">
              <span className="flex items-center justify-center">
                <PieChart className="w-4 h-4 mr-2" />
                Advanced Nutrition Analytics
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Your Complete Nutrition Report
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="text-lg sm:text-xl text-gray-200 mb-8 space-y-4">
              <p className="drop-shadow-md">
                Receive a detailed nutrition analysis that goes beyond simple calorie counting. Our AI creates
                comprehensive reports with <span className="text-cyan-400 font-semibold">macro breakdowns</span>,{" "}
                <span className="text-emerald-400 font-semibold">meal timing optimization</span>, and{" "}
                <span className="text-cyan-400 font-semibold">shopping lists</span>.
              </p>
              <p className="text-lg text-gray-300">
                Each report includes daily meal schedules, nutrient tracking, supplement recommendations, and adaptive
                meal planning that adjusts to your preferences and goals.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Enhanced Bento Grid Layout */}
        <div className="max-w-7xl mx-auto">
          <FadeIn delay={400}>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
                {/* Enhanced Report Preview */}
                <div className="md:col-span-2">
                  <div className="h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                          <PieChart className="w-6 h-6" />
                        </div>
                        Nutrition Report
                      </h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-cyan-300 text-sm font-medium">Live Preview</span>
                      </div>
                    </div>
                    <div className="relative group">
                      <Image
                        src="/placeholder.svg?height=640&width=360"
                        alt="Meal Plan Report Preview"
                        width={360}
                        height={640}
                        className="w-full rounded-lg group-hover:scale-[1.02] transition-all duration-500"
                        style={{ aspectRatio: "9/16" }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 via-transparent to-transparent rounded-xl" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-cyan-500/25 backdrop-blur-md rounded-xl p-4 border border-cyan-500/40">
                          <div className="text-cyan-300 font-semibold text-sm mb-1">Nutrition Analytics</div>
                          <div className="text-white text-xs">Complete meal breakdown with macro tracking</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Utensils className="w-3 h-3 text-cyan-400" />
                            <span className="text-cyan-300 text-xs">Personalized meal planning</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/30">
                        <div className="text-cyan-400 text-sm font-medium">Report Length</div>
                        <div className="text-white text-lg font-bold">8-12 Pages</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/30">
                        <div className="text-emerald-400 text-sm font-medium">Meal Variations</div>
                        <div className="text-white text-lg font-bold">50+ Options</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="md:col-span-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                    {/* Fixed Macronutrient Distribution - Proper circular pie chart */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-cyan-500/25 p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Macro Distribution
                      </h3>
                      <div className="flex items-center justify-center">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36">
                          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* Background circle */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#374151" strokeWidth="8" />

                            {/* Protein slice - 40% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="35"
                              fill="none"
                              stroke="#0ea5e9"
                              strokeWidth="8"
                              strokeDasharray="87.96"
                              strokeDashoffset="52.78"
                              className="transition-all duration-1000 hover:stroke-width-10"
                            />

                            {/* Carbs slice - 35% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="35"
                              fill="none"
                              stroke="#06b6d4"
                              strokeWidth="8"
                              strokeDasharray="76.97"
                              strokeDashoffset="46.18"
                              transform="rotate(144 50 50)"
                              className="transition-all duration-1000 hover:stroke-width-10"
                            />

                            {/* Fats slice - 25% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="35"
                              fill="none"
                              stroke="#0891b2"
                              strokeWidth="8"
                              strokeDasharray="54.98"
                              strokeDashoffset="32.99"
                              transform="rotate(270 50 50)"
                              className="transition-all duration-1000 hover:stroke-width-10"
                            />

                            {/* Center text */}
                            <text
                              x="50"
                              y="45"
                              textAnchor="middle"
                              fill="white"
                              fontSize="10"
                              fontWeight="bold"
                              transform="rotate(90 50 50)"
                            >
                              2,100
                            </text>
                            <text
                              x="50"
                              y="55"
                              textAnchor="middle"
                              fill="#9CA3AF"
                              fontSize="6"
                              transform="rotate(90 50 50)"
                            >
                              calories
                            </text>
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
                            <span className="text-white text-sm font-medium">Protein</span>
                          </div>
                          <span className="text-cyan-400 text-sm font-bold">40%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
                            <span className="text-white text-sm font-medium">Carbs</span>
                          </div>
                          <span className="text-cyan-400 text-sm font-bold">35%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#0891b2]"></div>
                            <span className="text-white text-sm font-medium">Fats</span>
                          </div>
                          <span className="text-cyan-400 text-sm font-bold">25%</span>
                        </div>
                      </div>
                    </div>

                    {/* Daily Meal Schedule */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-cyan-500/25 p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Daily Schedule
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            time: "7:00 AM",
                            meal: "Breakfast",
                            calories: 450,
                            color: "bg-emerald-500/10 border-emerald-500/30",
                          },
                          {
                            time: "10:30 AM",
                            meal: "Snack",
                            calories: 250,
                            color: "bg-cyan-500/10 border-cyan-500/30",
                          },
                          {
                            time: "1:00 PM",
                            meal: "Lunch",
                            calories: 550,
                            color: "bg-emerald-500/10 border-emerald-500/30",
                          },
                          { time: "4:00 PM", meal: "Snack", calories: 300, color: "bg-cyan-500/10 border-cyan-500/30" },
                          {
                            time: "7:00 PM",
                            meal: "Dinner",
                            calories: 550,
                            color: "bg-emerald-500/10 border-emerald-500/30",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg ${item.color} border hover:border-cyan-500/40 transition-all duration-300 cursor-pointer hover:scale-105`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-cyan-500" />
                              <div>
                                <div className="text-white text-sm font-medium">{item.meal}</div>
                                <div className="text-gray-400 text-xs">{item.time}</div>
                              </div>
                            </div>
                            <div className="text-cyan-400 font-bold text-sm">{item.calories} cal</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nutrition Insights */}
                    <div className="md:col-span-2 bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-cyan-500/25 p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Nutrition Insights
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            label: "Daily Protein",
                            value: "140g",
                            unit: "Target: 120-150g",
                            color: "text-cyan-400",
                            bg: "bg-cyan-500/10 border-cyan-500/30",
                          },
                          {
                            label: "Water Intake",
                            value: "2.5L",
                            unit: "Target: 2.5L",
                            color: "text-emerald-400",
                            bg: "bg-emerald-500/10 border-emerald-500/30",
                          },
                          {
                            label: "Fiber",
                            value: "32g",
                            unit: "Target: 25-35g",
                            color: "text-cyan-400",
                            bg: "bg-cyan-500/10 border-cyan-500/30",
                          },
                          {
                            label: "Meal Prep",
                            value: "3h",
                            unit: "Weekly time",
                            color: "text-emerald-400",
                            bg: "bg-emerald-500/10 border-emerald-500/30",
                          },
                        ].map((metric, index) => (
                          <div
                            key={index}
                            className={`${metric.bg} rounded-lg p-3 sm:p-4 border hover:border-cyan-500/40 transition-all duration-300 cursor-pointer hover:scale-105`}
                          >
                            <div className="text-sm text-gray-400 mb-1 font-medium">{metric.label}</div>
                            <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                            <div className="text-xs text-gray-500">{metric.unit}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Enhanced CTA Section */}
        <FadeIn delay={500}>
          <div className="max-w-5xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-2/3 p-8 md:p-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Generate Your Meal Plan
                  </h2>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    Get a comprehensive nutrition report with detailed macro analysis, meal schedules, shopping lists,
                    supplement recommendations, and personalized meal planning that adapts to your lifestyle.
                  </p>
                  <div className="flex flex-col gap-4 justify-center lg:justify-start items-center lg:items-start max-w-lg mx-auto lg:mx-0">
                    <EnhancedButton primary href="/meal-plan" size="lg">
                      Generate Meal Plan
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </EnhancedButton>
                  </div>
                </div>
                <div className="w-full md:w-1/3 p-6 md:p-0 flex justify-center">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25"></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 backdrop-blur-sm border border-cyan-500/40 flex items-center justify-center">
                      <Utensils className="h-16 w-16 text-white opacity-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// Benefits section
function BenefitsSection() {
  const benefits = [
    {
      icon: Dumbbell,
      title: "Personalized Workouts",
      description: "Custom exercise plans that adapt to your fitness level and available equipment",
    },
    {
      icon: Utensils,
      title: "Smart Nutrition",
      description: "Meal plans that match your dietary preferences and support your goals",
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Advanced algorithms that learn and adapt to optimize your results",
    },
    {
      icon: Trophy,
      title: "Proven Results",
      description: "Evidence-based approach that delivers measurable improvements",
    },
  ]

  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn delay={100}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-sm font-medium mb-6">
              <Heart className="w-4 h-4 text-pink-400" />
              Why Choose AI GymBRO
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Transform Your Fitness Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of AI-driven fitness and nutrition planning designed for real results
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <FadeIn key={index} delay={200 + index * 100}>
              <div className="group relative h-full">
                <div className="relative bg-gray-800/60 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-gray-700 group-hover:border-emerald-500/40 transition-all duration-300 h-full hover:shadow-xl hover:shadow-emerald-500/15 hover:-translate-y-1 flex flex-col">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/25 to-cyan-500/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/30">
                    <benefit.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">{benefit.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer
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
export default function Home() {
  return (
    <div className="min-h-screen relative">
      <EnhancedBackground />
      <HeroSection />
      <ProductsSection />
      <WorkoutPlanSection />
      <MealPlanSection />
      <BenefitsSection />
      <Footer />
    </div>
  )
}

