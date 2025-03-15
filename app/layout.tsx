import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import Link from "next/link"
import { Dumbbell } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI GymBRO - Personalized Workout & Meal Plans",
  description: "Generate personalized workout and meal plans using AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gray-950 text-gray-50`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <Dumbbell className="h-6 w-6 text-emerald-500" />
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                  AI GymBRO
                </span>
              </Link>
              <nav className="w-full sm:w-auto">
                <ul className="flex gap-6 justify-center sm:justify-end">
                  <li>
                    <Link href="/workout-plan" className="text-gray-300 hover:text-emerald-400 transition-colors">
                      Workout Plans
                    </Link>
                  </li>
                  <li>
                    <Link href="/meal-plan" className="text-gray-300 hover:text-emerald-400 transition-colors">
                      Meal Plans
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="mt-20 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} AI GymBRO. All rights reserved.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

