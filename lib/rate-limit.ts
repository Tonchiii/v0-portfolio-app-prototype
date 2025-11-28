// Production-ready rate limiting with Upstash Redis
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Different rate limits for different endpoints
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  analytics: true,
  prefix: "@upstash/ratelimit",
})

export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 login attempts per minute
  analytics: true,
  prefix: "@upstash/ratelimit/auth",
})

export const strictRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute for sensitive endpoints
  analytics: true,
  prefix: "@upstash/ratelimit/strict",
})

// Helper to check rate limit
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit = apiRateLimit
) {
  const { success, limit, reset, remaining } = await limiter.limit(identifier)
  
  return {
    success,
    limit,
    reset,
    remaining,
    headers: {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": new Date(reset).toISOString(),
    },
  }
}
