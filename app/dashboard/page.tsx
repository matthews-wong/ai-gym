"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { 
  Dumbbell, 
  Utensils, 
  ChevronRight,
  Sparkles,
  Loader2,
  Settings
} from "lucide-react";

interface SavedPlan {
  id: string;
  plan_type: "workout" | "meal";
  plan_data: Record<string, unknown>;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [workoutPlan, setWorkoutPlan] = useState<SavedPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<SavedPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start fetching as soon as we have a user, don't wait for authLoading
    if (user) {
      fetchPlans();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchPlans = async () => {
    if (!user) return;

    try {
      // Run both queries in parallel for faster loading
      const [workoutResult, mealResult] = await Promise.all([
        supabase
          .from("saved_plans")
          .select("id, plan_type, created_at")
          .eq("user_id", user.id)
          .eq("plan_type", "workout")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("saved_plans")
          .select("id, plan_type, created_at")
          .eq("user_id", user.id)
          .eq("plan_type", "meal")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      if (workoutResult.data) setWorkoutPlan(workoutResult.data as SavedPlan);
      if (mealResult.data) setMealPlan(mealResult.data as SavedPlan);

    } catch {
      // No plans found or tables not created yet
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
          <p className="text-stone-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.email?.split("@")[0] || "there";
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Header */}
        <header className="mb-12 flex items-start justify-between">
          <div>
            <p className="text-stone-500 text-sm mb-1">{greeting}</p>
            <h1 className="text-3xl font-bold text-white">{userName}</h1>
          </div>
          <Link 
            href="/dashboard/settings"
            className="p-2.5 text-stone-500 hover:text-white hover:bg-stone-800 rounded-xl transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </header>

        {/* Plans */}
        <section className="mb-12">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-5">
            Your Plans
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Workout Plan */}
            <Link href="/dashboard/workouts" className="group">
              <div className="relative overflow-hidden p-6 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-2xl hover:border-teal-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-teal-400" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-700 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Workout Plan</h3>
                  <p className="text-sm text-stone-500">
                    {workoutPlan ? `Created ${formatDate(workoutPlan.created_at)}` : "No plan created yet"}
                  </p>
                </div>
              </div>
            </Link>

            {/* Meal Plan */}
            <Link href="/dashboard/meals" className="group">
              <div className="relative overflow-hidden p-6 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-2xl hover:border-amber-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
                      <Utensils className="w-6 h-6 text-amber-400" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-700 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Meal Plan</h3>
                  <p className="text-sm text-stone-500">
                    {mealPlan ? `Created ${formatDate(mealPlan.created_at)}` : "No plan created yet"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-5">
            Create New
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/workout-plan"
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-teal-500/20 transition-all duration-300"
            >
              <Dumbbell className="w-4 h-4" />
              New Workout Plan
            </Link>
            <Link 
              href="/meal-plan"
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-stone-800 hover:bg-stone-700 text-white text-sm font-semibold rounded-xl border border-stone-700/50 transition-all duration-300"
            >
              <Utensils className="w-4 h-4" />
              New Meal Plan
            </Link>
          </div>
        </section>

        {/* Empty State */}
        {(!workoutPlan && !mealPlan) && (
          <div className="mt-12 p-8 bg-gradient-to-br from-stone-900/80 to-stone-900/40 border border-stone-800/50 rounded-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Welcome to your dashboard</h3>
            <p className="text-stone-400 max-w-md mx-auto">
              Create your first workout or meal plan to get started on your wellness journey.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 18) return "Good afternoon,";
  return "Good evening,";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
