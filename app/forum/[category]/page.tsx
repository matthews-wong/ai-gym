"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Eye, MessageSquare, Clock, Pin } from "lucide-react"
import { getCategoryBySlug, getThreads, type ForumCategory, type ForumThread } from "@/lib/services/forumService"
import { useAuth } from "@/lib/hooks/useAuth"

const colorMap: Record<string, string> = {
  teal: "bg-teal-500/20 text-teal-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/20 text-amber-400",
  rose: "bg-rose-500/20 text-rose-400",
  blue: "bg-blue-500/20 text-blue-400",
  violet: "bg-violet-500/20 text-violet-400",
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return "Just now"
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const [category, setCategory] = useState<ForumCategory | null>(null)
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function loadData() {
      const [cat, threadList] = await Promise.all([
        getCategoryBySlug(categorySlug),
        getThreads(categorySlug, 50),
      ])
      setCategory(cat)
      setThreads(threadList)
      setLoading(false)
    }
    loadData()
  }, [categorySlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category not found</h1>
          <Link href="/forum" className="text-teal-400 hover:underline">
            Back to Forum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{category.name}</h1>
              <p className="text-stone-400 mt-1">{category.description}</p>
            </div>
            {!category.is_admin_only && (
              user ? (
                <Link
                  href={`/forum/new?category=${category.slug}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-medium rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                  New Thread
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-xl transition-all"
                >
                  Sign in to post
                </Link>
              )
            )}
          </div>
        </div>

        {/* Threads */}
        <div className="space-y-2">
          {threads.length === 0 ? (
            <div className="text-center py-16 bg-stone-900/80 border border-stone-800/50 rounded-xl">
              <MessageSquare className="w-12 h-12 text-stone-700 mx-auto mb-3" />
              <p className="text-stone-400 mb-4">
                {category.is_admin_only 
                  ? "No announcements yet. Stay tuned!" 
                  : "No threads in this category yet."}
              </p>
              {user && !category.is_admin_only && (
                <Link
                  href={`/forum/new?category=${category.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Start a discussion
                </Link>
              )}
            </div>
          ) : (
            threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/${categorySlug}/${thread.slug}`}
                className="block p-4 bg-stone-900/80 border border-stone-800/50 rounded-xl hover:bg-stone-800/50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-stone-400">
                      {thread.author_username?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {thread.is_pinned && (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400">
                          <Pin className="w-3 h-3" />
                          Pinned
                        </span>
                      )}
                      {thread.is_locked && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-stone-700 text-stone-400">
                          Locked
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                      {thread.title}
                    </h3>
                    <p className="text-sm text-stone-500 line-clamp-2 mt-1">{thread.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-stone-600">
                      <span>by <span className="text-stone-400">{thread.author_username}</span></span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(thread.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {thread.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {thread.reply_count || 0} replies
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
