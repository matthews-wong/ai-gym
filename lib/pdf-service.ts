"use client"

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export function generatePDF(plan: any, type: "workout" | "meal") {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(16, 185, 129) // emerald-500
  doc.text(`AI GymBRO - Your Personalized ${type === "workout" ? "Workout" : "Meal"} Plan`, 105, 15, {
    align: "center",
  })

  // Add summary
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Plan Summary:", 14, 25)

  const summaryText =
    type === "workout"
      ? `Goal: ${plan.summary.goal} | Level: ${plan.summary.level} | ${plan.summary.daysPerWeek} days per week | ${plan.summary.sessionLength} min sessions`
      : `Goal: ${plan.summary.goal} | ${plan.summary.calories} calories | Diet: ${plan.summary.dietType} | ${plan.summary.mealsPerDay} meals per day`

  doc.setFontSize(10)
  doc.text(summaryText, 14, 32)

  // Add overview
  doc.setFontSize(12)
  doc.text("Overview:", 14, 42)

  const splitOverview = doc.splitTextToSize(plan.overview, 180)
  doc.setFontSize(10)
  doc.text(splitOverview, 14, 49)

  let yPosition = 49 + splitOverview.length * 5

  // Add macros if meal plan
  if (type === "meal") {
    yPosition += 5
    doc.setFontSize(12)
    doc.text("Macronutrient Breakdown:", 14, yPosition)
    yPosition += 7

    autoTable(doc, {
      startY: yPosition,
      head: [["Nutrient", "Amount", "Calories", "% of Total"]],
      body: [
        [
          "Protein",
          `${plan.macros.protein}g`,
          `${plan.macros.protein * 4} cal`,
          `${Math.round(((plan.macros.protein * 4) / plan.summary.calories) * 100)}%`,
        ],
        [
          "Carbs",
          `${plan.macros.carbs}g`,
          `${plan.macros.carbs * 4} cal`,
          `${Math.round(((plan.macros.carbs * 4) / plan.summary.calories) * 100)}%`,
        ],
        [
          "Fat",
          `${plan.macros.fat}g`,
          `${plan.macros.fat * 9} cal`,
          `${Math.round(((plan.macros.fat * 9) / plan.summary.calories) * 100)}%`,
        ],
        ["Total", "", `${plan.summary.calories} cal`, "100%"],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [16, 185, 129] },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 10
  }

  // Add daily plans
  if (type === "workout") {
    // Workout plan
    Object.entries(plan.workouts).forEach(([day, workout]: [string, any], index: number) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      const dayNumber = index + 1
      doc.setFontSize(14)
      doc.setTextColor(16, 185, 129)
      doc.text(`Day ${dayNumber}: ${workout.focus}`, 14, yPosition)
      yPosition += 7

      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      const splitDesc = doc.splitTextToSize(workout.description, 180)
      doc.text(splitDesc, 14, yPosition)
      yPosition += splitDesc.length * 5 + 5

      // Exercise table
      autoTable(doc, {
        startY: yPosition,
        head: [["Exercise", "Sets", "Reps", "Rest"]],
        body: workout.exercises.map((exercise: any) => [
          exercise.name,
          exercise.sets.toString(),
          exercise.reps,
          exercise.rest,
        ]),
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [16, 185, 129] },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 5

      // Notes
      doc.setFontSize(10)
      doc.text("Notes:", 14, yPosition)
      yPosition += 5

      workout.notes.forEach((note: string) => {
        const splitNote = doc.splitTextToSize(`• ${note}`, 180)
        doc.text(splitNote, 14, yPosition)
        yPosition += splitNote.length * 5
      })

      yPosition += 10
    })
  } else {
    // Meal plan
    Object.entries(plan.meals).forEach(([day, meals]: [string, any], dayIndex: number) => {
      // Add a new page for each day
      if (dayIndex > 0) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(16, 185, 129)
      doc.text(`Day ${dayIndex + 1}`, 14, yPosition)
      yPosition += 10

      meals.forEach((meal: any, mealIndex: number) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(12)
        doc.setTextColor(16, 185, 129)
        doc.text(meal.name, 14, yPosition)
        yPosition += 7

        // Food table
        autoTable(doc, {
          startY: yPosition,
          head: [["Food", "Amount", "Protein", "Carbs", "Fat", "Calories"]],
          body: [
            ...meal.foods.map((food: any) => [
              food.name,
              food.amount,
              `${food.protein}g`,
              `${food.carbs}g`,
              `${food.fat}g`,
              food.calories.toString(),
            ]),
            [
              "Total",
              "",
              `${meal.totals.protein}g`,
              `${meal.totals.carbs}g`,
              `${meal.totals.fat}g`,
              meal.totals.calories.toString(),
            ],
          ],
          theme: "grid",
          styles: { fontSize: 9, cellPadding: 2 },
          headStyles: { fillColor: [16, 185, 129] },
          foot: [
            [
              "Total",
              "",
              `${meal.totals.protein}g`,
              `${meal.totals.carbs}g`,
              `${meal.totals.fat}g`,
              meal.totals.calories.toString(),
            ],
          ],
          footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 5

        // Notes
        if (meal.notes) {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          const splitNote = doc.splitTextToSize(`Preparation: ${meal.notes}`, 180)
          doc.text(splitNote, 14, yPosition)
          yPosition += splitNote.length * 5 + 10
        } else {
          yPosition += 10
        }
      })
    })
  }

  // Add footer
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text("Generated by AI GymBRO - Your AI-powered fitness companion", 105, 285, { align: "center" })

  // Save the PDF
  doc.save(`ai-gymbro-${type}-plan.pdf`)
}

