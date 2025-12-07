"use client"
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Check, 
  X, 
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trophy
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { 
  checkIsSuperAdmin, 
  getPendingCompletions,
  getAllCompletions,
  approveCompletion,
  rejectCompletion,
  type MealCompletionAdmin
} from "@/lib/services/adminService"

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminLeaderboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pendingCompletions, setPendingCompletions] = useState<MealCompletionAdmin[]>([])
  const [allCompletions, setAllCompletions] = useState<MealCompletionAdmin[]>([])
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
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
      const [pending, all] = await Promise.all([
        getPendingCompletions(),
        getAllCompletions(),
      ])
      setPendingCompletions(pending)
      setAllCompletions(all)
      setLoading(false)
    }

    loadData()
  }, [user, authLoading, router])

  const handleApprove = async (completionId: string) => {
    const success = await approveCompletion(completionId)
    if (success) {
      setPendingCompletions(pending => pending.filter(c => c.id !== completionId))
      setAllCompletions(all => all.map(c => 
        c.id === completionId ? { ...c, is_approved: true } : c
      ))
    }
  }

  const handleReject = async (completionId: string) => {
    const success = await rejectCompletion(completionId)
    if (success) {
      setPendingCompletions(pending => pending.filter(c => c.id !== completionId))
      setAllCompletions(all => all.filter(c => c.id !== completionId))
    }
    setDeleteConfirm(null)
  }

  if (loading || authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const displayCompletions = activeTab === "pending" ? pendingCompletions : allCompletions

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Manage Leaderboard</h1>
                <p className="text-stone-400 text-sm">
                  {pendingCompletions.length} pending approval
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              activeTab === "pending"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending ({pendingCompletions.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              activeTab === "all"
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-white"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            All ({allCompletions.length})
          </button>
        </div>

        {/* Completions Grid */}
        {displayCompletions.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/80 border border-stone-800/50 rounded-2xl">
            <Trophy className="w-12 h-12 text-stone-700 mx-auto mb-3" />
            <p className="text-stone-400">
              {activeTab === "pending" ? "No pending submissions" : "No submissions yet"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCompletions.map((completion) => (
              <div
                key={completion.id}
                className="bg-stone-900/80 border border-stone-800/50 rounded-xl overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-video relative">
                  <img
                    src={completion.photo_url}
                    alt="Meal proof"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {completion.is_approved && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Approved
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center">
                      <span className="text-xs font-medium text-stone-400">
                        {completion.username?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{completion.username}</p>
                      <p className="text-xs text-stone-500">{formatDate(completion.completed_at)}</p>
                    </div>
                  </div>

                  {completion.description && (
                    <p className="text-sm text-stone-400 mb-3 line-clamp-2">{completion.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!completion.is_approved && (
                      <button
                        onClick={() => handleApprove(completion.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(completion.id)}
                      className={`flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors ${
                        completion.is_approved ? "flex-1" : "px-3"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {completion.is_approved && "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Submission?</h3>
                  <p className="text-sm text-stone-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-stone-300 mb-6">
                Are you sure you want to delete this meal completion submission?
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(deleteConfirm)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
