import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://aigymbro.web.id"),
  title: "Fitness Leaderboard | AI GymBRO Community Rankings",
  description:
    "Join the AI GymBRO fitness leaderboard! Track your progress, compete with fellow fitness enthusiasts, upload meal photos, and share your workout transformations. See who's leading the pack in our community.",
  keywords: [
    "fitness leaderboard",
    "workout rankings",
    "fitness community",
    "meal tracking",
    "transformation photos",
    "fitness competition",
    "AI GymBRO leaderboard",
    "workout progress",
    "fitness motivation",
    "gym community",
    "health challenge",
    "fitness goals",
  ],
  authors: [
    {
      name: "AI GymBRO",
      url: "https://www.matthewswong.com",
    },
  ],
  creator: "AI GymBRO",
  publisher: "AI GymBRO",
  category: "Health & Fitness",
  openGraph: {
    title: "Fitness Leaderboard | AI GymBRO Community Rankings",
    description:
      "Join the AI GymBRO fitness leaderboard! Track your progress, compete with fellow fitness enthusiasts, and share your transformation journey.",
    type: "website",
    siteName: "AI GymBRO",
    locale: "en_US",
    url: "https://aigymbro.web.id/leaderboard",
  },
  twitter: {
    card: "summary",
    title: "Fitness Leaderboard | AI GymBRO",
    description:
      "Track your progress and compete with fellow fitness enthusiasts on AI GymBRO's community leaderboard.",
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
    canonical: "https://aigymbro.web.id/leaderboard",
  },
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
