// Example: Using Upstash rate limiting in middleware
// Replace the basic rate limiting section in middleware.ts with this

import { checkRateLimit, apiRateLimit } from "@/lib/rate-limit"

// In your middleware function:
const ip = getIP(req)
const rateCheck = await checkRateLimit(ip, apiRateLimit)

if (!rateCheck.success) {
  const response = new NextResponse("Too Many Requests", { status: 429 })
  response.headers.set("Retry-After", String(Math.ceil((rateCheck.reset - Date.now()) / 1000)))
  Object.entries(rateCheck.headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}
