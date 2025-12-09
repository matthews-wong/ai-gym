import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fitness Blog | AI GymBro - Expert Tips & Guides",
  description:
    "Explore our fitness blog for expert workout tips, nutrition guides, and health advice. Stay informed with daily articles on training, recovery, and healthy living.",
  keywords: [
    "fitness blog",
    "workout tips",
    "nutrition advice",
    "gym blog",
    "health articles",
    "exercise guides",
    "training tips",
    "fitness articles",
  ],
  alternates: {
    canonical: "https://aigymbro.web.id/blog",
  },
  openGraph: {
    title: "Fitness Blog | AI GymBro",
    description:
      "Expert workout tips, nutrition guides, and health advice. Daily articles on training, recovery, and healthy living.",
    url: "https://aigymbro.web.id/blog",
    siteName: "AI GymBro",
    type: "website",
    images: [
      {
        url: "https://aigymbro.web.id/og-image/blog.png",
        width: 1200,
        height: 630,
        alt: "AI GymBro Fitness Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitness Blog | AI GymBro",
    description:
      "Expert workout tips, nutrition guides, and health advice. Daily articles on training, recovery, and healthy living.",
    images: ["https://aigymbro.web.id/og-image/blog.png"],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
