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
  Target,
  Clock,
  TrendingUp,
  Users,
  Database,
  Brain,
  CheckCircle,
  Search,
  FileText,
  Cpu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
} from "recharts"

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

// Hero section for About page
function AboutHeroSection() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
      {/* Gradient background with seamless transitions */}
      <div className="absolute inset-0">
        {/* Main background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-transparent" />
        {/* Top gradient transition - 20% gradual translucent */}
        <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        {/* Bottom gradient transition - 20% gradual translucent */}
        <div className="absolute bottom-0 left-0 w-full h-[20%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-sm font-medium mb-8 shadow-lg shadow-emerald-500/10">
              <Heart className="w-4 h-4 text-pink-400" />
              About AI GymBRO
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Democratizing
              </span>
              <br />
              <span className="text-white">Fitness & Nutrition</span>
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              AI GymBRO is a web app designed to democratize workout planning and meal planning for everyone. 
              We believe that structured planning should be accessible to all, not just those who can afford premium services.
            </p>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <EnhancedButton primary href="#mission" size="lg">
                Our Mission
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </EnhancedButton>
              <EnhancedButton href="#how-it-works" size="lg">
                How It Works
                <Target className="w-5 h-5" />
              </EnhancedButton>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// Mission section
function MissionSection() {
  return (
    <section id="mission" className="relative py-16 sm:py-20 md:py-24 lg:py-32" style={{ scrollMarginTop: "80px" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div>
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                Our Mission
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Accessible Fitness
                </span>
                <br />
                <span className="text-white">For Everyone</span>
              </h2>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  Usually, personalized workout and meal planning services are expensive and exclusive. 
                  We want to change that by making these essential tools available to everyone, regardless of their budget.
                </p>
                
                <p>
                  <span className="text-emerald-400 font-semibold bg-emerald-400/15 px-3 py-1 rounded-lg border border-emerald-400/30">
                    We are not here to replace nutritionists or workout coaches.
                  </span>
                </p>
                
                <p>
                  We are here to facilitate you so that you can have structured planning, because{" "}
                  <span className="text-cyan-400 font-bold text-xl bg-cyan-400/15 px-3 py-2 rounded-lg border border-cyan-400/30 inline-block my-2">
                    great actions need structured planning
                  </span>
                </p>
                
                <p>
                  Our AI-powered platform provides you with the foundation and structure you need to succeed, 
                  while still encouraging you to work with professionals when needed.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Right side - Enhanced Progress Chart */}
          <div>
            <FadeIn delay={400}>
              <div className="relative bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl overflow-hidden group h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                    Fitness Progress Tracking
                  </h3>
                  <ResponsiveContainer width="100%" height="80%">
                    <AreaChart
                      data={[
                        { month: "Jan", strength: 65, endurance: 45, flexibility: 30 },
                        { month: "Feb", strength: 72, endurance: 52, flexibility: 38 },
                        { month: "Mar", strength: 78, endurance: 58, flexibility: 45 },
                        { month: "Apr", strength: 85, endurance: 65, flexibility: 52 },
                        { month: "May", strength: 90, endurance: 72, flexibility: 58 },
                        { month: "Jun", strength: 95, endurance: 78, flexibility: 65 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="strengthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="enduranceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="flexibilityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '12px',
                          color: 'white'
                        }}
                      />
                      <Area type="monotone" dataKey="strength" stroke="#059669" fill="url(#strengthGradient)" strokeWidth={3} />
                      <Area type="monotone" dataKey="endurance" stroke="#06B6D4" fill="url(#enduranceGradient)" strokeWidth={3} />
                      <Area type="monotone" dataKey="flexibility" stroke="#8B5CF6" fill="url(#flexibilityGradient)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-500 mt-2">*Example data: Simulated fitness progress over 6 months.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

// How it works section with improved seamless transitions and enhanced diagrams
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-20 md:py-24 lg:py-32" style={{ scrollMarginTop: "80px" }}>
      {/* Enhanced gradient background with seamless transitions */}
      <div className="absolute inset-0">
        {/* Main background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-transparent" />
        {/* Top gradient transition - 20% gradual translucent */}
        <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        {/* Bottom gradient transition - 20% gradual translucent */}
        <div className="absolute bottom-0 left-0 w-full h-[20%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-sm font-medium mb-6 shadow-lg shadow-cyan-500/10">
              <Zap className="w-4 h-4" />
              How It Works
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Simple Process,
              </span>
              <br />
              <span className="text-white">Powerful Results</span>
            </h2>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-xl text-gray-300 leading-relaxed">
              Our AI-powered system works the same way for both workout and meal planning, 
              ensuring you get personalized, data-driven recommendations.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-24">
          {/* Step 1: Input Form with Enhanced Visualization */}
          <FadeIn delay={400}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/25 to-cyan-500/25 flex items-center justify-center border border-emerald-500/30">
                    <Target className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-emerald-400 font-bold text-lg">Step 1</div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                  Fill Your Inputs
                </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  Tell us about your goals - whether you're looking for deficit or bulking for meal planning, 
                  or your fitness objectives for workout planning. Our comprehensive form captures all the 
                  details we need to create your personalized plan.
                </p>
              </div>

              {/* Enhanced Input Visualization */}
              <div>
                <div className="relative bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl overflow-hidden group h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      User Input Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height="80%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={[
                        { name: "Goals", value: 85, fill: "#059669" },
                        { name: "Preferences", value: 70, fill: "#06B6D4" },
                        { name: "Restrictions", value: 60, fill: "#8B5CF6" },
                        { name: "Experience", value: 90, fill: "#F59E0B" },
                      ]}>
                        <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '12px',
                            color: 'white'
                          }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-gray-500 mt-2">*Example data: Input completion rates by category.</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 2: AI Processing with Enhanced Visualization */}
          <FadeIn delay={500}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Enhanced AI Processing Visualization */}
              <div className="order-2 lg:order-1">
                <div className="relative bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl overflow-hidden group h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-emerald-900/20 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      AI Processing Pipeline
                    </h4>
                    <ResponsiveContainer width="100%" height="80%">
                      <LineChart data={[
                        { stage: "Input", processing: 20, accuracy: 95 },
                        { stage: "Analysis", processing: 60, accuracy: 88 },
                        { stage: "Generation", processing: 85, accuracy: 92 },
                        { stage: "Optimization", processing: 95, accuracy: 96 },
                        { stage: "Output", processing: 100, accuracy: 98 },
                      ]}>
                        <defs>
                          <linearGradient id="processingGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#06B6D4" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="stage" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '12px',
                            color: 'white'
                          }}
                        />
                        <Line type="monotone" dataKey="processing" stroke="url(#processingGradient)" strokeWidth={4} dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }} />
                        <Line type="monotone" dataKey="accuracy" stroke="#059669" strokeWidth={3} strokeDasharray="5 5" dot={{ fill: '#059669', strokeWidth: 2, r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-gray-500 mt-2">*Example data: AI processing stages and accuracy metrics.</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/25 to-emerald-500/25 flex items-center justify-center border border-cyan-500/30">
                    <Brain className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-cyan-400 font-bold text-lg">Step 2</div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                  AI Processing
                </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Our advanced AI algorithms analyze your inputs using machine learning models trained on 
                  thousands of successful fitness and nutrition plans. The system considers your goals, 
                  preferences, restrictions, and experience level.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>Personalized goal analysis</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span>Dietary restriction consideration</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>Experience-based recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 3: Plan Generation with Enhanced Visualization */}
          <FadeIn delay={600}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/25 to-cyan-500/25 flex items-center justify-center border border-emerald-500/30">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-emerald-400 font-bold text-lg">Step 3</div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                  Get Your Plan
                </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Receive a comprehensive, personalized plan that includes detailed workout routines or 
                  meal plans with nutritional information. Each plan is structured, easy to follow, 
                  and designed to help you achieve your specific goals.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <div className="text-emerald-400 font-bold text-2xl">7-30</div>
                    <div className="text-gray-300 text-sm">Days Coverage</div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <div className="text-cyan-400 font-bold text-2xl">100%</div>
                    <div className="text-gray-300 text-sm">Personalized</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Plan Generation Visualization */}
              <div>
                <div className="relative bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl overflow-hidden group h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-emerald-400" />
                      Plan Effectiveness
                    </h4>
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={[
                        { category: "Workout", effectiveness: 92, satisfaction: 88 },
                        { category: "Nutrition", effectiveness: 89, satisfaction: 91 },
                        { category: "Recovery", effectiveness: 85, satisfaction: 87 },
                        { category: "Progress", effectiveness: 94, satisfaction: 93 },
                      ]}>
                        <defs>
                          <linearGradient id="effectivenessGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#065F46" stopOpacity={0.8} />
                          </linearGradient>
                          <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0891B2" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="category" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '12px',
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="effectiveness" name="Effectiveness %" fill="url(#effectivenessGradient)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="satisfaction" name="Satisfaction %" fill="url(#satisfactionGradient)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-gray-500 mt-2">*Example data: Plan effectiveness and user satisfaction metrics.</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Enhanced CTA Section */}
        <FadeIn delay={700}>
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-md">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                Ready to Start Your Journey?
              </h3>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of users who have transformed their fitness and nutrition with our AI-powered platform.
              </p>
              <EnhancedButton primary href="#" size="lg">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </EnhancedButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <EnhancedBackground />
      <AboutHeroSection />
      <MissionSection />
      <HowItWorksSection />
    </div>
  )
}

