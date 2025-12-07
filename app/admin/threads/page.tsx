"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Trash2, 
  Pin, 
  Lock, 
  Unlock, 
  Eye,
  MessageSquare,
  ExternalLink,
  Search,
  AlertTriangle
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { 
  checkIsSuperAdmin, 
  getAllThreadsAdmin,
  deleteThread,
  togglePinThread,
  toggleLockThread,
  type ForumThreadAdmin
} from "@/lib/services/adminService"

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function AdminThreadsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [threads, setThreads] = useState<ForumThreadAdmin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
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
      const threadsData = await getAllThreadsAdmin()
      setThreads(threadsData)
      setLoading(false)
    }

    loadData()
  }, [user, authLoading, router])

  const handleDelete = async (threadId: string) => {
    const success = await deleteThread(threadId)
    if (success) {
      setThreads(threads.filter(t => t.id !== threadId))
    }
    setDeleteConfirm(null)
  }

  const handleTogglePin = async (threadId: string, currentState: boolean) => {
    const success = await togglePinThread(threadId, !currentState)
    if (success) {
      setThreads(threads.map(t => 
        t.id === threadId ? { ...t, is_pinned: !currentState } : t
      ))
    }
  }

  const handleToggleLock = async (threadId: string, currentState: boolean) => {
    const success = await toggleLockThread(threadId, !currentState)
    if (success) {
      setThreads(threads.map(t => 
        t.id === threadId ? { ...t, is_locked: !currentState } : t
      ))
    }
  }

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.author_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Threads</h1>
              <p className="text-stone-400 mt-1">{threads.length} total threads</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threads by title, author, or category..."
              className="w-full pl-12 pr-4 py-3 bg-stone-900/80 border border-stone-800/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-violet-500/50"
            />
          </div>
        </div>

        {/* Threads Table */}
        <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-800/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-stone-400">Thread</th>
                  <th className="text-left px-4 py-4 text-sm font-medium text-stone-400">Category</th>
                  <th className="text-left px-4 py-4 text-sm font-medium text-stone-400">Author</th>
                  <th className="text-center px-4 py-4 text-sm font-medium text-stone-400">Stats</th>
                  <th className="text-left px-4 py-4 text-sm font-medium text-stone-400">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-stone-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredThreads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                      No threads found
                    </td>
                  </tr>
                ) : (
                  filteredThreads.map((thread) => (
                    <tr key={thread.id} className="border-b border-stone-800/30 hover:bg-stone-800/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {thread.is_pinned && (
                            <Pin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          )}
                          {thread.is_locked && (
                            <Lock className="w-4 h-4 text-stone-500 flex-shrink-0" />
                          )}
                          <span className="text-white font-medium line-clamp-1 max-w-xs">
                            {thread.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-stone-400">{thread.category_name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-stone-400">{thread.author_username}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-3 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {thread.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {thread.reply_count}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-stone-500">{formatDate(thread.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/forum/${thread.category_slug}/${thread.slug}`}
                            target="_blank"
                            className="p-2 text-stone-500 hover:text-white hover:bg-stone-700 rounded-lg transition-colors"
                            title="View thread"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleTogglePin(thread.id, thread.is_pinned)}
                            className={`p-2 rounded-lg transition-colors ${
                              thread.is_pinned 
                                ? "text-amber-400 bg-amber-500/20 hover:bg-amber-500/30" 
                                : "text-stone-500 hover:text-amber-400 hover:bg-stone-700"
                            }`}
                            title={thread.is_pinned ? "Unpin" : "Pin"}
                          >
                            <Pin className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleLock(thread.id, thread.is_locked)}
                            className={`p-2 rounded-lg transition-colors ${
                              thread.is_locked 
                                ? "text-stone-400 bg-stone-700 hover:bg-stone-600" 
                                : "text-stone-500 hover:text-white hover:bg-stone-700"
                            }`}
                            title={thread.is_locked ? "Unlock" : "Lock"}
                          >
                            {thread.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(thread.id)}
                            className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Thread?</h3>
                  <p className="text-sm text-stone-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-stone-300 mb-6">
                Are you sure you want to delete this thread? All replies will also be deleted.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                >
                  Delete Thread
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
