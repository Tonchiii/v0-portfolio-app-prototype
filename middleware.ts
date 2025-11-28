import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"

// Note: Arcjet and database imports removed to reduce middleware size for Edge runtime
// Rate limiting and bot detection moved to individual API routes

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
  // Simple rate limiting for edge runtime (lightweight)
  const ip = getIP(req)
  const now = Date.now()
  const entry = rateLimitStore.get(ip)
  
  if (!entry || entry.reset < now) {
    rateLimitStore.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS })
  } else {
    entry.count += 1
    
    if (entry.count > RATE_LIMIT_MAX) {
      const retryAfter = Math.ceil((entry.reset - now) / 1000)
      return new NextResponse("Too Many Requests", { 
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": "0",
        }
      })
    }
    
    rateLimitStore.set(ip, entry)
  }

  // Protect ALL routes except public routes (sign-in, sign-up)
  if (!isPublicRoute(req)) {
    await auth.protect()
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
