import { supabase } from "@/lib/supabase"

export interface AdminStats {
  total_users: number
  new_users_7d: number
  new_users_30d: number
  total_workout_plans: number
  total_meal_plans: number
  total_plans: number
  plans_7d: number
  plans_30d: number
  total_threads: number
  total_replies: number
  threads_7d: number
}

export interface RecentPlan {
  id: string
  plan_type: string
  created_at: string
  user_email: string
  username: string
}

export interface RecentUser {
  id: string
  email: string
  created_at: string
  username: string
}

export interface ForumThreadAdmin {
  id: string
  title: string
  slug: string
  category_slug: string
  category_name: string
  author_username: string
  created_at: string
  views: number
  reply_count: number
  is_pinned: boolean
  is_locked: boolean
}

// Cache admin status to avoid repeated DB calls
const adminCache = new Map<string, { isAdmin: boolean; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function checkIsSuperAdmin(userId: string): Promise<boolean> {
  // Check cache first
  const cached = adminCache.get(userId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.isAdmin
  }

  const { data } = await supabase
    .from("super_admins")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle()

  const isAdmin = !!data
  adminCache.set(userId, { isAdmin, timestamp: Date.now() })
  return isAdmin
}

export async function getAdminStats(): Promise<AdminStats | null> {
  // Since views might not work with RLS, we'll query tables directly
  const [
    usersResult,
    workoutPlansResult,
    mealPlansResult,
    threadsResult,
    repliesResult,
  ] = await Promise.all([
    supabase.from("profiles").select("id, created_at"),
    supabase.from("saved_plans").select("id, created_at").eq("plan_type", "workout"),
    supabase.from("saved_plans").select("id, created_at").eq("plan_type", "meal"),
    supabase.from("forum_threads").select("id, created_at"),
    supabase.from("forum_replies").select("id"),
  ])

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const users = usersResult.data || []
  const workoutPlans = workoutPlansResult.data || []
  const mealPlans = mealPlansResult.data || []
  const threads = threadsResult.data || []
  const replies = repliesResult.data || []

  const allPlans = [...workoutPlans, ...mealPlans]

  return {
    total_users: users.length,
    new_users_7d: users.filter(u => new Date(u.created_at) > sevenDaysAgo).length,
    new_users_30d: users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length,
    total_workout_plans: workoutPlans.length,
    total_meal_plans: mealPlans.length,
    total_plans: allPlans.length,
    plans_7d: allPlans.filter(p => new Date(p.created_at) > sevenDaysAgo).length,
    plans_30d: allPlans.filter(p => new Date(p.created_at) > thirtyDaysAgo).length,
    total_threads: threads.length,
    total_replies: replies.length,
    threads_7d: threads.filter(t => new Date(t.created_at) > sevenDaysAgo).length,
  }
}

export async function getRecentPlans(limit = 20): Promise<RecentPlan[]> {
  const { data: plans, error: plansError } = await supabase
    .from("saved_plans")
    .select("id, user_id, plan_type, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (plansError || !plans) {
    console.error("Error fetching recent plans:", plansError)
    return []
  }

  // Get unique user IDs
  const userIds = [...new Set(plans.map(p => p.user_id))]
  
  // Fetch profiles for these users
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, username")
    .in("id", userIds)

  const profileMap = new Map((profiles || []).map(p => [p.id, p]))

  return plans.map(p => ({
    id: p.id,
    plan_type: p.plan_type,
    created_at: p.created_at,
    user_email: profileMap.get(p.user_id)?.email || "Unknown",
    username: profileMap.get(p.user_id)?.username || "Unknown",
  }))
}

export async function getRecentUsers(limit = 20): Promise<RecentUser[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, username, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent users:", error)
    return []
  }

  return data || []
}

