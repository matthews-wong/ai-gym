import type { Metadata } from "next"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About AI GymBRO - Your Personal AI Fitness & Nutrition Coach",
  description:
    "Learn about AI GymBRO's mission to revolutionize fitness and nutrition through AI technology.",
  url: "https://aigymbro.web.id/about",
  mainEntity: {
    "@type": "Organization",
    name: "AI GymBRO",
    url: "https://aigymbro.web.id",
    logo: {
      "@type": "ImageObject",
      url: "https://aigymbro.web.id/android-chrome-512x512.png",
      width: 512,
      height: 512,
    },
    founder: {
      "@type": "Person",
      name: "Matthews Wong",
      url: "https://www.matthewswong.com",
      jobTitle: "Software Engineer & Founder",
      description:
        "Software engineer with a passion for fitness and workout, combining technology and health to create AI GymBRO.",
      knowsAbout: ["Artificial Intelligence", "Fitness", "Nutrition", "Software Development"],
    },
    foundingDate: "2024",
    description: "AI-powered fitness and nutrition platform democratizing personalized health coaching",
    mission:
      "To democratize personalized fitness and nutrition through the power of artificial intelligence, making world-class coaching accessible to everyone.",
    values: ["Personalization First", "Innovation Driven", "Community Focused", "Results Oriented"],
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://aigymbro.web.id",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://aigymbro.web.id/about",
      },
    ],
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AI GymBRO",
  url: "https://aigymbro.web.id",
  logo: "https://aigymbro.web.id/android-chrome-512x512.png",
  description: "AI-powered fitness and nutrition platform democratizing personalized health coaching",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "Matthews Wong",
    jobTitle: "Founder & Developer",
    url: "https://www.matthewswong.com",
    description:
      "I am a software engineer while I have a hobby about fitness and workout. Most research shows that a proper meal and workout is the key to achieving your health goals. So combining my 2 main interests, I built this app 'AI GymBRO' for you to create your meal plan and workout plan with the power of artificial intelligence.",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@aigymbro.web.id",
    availableLanguage: ["English"],
  },
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Fitness Training",
    "Nutrition Planning",
    "Health Optimization",
    "Personalized Coaching",
  ],
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Matthews Wong",
  jobTitle: "Founder & Developer of AI GymBRO",
  url: "https://www.matthewswong.com",
  worksFor: {
    "@type": "Organization",
    name: "AI GymBRO",
    url: "https://aigymbro.web.id",
  },
  description:
    "Software engineer with a passion for fitness and workout. Creator of AI GymBRO, combining artificial intelligence with health and fitness.",
  knowsAbout: ["Artificial Intelligence", "Software Development", "Fitness", "Nutrition", "Machine Learning"],
  alumniOf: "Software Engineering",
  hasOccupation: {
    "@type": "Occupation",
    name: "Software Engineer & Entrepreneur",
    occupationLocation: {
      "@type": "Place",
      name: "Indonesia",
    },
  },
}

export const metadata: Metadata = {
  metadataBase: new URL("https://aigymbro.web.id"),
  title: "About AI GymBRO - Learn Our Story | AI-Powered Fitness Coach",
  description:
    "Discover the story behind AI GymBRO, the revolutionary AI-powered fitness and nutrition platform. Learn how we're democratizing personalized health coaching through artificial intelligence technology.",
  keywords: [
    "about AI GymBRO",
    "Matthews Wong developer",
    "AI fitness story",
    "fitness app founder",
    "AI nutrition platform",
    "personalized fitness AI",
    "AI GymBRO mission",
    "fitness technology story",
    "AI health coaching",
    "workout app creator",
    "meal planning",
    "fitness innovation",
    "AI personal trainer story",
    "health tech entrepreneur",
    "fitness AI development",
  ],
  authors: [
    {
      name: "Matthews Wong",
      url: "https://www.matthewswong.com",
    },
  ],
  creator: "Matthews Wong",
  publisher: "AI GymBRO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "Health & Fitness",
  classification: "About Page - Health and Fitness Application",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://aigymbro.web.id/about",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aigymbro.web.id/about",
    siteName: "AI GymBRO",
    title: "About AI GymBRO - Meet Our Founder & Learn Our Story",
    description:
      "Discover the story behind AI GymBRO . Learn how we're revolutionizing fitness and nutrition through AI technology, making personalized coaching accessible to everyone.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "AI GymBRO - About Our AI-Powered Fitness & Nutrition Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aigymbro",
    creator: "@matthewswong",
    title: "About AI GymBRO - Learn Our Story ",
    description:
      "Learn how we're revolutionizing fitness and nutrition through AI technology.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "AI GymBRO - About Our AI-Powered Fitness & Nutrition Platform",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "About AI GymBRO",
    statusBarStyle: "black-translucent",
  },
  applicationName: "AI GymBRO",
  generator: "Next.js",
  manifest: "/manifest.json",
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {children}
    </>
  )
}