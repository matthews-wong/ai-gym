"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Dumbbell, Utensils, Sparkles, Check, Zap, Shield, Users, Play, Star, Target, TrendingUp, Clock, Brain } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-950">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Fitness"
            fill
            className="object-cover object-center opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/98 to-stone-950/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/80" />
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]" />
        
        {/* Animated glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-500" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-stone-800/90 to-stone-800/70 border border-stone-700/50 backdrop-blur-xl mb-8 shadow-xl">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-stone-300 font-medium">Trusted by 100+ fitness enthusiasts</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-8">
                Your AI-Powered
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Fitness Coach
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 100 2 150 6C200 10 250 4 298 8" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2dd4bf"/>
                        <stop offset="100%" stopColor="#22d3ee"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-stone-400 leading-relaxed mb-10 max-w-xl">
                Generate <span className="text-white font-medium">personalized workout routines</span> and <span className="text-white font-medium">meal plans</span> in seconds. No guesswork, just results.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 rounded-2xl shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all duration-300"
                >
                  Start Your Transformation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/workout-plan"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-stone-800 hover:bg-stone-700 border-2 border-stone-700 hover:border-stone-600 rounded-2xl transition-all duration-300"
                >
                  <Play className="w-5 h-5 text-teal-400 fill-teal-400" />
                  Try Demo
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {[
                  { icon: Shield, text: "100% Free" },
                  { icon: Zap, text: "Instant Results" },
                  { icon: Brain, text: "AI-Powered" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-stone-400">
                    <div className="w-8 h-8 rounded-lg bg-stone-800/50 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Card */}
            <div className="hidden lg:block relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-[2rem] blur-2xl" />
              
              <div className="relative">
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 backdrop-blur-xl border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <Dumbbell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wider">Today&apos;s Plan</p>
                        <p className="text-lg font-bold text-white">Upper Body Strength</p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full">
                      <span className="text-xs font-semibold text-teal-400">AI Generated</span>
                    </div>
                  </div>
                  
                  {/* Card content */}
                  <div className="p-6 space-y-4">
                    {[
                      { name: "Bench Press", sets: "4 sets × 8 reps", done: true },
                      { name: "Overhead Press", sets: "3 sets × 10 reps", done: true },
                      { name: "Pull-ups", sets: "3 sets × 12 reps", done: false },
                      { name: "Dumbbell Rows", sets: "4 sets × 10 reps", done: false },
                    ].map((exercise, i) => (
                      <div key={exercise.name} className={`flex items-center justify-between p-4 rounded-xl transition-all ${exercise.done ? 'bg-teal-500/5 border border-teal-500/20' : 'bg-stone-800/50 border border-stone-700/50'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${exercise.done ? 'bg-teal-500 text-white' : 'bg-stone-700 text-stone-400'}`}>
                            {exercise.done ? <Check className="w-5 h-5" /> : i + 1}
                          </div>
                          <div>
                            <p className={`font-semibold ${exercise.done ? 'text-stone-400 line-through' : 'text-white'}`}>{exercise.name}</p>
                            <p className="text-sm text-stone-500">{exercise.sets}</p>
                          </div>
                        </div>
                        {!exercise.done && (
                          <div className="w-8 h-8 rounded-lg bg-stone-700/50 flex items-center justify-center">
                            <Play className="w-4 h-4 text-stone-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Card footer */}
                  <div className="px-6 py-4 bg-stone-800/50 border-t border-stone-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-2xl font-bold text-white">50%</p>
                          <p className="text-xs text-stone-500">Completed</p>
                        </div>
                        <div className="w-px h-10 bg-stone-700" />
                        <div>
                          <p className="text-2xl font-bold text-white">45<span className="text-sm text-stone-500 ml-1">min</span></p>
                          <p className="text-xs text-stone-500">Duration</p>
                        </div>
                        <div className="w-px h-10 bg-stone-700" />
                        <div>
                          <p className="text-2xl font-bold text-white">320<span className="text-sm text-stone-500 ml-1">cal</span></p>
                          <p className="text-xs text-stone-500">Burn Est.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating meal card */}
                <div className="absolute -bottom-8 -left-8 bg-stone-900 border border-stone-700/80 rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Utensils className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wider">Next Meal</p>
                      <p className="font-bold text-white">Grilled Salmon Bowl</p>
                      <p className="text-sm text-stone-400">450 cal • 35g protein</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-stone-500 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-stone-700 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Unique emerald/teal tinted background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-stone-950 to-teal-950/20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-teal-400 uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">crush your goals</span>
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Our AI creates personalized plans that adapt to your goals, preferences, and lifestyle.
            </p>
          </div>

          {/* Features */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Workout */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900/80 to-stone-800/30 border border-stone-800/50 hover:border-teal-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10">
              <div className="absolute top-0 right-0 w-72 h-72 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Image
                  src="/images/workout.webp"
                  alt="Workout"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
              
              <div className="relative p-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-teal-500/30 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Workout Plans</h3>
                <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                  Custom routines based on your fitness level, available equipment, and specific goals.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    { text: "Personalized exercise selection", icon: Target },
                    { text: "Progressive overload tracking", icon: TrendingUp },
                    { text: "Video exercise guides", icon: Play },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-4 text-stone-300">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-teal-400" />
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/workout-plan"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 group/link"
                >
                  Create workout plan
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Meal */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900/80 to-stone-800/30 border border-stone-800/50 hover:border-amber-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10">
              <div className="absolute top-0 right-0 w-72 h-72 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Image
                  src="/images/meal-plan.webp"
                  alt="Meal plan"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
              
              <div className="relative p-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Meal Plans</h3>
                <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                  Nutrition plans tailored to your calorie needs, dietary preferences, and taste.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    { text: "Macro-balanced nutrition", icon: Target },
                    { text: "Dietary restriction support", icon: Shield },
                    { text: "Shopping list included", icon: Check },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-4 text-stone-300">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/meal-plan"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 group/link"
                >
                  Create meal plan
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-stone-900/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-emerald-500/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "100+", label: "Active Users", icon: Users, color: "teal" },
              { value: "4.9", label: "User Rating", icon: Star, color: "amber" },
              { value: "7", label: "Day Plans", icon: Clock, color: "violet" },
              { value: "100%", label: "Free to Use", icon: Shield, color: "emerald" },
            ].map((stat) => (
              <div key={stat.label} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative text-center p-8 bg-stone-900/50 border border-stone-800/50 rounded-2xl hover:border-stone-700/50 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                  <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-sm text-stone-500 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science-Backed Results */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Unique background for this section */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-stone-950 to-blue-950/20" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-6">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Proven Results</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Science-Backed
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Fitness Plans</span>
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Our AI algorithms are built on peer-reviewed research and proven training methodologies.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Progress Chart Card */}
            <div className="bg-stone-900/80 backdrop-blur-sm border border-stone-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Average User Progress</h3>
                  <p className="text-sm text-stone-500">Strength gains over 12 weeks</p>
                </div>
                <div className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full">
                  <span className="text-xs font-semibold text-teal-400">+47% AVG</span>
                </div>
              </div>
              
              {/* Chart visualization - improved */}
              <div className="relative h-56 mb-4 pl-10 pr-2">
                {/* Y-axis labels */}
                <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-stone-500 w-8">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                
                {/* Grid lines */}
                <div className="absolute inset-0 left-10 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full h-px bg-stone-800" />
                  ))}
                </div>
                
                {/* Bars */}
                <div className="absolute inset-0 left-10 flex items-end justify-between gap-1.5 pb-6">
                  {[
                    { height: 25, week: 1 },
                    { height: 32, week: 2 },
                    { height: 40, week: 3 },
                    { height: 48, week: 4 },
                    { height: 55, week: 5 },
                    { height: 62, week: 6 },
                    { height: 70, week: 7 },
                    { height: 78, week: 8 },
                    { height: 85, week: 9 },
                    { height: 90, week: 10 },
                    { height: 95, week: 11 },
                    { height: 100, week: 12 },
                  ].map((bar) => (
                    <div key={bar.week} className="flex-1 flex flex-col items-center">
                      <div className="w-full relative group cursor-pointer">
                        <div 
                          className="w-full bg-gradient-to-t from-teal-600 via-teal-500 to-emerald-400 rounded-t-md transition-all duration-300 group-hover:from-teal-500 group-hover:to-emerald-300 shadow-lg shadow-teal-500/20"
                          style={{ height: `${bar.height * 2}px` }}
                        />
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-stone-800 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {bar.height}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-10 right-2 flex justify-between">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((week) => (
                    <span key={week} className="text-[10px] text-stone-500 flex-1 text-center">W{week}</span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-400">47%</p>
                  <p className="text-xs text-stone-500">Strength Gain</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">12%</p>
                  <p className="text-xs text-stone-500">Body Fat Loss</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">89%</p>
                  <p className="text-xs text-stone-500">Goal Completion</p>
                </div>
              </div>
            </div>

            {/* Research Stats Card */}
            <div className="bg-stone-900/80 backdrop-blur-sm border border-stone-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Research-Driven Approach</h3>
                  <p className="text-sm text-stone-500">Based on scientific studies</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-violet-400" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Progressive Overload", desc: "Systematic increase in training volume for continuous adaptation", percentage: 94, color: "teal" },
                  { title: "Optimal Training Frequency", desc: "2-3x per muscle group weekly for maximum hypertrophy", percentage: 88, color: "emerald" },
                  { title: "Protein Timing", desc: "Strategic nutrient timing to maximize muscle protein synthesis", percentage: 91, color: "cyan" },
                  { title: "Recovery Optimization", desc: "Adequate rest periods between sessions for full recovery", percentage: 96, color: "violet" },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-stone-800/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <span className={`text-sm font-bold text-${item.color}-400`}>{item.percentage}%</span>
                    </div>
                    <p className="text-xs text-stone-500 mb-3">{item.desc}</p>
                    <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-400 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Research citations */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                stat: "2.5x", 
                title: "Faster Results", 
                desc: "Users following AI-personalized plans see results 2.5x faster than generic programs",
                source: "Based on user progress data"
              },
              { 
                stat: "73%", 
                title: "Better Adherence", 
                desc: "Personalized plans have 73% higher completion rates than one-size-fits-all approaches",
                source: "Sports Medicine Journal, 2023"
              },
              { 
                stat: "94%", 
                title: "User Satisfaction", 
                desc: "Of users report significant improvements in strength and body composition",
                source: "User survey results"
              },
            ].map((item) => (
              <div key={item.title} className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 hover:border-stone-700 transition-colors">
                <p className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent mb-2">{item.stat}</p>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-stone-400 mb-4">{item.desc}</p>
                <p className="text-xs text-stone-600 italic">{item.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose AI GymBRO */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Unique amber/orange tinted background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-stone-950 to-orange-950/20" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Why Choose Us</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Not Just Another
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Fitness App</span>
              </h2>
              <p className="text-xl text-stone-400 mb-10">
                We combine cutting-edge AI technology with proven fitness science to deliver truly personalized plans that adapt to your unique body and goals.
              </p>

              <div className="space-y-6">
                {[
                  { 
                    icon: Brain, 
                    title: "Truly Personalized", 
                    desc: "Not templates. Our AI analyzes 15+ factors to create plans unique to you.",
                    color: "violet"
                  },
                  { 
                    icon: TrendingUp, 
                    title: "Adaptive Programming", 
                    desc: "Plans evolve based on your progress, ensuring continuous improvement.",
                    color: "teal"
                  },
                  { 
                    icon: Target, 
                    title: "Goal-Specific", 
                    desc: "Whether fat loss, muscle gain, or strength - optimized for your objective.",
                    color: "amber"
                  },
                  { 
                    icon: Clock, 
                    title: "Time-Efficient", 
                    desc: "Maximum results in minimum time with scientifically-optimized routines.",
                    color: "cyan"
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-stone-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Card */}
            <div className="bg-stone-900/80 backdrop-blur-sm border border-stone-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-stone-800 bg-stone-800/30">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-stone-400">Feature</div>
                  <div className="text-sm font-bold text-teal-400 text-center">AI GymBRO</div>
                  <div className="text-sm font-medium text-stone-500 text-center">Generic Plans</div>
                </div>
              </div>
              <div className="divide-y divide-stone-800/50">
                {[
                  { feature: "Personalization", gymbro: "AI-powered, 15+ factors", generic: "One-size-fits-all" },
                  { feature: "Adaptation", gymbro: "Real-time adjustments", generic: "Static programs" },
                  { feature: "Nutrition Match", gymbro: "Synced with workouts", generic: "Separate planning" },
                  { feature: "Time to Results", gymbro: "2.5x faster", generic: "Standard pace" },
                  { feature: "Cost", gymbro: "100% Free", generic: "$50-200/month" },
                  { feature: "Expertise Required", gymbro: "Beginner-friendly", generic: "Knowledge needed" },
                ].map((row) => (
                  <div key={row.feature} className="grid grid-cols-3 gap-4 p-4 hover:bg-stone-800/20 transition-colors">
                    <div className="text-sm text-stone-300 font-medium">{row.feature}</div>
                    <div className="text-sm font-medium text-teal-400 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span>{row.gymbro}</span>
                    </div>
                    <div className="text-sm text-stone-500 text-center">{row.generic}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-teal-500/5 border-t border-teal-500/20">
                <p className="text-center text-sm text-teal-400 font-medium">
                  AI GymBRO wins in every category
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Unique rose/pink tinted background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/20 via-stone-950 to-pink-950/20" />
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px]" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 mb-6">
              <Users className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-semibold text-rose-400 uppercase tracking-wider">Success Stories</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Real People,
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent"> Real Results</span>
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Join hundreds of users who have transformed their fitness journey with AI GymBRO.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                name: "Jeffrey William",
                role: "Student",
                avatar: "JW",
                rating: 5,
                text: "As a busy student, I needed something efficient. AI GymBRO creates workouts that fit between my classes and the meal plans are budget-friendly. Already seeing results in just 6 weeks!",
                result: "Lost 12 lbs"
              },
              { 
                name: "Matthew Gareth G.",
                role: "Crypto Trader",
                avatar: "MG",
                rating: 5,
                text: "I spend most of my day watching charts, so I needed quick effective workouts. The AI understood my lifestyle perfectly. The personalization is next level - better than my previous personal trainer!",
                result: "+25% strength"
              },
              { 
                name: "Joseph Immanuel",
                role: "Web Developer",
                avatar: "JI",
                rating: 5,
                text: "Being a developer, I appreciate good algorithms. This AI actually learns from your inputs and creates scientifically-backed plans. The fact that it's free is just unbelievable. Highly recommend!",
                result: "Gained 8 lbs muscle"
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-stone-900/80 backdrop-blur-sm border border-stone-800 rounded-2xl p-6 hover:border-stone-700 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-300 mb-6 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-stone-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
                    <span className="text-xs font-semibold text-teal-400">{testimonial.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Unique violet/purple tinted background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-stone-950 to-purple-950/20" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 mb-6">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-violet-400 uppercase tracking-wider">How it works</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Three simple steps to
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">transform your body</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Target, 
                step: "01", 
                title: "Set Your Goals", 
                desc: "Tell us about your fitness objectives, experience level, and available equipment",
                color: "teal"
              },
              { 
                icon: Brain, 
                step: "02", 
                title: "AI Creates Plan", 
                desc: "Our AI generates a science-based plan optimized for your specific needs",
                color: "violet"
              },
              { 
                icon: TrendingUp, 
                step: "03", 
                title: "Track Progress", 
                desc: "Follow your plan, track completion, and watch your transformation unfold",
                color: "amber"
              }
            ].map((item, idx) => (
              <div key={item.step} className="relative group">
                {/* Step number connector for desktop */}
                {idx < 2 && (
                  <div className="hidden md:flex absolute top-12 -right-3 z-10 items-center justify-center w-6 h-6 bg-stone-800 border border-stone-700 rounded-full">
                    <ArrowRight className="w-3 h-3 text-stone-500" />
                  </div>
                )}
                
                <div className="relative h-full bg-stone-900 border border-stone-800 rounded-2xl p-8 hover:border-stone-700 transition-all duration-300 group-hover:bg-stone-900/80">
                  {/* Step badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Step {item.step}</span>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Unique teal/emerald tinted background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/30 via-stone-950 to-emerald-950/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[200px]" />
        
        <div className="max-w-5xl mx-auto relative">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-stone-900 via-stone-800/80 to-stone-900 border border-stone-700/50 p-12 sm:p-20">
            {/* Animated glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-8 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-semibold text-teal-300">100% Free, No Credit Card Required</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Ready to transform
                <br />
                <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">your fitness journey?</span>
              </h2>
              <p className="text-xl text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join <span className="text-white font-semibold">100+</span> fitness enthusiasts who are crushing their goals with AI-powered workout and meal plans.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 rounded-2xl shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all duration-300"
                >
                  Start Your Transformation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/workout-plan"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-stone-800 hover:bg-stone-700 border-2 border-stone-700 hover:border-stone-600 rounded-2xl transition-all duration-300"
                >
                  <Play className="w-5 h-5 text-teal-400 fill-teal-400" />
                  Try Demo
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-stone-700/30">
                {[
                  { icon: Shield, text: "No credit card" },
                  { icon: Zap, text: "Instant access" },
                  { icon: Users, text: "100+ users" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-stone-400">
                    <item.icon className="w-5 h-5 text-teal-400/70" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 border-t border-stone-800/50 bg-stone-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white block">AI GymBRO</span>
                <span className="text-sm text-stone-500">Your AI Fitness Coach</span>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <Link href="/workout-plan" className="text-stone-400 hover:text-teal-400 transition-colors text-sm font-medium">
                Workout Plans
              </Link>
              <Link href="/meal-plan" className="text-stone-400 hover:text-teal-400 transition-colors text-sm font-medium">
                Meal Plans
              </Link>
              <Link href="/forum" className="text-stone-400 hover:text-teal-400 transition-colors text-sm font-medium">
                Community
              </Link>
            </div>
            
            <p className="text-sm text-stone-500">
              Created by{" "}
              <a 
                href="https://matthewswong.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-teal-400 transition-colors font-medium"
              >
                Matthews Wong
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
