import type { Metadata } from "next"
import type { ReactNode } from "react"

const mealPlanJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI GymBRO Meal Plan Generator",
  description: "Generate personalized AI-powered meal plans based on your caloric needs, dietary preferences, food allergies, and nutrition goals.",
  url: "https://aigymbro.web.id/meal-plan",
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
    "Personalized meal plan generation",
    "AI-powered nutrition recommendations",
    "Calorie target customization",
    "Dietary preference accommodation",
    "Food allergy considerations",
    "Macronutrient balance optimization",
    "Shopping list generation",
    "Recipe suggestions with instructions"
  ],
  targetAudience: {
    "@type": "Audience",
    "audienceType": "health-conscious individuals, dieters, fitness enthusiasts, nutrition seekers"
  }
}

const nutritionServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Meal Plan Generator",
  description: "Create customized meal plans using artificial intelligence based on your caloric needs, dietary preferences, allergies, and nutrition goals.",
  provider: {
    "@type": "Organization",
    name: "AI GymBRO",
    url: "https://aigymbro.web.id"
  },
  serviceType: "Nutrition Planning Service",
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://aigymbro.web.id/meal-plan",
    serviceType: "Online"
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Meal Plan Types",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Weight Loss Meal Plans"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Muscle Building Meal Plans"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Vegetarian Meal Plans"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Keto Diet Meal Plans"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Mediterranean Diet Plans"
        }
      }
    ]
  }
}

const howToMealPlanJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate Your Perfect Meal Plan with AI GymBRO",
  description: "Step-by-step guide to create a personalized meal plan using AI GymBRO's intelligent nutrition planning system.",
  image: "https://aigymbro.web.id/android-chrome-512x512.png",
  totalTime: "PT5M",
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
    },
    {
      "@type": "HowToSupply",
      name: "Basic knowledge of your dietary preferences"
    }
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Calculate Your Caloric Needs",
      text: "Input your age, gender, weight, height, and activity level to determine your daily caloric requirements for your goals.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    },
    {
      "@type": "HowToStep",
      name: "Set Your Nutrition Goals",
      text: "Choose your primary objective: weight loss, muscle gain, maintenance, or athletic performance to optimize macronutrient distribution.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    },
    {
      "@type": "HowToStep",
      name: "Select Dietary Preferences",
      text: "Specify your diet type: omnivore, vegetarian, vegan, keto, paleo, Mediterranean, or other specific dietary approaches.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    },
    {
      "@type": "HowToStep",
      name: "Add Food Allergies & Restrictions",
      text: "List any food allergies, intolerances, or foods you want to avoid to ensure safe and enjoyable meal recommendations.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    },
    {
      "@type": "HowToStep",
      name: "Set Meal Preferences",
      text: "Choose number of meals per day, cooking complexity, prep time preferences, and budget considerations.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    },
    {
      "@type": "HowToStep",
      name: "Generate Your Personalized Plan",
      text: "Let AI GymBRO create a comprehensive meal plan with recipes, shopping lists, and nutritional breakdowns tailored to your needs.",
      image: "https://aigymbro.web.id/android-chrome-512x512.png"
    }
  ]
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How accurate is the AI meal plan generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI GymBRO uses advanced algorithms and nutritional databases to create meal plans that meet your specific caloric and macronutrient needs with high accuracy."
      }
    },
    {
      "@type": "Question",
      name: "Can I customize the meal plan after it's generated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can modify portion sizes, swap ingredients, and adjust meals to better fit your preferences while maintaining nutritional balance."
      }
    },
    {
      "@type": "Question",
      name: "Does the meal planner account for food allergies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. The AI considers all specified food allergies and dietary restrictions to ensure safe meal recommendations."
      }
    },
    {
      "@type": "Question",
      name: "How often should I update my meal plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend updating your meal plan every 2-4 weeks or whenever your goals, preferences, or lifestyle changes significantly."
      }
    }
  ]
}

const breadcrumbMealJsonLd = {
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
      name: "Meal Plan Generator",
      item: "https://aigymbro.web.id/meal-plan"
    }
  ]
}

export const metadata: Metadata = {
  metadataBase: new URL("https://aigymbro.web.id"),
  title: "Generate Your Personalized Meal Plan | AI GymBRO",
  description: "Create a customized meal plan based on your caloric needs, dietary preferences, and nutrition goals. AI-powered nutrition planning with recipes, shopping lists, and macro tracking. Start eating better today.",
  keywords: [
    "meal plan generator",
    "AI nutrition planner",
    "personalized diet plan",
    "custom meal planner",
    "AI nutritionist",
    "calorie meal planning",
    "macro meal planner",
    "diet plan generator",
    "nutrition plan creator",
    "healthy meal planner",
    "weight loss meal plan",
    "muscle building diet",
    "vegetarian meal planner",
    "keto meal plan generator",
    "mediterranean diet planner",
    "food allergy meal planning",
    "recipe meal planner",
    "shopping list generator",
    "macro calculator meal plan",
    "AI diet coach"
  ],
  authors: [
    {
      name: "Matthews Wong",
      url: "https://www.matthewswong.tech",
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
  classification: "Nutrition Planning Tool - Health and Fitness Application",
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
    canonical: "https://aigymbro.web.id/meal-plan",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aigymbro.web.id/meal-plan",
    siteName: "AI GymBRO",
    title: "Generate Your Personalized Meal Plan | AI GymBRO",
    description: "Create a customized meal plan with AI. Set your caloric needs, dietary preferences, allergies, and nutrition goals. Get personalized recipes and shopping lists.",
    images: [
      {
        url: "/meal-plan-og.png",
        width: 1200,
        height: 630,
        alt: "AI GymBRO Meal Plan Generator - Create Your Perfect Nutrition Plan",
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
    title: "Generate Your Personalized Meal Plan | AI GymBRO",
    description: "Create a customized meal plan with AI. Set calories, preferences & allergies for perfect nutrition planning.",
    images: [
      {
        url: "/meal-plan-twitter.png",
        width: 1200,
        height: 600,
        alt: "AI GymBRO Meal Plan Generator",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Meal Plan Generator",
    statusBarStyle: "black-translucent",
  },
  applicationName: "AI GymBRO",
  generator: "Next.js",
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "AI GymBRO Meal Planner",
    "msapplication-TileColor": "#16a34a",
    "theme-color": "#16a34a",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mealPlanJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nutritionServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToMealPlanJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbMealJsonLd) }}
      />
      {children}
    </>
  )
}