"use client"

import { useEffect, useState } from "react"
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
  Megaphone
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { 
  checkIsSuperAdmin, 
  getAdminStats, 
  getRecentPlans, 
  getRecentUsers,
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

      const [statsData, plans, users] = await Promise.all([
        getAdminStats(),
        getRecentPlans(10),
        getRecentUsers(10),
      ])

      setStats(statsData)
      setRecentPlans(plans)
      setRecentUsers(users)
      setLoading(false)
    }

    checkAdmin()
  }, [user, authLoading, router])

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-stone-400 text-sm">AI GymBro Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/threads"
              className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Manage Threads
            </Link>
            <Link
              href="/admin/announcement"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white rounded-xl transition-colors"
            >
              <Megaphone className="w-4 h-4" />
              New Announcement
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<MessageSquare className="w-5 h-5" />}
            label="Forum Threads"
            value={stats?.total_threads || 0}
            subValue={`+${stats?.threads_7d || 0} this week`}
            color="violet"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Total Replies"
            value={stats?.total_replies || 0}
            color="rose"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="New Users (30d)"
            value={stats?.new_users_30d || 0}
            color="cyan"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Plans */}
          <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Recent Plans Generated
            </h2>
            <div className="space-y-3">
              {recentPlans.length === 0 ? (
                <p className="text-stone-500 text-sm">No plans generated yet</p>
              ) : (
                recentPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-3 bg-stone-800/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        plan.plan_type === "workout" 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {plan.plan_type === "workout" ? (
                          <Dumbbell className="w-4 h-4" />
                        ) : (
                          <Utensils className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{plan.plan_type} Plan</p>
                        <p className="text-xs text-stone-500">{plan.username || plan.user_email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-stone-600">{formatDate(plan.created_at)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Recent Users
            </h2>
            <div className="space-y-3">
              {recentUsers.length === 0 ? (
                <p className="text-stone-500 text-sm">No users yet</p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 bg-stone-800/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center">
                        <span className="text-xs font-medium text-stone-300">
                          {u.email?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{u.username || "No username"}</p>
                        <p className="text-xs text-stone-500">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-stone-600">{formatDate(u.created_at)}</span>
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
    <div className="bg-stone-900/80 border border-stone-800/50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-sm text-stone-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      {subValue && <p className="text-xs text-stone-500 mt-1">{subValue}</p>}
    </div>
  )
}
