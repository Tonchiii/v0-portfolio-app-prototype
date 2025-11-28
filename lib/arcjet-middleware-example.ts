// Example: Using Arcjet in middleware
// Add this after your Clerk authentication

import { aj } from "@/lib/arcjet-config"

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // ... existing auth code ...

  // Arcjet protection
  const decision = await aj.protect(req)

  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      return new NextResponse("Forbidden - Bot Detected", { status: 403 })
    }
    if (decision.reason.isRateLimit()) {
      return new NextResponse("Too Many Requests", { 
        status: 429,
        headers: {
          "Retry-After": String(decision.reason.resetTime),
        },
      })
    }
    if (decision.reason.isShield()) {
      return new NextResponse("Forbidden - Suspicious Activity", { status: 403 })
    }
  }

  // ... rest of middleware ...
})
