"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download } from "lucide-react"
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

  // Helper function to format focus areas for display
  const formatFocusAreas = (areas: string[]) => {
    if (!areas || areas.length === 0) return "Not specified"
    return areas.join(", ")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Form
        </Button>

        <div className="w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="border-emerald-600 text-emerald-500 hover:bg-emerald-950 w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 mb-8">
        <CardHeader>
          <CardTitle className="text-emerald-400 text-2xl">Your Personalized Workout Plan</CardTitle>
          <CardDescription>
            Based on your goals: {plan.summary.goal} | Level: {plan.summary.level} | {plan.summary.daysPerWeek} days per
            week | {plan.summary.sessionLength} minutes per session | Focus: {formatFocusAreas(plan.summary.focusAreas)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Plan Overview</h3>
            <p className="text-gray-400">{plan.overview}</p>
          </div>

          <Tabs defaultValue="day1" value={activeDay} onValueChange={setActiveDay}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 mb-4 overflow-x-auto">
              {Object.keys(plan.workouts).map((day, index) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="data-[state=active]:bg-emerald-900 data-[state=active]:text-emerald-50"
                >
                  Day {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(plan.workouts).map(([day, workout]: [string, any]) => (
              <TabsContent key={day} value={day} className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">{workout.focus}</h3>
                  <p className="text-gray-400 mb-4">{workout.description}</p>

                  <div className="overflow-x-auto -mx-4 px-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exercise</TableHead>
                          <TableHead className="w-16">Sets</TableHead>
                          <TableHead className="w-16">Reps</TableHead>
                          <TableHead className="w-16">Rest</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workout.exercises.map((exercise: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{exercise.name}</TableCell>
                            <TableCell>{exercise.sets}</TableCell>
                            <TableCell>{exercise.reps}</TableCell>
                            <TableCell>{exercise.rest}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Notes:</h4>
                  <ul className="list-disc pl-5 text-gray-400">
                    {workout.notes.map((note: string, index: number) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-gray-800 pt-4 text-gray-400 text-sm">
          <p>
            This plan is designed based on your specific goals and preferences. Adjust weights and intensity as needed.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

