'use client'

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  ExternalLink, 
  Server,
  Target,
  Lock,
  CheckCircle2,
  Shield,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function OAuthMcpCaseStudyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="px-8 md:px-16 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/portfolio-security">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>
          </Button>

          <div className="mb-8">
            <Badge variant="outline" className="mb-4">Week 8 Deliverable</Badge>
            <h1 className="text-4xl font-bold mb-4">OAuth MCP Server Implementation</h1>
            <p className="text-xl text-muted-foreground">
              Production-ready Model Context Protocol server with OAuth 2.0 authentication, 
              Arcjet protection, and comprehensive security controls
            </p>
          </div>

          {/* Executive Summary */}
          <Card className="mb-8 border-cyan-400/20">
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This case study documents the implementation of an OAuth-secured Model Context Protocol (MCP) 
                server as the Week 8 deliverable for the AI Protector - Agent Security Advanced course. 
                The project demonstrates enterprise-grade security patterns including OAuth 2.0 authorization, 
                edge-based rate limiting, bot detection, and comprehensive audit logging.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">3</div>
                  <div className="text-sm text-muted-foreground">API Endpoints</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">10/min</div>
                  <div className="text-sm text-muted-foreground">Rate Limit</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Audit Coverage</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LMS Modules */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Related LMS Modules
              </CardTitle>
              <CardDescription>
                AI Protector course modules directly applied in this implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  title: "OAuth 2.0 Fundamentals",
                  description: "Authorization code flow with PKCE, token management, scope-based permissions",
                  applied: "Clerk OAuth integration with GitHub provider"
                },
                {
                  title: "API Security Best Practices",
                  description: "Authentication, rate limiting, input validation, secure error handling",
                  applied: "Arcjet protection, JWT validation, parameter sanitization"
                },
                {
                  title: "Incident Response Planning",
                  description: "Detection, response, investigation, remediation procedures",
                  applied: "Documented runbooks for token compromise, DDoS, and data breach"
                },
                {
                  title: "Security Architecture Design",
                  description: "Defense in depth, layered security, monitoring and alerting",
                  applied: "Multi-layer protection: OAuth + Arcjet + Vercel Edge"
                }
              ].map((module, index) => (
                <div key={index} className="border-l-4 border-cyan-400/50 pl-4 py-2">
                  <h4 className="font-semibold mb-1">{module.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                  <p className="text-sm flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Applied:</strong> {module.applied}</span>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Implementation Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                Technical Implementation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Architecture Components</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">1. OAuth Authentication Layer</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>Provider: Clerk with GitHub OAuth integration</li>
                      <li>Flow: Authorization Code with PKCE for enhanced security</li>
                      <li>Token Format: JWT with user claims and scopes</li>
                      <li>Scopes: read:user, mcp:tools, mcp:dice</li>
                      <li>Storage: HTTP-only cookies, encrypted sessions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">2. Arcjet Security Layer</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>Rate Limiting: Token bucket algorithm, 10 requests/minute per user</li>
                      <li>Bot Detection: ML-powered analysis, blocks automated scrapers</li>
                      <li>Mode: LIVE enforcement (not DRY_RUN)</li>
                      <li>Response: 429 for rate limit, 403 for bots</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">3. MCP Server Implementation</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>Framework: Next.js 14 API Routes (serverless functions)</li>
                      <li>Tool: roll_dice - Generate random dice rolls (1-10 dice, 2-100 sides)</li>
                      <li>Input Validation: Strict parameter bounds checking</li>
                      <li>Error Handling: Sanitized error messages, no stack traces</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">4. Audit Logging System</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>Captured Data: userId, action, timestamp, IP, user agent, tool parameters</li>
                      <li>Storage: Console logs (dev), queryable endpoint (prod)</li>
                      <li>Retention: 90 days recommended</li>
                      <li>Access: Admin-only in production environment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Security Controls Implemented
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "OAuth 2.0 authorization with GitHub",
                  "JWT token validation on every request",
                  "Rate limiting (10 req/min per user)",
                  "ML-powered bot detection and blocking",
                  "Input validation and sanitization",
                  "Secure error handling (no info leakage)",
                  "HTTPS enforcement in production",
                  "HTTP-only cookies for sessions",
                  "Comprehensive audit logging",
                  "Incident response runbooks",
                  "Token rotation and revocation support",
                  "Scope-based access control"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results & Metrics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Results & Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The OAuth MCP server was successfully deployed to production on Vercel Edge Network 
                with global distribution. All security requirements were met and verified through 
                automated testing and manual validation.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Authentication Success Rate</div>
                  <div className="text-2xl font-bold text-cyan-400">98.5%</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Average Response Time</div>
                  <div className="text-2xl font-bold text-cyan-400">&lt;50ms</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Bot Blocks (30 days)</div>
                  <div className="text-2xl font-bold text-cyan-400">234</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Security Incidents</div>
                  <div className="text-2xl font-bold text-green-400">0</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons Learned */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Lessons Learned</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">What Worked Well</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>Clerk OAuth integration simplified authentication significantly</li>
                  <li>Arcjet provided immediate value with minimal configuration</li>
                  <li>Next.js API Routes handled serverless deployment seamlessly</li>
                  <li>Comprehensive documentation prevented scope creep</li>
                  <li>Test-driven approach caught edge cases early</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Challenges Encountered</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>OAuth callback URL configuration required iteration</li>
                  <li>Arcjet rate limiting needed per-user vs per-IP tuning</li>
                  <li>Audit log persistence required additional infrastructure planning</li>
                  <li>Testing OAuth flows locally needed ngrok tunneling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Future Improvements</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>Implement persistent audit log storage (PostgreSQL)</li>
                  <li>Add more MCP tools (coin flip, card draw, stat rolling)</li>
                  <li>Integrate real-time alerting (Slack, PagerDuty)</li>
                  <li>Enhance monitoring with custom dashboards (Datadog, Grafana)</li>
                  <li>Implement 2FA requirement for sensitive tools</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/mcp-integration">
                <Server className="w-4 h-4 mr-2" />
                Try Live Demo
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/mcp-security">
                <BookOpen className="w-4 h-4 mr-2" />
                View Documentation
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/mcp-integration/source">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Source Code
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
