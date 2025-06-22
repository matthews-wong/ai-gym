"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About AI GymBRO - Your Personal AI Fitness & Nutrition Coach",
  description:
    "Learn about AI GymBRO's mission to revolutionize fitness and nutrition through AI technology. Meet our founder Matthews Wong and discover our story.",
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
      url: "https://www.matthewswong.tech",
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
    url: "https://www.matthewswong.tech",
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
  url: "https://www.matthewswong.tech",
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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://api.aigymbro.web.id" />
        <link rel="dns-prefetch" href="https://cdn.aigymbro.web.id" />

        {/* Favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

        {/* Performance hints */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        {/* Main content wrapper */}
        <div id="main-content" role="main">
          {children}
        </div>

        {/* Critical CSS for above-the-fold content */}
        <style jsx global>{`
          /* Critical CSS for initial paint */
          body {
            margin: 0;
            padding: 0;
            font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
            background-color: #0f172a;
            color: #ffffff;
          }
          
          /* Prevent layout shift */
          .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Loading state */
          .loading-skeleton {
            background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </body>
    </html>
  )
}
