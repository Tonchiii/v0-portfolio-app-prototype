import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import arcjet, { tokenBucket, detectBot } from '@arcjet/next'

// Arcjet protection for MCP endpoints
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Token bucket rate limiting: 10 requests per minute per user
    tokenBucket({
      mode: 'LIVE',
      refillRate: 10,
      interval: 60,
      capacity: 10,
    }),
    // Bot detection
    detectBot({
      mode: 'LIVE',
      allow: [], // Block all bots by default
    }),
  ],
})

interface DiceRollRequest {
  sides?: number
  count?: number
}

interface DiceRollResponse {
  rolls: number[]
  total: number
  sides: number
  count: number
  user: {
    id: string
    email: string
    name: string
  }
  timestamp: string
}

/**
 * MCP Roll Dice Tool
 * OAuth-protected endpoint for rolling dice
 * Integrates with Clerk authentication and Arcjet security
 */
export async function POST(req: NextRequest) {
  try {
    // Arcjet protection check
    const decision = await aj.protect(req, { requested: 1 })
    
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
          },
          { status: 429 }
        )
      }
      
      if (decision.reason.isBot()) {
        return NextResponse.json(
          {
            error: 'Bot detected',
            message: 'Automated requests are not allowed.',
          },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { error: 'Access denied', message: 'Request blocked by security policy.' },
        { status: 403 }
      )
    }

    // OAuth authentication via Clerk
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required. Please sign in with OAuth.',
        },
        { status: 401 }
      )
    }

    // Parse request body
    const body: DiceRollRequest = await req.json()
    const sides = body.sides || 6 // Default to 6-sided die
    const count = body.count || 1 // Default to 1 die

    // Validation
    if (sides < 2 || sides > 100) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          message: 'Sides must be between 2 and 100.',
        },
        { status: 400 }
      )
    }

    if (count < 1 || count > 10) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          message: 'Count must be between 1 and 10.',
        },
        { status: 400 }
      )
    }

    // Roll dice
    const rolls: number[] = []
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1)
    }

    const total = rolls.reduce((sum, roll) => sum + roll, 0)

    // Audit logging
    console.log('[AUDIT]', {
      action: 'mcp_roll_dice',
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      sides,
      count,
      rolls,
      total,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      userAgent: req.headers.get('user-agent'),
    })

    // Response
    const response: DiceRollResponse = {
      rolls,
      total,
      sides,
      count,
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('[ERROR] MCP Roll Dice:', error)
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An error occurred while processing your request.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for MCP tool discovery
 * Returns tool metadata for MCP clients
 */
export async function GET(req: NextRequest) {
  try {
    // Authentication check (but allow unauthenticated tool discovery)
    const user = await currentUser()

    const toolMetadata = {
      name: 'roll_dice',
      description: 'Roll dice with specified sides and count. Requires OAuth authentication.',
      version: '1.0.0',
      authentication: {
        type: 'oauth2',
        provider: 'clerk',
        required: true,
      },
      inputSchema: {
        type: 'object',
        properties: {
          sides: {
            type: 'number',
            description: 'Number of sides on the die (2-100)',
            default: 6,
            minimum: 2,
            maximum: 100,
          },
          count: {
            type: 'number',
            description: 'Number of dice to roll (1-10)',
            default: 1,
            minimum: 1,
            maximum: 10,
          },
        },
      },
      outputSchema: {
        type: 'object',
        properties: {
          rolls: {
            type: 'array',
            items: { type: 'number' },
            description: 'Individual dice roll results',
          },
          total: {
            type: 'number',
            description: 'Sum of all rolls',
          },
          sides: {
            type: 'number',
            description: 'Number of sides used',
          },
          count: {
            type: 'number',
            description: 'Number of dice rolled',
          },
          user: {
            type: 'object',
            description: 'Authenticated user information',
          },
          timestamp: {
            type: 'string',
            description: 'ISO 8601 timestamp of the roll',
          },
        },
      },
      security: {
        arcjet: {
          rateLimit: '10 requests per minute',
          botDetection: 'enabled',
        },
        clerk: {
          oauthRequired: true,
        },
        logging: {
          auditLog: 'enabled',
          includes: ['userId', 'email', 'action', 'timestamp', 'ip'],
        },
      },
      authenticated: !!user,
    }

    return NextResponse.json(toolMetadata, { status: 200 })
  } catch (error) {
    console.error('[ERROR] MCP Tool Discovery:', error)
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to retrieve tool metadata.',
      },
      { status: 500 }
    )
  }
}
