import type { Metadata } from "next"
import { getThread, getCategoryBySlug } from "@/lib/services/forumService"

type Props = {
  params: Promise<{ category: string; slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const [thread, categoryData] = await Promise.all([
    getThread(category, slug),
    getCategoryBySlug(category),
  ])

  if (!thread) {
    return {
      title: "Thread Not Found | AI GymBRO Forum",
      description: "The requested forum thread could not be found.",
    }
  }

  const categoryName = categoryData?.name || category
  const title = `${thread.title} | ${categoryName} | AI GymBRO Forum`
  const description =
    thread.content.substring(0, 160).replace(/\n/g, " ").trim() +
    (thread.content.length > 160 ? "..." : "")

  return {
    metadataBase: new URL("https://aigymbro.web.id"),
    title,
    description,
    keywords: [
      categoryName.toLowerCase(),
      "fitness discussion",
      "community forum",
      "AI GymBRO",
      "fitness advice",
      "workout tips",
      "health community",
    ],
    authors: [
      {
        name: thread.author_username || "Community Member",
        url: "https://aigymbro.web.id/forum",
      },
    ],
    creator: thread.author_username || "Community Member",
    publisher: "AI GymBRO",
    category: "Health & Fitness",
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: thread.created_at,
      modifiedTime: thread.updated_at,
      authors: [thread.author_username || "Community Member"],
      siteName: "AI GymBRO Forum",
      locale: "en_US",
      url: `https://aigymbro.web.id/forum/${category}/${slug}`,
      images: [
        {
          url: "https://aigymbro.web.id/og-image/forum.png",
          width: 1200,
          height: 630,
          alt: `${thread.title} - AI GymBRO Forum`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://aigymbro.web.id/og-image/forum.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `https://aigymbro.web.id/forum/${category}/${slug}`,
    },
  }
}

export default function ForumThreadLayout({ children }: Props) {
  return <>{children}</>
}
