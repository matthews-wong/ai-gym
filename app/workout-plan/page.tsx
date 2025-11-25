"use client"

import { useState, useEffect } from "react"
import { Dumbbell, Sparkles, BrainCircuit, Target, ArrowRight } from "lucide-react"
import WorkoutPlanForm from "@/components/workout-plan-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// --- 1. THE AI PROCESSING MODAL (Unchanged) ---
const AIProcessingModal = ({ isOpen }: { isOpen: boolean }) => {
  const [textIndex, setTextIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const loadingTexts = [
    "Analyzing your body metrics...",
    "Scanning exercise database...",
    "Calculating volume & intensity...",
    "Optimizing for your equipment...",
    "Finalizing your personalized plan..."
  ]

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setTextIndex(0)
      return
    }

    const timer = setTimeout(() => setProgress(100), 100)
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev))
    }, 1200)

    return () => {
      clearTimeout(timer)
      clearInterval(textInterval)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div className="relative w-full max-w-md p-6 mx-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-500/20 rounded-full blur-[60px] animate-pulse"></div>
        <div className="relative bg-gray-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-pulse"></div>
              <div className="relative h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center border border-emerald-500/50">
                <BrainCircuit className="h-8 w-8 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Building Your Plan</h3>
              <p className="text-emerald-400 text-sm font-medium h-5 transition-all duration-300">
                {loadingTexts[textIndex]}
              </p>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all ease-out"
                style={{ width: `${progress}%`, transitionDuration: '6000ms' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- 2. THE MAIN PAGE ---
export default function WorkoutPlanPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFormSubmit = (data: any) => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      alert("Plan Generated Successfully!")
    }, 6000)
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 selection:bg-emerald-500/30 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10"></div>

      <AIProcessingModal isOpen={isGenerating} />

      <div className="relative z-10 container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            <span>AI Personal Trainer</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Create Your Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              Workout Routine
            </span>
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
             No more generic PDFs. Get a science-based workout plan tailored specifically to your body type and schedule.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Side: Benefits (Context) */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
             <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm sticky top-8">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  What you'll get
                </h3>
                <ul className="space-y-4">
                  {[
                    { title: "Personalized Split", desc: "PPL, Upper/Lower, or Full Body" },
                    { title: "Equipment Aware", desc: "Using only what you have access to" },
                    { title: "Progressive Overload", desc: "Exact sets, reps, and weight guides" }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-gray-200 text-sm font-medium">{item.title}</p>
                        <p className="text-gray-500 text-xs">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          {/* Right Side: The Form */}
          <div className="lg:col-span-8">
            <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-xl shadow-2xl">
              
              {/* --- UPDATED HEADER SECTION --- */}
              <CardHeader className="border-b border-gray-800 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">Customize Your Plan</CardTitle>
                    <CardDescription className="text-gray-400 mt-1.5">
                      Tell us about your goals and equipment so we can build the perfect routine for you.
                    </CardDescription>
                  </div>
                  {/* Visual decoration */}
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <ArrowRight className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-8">
                <WorkoutPlanForm onSubmit={handleFormSubmit} />
              </CardContent>
            </Card>
            
            <p className="text-center text-gray-600 text-xs mt-6">
              AI GymBRO creates plans based on current sports science research.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}