import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@/components/google-analytics"
import "./globals.css"
import { Suspense } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import AskAI from "@/components/ask-ai"

export const metadata: Metadata = {
  title: "Elton James T. Ramos | Security Engineer & Software Developer",
  description:
    "Portfolio of Elton James T. Ramos - AI Protector graduate specializing in OAuth MCP servers, penetration testing, and enterprise security architecture. Featuring production-ready security implementations.",
  keywords: [
    "security engineer",
    "software developer",
    "OAuth MCP",
    "penetration testing",
    "AI Protector",
    "Arcjet",
    "Clerk authentication",
    "cybersecurity",
    "Next.js",
    "TypeScript"
  ],
  authors: [{ name: "Elton James T. Ramos", url: "https://v0-portfolio-app-prototype-weeklate.vercel.app" }],
  creator: "Elton James T. Ramos",
  publisher: "Elton James T. Ramos",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://v0-portfolio-app-prototype-weeklate.vercel.app",
    title: "Elton James T. Ramos | Security Engineer & Software Developer",
    description: "AI Protector graduate specializing in OAuth MCP servers, penetration testing, and enterprise security architecture",
    siteName: "Elton James T. Ramos Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elton James T. Ramos | Security Engineer & Software Developer",
    description: "AI Protector graduate specializing in OAuth MCP servers and enterprise security",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  generator: "v0.app",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#06b6d4",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Elton James T. Ramos",
                "jobTitle": "Security Engineer & Software Developer",
                "description": "AI Protector graduate specializing in OAuth MCP servers, penetration testing, and enterprise security architecture",
                "url": "https://v0-portfolio-app-prototype-weeklate.vercel.app",
                "email": "eltonramos417@gmail.com",
                "telephone": "+639919043753",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Caloocan City",
                  "addressRegion": "Manila",
                  "addressCountry": "PH"
                },
                "alumniOf": {
                  "@type": "EducationalOrganization",
                  "name": "AI Protector - Agent Security Advanced"
                },
                "knowsAbout": [
                  "OAuth 2.0",
                  "Model Context Protocol",
                  "Penetration Testing",
                  "Arcjet Security",
                  "Clerk Authentication",
                  "Next.js",
                  "TypeScript",
                  "Cybersecurity",
                  "Software Development"
                ]
              })
            }}
          />
          <Suspense fallback={null}>{children}</Suspense>
          <AskAI />
          <GoogleAnalytics />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
