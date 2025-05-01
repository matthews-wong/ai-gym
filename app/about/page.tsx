"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, Award, Clock, CheckCircle, Heart, Dumbbell, Zap, Star, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

// Animation keyframes as a style element that will be injected
const animationKeyframes = `
@keyframes float {
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-20px) translateX(10px); }
  100% { transform: translateY(0px) translateX(0px); }
}

@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 0.4; }
  100% { transform: scale(1); opacity: 0.8; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
`

// Enhanced 3D background component
const EnhancedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-black bg-[radial-gradient(circle_at_center,rgba(0,220,130,0.18),transparent_80%)]" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,200,255,0.12),transparent_70%)]" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(100,0,255,0.08),transparent_70%)]" />
      <div className="absolute inset-0 overflow-hidden">
        <DynamicElements />
      </div>
    </div>
  )
}

// Dynamic background elements with enhanced animations
const DynamicElements = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {}
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Enhanced floating orbs with more varied movement */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 400 + 200}px`,
            height: `${Math.random() * 400 + 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.25 + 0.05,
            background: `radial-gradient(circle at center, ${
              ["rgba(16,185,129,0.4)", "rgba(6,182,212,0.4)", "rgba(59,130,246,0.4)", "rgba(124,58,237,0.3)"][
                Math.floor(Math.random() * 4)
              ]
            }, transparent)`,
            transform: `scale(${Math.random() + 0.5})`,
            filter: `blur(${Math.random() * 60 + 100}px)`,
            animation: `float ${Math.random() * 30 + 40}s ease-in-out infinite ${Math.random() * 10}s alternate`,
          }}
        />
      ))}

      {/* Enhanced grid lines with subtle glow effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Subtle particle effect */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
        }}
      />
    </>
  )
}

// Enhanced animation component
interface EnhancedAnimationProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  className?: string
}

const EnhancedAnimation = ({
  children,
  delay = 0,
  duration = 1000,
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

// Enhanced button component
interface EnhancedButtonProps {
  children: React.ReactNode
  primary?: boolean
  href: string
  className?: string
  size?: "default" | "lg" | "xl"
}

const EnhancedButton = ({ children, primary = false, href, className = "", size = "default" }: EnhancedButtonProps) => {
  const sizeClasses = {
    default: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-6",
    xl: "text-lg py-3 px-8",
  }

  return (
    <Link href={href} className={`group relative w-full sm:w-auto ${className}`}>
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50 blur-sm transition-all duration-500 group-hover:opacity-70 group-hover:blur-md" />
      <Button
        className={`relative w-full font-semibold ${sizeClasses[size]} ${
          primary
            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0"
            : "bg-gray-900/80 hover:bg-gray-800 text-white border border-emerald-500/30 hover:border-emerald-400"
        } transition-all duration-300`}
      >
        {children}
      </Button>
    </Link>
  )
}

// Team member card component
interface TeamMemberProps {
  name: string
  role: string
  bio: string
  imageSrc: string
  delay?: number
}

const TeamMember = ({ name, role, bio, imageSrc, delay = 0 }: TeamMemberProps) => {
  return (
    <EnhancedAnimation delay={delay}>
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur-md"></div>
        <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 group-hover:border-emerald-500/30 transition-all duration-300 h-full flex flex-col">
          <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 p-0.5 rounded-full z-10"></div>
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={name}
              width={96}
              height={96}
              className="w-full h-full object-cover object-center rounded-full relative z-0 transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <h3 className="text-xl font-bold mb-1 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {name}
          </h3>

          <div className="flex items-center justify-center mb-4">
            <span className="inline-block h-0.5 w-8 bg-gradient-to-r from-emerald-500 to-cyan-500 mr-2"></span>
            <p className="text-emerald-400 font-medium text-sm">{role}</p>
            <span className="inline-block h-0.5 w-8 bg-gradient-to-r from-cyan-500 to-emerald-500 ml-2"></span>
          </div>

          <p className="text-gray-300 text-center flex-grow">{bio}</p>

          <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 group-hover:w-full mx-auto"></div>
        </div>
      </div>
    </EnhancedAnimation>
  )
}

// Timeline item component
interface TimelineItemProps {
  year: string
  title: string
  description: string
  icon: React.ElementType
  delay?: number
}

const TimelineItem = ({ year, title, description, icon: Icon, delay = 0 }: TimelineItemProps) => {
  return (
    <EnhancedAnimation delay={delay}>
      <div className="relative pl-10 pb-10 last:pb-0">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-cyan-500 opacity-30"></div>

        {/* Icon */}
        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-gray-800 hover:border-emerald-500/30 transition-all duration-300">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-2">
            {year}
          </div>
          <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {title}
          </h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
    </EnhancedAnimation>
  )
}

// Testimonial component
interface TestimonialProps {
  quote: string
  author: string
  role: string
  rating: number
  delay?: number
}

const Testimonial = ({ quote, author, role, rating, delay = 0 }: TestimonialProps) => {
  return (
    <EnhancedAnimation delay={delay}>
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur-md"></div>
        <div className="relative bg-gray-900/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 group-hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
            ))}
          </div>

          <p className="text-gray-300 mb-6 italic">"{quote}"</p>

          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white">{author}</h4>
              <p className="text-sm text-emerald-400">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </EnhancedAnimation>
  )
}

