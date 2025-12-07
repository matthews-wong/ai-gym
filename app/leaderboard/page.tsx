"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Trophy, 
  Medal, 
  Camera, 
  Upload, 
  X, 
  Loader2,
  Crown,
  Flame,
  ImageIcon
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import {
  getLeaderboard,
  getRecentCompletions,
  uploadMealPhoto,
  createMealCompletion,
  type LeaderboardEntry,
  type MealCompletion
} from "@/lib/services/leaderboardService"

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [recentCompletions, setRecentCompletions] = useState<MealCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadData() {
      const [lb, completions] = await Promise.all([
        getLeaderboard(50),
        getRecentCompletions(20),
      ])
      setLeaderboard(lb)
      setRecentCompletions(completions)
      setLoading(false)
    }
    loadData()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!user || !selectedFile) return

    setUploading(true)
    const photoUrl = await uploadMealPhoto(user.id, selectedFile)
    
    if (photoUrl) {
      const completion = await createMealCompletion(user.id, photoUrl, description)
      if (completion) {
        // Refresh data
        const [lb, completions] = await Promise.all([
          getLeaderboard(50),
          getRecentCompletions(20),
        ])
        setLeaderboard(lb)
        setRecentCompletions(completions)
        
        // Reset form
        setShowUploadModal(false)
        setSelectedFile(null)
        setPreviewUrl(null)
        setDescription("")
      }
    }
    setUploading(false)
  }

  const closeModal = () => {
    setShowUploadModal(false)
    setSelectedFile(null)
    setPreviewUrl(null)
    setDescription("")
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="w-5 h-5 text-center text-stone-500 font-medium">{index + 1}</span>
  }

  const getRankBg = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30"
    if (index === 1) return "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30"
    if (index === 2) return "bg-gradient-to-r from-amber-600/20 to-orange-500/10 border-amber-600/30"
    return "bg-stone-900/80 border-stone-800/50"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
              <p className="text-stone-400 text-sm">Top meal plan completers</p>
            </div>
          </div>
          {user && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-medium rounded-xl transition-all"
            >
              <Camera className="w-4 h-4" />
              Upload Proof
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                Top Completers
              </h2>
              
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 text-stone-700 mx-auto mb-3" />
                  <p className="text-stone-500">No completions yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.user_id}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${getRankBg(index)}`}
                    >
                      <div className="w-8 flex justify-center">
                        {getRankIcon(index)}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center overflow-hidden">
                        {entry.avatar_url ? (
                          <Image
                            src={entry.avatar_url}
                            alt={entry.username}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-stone-400">
                            {entry.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{entry.username}</p>
                        <p className="text-xs text-stone-500">
                          Last: {formatDate(entry.last_completion)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-400">{entry.completion_count}</p>
                        <p className="text-xs text-stone-500">meals</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Completions */}
          <div>
            <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-teal-400" />
                Recent Proofs
              </h2>
              
              {recentCompletions.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="w-10 h-10 text-stone-700 mx-auto mb-2" />
                  <p className="text-stone-500 text-sm">No proofs uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCompletions.slice(0, 10).map((completion) => (
                    <div
                      key={completion.id}
                      className="bg-stone-800/30 rounded-xl overflow-hidden"
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={completion.photo_url}
                          alt="Meal proof"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-white">{completion.username}</p>
                        {completion.description && (
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2">{completion.description}</p>
                        )}
                        <p className="text-xs text-stone-600 mt-1">{formatDate(completion.completed_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Upload Meal Proof</h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {previewUrl ? (
                <div className="mb-4">
                  <div className="aspect-video relative rounded-xl overflow-hidden mb-3">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                    }}
                    className="text-sm text-stone-400 hover:text-white"
                  >
                    Choose different photo
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-700 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/50 transition-colors mb-4"
                >
                  <Upload className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                  <p className="text-stone-400 mb-1">Click to upload photo</p>
                  <p className="text-xs text-stone-600">JPG, PNG up to 5MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you make?"
                  rows={2}
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-stone-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-stone-700 disabled:to-stone-700 text-white font-medium rounded-xl transition-all"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Not logged in prompt */}
        {!user && (
          <div className="mt-8 bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6 text-center">
            <p className="text-stone-400 mb-4">Sign in to upload your meal proofs and join the leaderboard!</p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-medium rounded-xl transition-all"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
