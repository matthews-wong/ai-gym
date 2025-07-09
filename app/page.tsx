"use client"

import React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Dumbbell, Utensils, Zap, Trophy, Heart, BarChart3, Target, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

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

const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => {
  const [isInView, setIsInView] = React.useState(false)
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true)
          setHasAnimated(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px',
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasAnimated])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{ 
        transitionDelay: hasAnimated ? `${delay}ms` : "0ms",
        willChange: hasAnimated ? 'auto' : 'opacity, transform'
      }}
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

// Optimized background - loads after critical content
const EnhancedBackground = () => {
  const [mounted, setMounted] = useState(false)
  const [shouldLoadBackground, setShouldLoadBackground] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Delay background loading to prioritize LCP
    const timer = setTimeout(() => {
      setShouldLoadBackground(true)
    }, 1000) // Load background after 1 second

    return () => clearTimeout(timer)
  }, [])

  // Return minimal background immediately for better LCP
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Critical base gradient - loads immediately for LCP */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-gray-950 to-emerald-900" />

      {/* Non-critical animated elements - load after LCP */}
      {mounted && shouldLoadBackground && (
        <>
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
            {Array.from({ length: window.innerWidth < 768 ? 15 : 30 }).map((_, i) => (
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
        </>
      )}
    </div>
  )
}

const LottiePlayer = ({ src, className = "" }: { src: string; className?: string }) => {
  const [mounted, setMounted] = React.useState(false)
  const [key, setKey] = React.useState(0)
  const [showSpinner, setShowSpinner] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const resizeTimeoutRef = React.useRef<NodeJS.Timeout>()
  const loadTimeoutRef = React.useRef<NodeJS.Timeout>()

  // Intersection Observer for lazy loading
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px 0px',
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Debounced resize handler to prevent excessive reloads
  React.useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        if (window.innerWidth !== undefined) {
          setShowSpinner(true)
          setIsLoaded(false)
          
          setTimeout(() => {
            setKey((prev) => prev + 1)
            setShowSpinner(false)
          }, 200)
        }
      }, 300) // Debounce resize events
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [])

  // Cleanup timeouts
  React.useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current)
    }
  }, [])

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="relative">
        <div className="w-12 h-12 border-3 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-b-cyan-400 rounded-full animate-spin animate-reverse" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )

  // Error fallback component
  const ErrorFallback = () => (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/20">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div className="text-emerald-400 font-semibold text-sm">AI Fitness Coach</div>
        <div className="text-emerald-300/60 text-xs mt-1">Interactive Experience</div>
      </div>
    </div>
  )

  // Initial mount loading state
  if (!mounted || !isInView) {
    return (
      <div ref={containerRef} className={`flex items-center justify-center ${className}`}>
        <LoadingSpinner />
      </div>
    )
  }

  // Show spinner during resize
  if (showSpinner) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LoadingSpinner />
      </div>
    )
  }

  // Show error fallback
  if (hasError) {
    return (
      <div className={className}>
        <ErrorFallback />
      </div>
    )
  }

  // Lazy load the Lottie component
  const DotLottieReact = React.lazy(() =>
    import("@lottiefiles/dotlottie-react").then((module) => ({
      default: module.DotLottieReact,
    })).catch(() => {
      setHasError(true)
      return { default: () => <ErrorFallback /> }
    })
  )

  return (
    <div 
      ref={containerRef}
      className={`${className} relative`} 
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <React.Suspense fallback={<LoadingSpinner />}>
        <DotLottieReact 
          key={key} 
          src={src} 
          loop 
          autoplay 
          style={{ width: "100%", height: "100%" }}
          onLoad={() => {
            setIsLoaded(true)
            setHasError(false)
          }}
          onError={() => {
            setHasError(true)
            setIsLoaded(false)
          }}
        />
      </React.Suspense>
      
      {/* Loading overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}

const ProductHuntBadge = ({ className = "" }: { className?: string }) => (
  <a
    href="https://www.producthunt.com/products/ai-gymbro?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ai&#0045;gymbro"
    target="_blank"
    rel="noopener noreferrer"
    className={`group ${className}`}
  >
    <div className="relative p-1 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-lg hover:from-emerald-500/50 hover:to-cyan-500/50 transition-all duration-300">
      <img 
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=985744&theme=dark&t=1752051355451" 
        alt="AI GymBRO - Personalized meal & workout plans powered by AI | Product Hunt" 
        className="w-[250px] h-[54px] hover:scale-105 transition-transform duration-300 rounded-md"
        width="250" 
        height="54" 
      />
    </div>
  </a>
);

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced hero background with better gradients */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Gym Background"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          sizes="100vw"
        />
        {/* Enhanced multi-layered overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-gray-900/80 to-gray-950/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-cyan-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Enhanced transition gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent z-10" />

      {/* Main content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium mb-8 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                Powered by Advanced AI Technology
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              {/* Enhanced title with better typography */}
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
              {/* Enhanced copywriting with improved highlights */}
              <div className="text-lg sm:text-xl md:text-2xl lg:text-xl mb-8 lg:mb-10 text-gray-100 leading-relaxed">
                <p className="mb-6 font-light">
                  Meet your{" "}
                  <span className="inline-block text-emerald-400 font-semibold bg-emerald-400/15 px-3 py-1 mx-1 my-1 rounded-lg border border-emerald-400/30 hover:bg-emerald-400/25 hover:border-emerald-400/50 transition-all duration-300 text-lg sm:text-lg md:text-xl lg:text-xl whitespace-nowrap shadow-lg shadow-emerald-500/10">
                    AI-powered fitness coach
                  </span>{" "}
                  and{" "}
                  <span className="inline-block text-cyan-400 font-semibold bg-cyan-400/15 px-3 py-1 mx-1 my-1 rounded-lg border border-cyan-400/30 hover:bg-cyan-400/25 hover:border-cyan-400/50 transition-all duration-300 text-lg sm:text-lg md:text-xl lg:text-xl whitespace-nowrap shadow-lg shadow-cyan-500/10">
                    nutrition expert
                  </span>
                </p>
              </div>
            </FadeIn>

            {/* Mobile Lottie - Optimized for mobile */}
            <div className="lg:hidden mb-12">
              <FadeIn delay={350}>
                <LottiePlayer src="/lottie/hero.lottie" className="w-full h-[250px] mx-auto" />
              </FadeIn>
            </div>

            <FadeIn delay={400}>
              {/* Enhanced button and Product Hunt badge layout */}
              <div className="flex flex-col lg:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start max-w-2xl mx-auto lg:mx-0">
                <EnhancedButton
                  primary
                  href="#products"
                  size="xl"
                  className="w-full sm:w-auto group relative overflow-hidden"
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
                  <span className="relative z-10">
                    Start Your Transformation
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </EnhancedButton>

                {/* Product Hunt Badge - Desktop: beside button */}
                <div className="hidden lg:block">
                  <ProductHuntBadge />
                </div>
              </div>

              {/* Product Hunt Badge - Mobile: below button */}
              <div className="lg:hidden mt-6 flex justify-center">
                <ProductHuntBadge />
              </div>
            </FadeIn>

            {/* Enhanced feature points */}
            <FadeIn delay={500}>
              <div className="hidden sm:flex mt-16 text-sm text-gray-400 items-center justify-center lg:justify-start gap-6 flex-wrap">
                <div className="flex items-center gap-2 group">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-emerald-300 transition-colors">Unlock Progress</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-cyan-300 transition-colors">Eat Smarter</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-emerald-300 transition-colors">Real Results</span>
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

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}

// Product cards section
function ProductsSection() {
  return (
    <section id="products" className="relative py-8 sm:py-12 md:py-16 lg:py-20" style={{ scrollMarginTop: "80px" }}>
      {/* Gradient background - solid at top, transparent from 50% down */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-transparent"
        style={{ background: "linear-gradient(to bottom, rgb(3, 7, 18) 0%, rgb(3, 7, 18) 50%, transparent 100%)" }}
      />

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
                    loading="lazy"
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
                    loading="lazy"
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
                {/* Enhanced Report Preview - Fixed aspect ratio for PDF screenshots */}
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
                        src="/images/meal-plan-example.webp"
                        alt="Workout Report Preview"
                        width={400}
                        height={500}
                        className="w-full rounded-lg group-hover:scale-[1.02] transition-all duration-500"
                        style={{ aspectRatio: "4/5" }}
                        loading="lazy"
                      />
                      {/* Lighter overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent rounded-xl" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-emerald-500/40 shadow-lg">
                          <div className="text-emerald-700 font-semibold text-sm mb-1">Advanced Analytics</div>
                          <div className="text-gray-800 text-xs">Complete workout breakdown with progress tracking</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Target className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 text-xs">Goal-oriented programming</span>
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
                    {/* Weekly Schedule with Recharts */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-emerald-500/25 p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Weekly Schedule
                      </h3>
                      <div className="text-xs text-gray-400 mb-2 italic">
                        This is example data - we will generate yours based on your given data
                      </div>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { day: "Mon", intensity: 85, type: "Upper" },
                              { day: "Tue", intensity: 75, type: "Lower" },
                              { day: "Wed", intensity: 90, type: "Push" },
                              { day: "Thu", intensity: 80, type: "Pull" },
                              { day: "Fri", intensity: 70, type: "Core" },
                              { day: "Sat", intensity: 20, type: "Rest" },
                              { day: "Sun", intensity: 30, type: "Rest" },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                              dataKey="day"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#9CA3AF", fontSize: 12 }}
                            />
                            <YAxis hide />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "1px solid #10B981",
                                borderRadius: "8px",
                                color: "#FFFFFF",
                              }}
                              formatter={(value, name) => [
                                name === "intensity" ? `${value}% Intensity` : value,
                                name === "intensity" ? "Workout" : "Type",
                              ]}
                            />
                            <Bar dataKey="intensity" fill="url(#workoutGradient)" radius={[4, 4, 0, 0]} />
                            <defs>
                              <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" />
                                <stop offset="100%" stopColor="#06B6D4" />
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Exercise Stats */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-emerald-500/25 p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Exercise Distribution
                      </h3>
                      <div className="text-xs text-gray-400 mb-2 italic">
                        This is example data - we will generate yours based on your given data
                      </div>
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

                    {/* Progress Metrics - Reduced gaps */}
                    <div className="md:col-span-2 bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-emerald-500/25 p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Progress Tracking Dashboard
                      </h3>
                      <div className="text-xs text-gray-400 mb-2 italic">
                        This is example data - we will generate yours based on your given data
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
                            className={`${metric.bg} rounded-lg p-3 border hover:border-emerald-500/40 transition-all duration-300 cursor-pointer hover:scale-105`}
                          >
                            <div className="text-xs sm:text-sm text-gray-400 mb-1 font-medium">{metric.label}</div>
                            <div className={`text-lg sm:text-2xl font-bold ${metric.color}`}>{metric.value}</div>
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
                {/* Enhanced Report Preview - Fixed aspect ratio for PDF screenshots */}
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
                        src="/images/meal-plan-example.webp"
                        alt="Meal Plan Report Preview"
                        width={400}
                        height={500}
                        className="w-full rounded-lg group-hover:scale-[1.02] transition-all duration-500"
                        style={{ aspectRatio: "4/5" }}
                        loading="lazy"
                      />
                      {/* Lighter overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 via-transparent to-transparent rounded-xl" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-cyan-500/40 shadow-lg">
                          <div className="text-cyan-700 font-semibold text-sm mb-1">Nutrition Analytics</div>
                          <div className="text-gray-800 text-xs">Complete meal breakdown with macro tracking</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Utensils className="w-3 h-3 text-cyan-600" />
                            <span className="text-cyan-700 text-xs">Personalized meal planning</span>
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
                    {/* Interactive Macronutrient Distribution with Recharts */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl border border-cyan-500/25 p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Macro Distribution
                      </h3>
                      <div className="text-xs text-gray-400 mb-4 italic">
                        This is example data - we will generate yours based on your given data
                      </div>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Protein", value: 40 },
                                { name: "Carbs", value: 35 },
                                { name: "Fats", value: 25 },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              <Cell fill="#0ea5e9" />
                              <Cell fill="#06b6d4" />
                              <Cell fill="#0891b2" />
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "1px solid #06B6D4",
                                borderRadius: "8px",
                                color: "#FFFFFF",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                              }}
                              formatter={(value, name) => [
                                <span
                                  key={`${name}-value`}
                                  style={{
                                    color: name === "Protein" ? "#0ea5e9" : name === "Carbs" ? "#06b6d4" : "#0891b2",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {value}%
                                </span>,
                                <span key={`${name}-name`} style={{ color: "#FFFFFF", fontWeight: "600" }}>
                                  {name}
                                </span>,
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between hover:bg-gray-700/30 p-2 rounded-lg transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
                            <span className="text-white text-sm font-medium hover:text-cyan-300 transition-colors">
                              Protein
                            </span>
                          </div>
                          <span className="text-cyan-400 text-sm font-bold">40%</span>
                        </div>
                        <div className="flex items-center justify-between hover:bg-gray-700/30 p-2 rounded-lg transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
                            <span className="text-white text-sm font-medium hover:text-cyan-300 transition-colors">
                              Carbs
                            </span>
                          </div>
                          <span className="text-cyan-400 text-sm font-bold">35%</span>
                        </div>
                        <div className="flex items-center justify-between hover:bg-gray-700/30 p-2 rounded-lg transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#0891b2]"></div>
                            <span className="text-white text-sm font-medium hover:text-cyan-300 transition-colors">
                              Fats
                            </span>
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
                      <div className="text-xs text-gray-400 mb-2 italic">
                        This is example data - we will generate yours based on your given data
                      </div>
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
                      <div className="text-xs text-gray-400 mb-2 italic">
                        This is example data - we will generate yours based on your given data
                      </div>
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
