import { supabase } from "@/lib/supabase"

export interface ForumCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  sort_order: number
  thread_count?: number
  is_admin_only?: boolean
}

export interface ForumThread {
  id: string
  category_id: string
  user_id: string
  title: string
  slug: string
  content: string
  views: number
  is_pinned: boolean
  is_locked: boolean
  created_at: string
  updated_at: string
  author_username?: string
  author_avatar?: string
  category_name?: string
  category_slug?: string
  category_color?: string
  reply_count?: number
  last_reply_at?: string
}

export interface ForumReply {
  id: string
  thread_id: string
  user_id: string
  content: string
  is_solution: boolean
  created_at: string
  updated_at: string
  author_username?: string
  author_avatar?: string
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100)
    .replace(/^-|-$/g, "")
}

export async function getCategories(): Promise<ForumCategory[]> {
  const { data, error } = await supabase
    .from("forum_categories")
    .select("id, name, slug, description, icon, color, sort_order, is_admin_only")
    .order("sort_order")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function getThreads(categorySlug?: string, limit = 20): Promise<ForumThread[]> {
  let query = supabase
    .from("forum_threads_with_author")
    .select("id, title, slug, content, views, is_pinned, is_locked, created_at, author_username, category_name, category_slug, reply_count")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (categorySlug) {
    query = query.eq("category_slug", categorySlug)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching threads:", error)
    return []
  }

  return data || []
}

export async function getThread(categorySlug: string, threadSlug: string): Promise<ForumThread | null> {
  const { data, error } = await supabase
    .from("forum_threads_with_author")
    .select("id, category_id, user_id, title, slug, content, views, is_pinned, is_locked, created_at, author_username, author_avatar, category_name, category_slug, reply_count")
    .eq("category_slug", categorySlug)
    .eq("slug", threadSlug)
    .maybeSingle()

  if (error) {
    console.error("Error fetching thread:", error)
    return null
  }

  // Increment views in background (non-blocking)
  if (data) {
    supabase.rpc("increment_thread_views", { thread_id: data.id }).catch(() => {})
  }

  return data
}

export async function getReplies(threadId: string): Promise<ForumReply[]> {
  const { data, error } = await supabase
    .from("forum_replies_with_author")
    .select("id, thread_id, user_id, content, is_solution, created_at, author_username, author_avatar")
    .eq("thread_id", threadId)
    .order("created_at")

  if (error) {
    console.error("Error fetching replies:", error)
    return []
  }

  return data || []
}

export async function createThread(
  categoryId: string,
  title: string,
  content: string,
  userId: string
): Promise<ForumThread | null> {
  const slug = generateSlug(title) + "-" + Date.now().toString(36)

  const { data, error } = await supabase
    .from("forum_threads")
    .insert({
      category_id: categoryId,
      user_id: userId,
      title,
      slug,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating thread:", error)
    return null
  }

  return data
}

export async function createReply(
  threadId: string,
  content: string,
  userId: string
): Promise<ForumReply | null> {
  const { data, error } = await supabase
    .from("forum_replies")
    .insert({
      thread_id: threadId,
      user_id: userId,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating reply:", error)
    return null
  }

  return data
}

export async function getCategoryBySlug(slug: string): Promise<ForumCategory | null> {
  const { data, error } = await supabase
    .from("forum_categories")
    .select("id, name, slug, description, icon, color, sort_order, is_admin_only")
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data
}
