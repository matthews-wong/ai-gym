"use client"

import { useEffect, useState } from "react"

export default function Loading() {
  // Prevent hydration issues by using useState with null initial value
  // and only rendering the component content after component mounts
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)

  // Setup progress interval only after mounting
  useEffect(() => {
    setMounted(true)
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  // Move styles to a separate component that's only inserted once
  useEffect(() => {
    // Check if style already exists to avoid duplicates
    const styleId = "loading-animations"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .loading-progress-bar {
          transition: width 0.3s ease-out;
        }

        .pulse-glow-animation {
          animation: pulse-glow 2s infinite;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  // If not mounted yet, return a placeholder to prevent hydration issues
  if (!mounted) {
    return <div className="min-h-screen bg-black"></div>
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 px-4">
      {/* Static Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 bg-black bg-[radial-gradient(circle_at_center,rgba(0,220,130,0.15),transparent_80%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,200,255,0.1),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(100,0,255,0.07),transparent_70%)]" />
        
        {/* Static decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 bg-emerald-500/30 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full opacity-10 bg-cyan-500/30 blur-3xl" />
        <div className="absolute top-2/3 right-1/4 w-72 h-72 rounded-full opacity-15 bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="z-10 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">
              AI Gym<span className="text-white">BRO</span>
            </span>
          </h1>
        </div>

        {/* Loading indicator */}
        <div className="w-64 md:w-80 mb-8">
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full loading-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-right text-emerald-400 font-medium text-sm">{progress}%</div>
        </div>

        {/* Loading message */}
        <div className="relative">
          <div
            className="absolute -inset-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-md pulse-glow-animation"
          />
          <div className="relative bg-gray-900/80 backdrop-blur-sm px-8 py-4 rounded-xl border border-emerald-500/30">
            <p className="text-gray-200 text-lg">Preparing your fitness journey...</p>
          </div>
        </div>
      </div>
    </div>
  )
}