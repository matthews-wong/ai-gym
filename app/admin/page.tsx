"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Users, 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  TrendingUp,
  Clock,
  Shield,
  FileText,
  Megaphone,
  RefreshCw,
  Pencil,
  Check,
  X,
  Trophy
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { 
  checkIsSuperAdmin, 
  getAdminStats, 
  getRecentPlans, 
  getRecentUsers,
  updateUsername,
  type AdminStats,
  type RecentPlan,
  type RecentUser
} from "@/lib/services/adminService"

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentPlans, setRecentPlans] = useState<RecentPlan[]>([])
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editUsername, setEditUsername] = useState("")

  const loadData = useCallback(async () => {
    const [statsData, plans, users] = await Promise.all([
      getAdminStats(),
      getRecentPlans(10),
      getRecentUsers(10),
    ])
    setStats(statsData)
    setRecentPlans(plans)
    setRecentUsers(users)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleEditUsername = (user: RecentUser) => {
    setEditingUserId(user.id)
    setEditUsername(user.username || "")
  }

  const handleSaveUsername = async (userId: string) => {
    if (!editUsername.trim()) return
    const success = await updateUsername(userId, editUsername.trim())
    if (success) {
      setRecentUsers(users => users.map(u => 
        u.id === userId ? { ...u, username: editUsername.trim() } : u
      ))
    }
    setEditingUserId(null)
    setEditUsername("")
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setEditUsername("")
  }

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        if (!authLoading) router.push("/auth/login")
        return
      }

      const adminStatus = await checkIsSuperAdmin(user.id)
      if (!adminStatus) {
        router.push("/")
        return
      }

      setIsAdmin(true)
      await loadData()
      setLoading(false)
    }

    checkAdmin()
  }, [user, authLoading, router, loadData])

  // Real-time subscription for new users and plans
  useEffect(() => {
    if (!isAdmin) return

    const profilesChannel = supabase
      .channel("admin-profiles")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "profiles" }, () => {
        loadData()
      })
      .subscribe()

    const plansChannel = supabase
      .channel("admin-plans")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "saved_plans" }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(profilesChannel)
      supabase.removeChannel(plansChannel)
    }
  }, [isAdmin, loadData])

  if (loading || authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-400">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-stone-400 text-xs sm:text-sm">AI GymBro Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex-shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/admin/threads"
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm rounded-lg transition-colors flex-shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Threads</span>
            </Link>
            <Link
              href="/admin/leaderboard"
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-sm rounded-lg transition-colors flex-shrink-0"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </Link>
            <Link
              href="/admin/announcement"
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white text-sm rounded-lg transition-colors flex-shrink-0"
            >
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Announce</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Users"
            value={stats?.total_users || 0}
            subValue={`+${stats?.new_users_7d || 0} this week`}
            color="blue"
          />
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            label="Total Plans"
            value={stats?.total_plans || 0}
            subValue={`+${stats?.plans_7d || 0} this week`}
            color="teal"
          />
          <StatCard
            icon={<Dumbbell className="w-5 h-5" />}
            label="Workout Plans"
            value={stats?.total_workout_plans || 0}
            color="emerald"
          />
          <StatCard
            icon={<Utensils className="w-5 h-5" />}
            label="Meal Plans"
            value={stats?.total_meal_plans || 0}
            color="amber"
          />
        </div>

        {/* Forum Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <StatCard
            icon={<MessageSquare className="w-5 h-5" />}
            label="Threads"
            value={stats?.total_threads || 0}
            subValue={`+${stats?.threads_7d || 0} this week`}
            color="violet"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Replies"
            value={stats?.total_replies || 0}
            color="rose"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="New (30d)"
            value={stats?.new_users_30d || 0}
            color="cyan"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Recent Plans */}
          <div className="bg-stone-900/80 border border-stone-800/50 rounded-xl p-4 sm:p-5">
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              Recent Plans
            </h2>
            <div className="space-y-2">
              {recentPlans.length === 0 ? (
                <p className="text-stone-500 text-sm">No plans generated yet</p>
              ) : (
                recentPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center gap-3 p-2.5 bg-stone-800/30 rounded-lg"
                  >
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                      plan.plan_type === "workout" 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {plan.plan_type === "workout" ? (
                        <Dumbbell className="w-3.5 h-3.5" />
                      ) : (
                        <Utensils className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white capitalize truncate">{plan.plan_type}</p>
                      <p className="text-xs text-stone-500 truncate">{plan.username || plan.user_email}</p>
                    </div>
                    <span className="text-[10px] text-stone-600 flex-shrink-0 hidden sm:block">{formatDate(plan.created_at)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-stone-900/80 border border-stone-800/50 rounded-xl p-4 sm:p-5">
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Recent Users
            </h2>
            <div className="space-y-2">
              {recentUsers.length === 0 ? (
                <p className="text-stone-500 text-sm">No users yet</p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-2 p-2.5 bg-stone-800/30 rounded-lg"
                  >
                    <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-medium text-stone-300">
                        {u.email?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingUserId === u.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            className="px-2 py-1 text-xs bg-stone-700 border border-stone-600 rounded text-white w-24 sm:w-28"
                            placeholder="Username"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveUsername(u.id)
                              if (e.key === "Escape") handleCancelEdit()
                            }}
                          />
                          <button
                            onClick={() => handleSaveUsername(u.id)}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className={`text-sm font-medium truncate ${u.username ? "text-white" : "text-stone-500 italic"}`}>
                            {u.username || "No username"}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">{u.email}</p>
                        </>
                      )}
                    </div>
                    {editingUserId !== u.id && (
                      <button
                        onClick={() => handleEditUsername(u)}
                        className="p-1.5 text-stone-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors flex-shrink-0"
                        title="Edit username"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: number
  subValue?: string
  color: string
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-400",
    teal: "bg-teal-500/20 text-teal-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/20 text-amber-400",
    violet: "bg-violet-500/20 text-violet-400",
    rose: "bg-rose-500/20 text-rose-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
  }

  return (
    <div className="bg-stone-900/80 border border-stone-800/50 rounded-xl p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-xs sm:text-sm text-stone-400 truncate">{label}</span>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-white">{value.toLocaleString()}</p>
      {subValue && <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">{subValue}</p>}
    </div>
  )
}
