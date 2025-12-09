"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { Menu, X, Dumbbell, LogOut, ChevronRight, Shield, Trophy, ChevronDown, Utensils, BookOpen } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { checkIsSuperAdmin } from "@/lib/services/adminService"
import type { User } from "@supabase/supabase-js"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Use auth state listener as primary - faster than getSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      
      // Check admin status in background (non-blocking)
      if (session?.user) {
        checkIsSuperAdmin(session.user.id).then(setIsAdmin).catch(() => setIsAdmin(false))
      } else {
        setIsAdmin(false)
      }
    })

    // Initial session check (non-blocking)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkIsSuperAdmin(session.user.id).then(setIsAdmin).catch(() => setIsAdmin(false))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMenuOpen])

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsMenuOpen(false)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-950 border-b border-stone-800 shadow-lg shadow-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/30 transition-all">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">GymBRO</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-900/50 border border-stone-800/50 rounded-full px-1.5 py-1.5" role="navigation" aria-label="Main navigation">
            <Link 
              href="/" 
              className="px-4 py-1.5 text-sm text-stone-300 hover:text-white hover:bg-stone-800/70 rounded-full transition-all"
            >
              Home
            </Link>
            {/* Services Dropdown - Click-based for better mobile/touch support */}
            <div className="relative" ref={servicesRef}>
              <button 
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`px-4 py-1.5 text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-500/20 rounded-full transition-all flex items-center gap-1.5 ${isServicesOpen ? 'bg-teal-500/20' : ''}`}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-xl shadow-black/20 py-2 min-w-[180px]" role="menu">
                    <Link 
                      href="/workout-plan"
                      onClick={() => setIsServicesOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-300 hover:text-white hover:bg-stone-800/70 transition-all"
                      role="menuitem"
                    >
                      <Dumbbell className="w-4 h-4 text-emerald-400" />
                      Workout Plan
                    </Link>
                    <Link 
                      href="/meal-plan"
                      onClick={() => setIsServicesOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-300 hover:text-white hover:bg-stone-800/70 transition-all"
                      role="menuitem"
                    >
                      <Utensils className="w-4 h-4 text-amber-400" />
                      Meal Plan
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link 
              href="/forum" 
              className="px-4 py-1.5 text-sm text-stone-300 hover:text-white hover:bg-stone-800/70 rounded-full transition-all"
            >
              Forum
            </Link>
            <Link 
              href="/blog" 
              className="px-4 py-1.5 text-sm text-stone-300 hover:text-white hover:bg-stone-800/70 rounded-full transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Blog
            </Link>
            <Link 
              href="/leaderboard" 
              className="px-4 py-1.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 rounded-full transition-all flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              Leaderboard
            </Link>
            {user && (
              <Link 
                href="/dashboard" 
                className="px-4 py-1.5 text-sm text-stone-300 hover:text-white hover:bg-stone-800/70 rounded-full transition-all"
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="px-4 py-1.5 text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/20 rounded-full transition-all flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-stone-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-stone-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 rounded-full shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-stone-300 hover:text-white bg-stone-900/50 border border-stone-800/50 rounded-xl transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Solid */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden fixed inset-0 top-0 bg-stone-950 z-50" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-stone-800">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">GymBRO</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-white bg-stone-900 border border-stone-800 rounded-xl"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex flex-col p-5 space-y-3 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }} role="navigation" aria-label="Mobile navigation">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-5 py-4 text-stone-100 bg-stone-900 border border-stone-800 rounded-xl hover:bg-stone-800 transition-colors"
            >
              <span className="font-semibold text-lg">Home</span>
              <ChevronRight className="w-5 h-5 text-stone-500" />
            </Link>
            
            {/* Services Section */}
            <div className="bg-stone-900 border border-teal-500/30 rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-teal-500/10 border-b border-teal-500/20">
                <span className="font-semibold text-teal-400">Services</span>
              </div>
              <Link 
                href="/workout-plan" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-5 py-4 text-stone-100 hover:bg-stone-800 transition-colors border-b border-stone-800/50"
              >
                <span className="font-semibold text-lg flex items-center gap-3">
                  <Dumbbell className="w-5 h-5 text-emerald-400" />
                  Workout Plan
                </span>
                <ChevronRight className="w-5 h-5 text-stone-500" />
              </Link>
              <Link 
                href="/meal-plan" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-5 py-4 text-stone-100 hover:bg-stone-800 transition-colors"
              >
                <span className="font-semibold text-lg flex items-center gap-3">
                  <Utensils className="w-5 h-5 text-amber-400" />
                  Meal Plan
                </span>
                <ChevronRight className="w-5 h-5 text-stone-500" />
              </Link>
            </div>

            <Link 
              href="/forum" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-5 py-4 text-stone-100 bg-stone-900 border border-stone-800 rounded-xl hover:bg-stone-800 transition-colors"
            >
              <span className="font-semibold text-lg">Forum</span>
              <ChevronRight className="w-5 h-5 text-stone-500" />
            </Link>
            <Link 
              href="/blog" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-5 py-4 text-stone-100 bg-stone-900 border border-stone-800 rounded-xl hover:bg-stone-800 transition-colors"
            >
              <span className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                Blog
              </span>
              <ChevronRight className="w-5 h-5 text-stone-500" />
            </Link>
            <Link 
              href="/leaderboard" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-5 py-4 text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-colors"
            >
              <span className="font-semibold text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Leaderboard
              </span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </Link>
            {user && (
              <Link 
                href="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-5 py-4 text-stone-100 bg-stone-900 border border-stone-800 rounded-xl hover:bg-stone-800 transition-colors"
              >
                <span className="font-semibold text-lg">Dashboard</span>
                <ChevronRight className="w-5 h-5 text-stone-500" />
              </Link>
            )}
            {isAdmin && (
              <Link 
                href="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-5 py-4 text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded-xl hover:bg-violet-500/20 transition-colors"
              >
                <span className="font-semibold text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Admin Panel
                </span>
                <ChevronRight className="w-4 h-4 text-violet-500" />
              </Link>
            )}
            
            {/* Divider */}
            <div className="my-4 border-t border-stone-800" />
            
            {/* Auth Section */}
            <div className="space-y-3">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-3 px-5 py-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors font-semibold text-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-5 py-4 text-center text-stone-100 bg-stone-900 border border-stone-800 rounded-xl hover:bg-stone-800 transition-colors font-semibold text-lg"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-5 py-4 text-center text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/25 font-bold text-lg"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
