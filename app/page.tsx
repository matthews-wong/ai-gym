"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, type ReactNode } from "react"
import { ArrowRight, Dumbbell, Utensils, Zap, Shield, Trophy, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem } from "@/components/ui/accordion"

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

@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
`

// Enhanced 3D background component with more dynamic elements
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

// More dynamic background elements with enhanced animations
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

      {/* Animated gradient line at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3), transparent)",
          backgroundSize: "200% 100%",
          animation: "shimmer 8s infinite linear",
        }}
      />
    </>
  )
}

// Enhanced animation component with more options
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

// Enhanced button component with more visual effects
interface EnhancedButtonProps {
  children: ReactNode
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

// Enhanced feature card with more interactive elements
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
          className={`absolute -inset-0.5 bg-gradient-to-r ${accentColor} rounded-2xl opacity-0 group-hover:opacity-40 transition duration-500 blur-md`}
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

          {/* Interactive indicator */}
          <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 group-hover:w-full" />
        </div>
      </div>
    </EnhancedAnimation>
  )
}

// Enhanced FAQ Section with more interactive elements
function EnhancedFAQSection() {
  const faqs = [
    {
      question: "How does AI GymBRO create personalized plans?",
      answer:
        "AI GymBRO uses advanced algorithms to analyze your goals, preferences, fitness level, dietary restrictions, and available equipment to create truly personalized workout and meal plans tailored specifically to you.",
    },
    {
      question: "Can I customize my workout plan?",
      answer:
        "You can specify your goals, available equipment, time constraints, and experience level. The AI will generate a plan that works for your specific situation and preferences.",
    },
    {
      question: "Are the meal plans suitable for special diets?",
      answer:
        "Yes, our AI can create meal plans for various dietary preferences including vegetarian, vegan, keto, paleo, and can accommodate food allergies and restrictions.",
    },
    {
      question: "How often should I update my fitness plan?",
      answer:
        "We recommend reviewing and potentially updating your plan every 4-6 weeks to ensure continued progress and to avoid plateaus. As your fitness improves, your plan should evolve with you.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Currently, AI GymBRO is available as a responsive web application that works well on all devices. A dedicated mobile app is in development and will be released soon.",
    },
  ]

  return (
    <EnhancedAnimation delay={900}>
      <div className="mt-24 w-full max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          Frequently Asked Questions
        </h2>
        <Accordion className="w-full space-y-4" type="single">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} title={faq.question} defaultOpen={index === 0}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </EnhancedAnimation>
  )
}

// Enhanced Creator Section with more visual elements
function EnhancedCreatorSection() {
  return (
    <EnhancedAnimation delay={1000}>
      <div className="mt-24 w-full max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          From the Creator
        </h2>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-lg transition duration-500"></div>

          <div className="relative bg-gray-900/60 backdrop-blur-md rounded-2xl border border-emerald-400/20 p-8 shadow-xl shadow-emerald-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-44 h-56 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 p-0.5 rounded-xl z-10"></div>
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent z-20"></div>
                <Image
                  src="/images/profile-pic.png"
                  alt="Matthews Wong"
                  width={176}
                  height={224}
                  className="w-full h-full object-cover object-center relative z-0 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 z-30"></div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-200">
                    Matthews Wong
                  </span>
                </h3>

                <div className="flex items-center justify-center md:justify-start mb-4">
                  <span className="inline-block h-0.5 w-10 bg-gradient-to-r from-emerald-500 to-cyan-500 mr-3"></span>
                  <p className="text-emerald-400 font-medium">Creator and Developer</p>
                </div>

                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Hello! I hope that this platform could help you to have the best meal planner and workout plan
                  tailored to your specific needs and goals.
                </p>

                <Link href="https://matthewswong.tech" target="_blank" rel="noopener noreferrer">
                  <div className="relative inline-block group/btn">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg opacity-60 blur-sm transition-opacity duration-300 group-hover/btn:opacity-80"></div>
                    <Button className="relative bg-gray-900 hover:bg-gray-800 text-white border-0 font-medium px-6 py-2.5 transition-all duration-300">
                      Connect with me
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnhancedAnimation>
  )
}

// Enhanced Hero Section with more dynamic elements
function EnhancedHeroSection() {
  return (
    <div className="text-center px-4 sm:px-6 max-w-5xl mx-auto pt-8">
      <EnhancedAnimation delay={0}>
        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6">
          <span className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Powered by Advanced AI
          </span>
        </div>
      </EnhancedAnimation>

      <EnhancedAnimation delay={100}>
        <h1 className="text-6xl md:text-8xl font-bold mb-6 sm:mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">
            AI Gym<span className="text-white">BRO</span>
          </span>
        </h1>
      </EnhancedAnimation>

      <EnhancedAnimation delay={200}>
        <p className="text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
          Your personal AI trainer and nutritionist. Generate customized workout and meal plans tailored to your
          specific goals and preferences.
        </p>
      </EnhancedAnimation>

      <EnhancedAnimation delay={300}>
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 max-w-lg mx-auto">
          <EnhancedButton primary href="/workout-plan" size="xl">
            Create Workout Plan <ArrowRight className="ml-2 h-5 w-5" />
          </EnhancedButton>
          <EnhancedButton href="/meal-plan" size="xl">
            Create Meal Plan <ArrowRight className="ml-2 h-5 w-5" />
          </EnhancedButton>
        </div>
      </EnhancedAnimation>
    </div>
  )
}

// Enhanced "Why Use This Platform" Section with more interactive elements
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
    <div className="mt-24 z-10 w-full max-w-6xl mx-auto px-4">
      <EnhancedAnimation delay={400}>
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
            <span className="flex items-center justify-center">
              <Heart className="w-4 h-4 mr-2" />
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
        <div className="relative bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 md:p-12 mb-12 overflow-hidden">
          {/* Enhanced background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="max-w-4xl mx-auto relative">
            <div className="flex flex-col items-center justify-center mb-16">
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 backdrop-blur-sm border border-emerald-500/40 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <div
                  className="absolute -inset-4 rounded-full border-2 border-dashed border-emerald-500/20"
                  style={{ animation: "spin-slow 20s linear infinite" }}
                ></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Healthy Lifestyle</h3>
              <p className="text-lg text-gray-300 text-center max-w-2xl">
                AI GymBRO helps you achieve balance with personalized plans that work for your unique body and goals
              </p>
            </div>

            {/* Enhanced Interactive Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`group relative rounded-xl transition-all duration-500 cursor-pointer ${
                    activeIndex === index ? "scale-105 z-10 shadow-xl shadow-emerald-500/10" : "hover:scale-[1.02]"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  style={{
                    boxShadow: activeIndex === index ? "0 0 30px rgba(16, 185, 129, 0.1)" : "none",
                  }}
                >
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 group-hover:border-emerald-500/30 p-6 h-full transition-all duration-300 overflow-hidden">
                    {/* Enhanced decorative corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12">
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${benefit.color} opacity-10 blur-xl transition-all duration-300 ${
                          activeIndex === index ? "scale-125" : "scale-100"
                        }`}
                      ></div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br ${benefit.color} opacity-20 flex items-center justify-center mr-5 transition-all duration-300 ${
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

            {/* Enhanced stats callout */}
            <div className="mt-16 p-6 rounded-xl bg-gradient-to-br from-emerald-900/30 to-cyan-900/20 backdrop-blur-sm border border-emerald-500/20">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full bg-emerald-500/20"
                      style={{ animation: "ping-slow 2s infinite" }}
                    ></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
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

// Enhanced CTA Section with more visual elements
function EnhancedCTASection() {
  return (
    <EnhancedAnimation delay={1100}>
      <div className="mt-24 p-10 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-cyan-900/20 backdrop-blur-md border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
        <h2 className="text-3xl font-bold mb-4 text-white text-center">Ready to transform your fitness journey?</h2>
        <p className="text-gray-300 mb-8 text-center text-lg max-w-2xl mx-auto">
          Start generating your personalized fitness and nutrition plans today with AI GymBRO and achieve your goals
          faster than ever before.
        </p>
        <div className="flex justify-center">
          <EnhancedButton primary href="/workout-plan" size="xl">
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </EnhancedButton>
        </div>
      </div>
    </EnhancedAnimation>
  )
}

// Main component with client-side hydration handling
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
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden py-16 px-4">
      <EnhancedBackground />

      {/* Hero Section */}
      <EnhancedHeroSection />

      {/* Why Use This Platform Section */}
      {isMounted && <EnhancedPlatformSection />}

      {/* Features Section with enhanced design */}
      <div className="mt-20 z-10 w-full max-w-6xl mx-auto px-4">
        <EnhancedAnimation delay={400}>
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Transform Your Fitness Journey
            </span>
          </h2>
        </EnhancedAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <EnhancedFeatureCard
            title="AI-Powered Plans"
            description="Leverage advanced artificial intelligence to create truly personalized fitness and nutrition plans based on your specific needs, goals, and preferences."
            icon={Zap}
            delay={500}
          />
          <EnhancedFeatureCard
            title="Export as PDF"
            description="Download your custom plans as beautifully formatted PDFs to reference anytime, anywhere, on any device - even when offline."
            icon={Shield}
            delay={600}
            accentColor="from-cyan-500 to-blue-400"
          />
          <EnhancedFeatureCard
            title="Detailed Guidance"
            description="Get comprehensive workout routines and meal plans with detailed instructions, tips, and progress tracking to maximize your results."
            icon={Trophy}
            delay={700}
            accentColor="from-purple-500 to-blue-400"
          />
          <EnhancedFeatureCard
            title="Custom Workouts"
            description="Create perfectly tailored workout routines based on your available equipment, experience level, time constraints, and fitness goals."
            icon={Dumbbell}
            delay={800}
          />
          <EnhancedFeatureCard
            title="Nutrition Planning"
            description="Generate meal plans that align with your dietary preferences, restrictions, and macronutrient goals while keeping your meals delicious and varied."
            icon={Utensils}
            delay={850}
            accentColor="from-green-500 to-emerald-400"
          />
          <EnhancedFeatureCard
            title="Health Monitoring"
            description="Track your progress, monitor key health metrics, and receive AI-powered insights to optimize your fitness journey and achieve results faster."
            icon={Heart}
            delay={900}
            accentColor="from-red-500 to-pink-400"
          />
        </div>
      </div>

      {/* FAQ Section */}
      {isMounted && <EnhancedFAQSection />}

      {/* Creator Section */}
      {isMounted && <EnhancedCreatorSection />}

      {/* CTA Section */}
      {isMounted && <EnhancedCTASection />}

      {/* Footer section */}
      <EnhancedAnimation delay={1200}>
        <footer className="mt-24 w-full text-center z-10 pb-8">
          <div className="text-gray-500 text-sm">© {new Date().getFullYear()} AI GymBRO. All rights reserved.</div>
        </footer>
      </EnhancedAnimation>
    </div>
  )
}

