import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fitness Forum - AI GymBRO Community",
  description: "Join the AI GymBRO fitness community forum. Discuss workouts, nutrition, share your fitness journey, get advice from fellow gym enthusiasts, and connect with like-minded people.",
  keywords: [
    "fitness forum",
    "gym community",
    "workout discussion",
    "nutrition advice",
    "fitness tips",
    "bodybuilding forum",
    "weight loss community",
    "muscle building tips",
    "AI GymBRO forum",
  ],
  openGraph: {
    title: "Fitness Forum - AI GymBRO Community",
    description: "Join the AI GymBRO fitness community forum. Discuss workouts, nutrition, and share your fitness journey.",
    type: "website",
    url: "https://aigymbro.web.id/forum",
    images: [
      {
        url: "https://aigymbro.web.id/og-image/forum.png",
        width: 1200,
        height: 630,
        alt: "AI GymBRO Fitness Forum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitness Forum - AI GymBRO Community",
    description: "Join the AI GymBRO fitness community forum. Discuss workouts, nutrition, and share your fitness journey.",
    images: ["https://aigymbro.web.id/og-image/forum.png"],
  },
}

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
