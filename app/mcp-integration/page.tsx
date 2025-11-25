'use client'

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Lock, 
  Server, 
  Play,
  Terminal,
  CheckCircle2,
  Code,
  Eye,
  Activity,
  Key,
  AlertTriangle,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
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
      
      // Add to audit logs (client-side for demo)
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Back Button */}
      <div className="px-8 md:px-16 pt-24">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/" className="flex items-center gap-2 hover:text-cyan-400">
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-background to-background" />
        <div className="relative px-8 md:px-16 pt-32 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 mb-6">
                <Server className="w-10 h-10 text-cyan-400" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                MCP Server <span className="text-cyan-400">Integration</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Interactive demonstration of OAuth-secured Model Context Protocol server with roll_dice tool. 
                Experience enterprise security controls in action.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="outline" className="text-sm px-4 py-2 border-cyan-400/50 text-cyan-400">
                  <Lock className="w-4 h-4 mr-2" />
                  OAuth Protected
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Arcjet Security
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <Activity className="w-4 h-4 mr-2" />
                  Live Monitoring
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="px-8 md:px-16 py-16 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Try the MCP Server</h2>
          
          {!isSignedIn ? (
            <Card className="border-orange-400/20 bg-orange-500/5">
              <CardContent className="p-12 text-center">
                <Lock className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Authentication Required</h3>
                <p className="text-muted-foreground mb-6">
                  Sign in with GitHub OAuth to access the MCP server and roll dice
                </p>
                <Button size="lg" asChild>
                  <Link href="/sign-in">
                    Sign In to Continue
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Roll Dice Tool */}
              <Card className="border-cyan-400/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-cyan-400" />
                    Roll Dice Tool
                  </CardTitle>
                  <CardDescription>
                    Execute the roll_dice MCP tool with OAuth authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Authenticated as: <span className="font-mono text-cyan-400">{user?.primaryEmailAddress?.emailAddress}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={() => handleRollDice(6, 2)}
                      disabled={isRolling}
                    >
                      {isRolling ? 'Rolling...' : 'Roll 2d6'}
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleRollDice(20, 1)}
                      disabled={isRolling}
                    >
                      {isRolling ? 'Rolling...' : 'Roll 1d20'}
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleRollDice(6, 4)}
                      disabled={isRolling}
                    >
                      {isRolling ? 'Rolling...' : 'Roll 4d6'}
                    </Button>
                  </div>

                  {diceResult && (
                    <div className="mt-6 p-4 bg-muted rounded-lg border border-cyan-400/20">
                      <h4 className="font-semibold mb-3 text-cyan-400">Result:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rolls:</span>
                          <span className="font-mono">[{diceResult.result?.rolls?.join(', ')}]</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-bold text-2xl text-cyan-400">{diceResult.result?.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Timestamp:</span>
                          <span className="font-mono text-xs">{new Date(diceResult.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Audit Logs */}
              <Card className="border-cyan-400/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    Audit Trail
                  </CardTitle>
                  <CardDescription>
                    Real-time security logging of tool executions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No audit logs yet. Roll the dice to see logging in action.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {auditLogs.map((log, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg border border-border text-xs">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {log.action}
                            </Badge>
                            <span className="text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="space-y-1 font-mono text-xs">
                            <div>User: {log.user}</div>
                            <div>Rolls: [{log.details.result?.rolls?.join(', ')}]</div>
                            <div>Total: {log.details.result?.total}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* OAuth Flow Visualization */}
      <section className="px-8 md:px-16 py-16 bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">OAuth Authentication Flow</h2>
          
          <Card className="border-cyan-400/20">
            <CardContent className="p-8">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">User clicks "Sign In"</div>
                    <div className="text-muted-foreground">Client redirects to Clerk authentication</div>
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-cyan-400/20 h-8"></div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">GitHub OAuth Authorization</div>
                    <div className="text-muted-foreground">User authenticates with GitHub and grants scopes</div>
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-cyan-400/20 h-8"></div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Token Issued</div>
                    <div className="text-muted-foreground">Clerk returns JWT access token to client</div>
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-cyan-400/20 h-8"></div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">MCP Request with Token</div>
                    <div className="text-muted-foreground">Client sends POST /api/mcp/roll-dice with Authorization header</div>
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-cyan-400/20 h-8"></div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Arcjet Security Checks</div>
                    <div className="text-muted-foreground">Rate limiting (10/min) and bot detection validated</div>
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-cyan-400/20 h-8"></div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                    6
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Token Validation</div>
                    <div className="text-muted-foreground">Server verifies JWT signature and expiration with Clerk</div>
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-cyan-400/20 h-8"></div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold">
                    7
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Execute Tool</div>
                    <div className="text-muted-foreground">roll_dice() generates random dice rolls</div>
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-cyan-400/20 h-8"></div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                    8
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Audit Logging</div>
                    <div className="text-muted-foreground">Record userId, action, timestamp, IP, and result</div>
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-cyan-400/20 h-8"></div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                    9
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Return Response</div>
                    <div className="text-muted-foreground">Server returns JSON response with dice rolls and metadata</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security Features */}
      <section className="px-8 md:px-16 py-16 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Security Controls</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-cyan-400/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  OAuth 2.0
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">GitHub provider via Clerk</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">JWT token validation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Scope-based permissions</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">HTTP-only cookies</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Arcjet Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">10 requests/min rate limit</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">ML-powered bot detection</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">DDoS mitigation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Real-time threat blocking</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Audit Logging
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">All tool executions logged</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">User context captured</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Timestamp and IP tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Queryable audit trail</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="px-8 md:px-16 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">API Documentation</h2>
          
          <Card className="border-cyan-400/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                Example cURL Request
              </CardTitle>
              <CardDescription>
                Execute the roll_dice tool via command line
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono border border-border">
{`# Roll 2d6 (two six-sided dice)
curl -X POST https://v0-portfolio-app-prototype-weeklate.vercel.app/api/mcp/roll-dice \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"sides": 6, "count": 2}'

# Expected Response
{
  "result": {
    "rolls": [4, 6],
    "total": 10,
    "sides": 6,
    "count": 2
  },
  "user": "user_2abc123def",
  "timestamp": "2025-11-25T10:30:45.123Z"
}`}
              </pre>

              <div className="mt-6 flex gap-4">
                <Button variant="outline" asChild>
                  <Link href="/mcp-security">
                    <Code className="w-4 h-4 mr-2" />
                    Full Documentation
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://github.com/yourusername/v0-portfolio-app-prototype" target="_blank">
                    <Code className="w-4 h-4 mr-2" />
                    View Source Code
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
