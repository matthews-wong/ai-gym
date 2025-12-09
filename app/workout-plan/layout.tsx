import type { Metadata } from "next"
import type { ReactNode } from "react"

const workoutPlanJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI GymBRO Workout Plan Generator",
  description: "Generate personalized AI-powered workout plans based on your fitness goals, experience level, available equipment, and schedule preferences.",
  url: "https://aigymbro.web.id/workout-plan",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  provider: {
    "@type": "Organization",
    name: "AI GymBRO",
    url: "https://aigymbro.web.id"
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "Free"
  },
  featureList: [
    "Personalized workout plan generation",
    "AI-powered exercise recommendations",
    "Multiple fitness goal options",
    "Equipment-based workout customization",
    "Schedule flexibility options",
    "Experience level adaptation",
    "Progress tracking integration",
    "Exercise form guidance"
  ],
  targetAudience: {
    "@type": "Audience",
    "audienceType": "fitness enthusiasts, beginners, athletes, gym-goers"
  }
}

const workoutServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Workout Plan Generator",
  description: "Create customized workout routines using artificial intelligence based on your fitness goals, available equipment, schedule, and experience level.",
  provider: {
    "@type": "Organization",
    name: "AI GymBRO",
    url: "https://aigymbro.web.id"
  },
  serviceType: "Fitness Planning Service",
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://aigymbro.web.id/workout-plan",
    serviceType: "Online"
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Workout Plan Types",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Strength Training Plans"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Cardio Workout Plans"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "HIIT Training Plans"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Home Workout Plans"
        }
      }
    ]
  }
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate Your Perfect Workout Plan with AI GymBRO",
  description: "Step-by-step guide to create a personalized workout plan using AI GymBRO's intelligent fitness planning system.",
  image: "https://aigymbro.web.id/android-chrome-512x512.png",
  totalTime: "PT3M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: "0"
  },
  supply: [
    {
      "@type": "HowToSupply",
      name: "Internet connection"
    },
    {
      "@type": "HowToSupply",
      name: "Device (computer, tablet, or smartphone)"
    }
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Set Your Fitness Goals",
      text: "Choose your primary fitness objective: muscle building, weight loss, strength gain, endurance improvement, or general fitness.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    },
    {
      "@type": "HowToStep",
      name: "Select Experience Level",
      text: "Indicate your current fitness experience: beginner, intermediate, or advanced to get appropriately challenging exercises.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    },
    {
      "@type": "HowToStep",
      name: "Choose Available Equipment",
      text: "Select what equipment you have access to: full gym, home gym, minimal equipment, or bodyweight only.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    },
    {
      "@type": "HowToStep",
      name: "Set Schedule Preferences",
      text: "Define how many days per week you can workout and preferred session duration.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    },
    {
      "@type": "HowToStep",
      name: "Generate Your Plan",
      text: "Let AI GymBRO's artificial intelligence create a personalized workout plan tailored to your specific needs and preferences.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    }
  ]
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://aigymbro.web.id"
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Workout Plan Generator",
      item: "https://aigymbro.web.id/workout-plan"
    }
  ]
}

export const metadata: Metadata = {
  metadataBase: new URL("https://aigymbro.web.id"),
  title: "Generate Your Personalized Workout Plan | AI GymBRO",
  description: "Create a customized workout plan tailored to your fitness goals, experience level, and available equipment. AI-powered fitness planning that adapts to your schedule and preferences. Start building your perfect routine today.",
  keywords: [
    "workout plan generator",
    "AI workout planner",
    "personalized fitness routine",
    "custom workout builder",
    "AI fitness coach",
    "gym workout creator",
    "home workout planner",
    "strength training program",
    "cardio workout plan",
    "HIIT training generator",
    "fitness goal planner",
    "exercise routine builder",
    "workout schedule creator",
    "AI personal trainer",
    "muscle building plan",
    "weight loss workout",
    "bodyweight exercise planner",
    "gym routine generator",
    "fitness program creator",
    "workout plan AI"
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
  classification: "Workout Planning Tool - Health and Fitness Application",
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
    canonical: "https://aigymbro.web.id/workout-plan",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aigymbro.web.id/workout-plan",
    siteName: "AI GymBRO",
    title: "Generate Your Personalized Workout Plan | AI GymBRO",
    description: "Create a customized workout plan with AI. Set your fitness goals, experience level, available equipment, and schedule. Get a personalized routine that adapts to your needs.",
    images: [
      {
        url: "/workout-plan-og.png",
        width: 1200,
        height: 630,
        alt: "AI GymBRO Workout Plan Generator - Create Your Perfect Fitness Routine",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "AI GymBRO Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aigymbro",
    creator: "@matthewswong",
    title: "Generate Your Personalized Workout Plan | AI GymBRO",
    description: "Create a customized workout plan with AI. Set your goals, experience, equipment & schedule for a perfect fitness routine.",
    images: [
      {
        url: "/workout-plan-twitter.png",
        width: 1200,
        height: 600,
        alt: "AI GymBRO Workout Plan Generator",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Workout Plan Generator",
    statusBarStyle: "black-translucent",
  },
  applicationName: "AI GymBRO",
  generator: "Next.js",
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "AI GymBRO Workout Planner",
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
  },
}

export default function Layout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workoutPlanJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workoutServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  )
}