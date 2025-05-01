import MealPlanForm from "@/components/meal-plan-form"
import { Utensils, Sparkles, Salad, ChevronDown } from "lucide-react"

export default function MealPlanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center p-1 px-3 mb-4 text-sm rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              AI-Powered Nutrition Planning
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
              Create Your Personalized Meal Plan
            </h1>

            <p className="text-gray-300 text-lg md:text-xl mb-6 max-w-3xl mx-auto">
              Get a customized 7-day meal plan tailored to your nutritional needs, preferences, and goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                <Utensils className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">Personalized Recipes</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                <Salad className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">Balanced Nutrition</span>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <ChevronDown className="h-8 w-8 text-gray-400 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 rounded-xl shadow-2xl border border-gray-800/50 overflow-hidden">
            <div className="p-6 sm:p-8">
              <MealPlanForm />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
              <div className="bg-emerald-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-400">
                Our advanced AI analyzes your preferences and nutritional needs to create the perfect meal plan.
              </p>
            </div>

            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
              <div className="bg-emerald-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Utensils className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Customizable</h3>
              <p className="text-gray-400">
                Tailor your meal plan with dietary restrictions, cuisine preferences, and cooking time constraints.
              </p>
            </div>

            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
              <div className="bg-emerald-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Salad className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Nutritionally Balanced</h3>
              <p className="text-gray-400">
                Each meal plan is carefully balanced to meet your caloric and macronutrient targets.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-emerald-400 mb-2">How does the meal plan generator work?</h3>
                <p className="text-gray-300">
                  Our AI analyzes your nutritional goals, dietary preferences, and restrictions to create a personalized
                  7-day meal plan with balanced macronutrients and varied recipes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-emerald-400 mb-2">How do I know how many calories I need?</h3>
                <p className="text-gray-300">
                  Use our built-in calorie calculator to estimate your daily calorie needs based on your age, gender,
                  weight, height, and activity level. The calculator will recommend a target calorie intake based on
                  your goals.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-emerald-400 mb-2">Can I customize my meal plan?</h3>
                <p className="text-gray-300">
                  Yes! You can specify dietary restrictions, cuisine preferences, meal complexity, and even include
                  options for snacks and desserts. The more details you provide, the more personalized your meal plan
                  will be.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

