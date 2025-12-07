"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, ChevronDown, ChevronUp, Calendar, Clock, Target, Loader2, Youtube } from "lucide-react"
import { generatePDF } from "@/lib/pdf-service"
import { savePlanToDatabase } from "@/lib/services/planService"

interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
}

interface DayWorkout {
  focus: string
  description?: string
  exercises: Exercise[]
  notes?: string[]
}

interface WorkoutPlanDisplayProps {
  plan: {
    summary: {
      goal: string
      level: string
      daysPerWeek: number
      sessionLength: number
    }
    overview: string
    workouts: Record<string, DayWorkout>
  }
  onBack: () => void
}

export default function WorkoutPlanDisplay({ plan, onBack }: WorkoutPlanDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>("day1")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    const saveToDb = async () => {
      await savePlanToDatabase({
        planType: "workout",
        planData: plan as unknown as Record<string, unknown>,
      })
    }
    saveToDb()
  }, [plan])

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDF(plan, "workout")
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const workoutDays = Object.entries(plan.workouts || {})

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </button>
        </div>

        {/* Plan Header */}
        <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {plan.summary?.goal || "Your"} Workout Plan
          </h1>
          <p className="text-stone-400 text-sm mb-4">{plan.overview || "Personalized workout routine"}</p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-teal-400" />
              <span className="text-stone-300">{plan.summary?.level || "Intermediate"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span className="text-stone-300">{plan.summary?.daysPerWeek || 3} days/week</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-teal-400" />
              <span className="text-stone-300">{plan.summary?.sessionLength || 60} min/session</span>
            </div>
          </div>
        </div>

        {/* Workout Days */}
        <div className="space-y-3">
          {workoutDays.length === 0 ? (
            <div className="bg-stone-900/80 border border-stone-800/50 rounded-xl p-8 text-center">
              <p className="text-stone-400">No workouts found</p>
            </div>
          ) : (
            workoutDays.map(([dayKey, workout]) => {
              const dayNumber = dayKey.replace("day", "")
              const isExpanded = expandedDay === dayKey

              return (
                <div
                  key={dayKey}
                  className="bg-stone-900/80 border border-stone-800/50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : dayKey)}
                    className="w-full flex items-center justify-between p-4 hover:bg-stone-800/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center flex-col">
                        <span className="text-xs text-teal-400/70 leading-none">Day</span>
                        <span className="text-sm font-bold text-teal-400 leading-none">{dayNumber}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{workout.focus || `Workout`}</h3>
                        <p className="text-sm text-stone-500">
                          {workout.exercises?.length || 0} exercises
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-stone-800/50">
                      {workout.description && (
                        <p className="text-stone-400 text-sm py-4">{workout.description}</p>
                      )}

                      <div className="space-y-2">
                        {workout.exercises?.map((exercise, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-stone-800/30 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white">{exercise.name}</p>
                              <div className="text-right">
                                <p className="text-teal-400 font-medium">
                                  {exercise.sets} × {exercise.reps}
                                </p>
                                <p className="text-xs text-stone-600">Rest: {exercise.rest}</p>
                              </div>
                            </div>
                            <a
                              href={`https://youtube.com/results?search_query=How+to+${encodeURIComponent(exercise.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Youtube className="w-3.5 h-3.5" />
                              Watch on YouTube
                            </a>
                          </div>
                        ))}
                      </div>

                      {workout.notes && workout.notes.length > 0 && (
                        <div className="mt-4 p-3 bg-stone-800/20 rounded-lg">
                          <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Notes</p>
                          <ul className="space-y-1">
                            {workout.notes.map((note, idx) => (
                              <li key={idx} className="text-sm text-stone-400">• {note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
