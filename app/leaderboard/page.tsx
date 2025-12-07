"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
/* eslint-disable @next/next/no-img-element */
import { 
  Trophy, 
  Medal, 
  Camera, 
  Upload, 
  X, 
  Loader2,
  Crown,
  Flame,
  ImageIcon,
  Clock,
  Dumbbell,
  ArrowRight
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import {
  getLeaderboard,
  getRecentCompletions,
  getTransformations,
  uploadMealPhoto,
  createMealCompletion,
  uploadTransformationPhoto,
  createTransformation,
  type LeaderboardEntry,
  type MealCompletion,
  type WorkoutTransformation
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

// Compress image to max 1MB
async function compressImage(file: File, maxSizeMB = 1): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let { width, height } = img
      
      // Max dimension 1200px
      const maxDim = 1200
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = (height / width) * maxDim
          width = maxDim
        } else {
          width = (width / height) * maxDim
          height = maxDim
        }
      }
      
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }))
          } else {
            resolve(file)
          }
        },
        "image/jpeg",
        0.8
      )
    }
    img.src = URL.createObjectURL(file)
  })
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [recentCompletions, setRecentCompletions] = useState<MealCompletion[]>([])
  const [transformations, setTransformations] = useState<WorkoutTransformation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"meals" | "transformations">("meals")
  
  // Meal upload state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Transformation upload state
  const [showTransformModal, setShowTransformModal] = useState(false)
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  const [beforePreview, setBeforePreview] = useState<string | null>(null)
  const [afterPreview, setAfterPreview] = useState<string | null>(null)
  const [transformDescription, setTransformDescription] = useState("")
  const [transformDuration, setTransformDuration] = useState("")
  const [uploadingTransform, setUploadingTransform] = useState(false)
  const beforeInputRef = useRef<HTMLInputElement>(null)
  const afterInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadData() {
      const [lb, completions, transforms] = await Promise.all([
        getLeaderboard(50),
        getRecentCompletions(20),
        getTransformations(20),
      ])
      setLeaderboard(lb)
      setRecentCompletions(completions)
      setTransformations(transforms)
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
        // Reset form and show success modal
        setShowUploadModal(false)
        setSelectedFile(null)
        setPreviewUrl(null)
        setDescription("")
        setShowSuccessModal(true)
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

  // Transformation handlers
  const handleBeforeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBeforeFile(file)
      setBeforePreview(URL.createObjectURL(file))
    }
  }

  const handleAfterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAfterFile(file)
      setAfterPreview(URL.createObjectURL(file))
    }
  }

  const handleTransformUpload = async () => {
    if (!user || !beforeFile || !afterFile) return

    setUploadingTransform(true)
    
    // Compress images before upload
    const [compressedBefore, compressedAfter] = await Promise.all([
      compressImage(beforeFile),
      compressImage(afterFile),
    ])
    
    const [beforeUrl, afterUrl] = await Promise.all([
      uploadTransformationPhoto(user.id, compressedBefore, "before"),
      uploadTransformationPhoto(user.id, compressedAfter, "after"),
    ])
    
    if (beforeUrl && afterUrl) {
      const transformation = await createTransformation(
        user.id,
        beforeUrl,
        afterUrl,
        transformDescription,
        transformDuration
      )
      if (transformation) {
        closeTransformModal()
        setShowSuccessModal(true)
      }
    }
    setUploadingTransform(false)
  }

  const closeTransformModal = () => {
    setShowTransformModal(false)
    setBeforeFile(null)
    setAfterFile(null)
    setBeforePreview(null)
    setAfterPreview(null)
    setTransformDescription("")
    setTransformDuration("")
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
              <p className="text-stone-400 text-sm">Showcase your progress</p>
            </div>
          </div>
          {user && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-medium rounded-xl transition-all"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Meal Proof</span>
              </button>
              <button
                onClick={() => setShowTransformModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-medium rounded-xl transition-all"
              >
                <Dumbbell className="w-4 h-4" />
                <span className="hidden sm:inline">Transformation</span>
              </button>
            </div>
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
                          <img
                            src={entry.avatar_url}
                            alt={entry.username}
                            className="w-full h-full object-cover"
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

          {/* Recent Proofs - Combined Feed */}
          <div>
            <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  Recent Proofs
                </span>
                <span className="text-xs text-stone-500">
                  {recentCompletions.length + transformations.length} total
                </span>
              </h2>

              {/* Filter Tabs */}
              <div className="flex gap-1 mb-4 p-1 bg-stone-800/50 rounded-lg">
                <button
                  onClick={() => setActiveTab("meals")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "meals"
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Meals ({recentCompletions.length})
                </button>
                <button
                  onClick={() => setActiveTab("transformations")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "transformations"
                      ? "bg-teal-500/20 text-teal-400"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  Transforms ({transformations.length})
                </button>
              </div>
              
              {activeTab === "meals" ? (
                recentCompletions.length === 0 ? (
                  <div className="text-center py-8">
                    <Camera className="w-10 h-10 text-stone-700 mx-auto mb-2" />
                    <p className="text-stone-500 text-sm">No meal proofs yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-1">
                    {recentCompletions.map((completion) => (
                      <div
                        key={completion.id}
                        className="bg-stone-800/30 rounded-lg overflow-hidden group"
                      >
                        <div className="aspect-square relative">
                          <img
                            src={completion.photo_url}
                            alt="Meal proof"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 left-1.5">
                            <span className="px-1.5 py-0.5 bg-amber-500/90 text-white text-[10px] font-medium rounded flex items-center gap-1">
                              <Camera className="w-2.5 h-2.5" />
                              Meal
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs font-medium text-white truncate">{completion.username}</p>
                            <p className="text-[10px] text-stone-300">{formatDate(completion.completed_at)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                transformations.length === 0 ? (
                  <div className="text-center py-8">
                    <Dumbbell className="w-10 h-10 text-stone-700 mx-auto mb-2" />
                    <p className="text-stone-500 text-sm">No transformations yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {transformations.map((transform) => (
                      <div
                        key={transform.id}
                        className="bg-stone-800/30 rounded-lg overflow-hidden"
                      >
                        <div className="relative">
                          <div className="absolute top-1.5 left-1.5 z-10">
                            <span className="px-1.5 py-0.5 bg-teal-500/90 text-white text-[10px] font-medium rounded flex items-center gap-1">
                              <Dumbbell className="w-2.5 h-2.5" />
                              Transform
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-0.5">
                            <div className="relative">
                              <img
                                src={transform.before_photo_url}
                                alt="Before"
                                className="w-full aspect-[4/5] object-cover"
                              />
                              <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/70 text-white text-[10px] rounded">Before</span>
                            </div>
                            <div className="relative">
                              <img
                                src={transform.after_photo_url}
                                alt="After"
                                className="w-full aspect-[4/5] object-cover"
                              />
                              <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-teal-500/90 text-white text-[10px] rounded">After</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-white">{transform.username}</p>
                            {transform.duration && (
                              <span className="text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">{transform.duration}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-stone-500 mt-0.5">{formatDate(transform.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
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
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
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

        {/* Transformation Upload Modal */}
        {showTransformModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Upload Transformation</h3>
                <button
                  onClick={closeTransformModal}
                  className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Before Photo */}
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">Before</label>
                  {beforePreview ? (
                    <div className="relative">
                      <img
                        src={beforePreview}
                        alt="Before preview"
                        className="w-full aspect-[3/4] object-cover rounded-xl"
                      />
                      <button
                        onClick={() => {
                          setBeforeFile(null)
                          setBeforePreview(null)
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/70 rounded-lg text-white hover:bg-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => beforeInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-700 rounded-xl aspect-[3/4] flex flex-col items-center justify-center cursor-pointer hover:border-teal-500/50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-stone-600 mb-2" />
                      <p className="text-stone-500 text-sm">Before photo</p>
                    </div>
                  )}
                </div>

                {/* After Photo */}
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">After</label>
                  {afterPreview ? (
                    <div className="relative">
                      <img
                        src={afterPreview}
                        alt="After preview"
                        className="w-full aspect-[3/4] object-cover rounded-xl"
                      />
                      <button
                        onClick={() => {
                          setAfterFile(null)
                          setAfterPreview(null)
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/70 rounded-lg text-white hover:bg-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => afterInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-700 rounded-xl aspect-[3/4] flex flex-col items-center justify-center cursor-pointer hover:border-teal-500/50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-stone-600 mb-2" />
                      <p className="text-stone-500 text-sm">After photo</p>
                    </div>
                  )}
                </div>
              </div>

              <input
                ref={beforeInputRef}
                type="file"
                accept="image/*"
                onChange={handleBeforeSelect}
                className="hidden"
              />
              <input
                ref={afterInputRef}
                type="file"
                accept="image/*"
                onChange={handleAfterSelect}
                className="hidden"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  Duration (e.g., &quot;3 months&quot;)
                </label>
                <input
                  value={transformDuration}
                  onChange={(e) => setTransformDuration(e.target.value)}
                  placeholder="How long did it take?"
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-teal-500/50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={transformDescription}
                  onChange={(e) => setTransformDescription(e.target.value)}
                  placeholder="Share your journey..."
                  rows={2}
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-teal-500/50 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeTransformModal}
                  className="flex-1 py-2.5 text-stone-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransformUpload}
                  disabled={!beforeFile || !afterFile || uploadingTransform}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:from-stone-700 disabled:to-stone-700 text-white font-medium rounded-xl transition-all"
                >
                  {uploadingTransform ? (
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

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload Successful!</h3>
              <p className="text-stone-400 mb-6">
                Your submission has been received. Please wait for admin approval before it appears on the leaderboard.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-medium rounded-xl transition-all"
              >
                Got it!
              </button>
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
