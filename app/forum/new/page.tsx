"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, AlertCircle } from "lucide-react"
import { getCategories, createThread, type ForumCategory } from "@/lib/services/forumService"
import { useAuth } from "@/lib/hooks/useAuth"

export default function NewThreadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCategory = searchParams.get("category")
  
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [categoryId, setCategoryId] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    async function loadCategories() {
      const cats = await getCategories()
      // Filter out admin-only categories for regular users
      const availableCategories = cats.filter(c => !c.is_admin_only)
      setCategories(availableCategories)
      
      if (preselectedCategory) {
        const cat = availableCategories.find((c) => c.slug === preselectedCategory)
        if (cat) setCategoryId(cat.id)
      }
      
      setLoading(false)
    }
    loadCategories()
  }, [preselectedCategory])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/forum/new")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !categoryId || !title.trim() || !content.trim()) return

    setSubmitting(true)
    setError(null)

    const thread = await createThread(categoryId, title.trim(), content.trim(), user.id)
    
    if (thread) {
      const category = categories.find((c) => c.id === categoryId)
      router.push(`/forum/${category?.slug}/${thread.slug}`)
    } else {
      setError("Failed to create thread. Please try again.")
      setSubmitting(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </Link>
          
          <h1 className="text-2xl font-bold text-white">Start a New Discussion</h1>
          <p className="text-stone-400 mt-1">Share your thoughts with the community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6">
          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white focus:outline-none focus:border-teal-500/50 appearance-none cursor-pointer"
            >
              <option value="" className="bg-stone-900">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-stone-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your discussion about?"
              required
              maxLength={200}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-teal-500/50"
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
              placeholder="Share more details about your topic..."
              required
              rows={8}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-teal-500/50 resize-none"
            />
          </div>

          {/* Guidelines */}
          <div className="p-4 bg-stone-800/30 rounded-xl mb-6">
            <h4 className="text-sm font-medium text-stone-300 mb-2">Community Guidelines</h4>
            <ul className="text-xs text-stone-500 space-y-1">
              <li>• Be respectful and supportive to other members</li>
              <li>• Stay on topic and provide helpful information</li>
              <li>• No spam, self-promotion, or inappropriate content</li>
            </ul>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/forum"
              className="px-5 py-2.5 text-stone-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !categoryId || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:from-stone-700 disabled:to-stone-700 text-white font-medium rounded-xl transition-all disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? "Creating..." : "Create Thread"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
