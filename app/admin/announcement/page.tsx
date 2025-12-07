"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, AlertCircle, Megaphone } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { checkIsSuperAdmin, getAnnouncementsCategoryId } from "@/lib/services/adminService"
import { createThread } from "@/lib/services/forumService"

export default function NewAnnouncementPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcementCategoryId, setAnnouncementCategoryId] = useState<string | null>(null)
  
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

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
      
      const categoryId = await getAnnouncementsCategoryId()
      setAnnouncementCategoryId(categoryId)
      setLoading(false)
    }

    checkAdmin()
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !announcementCategoryId || !title.trim() || !content.trim()) return

    setSubmitting(true)
    setError(null)

    const thread = await createThread(announcementCategoryId, title.trim(), content.trim(), user.id)
    
    if (thread) {
      router.push(`/forum/announcements/${thread.slug}`)
    } else {
      setError("Failed to create announcement. Please try again.")
      setSubmitting(false)
    }
  }

  if (loading || authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!announcementCategoryId) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Announcements Category Not Found</h1>
          <p className="text-stone-400 mb-4">
            Please run the SQL to create the announcements category first.
          </p>
          <Link href="/admin" className="text-violet-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">New Announcement</h1>
              <p className="text-stone-400">Post an official announcement to the community</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6">
          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">
              <Megaphone className="w-4 h-4" />
              Official Announcements
            </span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Announcement Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New Feature: AI Workout Recommendations"
              required
              maxLength={200}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-violet-500/50"
            />
            <p className="text-xs text-stone-600 mt-1">{title.length}/200 characters</p>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your announcement here..."
              required
              rows={10}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-violet-500/50 resize-none"
            />
          </div>

          {/* Info */}
          <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl mb-6">
            <h4 className="text-sm font-medium text-violet-300 mb-2">About Announcements</h4>
            <ul className="text-xs text-stone-400 space-y-1">
              <li>• Only super admins can post announcements</li>
              <li>• Announcements appear at the top of the forum</li>
              <li>• All users can view and reply to announcements</li>
            </ul>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/admin"
              className="px-5 py-2.5 text-stone-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 disabled:from-stone-700 disabled:to-stone-700 text-white font-medium rounded-xl transition-all disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? "Publishing..." : "Publish Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
