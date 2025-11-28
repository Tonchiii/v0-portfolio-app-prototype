// Basic bot detection via user-agent
// Add this to your middleware.ts

const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
  /puppeteer/i,
  /python-requests/i,
  /curl/i,
  /wget/i,
  /libwww/i,
]

// Whitelist legitimate bots
const ALLOWED_BOTS = [
  /googlebot/i,
  /bingbot/i,
  /slackbot/i,
  /twitterbot/i,
  /facebookexternalhit/i,
  /linkedinbot/i,
  /discordbot/i,
]

export function detectBot(userAgent: string | null): { isBot: boolean; isAllowed: boolean } {
  if (!userAgent) {
    return { isBot: true, isAllowed: false } // No user agent = suspicious
  }

  // Check if it's an allowed bot
  const isAllowed = ALLOWED_BOTS.some(pattern => pattern.test(userAgent))
  if (isAllowed) {
    return { isBot: true, isAllowed: true }
  }

  // Check if it's a bot
  const isBot = BOT_PATTERNS.some(pattern => pattern.test(userAgent))
  return { isBot, isAllowed: false }
}

// Usage in middleware:
const userAgent = req.headers.get("user-agent")
const botCheck = detectBot(userAgent)

if (botCheck.isBot && !botCheck.isAllowed) {
  return new NextResponse("Forbidden - Bot Detected", { status: 403 })
}
