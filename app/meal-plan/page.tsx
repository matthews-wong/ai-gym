"use client"

import { useEffect, useRef } from "react"
import { Utensils, Sparkles } from "lucide-react"
import MealPlanForm from "@/components/meal-plan-form"
import { useAuth } from "@/lib/hooks/useAuth"
import { toast } from "@/components/ui/use-toast"

export default function MealPlanPage() {
  const { user, loading } = useAuth()
  const toastShown = useRef(false)

  useEffect(() => {
    if (!loading && !user && !toastShown.current) {
      toastShown.current = true
      toast({
        variant: "warning",
        title: "Not logged in",
        description: "Your plan will not be saved. Please login to save your meal plan.",
      })
    }
  }, [user, loading])

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#a8a29e05_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e05_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">AI Nutrition Planning</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Create Your{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Meal Plan
            </span>
          </h1>
          
          <p className="text-stone-400 max-w-md mx-auto">
            Tell us about your nutrition goals and we&apos;ll create a 7-day meal plan for you.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-800/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Your Details</h2>
              <p className="text-sm text-stone-500">Fill in the form below</p>
            </div>
          </div>
          
          <MealPlanForm />
        </div>
      </div>
    </div>
  )
}
