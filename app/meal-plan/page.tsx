import MealPlanForm from "@/components/meal-plan-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MealPlanPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
        Create Your Meal Plan
      </h1>
      <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
        Fill out the form below with your nutrition preferences and goals. Our AI will generate a personalized meal plan
        tailored specifically to you.
      </p>

      <Card className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle className="text-emerald-400">Nutrition Preferences</CardTitle>
          <CardDescription>Tell us about your nutrition goals and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <MealPlanForm />
        </CardContent>
      </Card>
    </div>
  )
}