export async function getAllThreadsAdmin(): Promise<ForumThreadAdmin[]> {
  const { data, error } = await supabase
    .from("forum_threads_with_author")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching threads:", error)
    return []
  }

  return (data || []).map((t) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    category_slug: t.category_slug,
    category_name: t.category_name,
    author_username: t.author_username,
    created_at: t.created_at,
    views: t.views,
    reply_count: t.reply_count || 0,
    is_pinned: t.is_pinned,
    is_locked: t.is_locked,
  }))
}

export async function deleteThread(threadId: string): Promise<boolean> {
  const { error } = await supabase
    .from("forum_threads")
    .delete()
    .eq("id", threadId)

  if (error) {
    console.error("Error deleting thread:", error)
    return false
  }

  return true
}

export async function togglePinThread(threadId: string, isPinned: boolean): Promise<boolean> {
  const { error } = await supabase
    .from("forum_threads")
    .update({ is_pinned: isPinned })
    .eq("id", threadId)

  if (error) {
    console.error("Error toggling pin:", error)
    return false
  }

  return true
}

export async function toggleLockThread(threadId: string, isLocked: boolean): Promise<boolean> {
  const { error } = await supabase
    .from("forum_threads")
    .update({ is_locked: isLocked })
    .eq("id", threadId)

  if (error) {
    console.error("Error toggling lock:", error)
    return false
  }

  return true
}

export async function getAnnouncementsCategoryId(): Promise<string | null> {
  const { data, error } = await supabase
    .from("forum_categories")
    .select("id")
    .eq("slug", "announcements")
    .single()

  if (error || !data) return null
  return data.id
}

export async function updateUsername(userId: string, username: string): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", userId)

  if (error) {
    console.error("Error updating username:", error)
    return false
  }

  return true
}

// Leaderboard admin functions
export interface MealCompletionAdmin {
  id: string
  user_id: string
  photo_url: string
  description: string | null
  completed_at: string
  is_approved: boolean
  username?: string
  email?: string
}

export async function getPendingCompletions(): Promise<MealCompletionAdmin[]> {
  const { data, error } = await supabase
    .from("meal_completions")
    .select("id, user_id, photo_url, description, completed_at, is_approved")
    .eq("is_approved", false)
    .order("completed_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending completions:", error)
    return []
  }

  // Get usernames
  const userIds = [...new Set((data || []).map(c => c.user_id))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, email")
    .in("id", userIds)

  const profileMap = new Map((profiles || []).map(p => [p.id, p]))

  return (data || []).map(c => ({
    ...c,
    username: profileMap.get(c.user_id)?.username || profileMap.get(c.user_id)?.email?.split("@")[0] || "User",
    email: profileMap.get(c.user_id)?.email
  }))
}