// Stats component
interface StatProps {
  value: string
  label: string
  icon: React.ElementType
  delay?: number
}

const Stat = ({ value, label, icon: Icon, delay = 0 }: StatProps) => {
  return (
    <EnhancedAnimation delay={delay}>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-30 transition duration-500 blur-md"></div>
        <div className="relative bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 group-hover:border-emerald-500/30 transition-all duration-300 flex flex-col items-center">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
            <Icon className="w-7 h-7 text-emerald-400" />
          </div>

          <h3 className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            {value}
          </h3>

          <p className="text-gray-300 text-center">{label}</p>
        </div>
      </div>
    </EnhancedAnimation>
  )
}

// Main About Us component
export default function AboutUs() {
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
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden py-16 px-4">
      <EnhancedBackground />

      {/* Hero Section */}
      <div className="text-center px-4 sm:px-6 max-w-5xl mx-auto pt-8 mb-20">
        <EnhancedAnimation delay={0}>
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Our Story
            </span>
          </div>
        </EnhancedAnimation>

        <EnhancedAnimation delay={100}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 sm:mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">
              About AI GymBRO
            </span>
          </h1>
        </EnhancedAnimation>

        <EnhancedAnimation delay={200}>
          <p className="text-xl sm:text-2xl mb-8 sm:mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make personalized fitness and nutrition accessible to everyone through the power of
            artificial intelligence.
          </p>
        </EnhancedAnimation>
      </div>

      {/* Our Mission Section */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-24">
        <EnhancedAnimation delay={300}>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-20 blur-lg"></div>
            <div className="relative bg-gray-900/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-emerald-500/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

              <div className="grid md:grid-cols-2 gap-10 items-center relative">
                <div>
                  <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
                    Our Mission
                  </div>
                  <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Democratizing Fitness Through AI
                  </h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    At AI GymBRO, we believe that everyone deserves access to high-quality, personalized fitness and
                    nutrition guidance. Our mission is to leverage cutting-edge artificial intelligence to make
                    expert-level coaching accessible to all, regardless of budget or location.
                  </p>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    We're committed to breaking down barriers to fitness by providing customized workout and meal plans
                    that adapt to your unique needs, preferences, and constraints. Our AI-powered platform delivers the
                    personalization of a private coach at a fraction of the cost.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <EnhancedButton primary href="/workout-plan" size="lg">
                      Try It Now <ArrowRight className="ml-2 h-5 w-5" />
                    </EnhancedButton>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl opacity-50 blur-lg"></div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-emerald-500/30">
                    <Image
                      src="/images/mission.png"
                      alt="Our Mission"
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">AI-Powered Fitness</span>
                      </div>
                      <p className="text-white text-lg font-medium">Personalized plans for everyone</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EnhancedAnimation>
      </div>

      {/* Our Values Section */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-24">
        <EnhancedAnimation delay={400}>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
              <span className="flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2" />
                Our Core Values
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Our values shape everything we do, from product development to customer support
            </p>
          </div>
        </EnhancedAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <EnhancedAnimation delay={500}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur-md"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 group-hover:border-emerald-500/30 transition-all duration-300 h-full">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Accessibility
                </h3>
                <p className="text-gray-300">
                  We believe quality fitness guidance should be available to everyone, regardless of budget or location.
                  Our platform makes expert-level coaching accessible to all.
                </p>
              </div>
            </div>
          </EnhancedAnimation>

          <EnhancedAnimation delay={600}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur-md"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 group-hover:border-emerald-500/30 transition-all duration-300 h-full">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
                  <Dumbbell className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Personalization
                </h3>
                <p className="text-gray-300">
                  We understand that every body is different. Our AI creates truly personalized plans that adapt to your
                  unique needs, preferences, and constraints.
                </p>
              </div>
            </div>
          </EnhancedAnimation>

          <EnhancedAnimation delay={700}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur-md"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 group-hover:border-emerald-500/30 transition-all duration-300 h-full">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Innovation
                </h3>
                <p className="text-gray-300">
                  We're constantly pushing the boundaries of what's possible with AI in fitness. Our platform evolves
                  with the latest research and technology to deliver the best results.
                </p>
              </div>
            </div>
          </EnhancedAnimation>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-24">
        <EnhancedAnimation delay={800}>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
              <span className="flex items-center justify-center">
                <Users className="w-4 h-4 mr-2" />
                Meet Our Team
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              The Minds Behind AI GymBRO
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Our diverse team of experts is passionate about combining fitness science with cutting-edge AI technology
            </p>
          </div>
        </EnhancedAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TeamMember
            name="Matthews Wong"
            role="Founder & Lead Developer"
            bio="Fitness enthusiast and AI specialist with a passion for making expert-level fitness guidance accessible to everyone."
            imageSrc="/images/profile-pic.png"    
            delay={900}
          />
          
        </div>
      </div>

      {/* Our Journey Section */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-24">
        <EnhancedAnimation delay={1200}>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
              <span className="flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2" />
                Our Journey
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              The Evolution of AI GymBRO
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              From idea to reality: how we're transforming the fitness industry with AI
            </p>
          </div>
        </EnhancedAnimation>

        <div className="max-w-3xl mx-auto">
          <TimelineItem
            year="2021"
            title="The Idea Takes Shape"
            description="Matthews Wong, frustrated by the lack of affordable, personalized fitness guidance, envisions an AI-powered solution that can deliver expert-level coaching to everyone."
            icon={Sparkles}
            delay={1300}
          />
          <TimelineItem
            year="2022"
            title="Research & Development"
            description="Our team begins developing the core AI algorithms, collaborating with fitness experts and nutritionists to ensure the platform delivers truly effective, science-based recommendations."
            icon={Zap}
            delay={1400}
          />
          <TimelineItem
            year="2023"
            title="Beta Launch"
            description="AI GymBRO launches in beta with a small group of users, gathering valuable feedback and continuously improving the platform's recommendations and user experience."
            icon={Award}
            delay={1500}
          />
          <TimelineItem
            year="2024"
            title="Public Release"
            description="After months of refinement, AI GymBRO officially launches to the public, making personalized fitness and nutrition guidance accessible to thousands of users worldwide."
            icon={CheckCircle}
            delay={1600}
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-24">
        <EnhancedAnimation delay={1700}>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
              <span className="flex items-center justify-center">
                <Award className="w-4 h-4 mr-2" />
                Our Impact
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              AI GymBRO By The Numbers
            </h2>
          </div>
        </EnhancedAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat value="10,000+" label="Active Users" icon={Users} delay={1800} />
          <Stat value="50,000+" label="Workout Plans Generated" icon={Dumbbell} delay={1850} />
          <Stat value="35,000+" label="Meal Plans Created" icon={Heart} delay={1900} />
          <Stat value="92%" label="User Satisfaction" icon={Award} delay={1950} />
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-24">
        <EnhancedAnimation delay={2000}>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
              <span className="flex items-center justify-center">
                <Users className="w-4 h-4 mr-2" />
                Testimonials
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              What Our Users Say
            </h2>
          </div>
        </EnhancedAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Testimonial
            quote="AI GymBRO has completely transformed my fitness journey. The personalized workout plans adapt perfectly to my busy schedule and limited equipment, and I've seen more progress in 3 months than I did in a year of following generic programs."
            author="Alex Thompson"
            role="Software Engineer"
            rating={5}
            delay={2100}
          />
          <Testimonial
            quote="As someone with dietary restrictions, finding meal plans that work for me has always been a challenge. AI GymBRO created a nutrition plan that perfectly balances my needs while keeping meals interesting and delicious."
            author="Jamie Rodriguez"
            role="Marketing Manager"
            rating={5}
            delay={2150}
          />
          <Testimonial
            quote="The level of personalization is incredible. It feels like having a personal trainer and nutritionist in my pocket, but at a fraction of the cost. I recommend AI GymBRO to everyone I know who's serious about fitness."
            author="Sam Wilson"
            role="Healthcare Professional"
            rating={4}
            delay={2200}
          />
          <Testimonial
            quote="I was skeptical about an AI creating effective workout plans, but I'm completely sold now. The progressive overload is perfectly calibrated, and the variety keeps me engaged. Best fitness investment I've made."
            author="Taylor Kim"
            role="Small Business Owner"
            rating={1}
            delay={2250}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-4xl mx-auto px-4 mb-24">
        <EnhancedAnimation delay={2300}>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-20 blur-lg"></div>
            <div className="relative bg-gray-900/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-emerald-500/20 text-center">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Ready to Transform Your Fitness Journey?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are achieving their fitness goals with AI GymBRO's personalized plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <EnhancedButton primary href="/workout-plan" size="xl">
                  Create Your Workout Plan <ArrowRight className="ml-2 h-5 w-5" />
                </EnhancedButton>
                <EnhancedButton href="/meal-plan" size="xl">
                  Create Your Meal Plan <ArrowRight className="ml-2 h-5 w-5" />
                </EnhancedButton>
              </div>
            </div>
          </div>
        </EnhancedAnimation>
      </div>

      {/* Footer */}
      <EnhancedAnimation delay={2400}>
        <footer className="w-full text-center z-10 pb-8">
          <div className="text-gray-500 text-sm">© {new Date().getFullYear()} AI GymBRO. All rights reserved.</div>
        </footer>
      </EnhancedAnimation>
    </div>
  )
}

