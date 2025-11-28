import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { blocked_users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next"

// Arcjet protection with bot detection, rate limiting, and attack shield
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    // ML-powered bot detection
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, DuckDuckGo
        "CATEGORY:PREVIEW", // Social media preview bots
        "CATEGORY:MONITOR", // Uptime monitors
      ],
    }),
    // Shield against common attacks (SQL injection, XSS, etc.)
    shield({
      mode: "LIVE",
    }),
    // Token bucket rate limiting (more sophisticated than simple counter)
    tokenBucket({
      mode: "LIVE",
      refillRate: 100, // 100 tokens per interval
      interval: 60, // 60 seconds
      capacity: 100, // Max 100 tokens in bucket
    }),
  ],
})

// Public routes matcher - These routes are accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/blocked",
])

// Simple in-memory rate limiter (per-process). Good for dev / lightweight edge
// For production use a distributed store like Redis or Upstash.
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = process.env.NODE_ENV === "development" ? 100 : 100 // 100 requests per minute
const rateLimitStore = new Map<string, { count: number; reset: number }>()

// Cleanup old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.reset < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

function getIP(req: NextRequest) {
  // Try common headers first (behind proxies/load balancers), fall back to request ip
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  const real = req.headers.get("x-real-ip")
  if (real) return real
  // NextRequest may not expose a direct ip in all runtimes; use a safe default
  return "127.0.0.1"
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Arcjet protection (bot detection, rate limiting, attack shield)
  const decision = await aj.protect(req)
  
  // Handle denied requests
  if (decision.isDenied()) {
    const ip = getIP(req)
    
    if (decision.reason.isBot()) {
      console.warn(`[ARCJET] Bot detected and blocked from ${ip}`)
      return new NextResponse("Forbidden - Bot Detected", { 
        status: 403,
        headers: {
          "X-Arcjet-Decision": "DENY",
          "X-Arcjet-Reason": "BOT_DETECTED",
        }
      })
    }
    
    if (decision.reason.isRateLimit()) {
      console.warn(`[ARCJET] Rate limit exceeded from ${ip}`)
      return new NextResponse("Too Many Requests", { 
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((decision.reason.resetTime - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(decision.reason.max),
          "X-RateLimit-Remaining": String(decision.reason.remaining),
          "X-RateLimit-Reset": new Date(decision.reason.resetTime).toISOString(),
        }
      })
    }
    
    if (decision.reason.isShield()) {
      console.warn(`[ARCJET] Attack detected and blocked from ${ip}`)
      return new NextResponse("Forbidden - Suspicious Activity", { 
        status: 403,
        headers: {
          "X-Arcjet-Decision": "DENY",
          "X-Arcjet-Reason": "ATTACK_DETECTED",
        }
      })
    }
  }
  
  // Fallback: Basic rate limiting (in case Arcjet fails)
  try {
    const ip = getIP(req)
    const now = Date.now()
    const entry = rateLimitStore.get(ip)
    
    if (!entry || entry.reset < now) {
      rateLimitStore.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS })
    } else {
      entry.count += 1
      
      if (entry.count > RATE_LIMIT_MAX) {
        const retryAfter = Math.ceil((entry.reset - now) / 1000)
        console.warn(`[FALLBACK] Rate limit exceeded: ${ip}`)
        
        const tooMany = new NextResponse("Too Many Requests", { status: 429 })
        tooMany.headers.set("Retry-After", String(retryAfter))
        tooMany.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX))
        tooMany.headers.set("X-RateLimit-Remaining", "0")
        return tooMany
      }
      
      rateLimitStore.set(ip, entry)
    }
  } catch (err) {
    console.error("Rate limiting error:", err)
  }

  // Protect ALL routes except public routes (sign-in, sign-up)
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // Check if user is blocked (only for authenticated users)
  const { userId } = await auth()
  if (userId && !isPublicRoute(req) && req.nextUrl.pathname !== "/blocked") {
    try {
      const blockedUser = await db.select().from(blocked_users).where(eq(blocked_users.user_id, userId))
      if (blockedUser.length > 0) {
        // Redirect blocked users to the blocked page
        return NextResponse.redirect(new URL("/blocked", req.url))
      }
    } catch (err) {
      // If check fails, log but continue (don't break the app)
      console.error("Error checking blocked user:", err)
    }
  }

  // Apply security headers to all responses
  const res = NextResponse.next()

  // Content-Security-Policy: conservative but allow inline styles for compatibility.
  // Update this policy to match your external assets (fonts, CDNs, analytics) as needed.
  // Allow https: for scripts and connect so Clerk and other external CDNs/APIs can be loaded.
  // Adjust origins to be more strict in production (prefer explicit domains like https://*.clerk.dev).
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; connect-src 'self' https:"
  )
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("Referrer-Policy", "no-referrer-when-downgrade")
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")

  return res
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
