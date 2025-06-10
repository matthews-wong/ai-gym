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
  Users,
  Database,
  Brain,
  CheckCircle,
  Search,
  FileText,
  Cpu,
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

          {/* Right side - Image */}
          <div>
            <FadeIn delay={400}>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="Diverse group of people exercising together in a community gym setting, representing accessibility and inclusivity in fitness"
                  width={500}
                  height={600}
                  className="w-full rounded-2xl shadow-2xl shadow-emerald-500/20"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent rounded-2xl" />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

// How it works section with improved seamless transitions
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
          {/* Step 1: Input Form - Image */}
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

              {/* Image */}
              <div>
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="User interface showing a form with various input fields for fitness goals, dietary preferences, and personal information"
                    width={600}
                    height={400}
                    className="w-full rounded-2xl shadow-2xl shadow-emerald-500/20"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-transparent rounded-2xl" />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 2: AI Processing - Fixed RAG Diagram */}
          <FadeIn delay={500}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:grid-flow-col-dense">
              {/* Content */}
              <div className="lg:col-start-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/25 to-emerald-500/25 flex items-center justify-center border border-cyan-500/30">
                    <Brain className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-cyan-400 font-bold text-lg">Step 2</div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                  AI Processing with RAG
                </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our AI uses Retrieval-Augmented Generation (RAG) to process your data. It retrieves relevant information 
                  from our knowledge base and generates personalized recommendations based on your unique inputs and preferences.
                </p>
              </div>

              {/* Fixed RAG Diagram */}
              <div className="lg:col-start-1">
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                  <div className="w-full h-[400px] relative">
                    {/* RAG Process Flow - Properly aligned */}
                    <div className="flex flex-col items-center h-full justify-between py-4">
                      
                      {/* User Query - Top */}
                      <div className="flex justify-center w-full">
                        <div className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 rounded-lg p-4 text-center min-w-[140px]">
                          <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                          <div className="text-cyan-300 text-sm font-semibold">USER QUERY</div>
                        </div>
                      </div>

                      {/* Arrow Down */}
                      <div className="flex justify-center">
                        <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400/60 to-emerald-400/60"></div>
                      </div>

                      {/* Middle Row - Retrieval and Knowledge Base */}
                      <div className="flex justify-between items-center w-full px-4">
                        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-lg p-4 text-center min-w-[120px]">
                          <Search className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                          <div className="text-emerald-300 text-sm font-semibold">RETRIEVAL</div>
                        </div>
                        
                        {/* Horizontal Arrow */}
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-400/60 to-blue-400/60 mx-4"></div>
                        
                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-4 text-center min-w-[120px]">
                          <Database className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <div className="text-blue-300 text-sm font-semibold">KNOWLEDGE BASE</div>
                        </div>
                      </div>

                      {/* Arrow Down */}
                      <div className="flex justify-center">
                        <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-400/60 to-yellow-400/60"></div>
                      </div>

                      {/* Generation - Bottom */}
                      <div className="flex justify-center w-full">
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-4 text-center min-w-[140px]">
                          <Cpu className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                          <div className="text-yellow-300 text-sm font-semibold">GENERATION</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 3: Data Integration - Fixed Alignment */}
          <FadeIn delay={600}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/25 to-cyan-500/25 flex items-center justify-center border border-emerald-500/30">
                    <Database className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-emerald-400 font-bold text-lg">Step 3</div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                  Data Integration
                </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  We gather insights from TikTok and YouTube influencers, then use RAG (Retrieval-Augmented Generation) 
                  with our healthy food database to ensure you get the most comprehensive and up-to-date recommendations.
                </p>
              </div>

              {/* Fixed Data Integration Animation */}
              <div>
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl p-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                  <div className="w-full h-[400px] relative">
                    {/* Central Hub */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-full border-2 border-emerald-400/50 flex items-center justify-center animate-pulse">
                        <Database className="w-10 h-10 text-emerald-400" />
                      </div>
                      {/* Pulsing rings */}
                      <div className="absolute inset-0 w-20 h-20 border-2 border-emerald-400/20 rounded-full animate-ping" />
                      <div className="absolute -inset-2 w-24 h-24 border border-emerald-400/10 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                    </div>
                    
                    {/* Data sources positioned around the center */}
                    {/* TikTok - Top Left */}
                    <div className="absolute top-8 left-8 bg-gradient-to-r from-pink-500/25 to-pink-600/25 p-4 rounded-xl border border-pink-500/40 backdrop-blur-sm shadow-lg animate-pulse">
                      <div className="text-pink-400 text-sm font-semibold flex items-center gap-2">
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
                        TikTok
                      </div>
                    </div>
                    
                    {/* YouTube - Top Right */}
                    <div className="absolute top-8 right-8 bg-gradient-to-r from-red-500/25 to-red-600/25 p-4 rounded-xl border border-red-500/40 backdrop-blur-sm shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}>
                      <div className="text-red-400 text-sm font-semibold flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                        YouTube
                      </div>
                    </div>
                    
                    {/* Health Sites - Bottom Left */}
                    <div className="absolute bottom-8 left-8 bg-gradient-to-r from-blue-500/25 to-blue-600/25 p-4 rounded-xl border border-blue-500/40 backdrop-blur-sm shadow-lg animate-pulse" style={{ animationDelay: '1s' }}>
                      <div className="text-blue-400 text-sm font-semibold flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                        Health Sites
                      </div>
                    </div>
                    
                    {/* Food DB - Bottom Right */}
                    <div className="absolute bottom-8 right-8 bg-gradient-to-r from-green-500/25 to-green-600/25 p-4 rounded-xl border border-green-500/40 backdrop-blur-sm shadow-lg animate-pulse" style={{ animationDelay: '1.5s' }}>
                      <div className="text-green-400 text-sm font-semibold flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        Food DB
                      </div>
                    </div>
                    
                    {/* Connection lines from each corner to center */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <linearGradient id="connectionGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgba(236, 72, 153, 0.4)" />
                          <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
                        </linearGradient>
                        <linearGradient id="connectionGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
                          <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
                        </linearGradient>
                        <linearGradient id="connectionGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                          <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
                        </linearGradient>
                        <linearGradient id="connectionGradient4" x1="100%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="rgba(34, 197, 94, 0.4)" />
                          <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
                        </linearGradient>
                      </defs>
                      
                      {/* Lines from corners to center */}
                      <line x1="80" y1="60" x2="200" y2="200" stroke="url(#connectionGradient1)" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
                      <line x1="320" y1="60" x2="200" y2="200" stroke="url(#connectionGradient2)" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <line x1="80" y1="340" x2="200" y2="200" stroke="url(#connectionGradient3)" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" style={{ animationDelay: '1s' }} />
                      <line x1="320" y1="340" x2="200" y2="200" stroke="url(#connectionGradient4)" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 4: Results - Image */}
          <FadeIn delay={700}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:grid-flow-col-dense">
              {/* Content */}
              <div className="lg:col-start-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/25 to-emerald-500/25 flex items-center justify-center border border-cyan-500/30">
                    <CheckCircle className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-cyan-400 font-bold text-lg">Step 4</div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                  Personalized Plan
                </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  Receive your customized workout or meal plan, structured and ready to help you achieve your goals. 
                  Your plan is tailored specifically to your inputs, preferences, and objectives.
                </p>
              </div>

              {/* Image */}
              <div className="lg:col-start-1">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Clean, organized meal plan and workout schedule displayed on a tablet or phone screen"
                    width={600}
                    height={400}
                    className="w-full rounded-2xl shadow-2xl shadow-cyan-500/20"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-transparent to-transparent rounded-2xl" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// From the creator section with Next.js Image and proper sizing
function FromTheCreatorSection() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={100}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-sm font-medium mb-6">
                <Heart className="w-4 h-4 text-pink-400" />
                From the Creator
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Meet the Mind
                </span>
                <br />
                <span className="text-white">Behind AI GymBRO</span>
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                  <p>
                    Hi there! I'm the creator of AI GymBRO, and I'm passionate about making fitness and nutrition 
                    accessible to everyone. As someone who has struggled with finding affordable, personalized 
                    fitness guidance, I understand the challenges many people face.
                  </p>
                  
                  <p>
                    <span className="text-emerald-400 font-semibold bg-emerald-400/15 px-3 py-1 rounded-lg border border-emerald-400/30">
                      My mission is simple: democratize fitness planning.
                    </span>
                  </p>
                  
                  <p>
                    I believe that everyone deserves access to structured, personalized fitness and nutrition plans, 
                    regardless of their budget. That's why I built AI GymBRO - to bridge the gap between expensive 
                    personal training and generic one-size-fits-all solutions.
                  </p>
                  
                  <p>
                    This platform represents countless hours of research, development, and testing to ensure 
                    you get the best possible recommendations for your unique goals and lifestyle.
                  </p>
                </div>
              </div>

              {/* Creator photo section with Next.js Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Container - smaller than the image */}
                  <div className="relative w-80 h-96 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden backdrop-blur-sm">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full" />
                    
                    {/* Container content area */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent">
                      <div className="text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">Matthews Wong</h3>
                        <p className="text-emerald-400 text-base font-medium mb-4">Founder & Developer</p>
                        <div className="flex justify-start">
                          <a
                            href="https://www.matthewswong.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
                          >
                            Visit Portfolio
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Founder image - extends outside the container */}
                  <div className="absolute -top-16 -right-8 w-96 h-[500px] rounded-3xl overflow-hidden border-2 border-emerald-400/30 shadow-xl backdrop-blur-sm">
                    <Image
                      src="/founder.png"
                      alt="Matthews Wong - Founder and Developer of AI GymBRO"
                      width={384}
                      height={500}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                  
                  {/* Enhanced drop shadow effect */}
                  <div className="absolute -bottom-6 left-6 right-6 h-12 bg-emerald-500/15 rounded-full blur-2xl" />
                  <div className="absolute -bottom-3 left-8 right-8 h-6 bg-emerald-500/10 rounded-full blur-xl" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// Footer component
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

// Main About page component
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white relative">
      <EnhancedBackground />
      <AboutHeroSection />
      <MissionSection />
      <HowItWorksSection />
      <FromTheCreatorSection />
      <Footer />
    </main>
  )
}

