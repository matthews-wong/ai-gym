import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import ParticleBackground from "@/components/particle-background"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div className="z-10 text-center px-4 sm:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
          AI GymBRO
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-300">
          Your personal AI trainer and nutritionist. Generate customized workout and meal plans tailored to your
          specific goals and preferences.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/workout-plan" className="w-full sm:w-auto">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
              Create Workout Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/meal-plan" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-600 text-emerald-500 hover:bg-emerald-950 w-full"
            >
              Create Meal Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            title="AI-Powered Plans"
            description="Leverage advanced AI to create personalized fitness and nutrition plans based on your specific needs."
            icon="Brain"
          />
          <FeatureCard
            title="Export as PDF"
            description="Download your plans as beautifully formatted PDFs to reference anytime, anywhere."
            icon="FileDown"
          />
          <FeatureCard
            title="Detailed Guidance"
            description="Get comprehensive workout routines and meal plans with detailed instructions and tips."
            icon="ListChecks"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  const icons = {
    Brain: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-emerald-500 mb-4"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
      </svg>
    ),
    FileDown: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-emerald-500 mb-4"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <path d="M12 18v-6"></path>
        <path d="m9 15 3 3 3-3"></path>
      </svg>
    ),
    ListChecks: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-emerald-500 mb-4"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 7 3 3 3-3"></path>
        <path d="M6 10V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-5"></path>
        <path d="M3 17 6 14 9 17"></path>
      </svg>
    ),
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-emerald-900 transition-all">
      {icons[icon as keyof typeof icons]}
      <h3 className="text-xl font-semibold mb-2 text-emerald-400">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