export async function getAllCompletions(): Promise<MealCompletionAdmin[]> {
  const { data, error } = await supabase
    .from("meal_completions")
    .select("id, user_id, photo_url, description, completed_at, is_approved")
    .order("completed_at", { ascending: false })

  if (error) {
    console.error("Error fetching completions:", error)
    return []
  }

  const userIds = [...new Set((data || []).map(c => c.user_id))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, email")
    .in("id", userIds)

  const profileMap = new Map((profiles || []).map(p => [p.id, p]))

  return (data || []).map(c => ({
    ...c,
    username: profileMap.get(c.user_id)?.username || profileMap.get(c.user_id)?.email?.split("@")[0] || "User",
    email: profileMap.get(c.user_id)?.email
  }))
}

export async function approveCompletion(completionId: string): Promise<boolean> {
  const { error } = await supabase
    .from("meal_completions")
    .update({ is_approved: true })
    .eq("id", completionId)

  if (error) {
    console.error("Error approving completion:", error)
    return false
  }

  return true
}

export async function rejectCompletion(completionId: string): Promise<boolean> {
  // First get the completion to get the photo URL
  const { data: completion, error: fetchError } = await supabase
    .from("meal_completions")
    .select("photo_url")
    .eq("id", completionId)
    .single()

  if (fetchError) {
    console.error("Error fetching completion:", fetchError)
    return false
  }

  // Delete photo from storage
  if (completion?.photo_url) {
    // Extract file path from URL (remove query params if any)
    const cleanUrl = completion.photo_url.split("?")[0]
    const urlParts = cleanUrl.split("/meal-photos/")
    if (urlParts[1]) {
      const filePath = urlParts[1]
      const { error: storageError } = await supabase.storage
        .from("meal-photos")
        .remove([filePath])
      
      if (storageError) {
        console.error("Error deleting meal photo:", storageError)
        // Continue to delete the record even if photo deletion fails
      }
    }
  }

  // Delete the database record
  const { error } = await supabase
    .from("meal_completions")
    .delete()
    .eq("id", completionId)

  if (error) {
    console.error("Error rejecting completion:", error)
    return false
  }

  return true
}

// Transformation admin functions
export interface TransformationAdmin {
  id: string
  user_id: string
  before_photo_url: string
  after_photo_url: string
  description: string | null
  duration: string | null
  is_approved: boolean
  created_at: string
  username?: string
  email?: string
}

export async function getPendingTransformations(): Promise<TransformationAdmin[]> {
  const { data, error } = await supabase
    .from("workout_transformations")
    .select("*")
    .eq("is_approved", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending transformations:", error)
    return []
  }

  const userIds = [...new Set((data || []).map(t => t.user_id))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, email")
    .in("id", userIds)

  const profileMap = new Map((profiles || []).map(p => [p.id, p]))

  return (data || []).map(t => ({
    ...t,
    username: profileMap.get(t.user_id)?.username || profileMap.get(t.user_id)?.email?.split("@")[0] || "User",
    email: profileMap.get(t.user_id)?.email
  }))
}

export async function getAllTransformations(): Promise<TransformationAdmin[]> {
  const { data, error } = await supabase
    .from("workout_transformations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching transformations:", error)
    return []
  }

  const userIds = [...new Set((data || []).map(t => t.user_id))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, email")
    .in("id", userIds)

  const profileMap = new Map((profiles || []).map(p => [p.id, p]))

  return (data || []).map(t => ({
    ...t,
    username: profileMap.get(t.user_id)?.username || profileMap.get(t.user_id)?.email?.split("@")[0] || "User",
    email: profileMap.get(t.user_id)?.email
  }))
}

export async function approveTransformation(transformationId: string): Promise<boolean> {
  const { error } = await supabase
    .from("workout_transformations")
    .update({ is_approved: true })
    .eq("id", transformationId)

  if (error) {
    console.error("Error approving transformation:", error)
    return false
  }

  return true
}

export async function rejectTransformation(transformationId: string): Promise<boolean> {
  // First get the transformation to get photo URLs
  const { data: transform, error: fetchError } = await supabase
    .from("workout_transformations")
    .select("before_photo_url, after_photo_url")
    .eq("id", transformationId)
    .single()

  if (fetchError) {
    console.error("Error fetching transformation:", fetchError)
    return false
  }

  // Delete photos from storage
  if (transform) {
    const filesToDelete: string[] = []
    
    // Extract file paths from URLs (remove query params if any)
    if (transform.before_photo_url) {
      const cleanUrl = transform.before_photo_url.split("?")[0]
      const urlParts = cleanUrl.split("/transformation-photos/")
      if (urlParts[1]) filesToDelete.push(urlParts[1])
    }
    if (transform.after_photo_url) {
      const cleanUrl = transform.after_photo_url.split("?")[0]
      const urlParts = cleanUrl.split("/transformation-photos/")
      if (urlParts[1]) filesToDelete.push(urlParts[1])
    }
    
    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("transformation-photos")
        .remove(filesToDelete)
      
      if (storageError) {
        console.error("Error deleting transformation photos:", storageError)
        // Continue to delete the record even if photo deletion fails
      }
    }
  }

  // Delete the database record
  const { error } = await supabase
    .from("workout_transformations")
    .delete()
    .eq("id", transformationId)

  if (error) {
    console.error("Error rejecting transformation:", error)
    return false
  }

  return true
}
