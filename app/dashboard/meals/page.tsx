"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  Utensils, 
  ChevronDown,
  ChevronUp,
  Plus,
  Loader2,
  Flame,
  Clock,
  Youtube
} from "lucide-react";

interface Food {
  name: string;
  amount: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface Meal {
  name: string;
  foods: Food[];
  totals: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  notes?: string;
  cookingTime?: string;
}

interface MealPlan {
  id: string;
  plan_data: {
    summary: {
      goal: string;
      calories: number;
      dietType: string;
      mealsPerDay: number;
    };
    overview: string;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    meals: Record<string, Meal[]>;
  };
  created_at: string;
}

export default function MealsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("day1");
  const [expandedMeal, setExpandedMeal] = useState<number | null>(0);

  useEffect(() => {
    if (user) {
      fetchMealPlan();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchMealPlan = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from("saved_plans")
        .select("id, plan_data, created_at")
        .eq("user_id", user.id)
        .eq("plan_type", "meal")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setPlan(data as MealPlan);
    } catch (error) {
      console.log("No meal plan found");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          <p className="text-stone-500 text-sm">Loading meal plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <header className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-300 text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Meal Plan</h1>
              {plan && (
                <p className="text-sm text-stone-500">
                  {plan.plan_data.summary?.goal} · {plan.plan_data.summary?.calories} cal/day
                </p>
              )}
            </div>
          </div>
        </header>

        {!plan ? (
          <div className="p-12 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 flex items-center justify-center mx-auto mb-5">
              <Utensils className="w-7 h-7 text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No meal plan yet</h2>
            <p className="text-stone-400 mb-6 max-w-sm mx-auto">
              Generate a personalized meal plan based on your nutrition goals.
            </p>
            <Link
              href="/meal-plan"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create Meal Plan
            </Link>
          </div>
        ) : (
          <>
            {/* Macros */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Protein", value: plan.plan_data.macros?.protein || 0, unit: "g", color: "teal" },
                { label: "Carbs", value: plan.plan_data.macros?.carbs || 0, unit: "g", color: "amber" },
                { label: "Fat", value: plan.plan_data.macros?.fat || 0, unit: "g", color: "rose" }
              ].map((macro) => (
                <div key={macro.label} className="p-5 bg-stone-900 border border-stone-800/50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-white">{macro.value}<span className="text-lg">{macro.unit}</span></p>
                  <p className="text-xs text-stone-500 mt-1">{macro.label}</p>
                </div>
              ))}
            </div>

            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4">
              {Object.keys(plan.plan_data.meals || {}).map((dayKey) => {
                const dayNumber = dayKey.replace("day", "");
                const isSelected = selectedDay === dayKey;
                
                return (
                  <button
                    key={dayKey}
                    onClick={() => setSelectedDay(dayKey)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      isSelected 
                        ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/20" 
                        : "bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-stone-300"
                    }`}
                  >
                    Day {dayNumber}
                  </button>
                );
              })}
            </div>

            {/* Meals */}
            <div className="space-y-4">
              {plan.plan_data.meals?.[selectedDay]?.map((meal, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedMeal(expandedMeal === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 hover:bg-stone-800/30 transition-colors"
                  >
                    <div className="text-left">
                      <h3 className="font-semibold text-white">{meal.name}</h3>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="flex items-center gap-1.5 text-sm text-amber-400">
                          <Flame className="w-4 h-4" />
                          {meal.totals?.calories || 0} cal
                        </span>
                        {meal.cookingTime && (
                          <span className="flex items-center gap-1.5 text-sm text-stone-500">
                            <Clock className="w-4 h-4" />
                            {meal.cookingTime}
                          </span>
                        )}
                      </div>
                    </div>
                    {expandedMeal === idx ? (
                      <ChevronUp className="w-5 h-5 text-stone-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-500" />
                    )}
                  </button>

                  {expandedMeal === idx && (
                    <div className="px-5 pb-5 border-t border-stone-800/50">
                      {/* YouTube Link */}
                      <a
                        href={`https://www.youtube.com/results?search_query=how+to+cook+${encodeURIComponent(meal.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 mt-4 mb-4 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 transition-colors group"
                      >
                        <Youtube className="w-5 h-5" />
                        <span className="text-sm font-medium">Watch how to cook {meal.name}</span>
                      </a>
                      
                      <div className="space-y-3">
                        {meal.foods?.map((food, foodIdx) => (
                          <div 
                            key={foodIdx}
                            className="flex items-center justify-between py-3 border-b border-stone-800/30 last:border-0"
                          >
                            <div>
                              <p className="text-stone-200 font-medium">{food.name}</p>
                              <p className="text-sm text-stone-600">{food.amount}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-stone-400">{food.calories} cal</p>
                              <p className="text-xs text-stone-600">
                                P:{food.protein}g · C:{food.carbs}g · F:{food.fat}g
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {meal.notes && (
                        <p className="text-sm text-stone-500 mt-4 pt-4 border-t border-stone-800/30 italic">
                          {meal.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* New Plan Link */}
            <div className="mt-10 pt-8 border-t border-stone-800/50 text-center">
              <Link
                href="/meal-plan"
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Generate new meal plan
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
