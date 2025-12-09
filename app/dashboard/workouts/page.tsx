"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  Dumbbell, 
  Plus,
  Loader2,
  Calendar,
  Clock,
  Youtube
} from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface DayWorkout {
  focus: string;
  description: string;
  exercises: Exercise[];
  notes: string[];
}

interface WorkoutPlan {
  id: string;
  plan_data: {
    summary: {
      goal: string;
      level: string;
      daysPerWeek: number;
      sessionLength: number;
    };
    overview: string;
    workouts: Record<string, DayWorkout>;
  };
  created_at: string;
}

export default function WorkoutsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>("day1");

  useEffect(() => {
    if (user) {
      fetchWorkoutPlan();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchWorkoutPlan = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from("saved_plans")
        .select("id, plan_data, created_at")
        .eq("user_id", user.id)
        .eq("plan_type", "workout")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setPlan(data as WorkoutPlan);
    } catch {
      // No workout plan found
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
          <p className="text-stone-500 text-sm">Loading workout plan...</p>
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Workout Plan</h1>
              {plan && (
                <p className="text-sm text-stone-500">
                  {plan.plan_data.summary?.goal} · {plan.plan_data.summary?.level}
                </p>
              )}
            </div>
          </div>
        </header>

        {!plan ? (
          <div className="p-12 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 flex items-center justify-center mx-auto mb-5">
              <Dumbbell className="w-7 h-7 text-teal-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No workout plan yet</h2>
            <p className="text-stone-400 mb-6 max-w-sm mx-auto">
              Generate a personalized workout plan based on your fitness goals.
            </p>
            <Link
              href="/workout-plan"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/20 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create Workout Plan
            </Link>
          </div>
        ) : (
          <>
            {/* Overview */}
            <div className="p-6 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-xl mb-8">
              <p className="text-stone-300 leading-relaxed">
                {plan.plan_data.overview}
              </p>
              <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-stone-800/50">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  <span className="text-stone-400">
                    {plan.plan_data.summary?.daysPerWeek} days/week
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-teal-400" />
                  <span className="text-stone-400">
                    {plan.plan_data.summary?.sessionLength} min/session
                  </span>
                </div>
              </div>
            </div>

            {/* Workout Days - Horizontal Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
              {Object.entries(plan.plan_data.workouts || {}).map(([dayKey, workout]) => {
                const dayNumber = dayKey.replace("day", "");
                const isSelected = expandedDay === dayKey;

                return (
                  <button
                    key={dayKey}
                    onClick={() => setExpandedDay(dayKey)}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-500/50 text-teal-400"
                        : "bg-stone-900/80 border-stone-800/50 text-stone-400 hover:bg-stone-800/50 hover:text-white"
                    }`}
                  >
                    <span className="text-xs opacity-70">Day</span>
                    <span className="text-lg font-bold">{dayNumber}</span>
                    <span className="text-xs truncate max-w-[80px]">{workout.focus?.split(" ")[0] || "Workout"}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Content */}
            {expandedDay && plan.plan_data.workouts[expandedDay] && (
              <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-stone-800/50">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {plan.plan_data.workouts[expandedDay].focus || "Workout"}
                  </h3>
                  {plan.plan_data.workouts[expandedDay].description && (
                    <p className="text-stone-400 text-sm">{plan.plan_data.workouts[expandedDay].description}</p>
                  )}
                  <p className="text-xs text-stone-500 mt-2">
                    {plan.plan_data.workouts[expandedDay].exercises?.length || 0} exercises
                  </p>
                </div>

                <div className="p-5 space-y-3">
                  {plan.plan_data.workouts[expandedDay].exercises?.map((exercise, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-stone-800/30 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-white">{exercise.name}</p>
                        <div className="text-right">
                          <p className="text-teal-400 font-semibold">
                            {exercise.sets} × {exercise.reps}
                          </p>
                          <p className="text-xs text-stone-500">Rest: {exercise.rest}</p>
                        </div>
                      </div>
                      <a
                        href={`https://www.youtube.com/results?search_query=how+to+${encodeURIComponent(exercise.name)}+exercise+form`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                        Watch tutorial
                      </a>
                    </div>
                  ))}
                </div>

                {plan.plan_data.workouts[expandedDay].notes && plan.plan_data.workouts[expandedDay].notes.length > 0 && (
                  <div className="px-5 pb-5">
                    <div className="p-4 bg-stone-800/20 rounded-xl">
                      <p className="text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Notes</p>
                      <ul className="space-y-1.5">
                        {plan.plan_data.workouts[expandedDay].notes.map((note, idx) => (
                          <li key={idx} className="text-sm text-stone-400">• {note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* New Plan Link */}
            <div className="mt-10 pt-8 border-t border-stone-800/50 text-center">
              <Link
                href="/workout-plan"
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-teal-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Generate new workout plan
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
