"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Dumbbell, Menu, X, Home, Salad, Info, Phone, Sparkles, Zap } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <header 
      className={`${
        scrolled 
          ? 'bg-gray-950/98 border-b border-emerald-400/40 backdrop-blur-2xl shadow-lg shadow-emerald-500/10' 
          : 'bg-gray-900/90 backdrop-blur-xl'
      } sticky top-0 z-50 transition-all duration-700 ease-out`}
    >
      <div className="container mx-auto px-6 lg:px-8 py-5 flex justify-between items-center">
        {/* Enhanced Logo */}
        <Link href="/" className="flex items-center gap-4 group relative">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 via-emerald-400/20 to-emerald-500/30 rounded-full blur-lg group-hover:blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 group-hover:from-emerald-400/30 group-hover:to-emerald-500/20 border border-emerald-500/30 group-hover:border-emerald-400/50 transition-all duration-300">
              <Dumbbell className="h-7 w-7 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 transform group-hover:rotate-12 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 group-hover:from-emerald-300 group-hover:via-emerald-200 group-hover:to-emerald-400 transition-all duration-300">
              AI GymBRO
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </Link>
        
        {/* Enhanced Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <Link href="/" className="relative text-gray-300 hover:text-emerald-300 transition-all duration-300 group py-2 px-3 rounded-lg hover:bg-emerald-500/5">
            <span className="relative z-10 font-medium">Home</span>
            <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-full"></span>
            <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-emerald-500/20 transition-all duration-300"></div>
          </Link>
          
          <Link href="/about" className="relative text-gray-300 hover:text-emerald-300 transition-all duration-300 group py-2 px-3 rounded-lg hover:bg-emerald-500/5">
            <span className="relative z-10 font-medium">About</span>
            <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-full"></span>
            <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-emerald-500/20 transition-all duration-300"></div>
          </Link>
          
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-600/50 to-transparent"></div>
        </nav>
        
        {/* Enhanced Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link 
            href="/workout-plan" 
            className="relative group px-6 lg:px-8 py-3 font-semibold text-white overflow-hidden rounded-xl transition-all duration-500 hover:scale-105"
          >
            {/* Animated background layers */}
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 group-hover:from-emerald-500 group-hover:via-emerald-400 group-hover:to-emerald-500 transition-all duration-500"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 animate-pulse"></span>
            <span className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent group-hover:via-emerald-200 transition-all duration-300"></span>
            <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent group-hover:via-emerald-200 transition-all duration-300"></span>
            
            {/* Content */}
            <span className="relative flex items-center gap-2 z-10">
              <Zap className="h-4 w-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
              Create Workout Plan
              <Sparkles className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
            </span>
            
            {/* Border effect */}
            <span className="absolute inset-0 rounded-xl border border-emerald-400/30 group-hover:border-emerald-300/60 transition-all duration-500"></span>
            
            {/* Glow effect */}
            <span className="absolute -inset-1 bg-gradient-to-r from-emerald-600/30 to-emerald-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></span>
          </Link>
          
          <Link 
            href="/meal-plan" 
            className="relative group px-6 lg:px-8 py-3 font-semibold text-emerald-300 border-2 border-emerald-500/50 hover:border-emerald-400/70 rounded-xl hover:bg-emerald-500/10 transition-all duration-500 hover:scale-105 overflow-hidden"
          >
            {/* Animated background */}
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-400/10 to-emerald-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            
            {/* Content */}
            <span className="relative flex items-center gap-2 z-10 group-hover:text-emerald-200 transition-colors duration-300">
              <Salad className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              Create Meal Plan
            </span>
            
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400/0 group-hover:border-emerald-300/60 transition-all duration-300"></span>
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400/0 group-hover:border-emerald-300/60 transition-all duration-300"></span>
          </Link>
        </div>
        
        {/* Enhanced Mobile Menu Button */}
        <button 
          className="md:hidden relative group p-2 text-gray-300 hover:text-emerald-300 transition-all duration-300 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="absolute inset-0 rounded-lg bg-emerald-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
        </button>
      </div>
      
      {/* Enhanced Mobile Fullscreen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-950/98 backdrop-blur-2xl z-50 flex flex-col md:hidden">
          {/* Enhanced Top Bar */}
          <div className="p-6 flex justify-between items-center border-b border-emerald-500/30 bg-gradient-to-r from-gray-900/80 via-gray-900/90 to-gray-900/80 backdrop-blur-xl">
            <Link 
              href="/" 
              className="flex items-center gap-4 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/40 to-emerald-400/30 rounded-full blur-lg group-hover:blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border border-emerald-400/40">
                  <Dumbbell className="h-7 w-7 text-emerald-300 group-hover:text-emerald-200 transition-all duration-300 transform group-hover:rotate-12" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-emerald-200 to-emerald-400 group-hover:from-emerald-200 group-hover:via-emerald-100 group-hover:to-emerald-300 transition-all duration-300">
                  AI GymBRO
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1 h-1 bg-emerald-300 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </Link>
            
            <button 
              className="group relative text-gray-300 hover:text-emerald-200 transition-all duration-300 p-3 rounded-xl hover:bg-emerald-500/15 border border-gray-700/50 hover:border-emerald-500/40"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="absolute inset-0 rounded-xl bg-emerald-500/20 blur opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
            </button>
          </div>
          
          {/* Enhanced Menu Content */}
          <div className="flex-1 flex flex-col p-6 bg-gradient-to-b from-gray-950/95 via-gray-950/98 to-gray-950/95">
            {/* Enhanced Navigation Links */}
            <nav className="space-y-4 mb-8">
              <Link 
                href="/" 
                className="flex items-center gap-5 text-lg text-gray-100 hover:text-emerald-200 py-5 px-6 rounded-2xl bg-gradient-to-r from-gray-900/70 via-gray-900/80 to-gray-900/70 hover:from-emerald-500/10 hover:via-emerald-500/15 hover:to-emerald-500/10 border border-gray-800/60 hover:border-emerald-500/40 transition-all duration-500 group backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 group-hover:from-emerald-400/30 group-hover:to-emerald-500/20 border border-emerald-500/30 group-hover:border-emerald-400/50 transition-all duration-300">
                  <Home className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute -inset-1 bg-emerald-500/30 rounded-xl blur opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                </div>
                <div className="flex-1">
                  <span className="font-semibold block">Home</span>
                  <span className="text-sm text-gray-400 group-hover:text-emerald-300/70 transition-colors duration-300">Main dashboard</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60 group-hover:bg-emerald-400 transition-all duration-300"></div>
                  <div className="w-1 h-1 rounded-full bg-emerald-600/40 group-hover:bg-emerald-500/80 transition-all duration-300"></div>
                </div>
              </Link>
              
              <Link 
                href="/about" 
                className="flex items-center gap-5 text-lg text-gray-100 hover:text-emerald-200 py-5 px-6 rounded-2xl bg-gradient-to-r from-gray-900/70 via-gray-900/80 to-gray-900/70 hover:from-emerald-500/10 hover:via-emerald-500/15 hover:to-emerald-500/10 border border-gray-800/60 hover:border-emerald-500/40 transition-all duration-500 group backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 group-hover:from-emerald-400/30 group-hover:to-emerald-500/20 border border-emerald-500/30 group-hover:border-emerald-400/50 transition-all duration-300">
                  <Info className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute -inset-1 bg-emerald-500/30 rounded-xl blur opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                </div>
                <div className="flex-1">
                  <span className="font-semibold block">About</span>
                  <span className="text-sm text-gray-400 group-hover:text-emerald-300/70 transition-colors duration-300">Learn more</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60 group-hover:bg-emerald-400 transition-all duration-300"></div>
                  <div className="w-1 h-1 rounded-full bg-emerald-600/40 group-hover:bg-emerald-500/80 transition-all duration-300"></div>
                </div>
              </Link>
            </nav>
            
            {/* Enhanced Divider */}
            <div className="relative my-8">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500/60 rounded-full blur-sm"></div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-emerald-400 rounded-full"></div>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="mt-auto space-y-5">
              <Link 
                href="/workout-plan" 
                className="relative block w-full text-center py-5 px-8 font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 rounded-2xl hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-500 transition-all duration-700 shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:shadow-2xl border-2 border-emerald-500/40 hover:border-emerald-400/60 group overflow-hidden transform hover:scale-[1.02]"
                onClick={() => setIsMenuOpen(false)}
              >
                {/* Animated shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                
                {/* Pulsing background */}
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-emerald-500/20 opacity-0 group-hover:opacity-100 animate-pulse transition-all duration-500"></span>
                
                <span className="relative flex items-center justify-center gap-3 z-10">
                  <div className="relative">
                    <Zap className="h-6 w-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>
                  <span className="text-lg">Create Workout Plan</span>
                  <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                </span>
                
                {/* Corner decorations */}
                <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></span>
                <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></span>
              </Link>
              
              <Link 
                href="/meal-plan" 
                className="relative block w-full text-center py-5 px-8 font-bold text-emerald-200 border-3 border-emerald-500/60 hover:border-emerald-400/80 rounded-2xl hover:bg-emerald-500/15 transition-all duration-500 group overflow-hidden backdrop-blur-sm transform hover:scale-[1.02]"
                onClick={() => setIsMenuOpen(false)}
              >
                {/* Animated background waves */}
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-emerald-400/20 to-emerald-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                
                <span className="relative flex items-center justify-center gap-3 z-10 group-hover:text-emerald-100 transition-colors duration-300">
                  <div className="relative">
                    <Salad className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -inset-1 bg-emerald-400/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>
                  <span className="text-lg">Create Meal Plan</span>
                </span>
                
                {/* Animated border segments */}
                <span className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 group-hover:w-full transition-all duration-500"></span>
                <span className="absolute bottom-0 right-0 w-0 h-1 bg-gradient-to-l from-emerald-400 to-emerald-300 group-hover:w-full transition-all duration-500 delay-100"></span>
              </Link>
            </div>
            
            {/* Bottom decoration */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500/60 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-emerald-400/80 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-emerald-600/60 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}