"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Dumbbell, Menu, X, Home, ShoppingBag, Info, Phone } from "lucide-react";

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
          ? 'bg-gray-950/95 border-b border-emerald-500/30 backdrop-blur-xl' 
          : 'bg-gray-900/85 backdrop-blur-md'
      } sticky top-0 z-50 transition-all duration-500`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Dumbbell className="h-8 w-8 text-emerald-500 group-hover:text-emerald-400 transition-all duration-300 transform group-hover:rotate-12" />
            <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-md group-hover:bg-emerald-400/30 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          </div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all duration-300">
            AI GymBRO
          </span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <div className="h-6 w-px bg-gray-700/50"></div>
        </nav>
        
        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/workout-plan" 
            className="relative px-6 py-2.5 font-medium text-white overflow-hidden group rounded-lg"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-emerald-500 group-hover:from-emerald-500 group-hover:to-emerald-400 transition-all duration-300"></span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="absolute top-0 left-0 w-full h-1 bg-emerald-300 -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative">Create Workout Plan</span>
            <span className="absolute inset-0 rounded-lg border border-emerald-500/50 group-hover:border-emerald-300/50 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
          </Link>
          <Link 
            href="/meal-plan" 
            className="relative px-6 py-2.5 font-medium text-emerald-400 border border-emerald-500/50 hover:border-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-all duration-300 group"
          >
            <span className="relative z-10">Create Meal Plan</span>
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent to-transparent group-hover:from-emerald-900/20 group-hover:to-transparent transition-all duration-500"></span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden relative text-gray-300 hover:text-emerald-400 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>
      </div>
      
      {/* Mobile fullscreen menu with improved layout */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/98 backdrop-blur-xl z-50 flex flex-col md:hidden">
          {/* Top bar with logo and X button */}
          <div className="p-6 flex justify-between items-center border-b border-gray-800">
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <Dumbbell className="h-8 w-8 text-emerald-500" />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                AI GymBRO
              </span>
            </Link>
            
            <button 
              className="text-gray-300 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Menu items */}
          <div className="flex-1 flex flex-col p-6">
            {/* Navigation links */}
            <nav className="space-y-4 mb-8">
              <Link 
                href="/" 
                className="flex items-center gap-3 text-lg text-gray-200 hover:text-emerald-400 py-3 px-4 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-3 text-lg text-gray-200 hover:text-emerald-400 py-3 px-4 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="h-5 w-5" />
                <span>About</span>
              </Link>
            </nav>
            
            <div className="h-px w-full bg-gray-800 my-4"></div>
            
            {/* Action buttons */}
            <div className="mt-auto space-y-4">
              <Link 
                href="/workout-plan" 
                className="block w-full text-center py-4 px-6 font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-md hover:shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Workout Plan
              </Link>
              
              <Link 
                href="/meal-plan" 
                className="block w-full text-center py-4 px-6 font-medium text-emerald-400 border border-emerald-500/50 hover:border-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Meal Plan
              </Link>
            </div>
          </div>
          
          {/* Footer */}
          <div className="py-6 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2025 AI GymBRO. All rights reserved.
          </div>
        </div>
      )}
    </header>
  );
}