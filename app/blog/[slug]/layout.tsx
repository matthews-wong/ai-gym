import type { Metadata } from "next"
import { getBlogBySlug } from "@/lib/services/blogService"

type Props = {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: "Blog Post Not Found | AI GymBRO",
      description: "The requested blog post could not be found.",
    }
  }

  const title = `${blog.title} | AI GymBRO Blog`
  const description = blog.excerpt || `Read about ${blog.title} on the AI GymBRO fitness and nutrition blog.`

  return {
    metadataBase: new URL("https://aigymbro.web.id"),
    title,
    description,
    keywords: [
      ...(blog.tags || []),
      blog.category,
      "fitness blog",
      "nutrition tips",
      "AI fitness",
      "health advice",
      "workout tips",
    ],
    authors: [
      {
        name: blog.author || "AI GymBRO",
        url: "https://www.matthewswong.com",
      },
    ],
    creator: blog.author || "AI GymBRO",
    publisher: "AI GymBRO",
    category: "Health & Fitness",
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: [blog.author || "AI GymBRO"],
      tags: blog.tags,
      siteName: "AI GymBRO",
      locale: "en_US",
      url: `https://aigymbro.web.id/blog/${slug}`,
      images: blog.cover_image
        ? [
            {
              url: blog.cover_image,
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.cover_image ? [blog.cover_image] : undefined,
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
      canonical: `https://aigymbro.web.id/blog/${slug}`,
    },
  }
}

export default function BlogPostLayout({ children }: Props) {
  return <>{children}</>
}
