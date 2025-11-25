"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, ChevronRight, Target, Calendar, Clock, Dumbbell } from "lucide-react"
import { generatePDF } from "@/lib/pdf-service"

interface WorkoutPlanDisplayProps {
  plan: any
  onBack: () => void
}

export default function WorkoutPlanDisplay({ plan, onBack }: WorkoutPlanDisplayProps) {
  const [activeDay, setActiveDay] = useState("day1")

  const handleDownloadPDF = () => {
    generatePDF(plan, "workout")
  }

  const formatFocusAreas = (areas: string[]) => {
    if (!areas || areas.length === 0) return "Not specified"
    return areas.join(", ")
  }

  const dayCount = Object.keys(plan.workouts).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 -ml-2 sm:ml-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleDownloadPDF}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto shadow-lg shadow-emerald-900/30"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/20 border-emerald-800/50 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-emerald-400/70 mb-1">Goal</p>
                  <p className="text-sm sm:text-base font-semibold text-white capitalize">{plan.summary.goal}</p>
                </div>
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-950/20 border-blue-800/50 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-blue-400/70 mb-1">Frequency</p>
                  <p className="text-sm sm:text-base font-semibold text-white">{plan.summary.daysPerWeek} days/week</p>
                </div>
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-950/20 border-purple-800/50 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-purple-400/70 mb-1">Duration</p>
                  <p className="text-sm sm:text-base font-semibold text-white">{plan.summary.sessionLength} min</p>
                </div>
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/30 to-orange-950/20 border-orange-800/50 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-orange-400/70 mb-1">Level</p>
                  <p className="text-sm sm:text-base font-semibold text-white capitalize">{plan.summary.level}</p>
                </div>
                <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="bg-gray-900/70 backdrop-blur-xl border-gray-800/50 shadow-2xl">
          <CardHeader className="border-b border-gray-800/50 pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Your Personalized Workout Plan
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2 leading-relaxed">
              {plan.overview}
            </CardDescription>
            {plan.summary.focusAreas && plan.summary.focusAreas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {plan.summary.focusAreas.map((area: string, i: number) => (
                  <span 
                    key={i}
                    className="px-3 py-1 text-xs sm:text-sm bg-emerald-900/30 text-emerald-300 rounded-full border border-emerald-800/50"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="day1" value={activeDay} onValueChange={setActiveDay}>
              {/* Mobile: Horizontal Scroll Tabs */}
              <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                <TabsList className="inline-flex w-auto min-w-full bg-gray-800/50 p-1 rounded-lg">
                  {Object.keys(plan.workouts).map((day, index) => (
                    <TabsTrigger
                      key={day}
                      value={day}
                      className="px-4 sm:px-6 py-2.5 rounded-md text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                    >
                      <span className="hidden sm:inline">Day {index + 1}</span>
                      <span className="sm:hidden">{index + 1}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {Object.entries(plan.workouts).map(([day, workout]: [string, any]) => (
                <TabsContent key={day} value={day} className="space-y-6 mt-0">
                  {/* Workout Header */}
                  <div className="bg-gradient-to-r from-emerald-900/20 to-transparent border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-lg">
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-2">{workout.focus}</h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{workout.description}</p>
                  </div>

                  {/* Exercises - Mobile Optimized */}
                  <div className="space-y-3">
                    {workout.exercises.map((exercise: any, index: number) => (
                      <Card key={index} className="bg-gray-800/50 border-gray-700/50 hover:border-emerald-700/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-base sm:text-lg mb-1">{exercise.name}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <span className="text-emerald-400 font-medium">{exercise.sets}</span> sets
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="text-emerald-400 font-medium">{exercise.reps}</span> reps
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="text-emerald-400 font-medium">{exercise.rest}</span> rest
                                </span>
                              </div>
                            </div>
                            <div className="ml-2 h-8 w-8 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 font-semibold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Notes */}
                  {workout.notes && workout.notes.length > 0 && (
                    <Card className="bg-blue-900/10 border-blue-800/30">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                          <ChevronRight className="h-4 w-4" />
                          Important Notes
                        </h4>
                        <ul className="space-y-2">
                          {workout.notes.map((note: string, index: number) => (
                            <li key={index} className="text-gray-300 text-sm sm:text-base flex items-start gap-2">
                              <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>

          <CardFooter className="border-t border-gray-800/50 bg-gray-900/50 p-4 sm:p-6">
            <div className="flex items-start gap-3 text-gray-400 text-xs sm:text-sm">
              <div className="h-8 w-8 rounded-full bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400">💡</span>
              </div>
              <p className="leading-relaxed">
                This plan is personalized for your goals and fitness level. Listen to your body, maintain proper form, and adjust weights as needed. Stay consistent for best results!
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}