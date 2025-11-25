"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, ChevronRight, Target, Calendar, Clock, Dumbbell, Info } from "lucide-react"
import { generatePDF } from "@/lib/pdf-service"
import { cn } from "@/lib/utils" // Assuming you have a cn utility, otherwise remove this and use template literals

interface WorkoutPlanDisplayProps {
  plan: any
  onBack: () => void
}

export default function WorkoutPlanDisplay({ plan, onBack }: WorkoutPlanDisplayProps) {
  const [activeDay, setActiveDay] = useState("day1")

  const handleDownloadPDF = () => {
    generatePDF(plan, "workout")
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-10">
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack} 
          className="text-gray-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <p className="text-sm font-semibold text-white">Your Plan</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDownloadPDF}
          className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Hero Summary */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {plan.summary.goal} Protocol
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto sm:mx-0">
            {plan.overview}
          </p>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <SummaryItem icon={Target} label="Goal" value={plan.summary.goal} color="emerald" />
            <SummaryItem icon={Calendar} label="Freq" value={`${plan.summary.daysPerWeek}x/week`} color="blue" />
            <SummaryItem icon={Clock} label="Time" value={`${plan.summary.sessionLength} min`} color="purple" />
            <SummaryItem icon={Dumbbell} label="Level" value={plan.summary.level} color="orange" />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="day1" value={activeDay} onValueChange={setActiveDay} className="w-full">
          {/* Sticky Tabs Navigation */}
          <div className="sticky top-[60px] z-10 -mx-4 px-4 bg-gray-950/95 pb-4 pt-2 mb-4 border-b border-gray-800/50 overflow-x-auto no-scrollbar">
            <TabsList className="bg-gray-900/50 p-1 h-auto inline-flex w-full sm:w-auto">
              {Object.keys(plan.workouts).map((day, index) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="flex-1 sm:flex-none py-2 px-4 text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Day {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(plan.workouts).map(([day, workout]: [string, any]) => (
            <TabsContent key={day} value={day} className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Focus Header */}
              <div className="bg-gradient-to-br from-emerald-900/20 to-gray-900 border border-emerald-900/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 uppercase text-[10px] tracking-wider">
                    Focus
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{workout.focus}</h3>
                <p className="text-gray-400 text-sm">{workout.description}</p>
              </div>

              {/* Exercise List - CLEAN UI (No Nested Cards) */}
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/60 flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-300">Routine</h4>
                  <span className="text-xs text-gray-500">{workout.exercises.length} Exercises</span>
                </div>
                
                <div className="divide-y divide-gray-800/50">
                  {workout.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="p-4 hover:bg-gray-800/30 transition-colors relative group">
                      <div className="flex items-start gap-4">
                        {/* Number Badge */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:bg-emerald-900/50 group-hover:text-emerald-400 transition-colors">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-base font-medium text-white truncate pr-2">{exercise.name}</h5>
                          </div>
                          
                          {/* Metrics Row */}
                          <div className="flex flex-wrap gap-2">
                            <MetricPill label="Sets" value={exercise.sets} color="emerald" />
                            <MetricPill label="Reps" value={exercise.reps} color="blue" />
                            <MetricPill label="Rest" value={exercise.rest} color="gray" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              {workout.notes && workout.notes.length > 0 && (
                <div className="bg-blue-950/10 border border-blue-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3 text-blue-400">
                    <Info className="h-4 w-4" />
                    <h4 className="text-sm font-semibold">Trainer Notes</h4>
                  </div>
                  <ul className="space-y-2">
                    {workout.notes.map((note: string, index: number) => (
                      <li key={index} className="text-gray-400 text-sm flex items-start gap-2 pl-1">
                        <span className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

// Sub-components for cleaner code
function SummaryItem({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    emerald: "text-emerald-400 bg-emerald-950/30 border-emerald-900/50",
    blue: "text-blue-400 bg-blue-950/30 border-blue-900/50",
    purple: "text-purple-400 bg-purple-950/30 border-purple-900/50",
    orange: "text-orange-400 bg-orange-950/30 border-orange-900/50",
  }
  
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${colors[color]}`}>
      <Icon className="h-5 w-5 mb-2 opacity-80" />
      <p className="text-[10px] uppercase tracking-wider opacity-70">{label}</p>
      <p className="text-sm font-semibold text-white capitalize truncate w-full text-center">{value}</p>
    </div>
  )
}

function MetricPill({ label, value, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-950/50 text-emerald-300 border-emerald-900/50",
    blue: "bg-blue-950/50 text-blue-300 border-blue-900/50",
    gray: "bg-gray-800/50 text-gray-300 border-gray-700/50",
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colors[color]}`}>
      <span className="opacity-50 mr-1.5 text-[10px] uppercase">{label}</span>
      {value}
    </span>
  )
}