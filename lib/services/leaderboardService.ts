import { supabase } from "@/lib/supabase"

export interface LeaderboardEntry {
  user_id: string
  username: string
  avatar_url: string | null
  completion_count: number
  last_completion: string
}

export interface MealCompletion {
  id: string
  user_id: string
  plan_id: string | null
  photo_url: string
  description: string | null
  completed_at: string
  created_at: string
  username?: string
}

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .limit(limit)

  if (error) {
    console.error("Error fetching leaderboard:", error)
    return []
  }

  return data || []
}

export async function getRecentCompletions(limit = 20): Promise<MealCompletion[]> {
  const { data, error } = await supabase
    .from("meal_completions")
    .select(`
      id,
      user_id,
      plan_id,
      photo_url,
      description,
      completed_at,
      created_at
    `)
    .order("completed_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching completions:", error)
    return []
  }

  // Get usernames for completions
  const userIds = [...new Set((data || []).map(c => c.user_id))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, email")
    .in("id", userIds)

  const profileMap = new Map((profiles || []).map(p => [p.id, p.username || p.email?.split("@")[0] || "User"]))

  return (data || []).map(c => ({
    ...c,
    username: profileMap.get(c.user_id) || "User"
  }))
}

export async function getUserCompletions(userId: string): Promise<MealCompletion[]> {
  const { data, error } = await supabase
    .from("meal_completions")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })

  if (error) {
    console.error("Error fetching user completions:", error)
    return []
  }

  return data || []
}

export async function uploadMealPhoto(
  userId: string,
  file: File
): Promise<string | null> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from("meal-photos")
    .upload(fileName, file)

  if (uploadError) {
    console.error("Error uploading photo:", uploadError)
    return null
  }

  const { data } = supabase.storage
    .from("meal-photos")
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function createMealCompletion(
  userId: string,
  photoUrl: string,
  description?: string,
  planId?: string
): Promise<MealCompletion | null> {
  const { data, error } = await supabase
    .from("meal_completions")
    .insert({
      user_id: userId,
      photo_url: photoUrl,
      description: description || null,
      plan_id: planId || null,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating completion:", error)
    return null
  }

  return data
}

export async function deleteMealCompletion(completionId: string): Promise<boolean> {
  const { error } = await supabase
    .from("meal_completions")
    .delete()
    .eq("id", completionId)

  if (error) {
    console.error("Error deleting completion:", error)
    return false
  }

  return true
}
