"use client"

interface MacronutrientChartProps {
  macros: {
    protein: number
    carbs: number
    fat: number
  }
}

export default function MacronutrientChart({ macros }: MacronutrientChartProps) {
  // Ensure macros are numbers (in case the AI returns strings)
  const protein =
    typeof macros.protein === "string" ? Number.parseInt(macros.protein as unknown as string, 10) : macros.protein
  const carbs = typeof macros.carbs === "string" ? Number.parseInt(macros.carbs as unknown as string, 10) : macros.carbs
  const fat = typeof macros.fat === "string" ? Number.parseInt(macros.fat as unknown as string, 10) : macros.fat

  const data = [
    { name: "Protein", value: protein * 4, grams: protein }, // 4 calories per gram
    { name: "Carbs", value: carbs * 4, grams: carbs }, // 4 calories per gram
    { name: "Fat", value: fat * 9, grams: fat }, // 9 calories per gram
  ]

  const COLORS = ["#10b981", "#6366f1", "#f59e0b"]

  // Calculate total calories and percentages
  const totalCalories = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full h-full flex flex-col">
      {/* Simple SVG Pie Chart */}
      <div className="relative w-full h-48 md:h-56">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Create pie chart segments */}
          {data.map((entry, index) => {
            const startAngle =
              index === 0 ? 0 : data.slice(0, index).reduce((sum, d) => sum + (d.value / totalCalories) * 360, 0)
            const endAngle = startAngle + (entry.value / totalCalories) * 360

            // Convert angles to radians for calculations
            const startRad = ((startAngle - 90) * Math.PI) / 180
            const endRad = ((endAngle - 90) * Math.PI) / 180

            // Calculate points
            const x1 = 50 + 40 * Math.cos(startRad)
            const y1 = 50 + 40 * Math.sin(startRad)
            const x2 = 50 + 40 * Math.cos(endRad)
            const y2 = 50 + 40 * Math.sin(endRad)

            // Determine if the arc should be drawn as a large arc
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

            // Create SVG path for the pie segment
            const path = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

            return (
              <path
                key={index}
                d={path}
                fill={COLORS[index]}
                stroke="#1f2937"
                strokeWidth="0.5"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            )
          })}

          {/* Add text in the center */}
          <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="fill-white text-xs font-medium">
            {totalCalories} cal
          </text>
        </svg>
      </div>

      {/* Legend with more details */}
      <div className="flex flex-col mt-4 gap-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index] }}></div>
              <span className="text-gray-300 text-sm">{entry.name}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-300 text-sm">
                {entry.grams}g ({Math.round((entry.value / totalCalories) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

