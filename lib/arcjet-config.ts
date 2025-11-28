// Arcjet configuration for comprehensive bot protection
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next"

export const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get from https://app.arcjet.com
  characteristics: ["ip.src"], // Track by IP address
  rules: [
    // Bot detection with ML
    detectBot({
      mode: "LIVE", // "DRY_RUN" for testing, "LIVE" for production
      allow: [
        // Allow legitimate crawlers
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
        "CATEGORY:PREVIEW", // OpenGraph, Twitter cards
        "CATEGORY:MONITOR", // Uptime monitors
      ],
    }),
    // Shield against common attacks
    shield({
      mode: "LIVE",
    }),
    // Rate limiting with token bucket
    tokenBucket({
      mode: "LIVE",
      refillRate: 100, // 100 tokens per interval
      interval: 60, // 60 seconds
      capacity: 100, // Max 100 tokens
    }),
  ],
})

// Different configurations for different routes
export const ajAuth = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [], // No bots allowed on auth routes
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 60,
      capacity: 5,
    }),
  ],
})

export const ajApi = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 50,
      interval: 60,
      capacity: 50,
    }),
  ],
})
