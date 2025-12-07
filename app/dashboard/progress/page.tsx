"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, TrendingUp, Loader2, Calendar, Target } from "lucide-react";

interface ProgressLog {
  id: string;
  date: string;
  weight: number;
  notes: string;
}

export default function ProgressPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [completionRate, setCompletionRate] = useState<number | null>(null);

  useEffect(() => {
    if (user) fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data: logsData } = await supabase
        .from("progress_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(10);

      if (logsData) setLogs(logsData);

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const startDate = startOfWeek.toISOString().split('T')[0];

      const { data: items } = await supabase
        .from("plan_items")
        .select("is_completed")
        .eq("user_id", user.id)
        .gte("scheduled_date", startDate);

      if (items && items.length > 0) {
        const completed = items.filter(i => i.is_completed).length;
        setCompletionRate(Math.round((completed / items.length) * 100));
      }

    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
          <p className="text-stone-500 text-sm">Loading progress...</p>
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Progress</h1>
              <p className="text-sm text-stone-500">Track your fitness journey</p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-400" />
              <p className="text-sm text-stone-500">This Week</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {completionRate !== null ? `${completionRate}%` : "—"}
            </p>
            <p className="text-xs text-stone-600 mt-1">Completion rate</p>
          </div>
          <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-violet-400" />
              <p className="text-sm text-stone-500">Latest Weight</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {logs[0]?.weight ? `${logs[0].weight}` : "—"}
              {logs[0]?.weight && <span className="text-lg font-normal text-stone-500 ml-1">kg</span>}
            </p>
            <p className="text-xs text-stone-600 mt-1">
              {logs[0] ? new Date(logs[0].date).toLocaleDateString() : "No data yet"}
            </p>
          </div>
        </div>

        {/* Weight History */}
        <div>
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-5">
            Weight History
          </h2>
          
          {logs.length === 0 ? (
            <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-xl p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-stone-800/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-stone-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No entries yet</h3>
              <p className="text-stone-500 text-sm">
                Track your weight to see your progress over time
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div 
                  key={log.id}
                  className="flex items-center justify-between p-5 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-xl"
                >
                  <div>
                    <p className="text-white font-semibold text-lg">{log.weight} kg</p>
                    {log.notes && (
                      <p className="text-sm text-stone-500 mt-0.5">{log.notes}</p>
                    )}
                  </div>
                  <p className="text-sm text-stone-500">
                    {new Date(log.date).toLocaleDateString("en-US", { 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
