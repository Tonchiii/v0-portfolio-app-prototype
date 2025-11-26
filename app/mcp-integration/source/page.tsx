'use client'

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Code, FileCode, Server } from "lucide-react"
import Link from "next/link"

export default function McpSourceCodePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Back Button */}
      <div className="px-8 md:px-16 pt-24">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/mcp-integration" className="flex items-center gap-2 hover:text-cyan-400">
            <ArrowLeft className="w-4 h-4" />
            Back to MCP Integration
          </Link>
        </Button>
      </div>

      {/* Header */}
      <section className="px-8 md:px-16 pt-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 mb-4">
              <FileCode className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              MCP Server <span className="text-cyan-400">Source Code</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Implementation details of the OAuth-secured Model Context Protocol server
            </p>
          </div>
        </div>
      </section>

      {/* Source Code Tabs */}
      <section className="px-8 md:px-16 pb-16">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="api" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="api">API Route</TabsTrigger>
              <TabsTrigger value="client">MCP Client</TabsTrigger>
              <TabsTrigger value="ui">UI Component</TabsTrigger>
            </TabsList>

            {/* API Route */}
            <TabsContent value="api" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-cyan-400" />
                    app/api/mcp/roll-dice/route.ts
                  </CardTitle>
                  <CardDescription>
                    OAuth-protected endpoint with Arcjet security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Next.js 14</Badge>
                    <Badge variant="outline">Clerk Auth</Badge>
                    <Badge variant="outline">Arcjet</Badge>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono border border-border max-h-[600px] overflow-y-auto">
{`import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(req: NextRequest) {
  try {
    // Arcjet protection check
    const decision = await aj.protect(req, { requested: 1 })
    
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        )
      }
      if (decision.reason.isBot()) {
        return NextResponse.json(
          { error: 'Bot detected' },
          { status: 403 }
        )
      }
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // OAuth authentication via Clerk
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: DiceRollRequest = await req.json()
    const sides = body.sides || 6
    const count = body.count || 1

    // Validation
    if (sides < 2 || sides > 100) {
      return NextResponse.json(
        { error: 'Sides must be between 2 and 100' },
        { status: 400 }
      )
    }
    if (count < 1 || count > 10) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 10' },
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
        name: \`\${user.firstName || ''} \${user.lastName || ''}\`.trim() || 'User',
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('[ERROR] MCP Roll Dice:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* MCP Client */}
            <TabsContent value="client" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    examples/mcp-client-example.ts
                  </CardTitle>
                  <CardDescription>
                    TypeScript client library for MCP server integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Fetch API</Badge>
                    <Badge variant="outline">Rate Limiting</Badge>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono border border-border max-h-[600px] overflow-y-auto">
{`interface DiceRollRequest {
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

class MCPRollDiceClient {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  async rollDice(params?: DiceRollRequest): Promise<DiceRollResponse> {
    if (!this.accessToken) {
      throw new Error('Access token not set')
    }

    const response = await fetch(\`\${this.baseUrl}/api/mcp/roll-dice\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.accessToken}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params || {}),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Roll dice failed')
    }

    return await response.json()
  }
}

// Usage Example
async function example() {
  const client = new MCPRollDiceClient('https://your-domain.vercel.app')
  client.setAccessToken('your_oauth_token')

  // Roll 2d6
  const result = await client.rollDice({ sides: 6, count: 2 })
  console.log(\`Rolls: \${result.rolls.join(', ')}\`)
  console.log(\`Total: \${result.total}\`)
}

export { MCPRollDiceClient }
export type { DiceRollRequest, DiceRollResponse }`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* UI Component */}
            <TabsContent value="ui" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    app/mcp-integration/page.tsx
                  </CardTitle>
                  <CardDescription>
                    React component for interactive dice rolling UI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Next.js 14</Badge>
                    <Badge variant="outline">Clerk Hooks</Badge>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono border border-border max-h-[600px] overflow-y-auto">
{`'use client'

import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function McpIntegrationPage() {
  const { isSignedIn, user } = useUser()
  const [diceResult, setDiceResult] = useState<any>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  const handleRollDice = async (sides: number = 6, count: number = 2) => {
    if (!isSignedIn) {
      alert('Please sign in to use the MCP server')
      return
    }

    setIsRolling(true)
    setDiceResult(null)

    try {
      const response = await fetch('/api/mcp/roll-dice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides, count }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to roll dice')
      }

      const result = await response.json()
      setDiceResult(result)
      
      // Add to audit logs
      setAuditLogs(prev => [{
        timestamp: new Date().toISOString(),
        action: 'roll_dice',
        details: result,
        user: user?.primaryEmailAddress?.emailAddress
      }, ...prev.slice(0, 4)])
    } catch (error: any) {
      alert(error.message || 'Error rolling dice')
    } finally {
      setIsRolling(false)
    }
  }

  return (
    <div>
      <Button 
        onClick={() => handleRollDice(6, 2)}
        disabled={isRolling}
      >
        {isRolling ? 'Rolling...' : 'Roll 2d6'}
      </Button>

      {diceResult && (
        <div>
          <p>Rolls: [{diceResult.rolls?.join(', ')}]</p>
          <p>Total: {diceResult.total}</p>
        </div>
      )}
    </div>
  )
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Additional Resources */}
          <Card className="mt-6 border-cyan-400/20">
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/mcp-security">
                  <Code className="w-4 h-4 mr-2" />
                  Full MCP Security Documentation
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/case-studies/oauth-mcp">
                  <FileCode className="w-4 h-4 mr-2" />
                  OAuth MCP Case Study
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
