import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { Navbar } from "../components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI GymBRO - Personalized AI Workout & Meal Plans | Fitness Training",
  description: "Transform your fitness with AI GymBRO's personalized workout plans, custom meal plans, and expert fitness training powered by artificial intelligence.",
  keywords: "AI workout plans, fitness AI, personalized meal plans, gym training app, custom workout generator, fitness meal planning, strength training AI, muscle building app, weight loss program, AI fitness coach",
  openGraph: {
    title: "AI GymBRO - Personalized AI Workout & Meal Plans",
    description: "Get custom workout and meal plans tailored to your fitness goals using advanced AI technology",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI GymBRO - Your AI Fitness Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI GymBRO - Personalized AI Workout & Meal Plans",
    description: "Custom AI-generated fitness and nutrition plans for your goals",
    images: ["/twitter-image.jpg"],
  },
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
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}