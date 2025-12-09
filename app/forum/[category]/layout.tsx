import type { Metadata } from "next"
import { getCategoryBySlug } from "@/lib/services/forumService"

type Props = {
  params: Promise<{ category: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const categoryData = await getCategoryBySlug(category)

  if (!categoryData) {
    return {
      title: "Category Not Found | AI GymBRO Forum",
      description: "The requested forum category could not be found.",
    }
  }

  const title = `${categoryData.name} | AI GymBRO Community Forum`
  const description =
    categoryData.description ||
    `Join the ${categoryData.name} discussion on AI GymBRO's community forum. Connect with fitness enthusiasts and share your journey.`

  return {
    metadataBase: new URL("https://aigymbro.web.id"),
    title,
    description,
    keywords: [
      categoryData.name.toLowerCase(),
      "fitness forum",
      "workout community",
      "health discussions",
      "AI GymBRO forum",
      "fitness community",
      "nutrition forum",
    ],
    authors: [
      {
        name: "AI GymBRO Community",
        url: "https://www.matthewswong.com",
      },
    ],
    creator: "AI GymBRO",
    publisher: "AI GymBRO",
    category: "Health & Fitness",
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "AI GymBRO Forum",
      locale: "en_US",
      url: `https://aigymbro.web.id/forum/${category}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
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
      canonical: `https://aigymbro.web.id/forum/${category}`,
    },
  }
}

export default function ForumCategoryLayout({ children }: Props) {
  return <>{children}</>
}
