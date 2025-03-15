"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download } from "lucide-react"
import { generatePDF } from "@/lib/pdf-service"
import MacronutrientChart from "./macronutrient-chart"

interface MealPlanDisplayProps {
  plan: any
  onBack: () => void
}

export default function MealPlanDisplay({ plan, onBack }: MealPlanDisplayProps) {
  const [activeDay, setActiveDay] = useState("day1")

  const handleDownloadPDF = () => {
    generatePDF(plan, "meal")
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
          <CardTitle className="text-emerald-400 text-2xl">Your Personalized Meal Plan</CardTitle>
          <CardDescription>
            Based on your goals: {plan.summary.goal} | {plan.summary.calories} calories | Diet: {plan.summary.dietType}{" "}
            | {plan.summary.mealsPerDay} meals per day | Restrictions: {plan.summary.restrictions}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Plan Overview</h3>
            <p className="text-gray-400">{plan.overview}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Macronutrient Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 md:h-72">
                <MacronutrientChart macros={plan.macros} />
              </div>
              <div className="flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Protein</p>
                    <p className="text-2xl font-bold text-emerald-400">{plan.macros.protein}g</p>
                    <p className="text-sm text-gray-500">{Math.round(plan.macros.protein * 4)} calories</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Carbs</p>
                    <p className="text-2xl font-bold text-emerald-400">{plan.macros.carbs}g</p>
                    <p className="text-sm text-gray-500">{Math.round(plan.macros.carbs * 4)} calories</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Fat</p>
                    <p className="text-2xl font-bold text-emerald-400">{plan.macros.fat}g</p>
                    <p className="text-sm text-gray-500">{Math.round(plan.macros.fat * 9)} calories</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-emerald-400">{plan.summary.calories}</p>
                    <p className="text-sm text-gray-500">calories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="day1" value={activeDay} onValueChange={setActiveDay}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 mb-4 overflow-x-auto">
              {Object.keys(plan.meals).map((day, index) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="data-[state=active]:bg-emerald-900 data-[state=active]:text-emerald-50"
                >
                  Day {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(plan.meals).map(([day, dayMeals]: [string, any]) => (
              <TabsContent key={day} value={day} className="space-y-6">
                {dayMeals.map((meal: any, index: number) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-emerald-400 mb-2">{meal.name}</h3>

                    <div className="overflow-x-auto -mx-4 px-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Food</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="w-16">Protein</TableHead>
                            <TableHead className="w-16">Carbs</TableHead>
                            <TableHead className="w-16">Fat</TableHead>
                            <TableHead className="w-16">Calories</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {meal.foods.map((food: any, foodIndex: number) => (
                            <TableRow key={foodIndex}>
                              <TableCell className="font-medium">{food.name}</TableCell>
                              <TableCell>{food.amount}</TableCell>
                              <TableCell>{food.protein}g</TableCell>
                              <TableCell>{food.carbs}g</TableCell>
                              <TableCell>{food.fat}g</TableCell>
                              <TableCell>{food.calories}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-gray-700/30">
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell className="font-bold">{meal.totals.protein}g</TableCell>
                            <TableCell className="font-bold">{meal.totals.carbs}g</TableCell>
                            <TableCell className="font-bold">{meal.totals.fat}g</TableCell>
                            <TableCell className="font-bold">{meal.totals.calories}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {meal.notes && (
                      <div className="mt-3 text-sm text-gray-400">
                        <p>
                          <span className="font-medium">Preparation:</span> {meal.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-gray-800 pt-4 text-gray-400 text-sm">
          <p>
            This meal plan is designed based on your specific goals and preferences. Adjust portions as needed to meet
            your calorie targets.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

