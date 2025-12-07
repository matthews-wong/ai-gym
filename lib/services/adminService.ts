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

export async function checkIsSuperAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("super_admins")
    .select("id")
    .eq("user_id", userId)
    .single()

  if (error || !data) return false
  return true
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
  const { data, error } = await supabase
    .from("saved_plans")
    .select(`
      id,
      plan_type,
      created_at,
      profiles (
        email,
        username
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent plans:", error)
    return []
  }

  return (data || []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    plan_type: p.plan_type as string,
    created_at: p.created_at as string,
    user_email: (p.profiles as Record<string, string>)?.email || "Unknown",
    username: (p.profiles as Record<string, string>)?.username || "Unknown",
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
