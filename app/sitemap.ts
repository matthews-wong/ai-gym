import { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"

const baseUrl = "https://aigymbro.web.id"

interface BlogRow {
  slug: string
  updated_at: string
}

interface CategoryRow {
  slug: string
}

interface ThreadRow {
  slug: string
  category_slug: string
  updated_at: string
}

// Revalidate sitemap every 1 hour (3600 seconds)
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/workout-plan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/meal-plan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forum`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ]

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = []
  let forumCategoryPages: MetadataRoute.Sitemap = []
  let forumThreadPages: MetadataRoute.Sitemap = []

  try {
    // Fetch published blogs
    const { data: blogs } = await supabase
      .from("blogs")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(100)

    if (blogs) {
      blogPages = (blogs as BlogRow[]).map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    }

    // Fetch forum categories
    const { data: categories } = await supabase
      .from("forum_categories")
      .select("slug")
      .order("sort_order")

    if (categories) {
      forumCategoryPages = (categories as CategoryRow[]).map((category) => ({
        url: `${baseUrl}/forum/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
      }))
    }

    // Fetch recent forum threads
    const { data: threads } = await supabase
      .from("forum_threads_with_author")
      .select("slug, category_slug, updated_at")
      .order("created_at", { ascending: false })
      .limit(200)

    if (threads) {
      forumThreadPages = (threads as ThreadRow[]).map((thread) => ({
        url: `${baseUrl}/forum/${thread.category_slug}/${thread.slug}`,
        lastModified: new Date(thread.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }))
    }
  } catch {
    // If database fetch fails, continue with static pages only
  }

  return [...staticPages, ...blogPages, ...forumCategoryPages, ...forumThreadPages]
}
