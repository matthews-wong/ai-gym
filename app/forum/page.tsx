"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageCircle, Dumbbell, Utensils, TrendingUp, HelpCircle, Plus, Eye, MessageSquare, Clock, Megaphone } from "lucide-react"
import { getCategories, getThreads, type ForumCategory, type ForumThread } from "@/lib/services/forumService"
import { useAuth } from "@/lib/hooks/useAuth"
import { ForumThreadSkeleton, Skeleton } from "@/components/ui/skeleton-loaders"

const iconMap: Record<string, React.ReactNode> = {
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  Megaphone: <Megaphone className="w-5 h-5" />,
}

const colorMap: Record<string, string> = {
  teal: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  rose: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  violet: "bg-violet-500/20 text-violet-400 border-violet-500/30",
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

export default function ForumPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [recentThreads, setRecentThreads] = useState<ForumThread[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function loadData() {
      const [cats, threads] = await Promise.all([
        getCategories(),
        getThreads(undefined, 10),
      ])
      setCategories(cats)
      setRecentThreads(threads)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Community Forum</h1>
            <p className="text-stone-400 mt-1">Connect, share, and learn with fellow fitness enthusiasts</p>
          </div>
          {user ? (
            <Link
              href="/forum/new"
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
          )}
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Categories Skeleton */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-stone-900/80 border border-stone-800/50 rounded-xl">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Threads Skeleton */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Discussions</h2>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <ForumThreadSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Categories */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/forum/${category.slug}`}
                    className="flex items-center gap-3 p-4 bg-stone-900/80 border border-stone-800/50 rounded-xl hover:bg-stone-800/50 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorMap[category.color] || colorMap.teal}`}>
                      {iconMap[category.icon] || <MessageCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white group-hover:text-teal-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-stone-500 truncate">{category.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Threads */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Discussions</h2>
              <div className="space-y-2">
                {recentThreads.length === 0 ? (
                  <div className="text-center py-12 bg-stone-900/80 border border-stone-800/50 rounded-xl">
                    <MessageSquare className="w-12 h-12 text-stone-700 mx-auto mb-3" />
                    <p className="text-stone-400">No discussions yet. Be the first to start one!</p>
                  </div>
                ) : (
                  recentThreads.map((thread) => (
                    <Link
                      key={thread.id}
                      href={`/forum/${thread.category_slug}/${thread.slug}`}
                      className="block p-4 bg-stone-900/80 border border-stone-800/50 rounded-xl hover:bg-stone-800/50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-stone-400">
                            {thread.author_username?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[thread.category_color || "teal"]}`}>
                              {thread.category_name}
                            </span>
                            {thread.is_pinned && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400">
                                Pinned
                              </span>
                            )}
                          </div>
                          <h3 className="font-medium text-white group-hover:text-teal-400 transition-colors line-clamp-1">
                            {thread.title}
                          </h3>
                          <p className="text-sm text-stone-500 line-clamp-1 mt-1">{thread.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-stone-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(thread.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {thread.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {thread.reply_count || 0}
                            </span>
                            <span>by {thread.author_username}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
