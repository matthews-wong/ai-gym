"use client"
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Check, 
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Camera,
  Dumbbell
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { 
  checkIsSuperAdmin, 
  getPendingCompletions,
  getAllCompletions,
  approveCompletion,
  rejectCompletion,
  getPendingTransformations,
  getAllTransformations,
  approveTransformation,
  rejectTransformation,
  type MealCompletionAdmin,
  type TransformationAdmin
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
  const [contentType, setContentType] = useState<"meals" | "transformations">("meals")
  const [statusFilter, setStatusFilter] = useState<"pending" | "all">("pending")
  
  // Meal completions
  const [pendingCompletions, setPendingCompletions] = useState<MealCompletionAdmin[]>([])
  const [allCompletions, setAllCompletions] = useState<MealCompletionAdmin[]>([])
  
  // Transformations
  const [pendingTransformations, setPendingTransformations] = useState<TransformationAdmin[]>([])
  const [allTransformations, setAllTransformations] = useState<TransformationAdmin[]>([])
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: "meal" | "transform" } | null>(null)

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
      const [pendingMeals, allMeals, pendingTransforms, allTransforms] = await Promise.all([
        getPendingCompletions(),
        getAllCompletions(),
        getPendingTransformations(),
        getAllTransformations(),
      ])
      setPendingCompletions(pendingMeals)
      setAllCompletions(allMeals)
      setPendingTransformations(pendingTransforms)
      setAllTransformations(allTransforms)
      setLoading(false)
    }

    loadData()
  }, [user, authLoading, router])

  const handleApproveMeal = async (completionId: string) => {
    const success = await approveCompletion(completionId)
    if (success) {
      setPendingCompletions(pending => pending.filter(c => c.id !== completionId))
      setAllCompletions(all => all.map(c => 
        c.id === completionId ? { ...c, is_approved: true } : c
      ))
    }
  }

  const handleApproveTransform = async (transformId: string) => {
    const success = await approveTransformation(transformId)
    if (success) {
      setPendingTransformations(pending => pending.filter(t => t.id !== transformId))
      setAllTransformations(all => all.map(t => 
        t.id === transformId ? { ...t, is_approved: true } : t
      ))
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    
    if (deleteConfirm.type === "meal") {
      const success = await rejectCompletion(deleteConfirm.id)
      if (success) {
        setPendingCompletions(pending => pending.filter(c => c.id !== deleteConfirm.id))
        setAllCompletions(all => all.filter(c => c.id !== deleteConfirm.id))
      }
    } else {
      const success = await rejectTransformation(deleteConfirm.id)
      if (success) {
        setPendingTransformations(pending => pending.filter(t => t.id !== deleteConfirm.id))
        setAllTransformations(all => all.filter(t => t.id !== deleteConfirm.id))
      }
    }
    setDeleteConfirm(null)
  }
  
  const pendingCount = pendingCompletions.length + pendingTransformations.length

  if (loading || authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors mb-3 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Manage Leaderboard</h1>
              <p className="text-stone-500 text-xs">{pendingCount} pending</p>
            </div>
          </div>
        </div>

        {/* Content Type Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setContentType("meals")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
              contentType === "meals"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-white"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Meals</span>
            <span className="text-xs opacity-70">({pendingCompletions.length})</span>
          </button>
          <button
            onClick={() => setContentType("transformations")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
              contentType === "transformations"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-white"
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Transforms</span>
            <span className="text-xs opacity-70">({pendingTransformations.length})</span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setStatusFilter("pending")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "pending"
                ? "bg-stone-800 text-white"
                : "text-stone-500 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-stone-800 text-white"
                : "text-stone-500 hover:text-white"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            All
          </button>
        </div>

        {/* Content Grid */}
        {contentType === "meals" ? (
          // Meal Completions
          (() => {
            const displayMeals = statusFilter === "pending" ? pendingCompletions : allCompletions
            return displayMeals.length === 0 ? (
              <div className="text-center py-16 bg-stone-900/80 border border-stone-800/50 rounded-2xl">
                <Camera className="w-12 h-12 text-stone-700 mx-auto mb-3" />
                <p className="text-stone-400">
                  {statusFilter === "pending" ? "No pending meal proofs" : "No meal proofs yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {displayMeals.map((completion) => (
                  <div
                    key={completion.id}
                    className="bg-stone-900/80 border border-stone-800/50 rounded-xl overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={completion.photo_url}
                        alt="Meal proof"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {completion.is_approved && (
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-emerald-500/90 text-white text-[10px] font-medium rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span className="hidden sm:inline">Approved</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-medium text-stone-400">
                            {completion.username?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">{completion.username}</p>
                          <p className="text-[10px] text-stone-500 hidden sm:block">{formatDate(completion.completed_at)}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {!completion.is_approved && (
                          <button
                            onClick={() => handleApproveMeal(completion.id)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-md transition-colors text-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Approve</span>
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirm({ id: completion.id, type: "meal" })}
                          className={`flex items-center justify-center gap-1 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors text-xs ${
                            completion.is_approved ? "flex-1" : "px-2"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{completion.is_approved && "Delete"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()
        ) : (
          // Transformations
          (() => {
            const displayTransforms = statusFilter === "pending" ? pendingTransformations : allTransformations
            return displayTransforms.length === 0 ? (
              <div className="text-center py-16 bg-stone-900/80 border border-stone-800/50 rounded-2xl">
                <Dumbbell className="w-12 h-12 text-stone-700 mx-auto mb-3" />
                <p className="text-stone-400">
                  {statusFilter === "pending" ? "No pending transformations" : "No transformations yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {displayTransforms.map((transform) => (
                  <div
                    key={transform.id}
                    className="bg-stone-900/80 border border-stone-800/50 rounded-xl overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="relative">
                        <img
                          src={transform.before_photo_url}
                          alt="Before"
                          className="w-full aspect-[3/4] object-cover"
                        />
                        <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/70 text-white text-[10px] rounded">Before</span>
                      </div>
                      <div className="relative">
                        <img
                          src={transform.after_photo_url}
                          alt="After"
                          className="w-full aspect-[3/4] object-cover"
                        />
                        <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-teal-500/90 text-white text-[10px] rounded">After</span>
                        {transform.is_approved && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-medium text-stone-400">
                            {transform.username?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">{transform.username}</p>
                        </div>
                        {transform.duration && (
                          <span className="text-[10px] text-teal-400 flex-shrink-0">{transform.duration}</span>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        {!transform.is_approved && (
                          <button
                            onClick={() => handleApproveTransform(transform.id)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-md transition-colors text-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Approve</span>
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirm({ id: transform.id, type: "transform" })}
                          className={`flex items-center justify-center gap-1 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors text-xs ${
                            transform.is_approved ? "flex-1" : "px-2"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{transform.is_approved && "Delete"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()
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
                Are you sure you want to delete this {deleteConfirm.type === "meal" ? "meal proof" : "transformation"}?
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
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
