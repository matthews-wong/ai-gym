import { supabase } from "@/lib/supabase"

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  cover_image: string | null
  tags: string[]
  read_time: number
  author: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export async function getBlogs(limit = 20, offset = 0): Promise<Blog[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, content, category, cover_image, tags, read_time, author, is_published, created_at, updated_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return []
  }

  return data || []
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, content, category, cover_image, tags, read_time, author, is_published, created_at, updated_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    return null
  }

  return data
}

export async function getBlogsByCategory(category: string, limit = 10): Promise<Blog[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, content, category, cover_image, tags, read_time, author, is_published, created_at, updated_at")
    .eq("category", category)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return []
  }

  return data || []
}

export async function getRecentBlogs(limit = 5): Promise<Blog[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, category, read_time, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return []
  }

  return data || []
}

export async function getBlogsCount(): Promise<number> {
  const { count, error } = await supabase
    .from("blogs")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true)

  if (error) {
    return 0
  }

  return count || 0
}

export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    fitness: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    nutrition: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    recovery: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    mindset: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    workout: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  }
  return colors[category] || "bg-stone-500/20 text-stone-400 border-stone-500/30"
}
