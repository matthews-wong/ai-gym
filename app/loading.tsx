"use client"

import { useEffect, useState } from "react"

export default function Loading() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Add keyframe animations
    const styleId = "loading-spinner"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        .pulse-text {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .fade-pulse {
          animation: fadeInOut 3s ease-in-out infinite;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-gray-900"></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center">
      {/* Circular Spinner */}
      <div className="relative mb-8">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-emerald-400 rounded-full spinner"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-400 rounded-full spinner opacity-60" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Brand */}
      <div className="text-center fade-pulse">
        <h1 className="text-2xl font-light text-white tracking-wide">
          AI Gym<span className="text-emerald-400 font-medium">BRO</span>
        </h1>
        <div className="mt-2 text-gray-400 text-sm pulse-text">
          Loading...
        </div>
      </div>
    </div>
  )
}