import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { blocked_users } from "@/lib/schema"
import { eq } from "drizzle-orm"

// Public routes - accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/subscribers",
  "/api/resume",
  "/blocked",
  "/blog(.*)",
  "/security-plan",
])

// Simple in-memory rate limiter (per-process). Good for dev / lightweight edge
// For production use a distributed store like Redis or Upstash.
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = process.env.NODE_ENV === "development" ? 1000 : 100 // Higher limit for dev
const rateLimitStore = new Map<string, { count: number; reset: number }>()

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
  // Basic rate limiting
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
        const tooMany = new NextResponse("Too Many Requests", { status: 429 })
        tooMany.headers.set("Retry-After", String(retryAfter))
        return tooMany
      }
      rateLimitStore.set(ip, entry)
    }
  } catch (err) {
    // If rate limiter has an error, continue — don't block requests unnecessarily
    // but log in a real app.
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
