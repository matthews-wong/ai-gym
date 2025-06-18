"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { Dumbbell, Menu, X, Home, Salad, Info, Sparkles, Zap } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when clicking outside or on escape
  useEffect(() => {
    if (!isMounted) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false)
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape)
      window.addEventListener("resize", handleResize)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      window.removeEventListener("resize", handleResize)
      document.body.style.overflow = ""
    }
  }, [isMenuOpen, isMounted])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), [])

  return (
    <header
      className={`${
        scrolled ? "bg-slate-950/95 border-b border-slate-800/50 shadow-xl shadow-emerald-500/5" : "bg-slate-950/90"
      } sticky top-0 z-50 transition-all duration-500 ease-out`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Modern Logo */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 group-hover:border-emerald-400/30 transition-all duration-300">
              <Dumbbell className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 transform group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-emerald-200 transition-all duration-300">
              AI GymBRO
            </span>
            <div className="h-0.5 w-0 bg-gradient-to-r from-emerald-400 to-emerald-300 group-hover:w-full transition-all duration-500 rounded-full"></div>
          </div>
        </Link>

        {/* Desktop Navigation - Always rendered, hidden with CSS */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="relative text-slate-300 hover:text-white transition-all duration-300 group py-2 px-4 rounded-xl hover:bg-slate-800/50"
          >
            <span className="relative z-10 font-medium">Home</span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-400 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></span>
          </Link>

          <Link
            href="/about"
            className="relative text-slate-300 hover:text-white transition-all duration-300 group py-2 px-4 rounded-xl hover:bg-slate-800/50"
          >
            <span className="relative z-10 font-medium">About</span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-400 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></span>
          </Link>

          <div className="h-6 w-px bg-slate-700"></div>
        </nav>

        {/* Desktop Buttons - Always rendered, hidden with CSS */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/workout-plan"
            className="relative group px-6 py-2.5 font-semibold text-white text-sm overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40"
          >
            <span className="relative flex items-center gap-2 z-10">
              <Zap className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden lg:inline">Create Workout Plan</span>
              <span className="lg:hidden">Workout</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </Link>

          <Link
            href="/meal-plan"
            className="relative group px-6 py-2.5 font-semibold text-emerald-300 text-sm border border-emerald-500/30 hover:border-emerald-400/50 rounded-xl hover:bg-emerald-500/10 transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <span className="relative flex items-center gap-2 z-10 group-hover:text-emerald-200 transition-colors duration-300">
              <Salad className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden lg:inline">Create Meal Plan</span>
              <span className="lg:hidden">Meal</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </Link>
        </div>

        {/* Mobile Menu Button - Always rendered, hidden with CSS */}
        <button
          className="md:hidden relative group p-2.5 text-slate-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      {/* Mobile Menu - Only render after mounting */}
      {isMounted && (
        <div
          className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-out ${
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-slate-950/98 transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMenu}
          />

          {/* Menu Content */}
          <div
            className={`relative h-full flex flex-col bg-slate-950 transform transition-all duration-300 ease-out ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-slate-800">
              <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
                <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                  <Dumbbell className="h-6 w-6 text-emerald-300" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  AI GymBRO
                </span>
              </Link>

              <button
                className="group p-2.5 text-slate-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-slate-800/50"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col p-6">
              <nav className="space-y-4 mb-8">
                <Link
                  href="/"
                  className="flex items-center gap-4 text-lg text-slate-100 hover:text-white py-4 px-5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 hover:border-slate-700 transition-all duration-300 group"
                  onClick={closeMenu}
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-400/30 transition-all duration-300">
                    <Home className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold block">Home</span>
                    <span className="text-sm text-slate-400">Main dashboard</span>
                  </div>
                </Link>
  
                <Link
                  href="/about"
                  className="flex items-center gap-4 text-lg text-slate-100 hover:text-white py-4 px-5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 hover:border-slate-700 transition-all duration-300 group"
                  onClick={closeMenu}
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-400/30 transition-all duration-300">
                    <Info className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold block">About</span>
                    <span className="text-sm text-slate-400">Learn more</span>
                  </div>
                </Link>
              </nav>

              {/* Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-4">
                <Link
                  href="/workout-plan"
                  className="block w-full text-center py-4 px-6 font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 group overflow-hidden"
                  onClick={closeMenu}
                >
                  <span className="relative flex items-center justify-center gap-3 z-10">
                    <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-lg">Create Workout Plan</span>
                    <Sparkles className="h-4 w-4 opacity-75" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Link>

                <Link
                  href="/meal-plan"
                  className="block w-full text-center py-4 px-6 font-bold text-emerald-200 border-2 border-emerald-500/50 hover:border-emerald-400/70 rounded-2xl hover:bg-emerald-500/10 transition-all duration-300 group overflow-hidden"
                  onClick={closeMenu}
                >
                  <span className="relative flex items-center justify-center gap-3 z-10 group-hover:text-emerald-100 transition-colors duration-300">
                    <Salad className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-lg">Create Meal Plan</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
