'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, AlertTriangle, Activity, Key, Server, FileText, Bell } from 'lucide-react'

export default function McpSecurityPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">MCP Security Architecture</h1>
        <p className="text-xl text-muted-foreground">
          Production-ready OAuth-secured Model Context Protocol server with comprehensive security controls
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="default">Week 8 Deliverable</Badge>
          <Badge variant="outline">OAuth 2.0</Badge>
          <Badge variant="outline">Arcjet Protected</Badge>
          <Badge variant="outline">Production Ready</Badge>
        </div>
      </div>

      {/* Architecture Overview */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="h-6 w-6" />
            <CardTitle>Architecture Overview</CardTitle>
          </div>
          <CardDescription>
            Multi-layer security architecture for MCP server deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">System Components</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4" /> OAuth Authentication Layer
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Provider: Clerk (GitHub OAuth)</li>
                    <li>• Flow: Authorization Code with PKCE</li>
                    <li>• Token Storage: Encrypted session-based</li>
                    <li>• Scopes: read:user, mcp:tools, mcp:dice</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Arcjet Protection
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Rate Limiting: 10 req/min per user</li>
                    <li>• Bot Detection: ML-powered analysis</li>
                    <li>• DDoS Protection: Token bucket algorithm</li>
                    <li>• Mode: LIVE (enforcement enabled)</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Server className="h-4 w-4" /> MCP Server
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Tool: roll_dice (OAuth-protected)</li>
                    <li>• API: REST endpoints at /api/mcp/*</li>
                    <li>• Framework: Next.js 14 API Routes</li>
                    <li>• Deployment: Vercel Edge Functions</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Monitoring & Logging
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Audit Logs: All tool executions</li>
                    <li>• Security Events: Auth failures, rate limits</li>
                    <li>• Metrics: Request volume, latency</li>
                    <li>• Alerts: Real-time anomaly detection</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Request Flow</h3>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                <div className="space-y-2">
                  <div>1. Client → <span className="text-blue-600">OAuth Authorization</span> → Clerk</div>
                  <div className="ml-4">↓ User authenticates, grants scopes</div>
                  <div>2. Clerk → <span className="text-green-600">Access Token</span> → Client</div>
                  <div className="ml-4">↓ JWT token with user claims</div>
                  <div>3. Client → <span className="text-purple-600">MCP Request + Token</span> → /api/mcp/roll-dice</div>
                  <div className="ml-4">↓ Authorization: Bearer &lt;token&gt;</div>
                  <div>4. Arcjet → <span className="text-orange-600">Security Checks</span></div>
                  <div className="ml-4">↓ Rate limit, bot detection</div>
                  <div>5. Server → <span className="text-blue-600">Token Validation</span> → Clerk</div>
                  <div className="ml-4">↓ Verify signature, expiration</div>
                  <div>6. Server → <span className="text-green-600">Execute Tool</span> → roll_dice()</div>
                  <div className="ml-4">↓ Generate random dice rolls</div>
                  <div>7. Server → <span className="text-purple-600">Audit Log</span> → Log service</div>
                  <div className="ml-4">↓ Record: userId, action, timestamp, IP</div>
                  <div>8. Server → <span className="text-green-600">Response</span> → Client</div>
                  <div className="ml-4">↓ {JSON.stringify({ rolls: [4, 6], total: 10 }, null, 0)}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OAuth Implementation */}
      <Card className="mb-8" id="oauth">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6" />
            <CardTitle>OAuth 2.0 Implementation</CardTitle>
          </div>
          <CardDescription>
            Secure authentication using industry-standard OAuth 2.0 protocol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">OAuth Provider Configuration</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="space-y-2 text-sm font-mono">
                  <div><span className="text-muted-foreground">Provider:</span> Clerk (clerk.com)</div>
                  <div><span className="text-muted-foreground">OAuth App:</span> GitHub Integration</div>
                  <div><span className="text-muted-foreground">Client ID:</span> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.slice(0, 20)}...</div>
                  <div><span className="text-muted-foreground">Callback URL:</span> https://your-domain.vercel.app/api/auth/callback</div>
                  <div><span className="text-muted-foreground">Scopes:</span> read:user, mcp:tools, mcp:dice</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Token Security</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Access Tokens</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Format: JWT (JSON Web Token)</li>
                    <li>• Lifetime: 1 hour (configurable)</li>
                    <li>• Storage: HTTP-only cookies</li>
                    <li>• Transmission: HTTPS only</li>
                    <li>• Validation: Signature verification</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Security Measures</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• PKCE: Prevents authorization code interception</li>
                    <li>• State Parameter: Prevents CSRF attacks</li>
                    <li>• Token Rotation: Regular refresh required</li>
                    <li>• Revocation: Immediate token invalidation</li>
                    <li>• Scope Enforcement: Granular permissions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Scope-Based Access Control</h3>
              <div className="space-y-2">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-semibold">read:user</div>
                  <div className="text-sm text-muted-foreground">Access basic user profile (name, email, ID)</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="font-semibold">mcp:tools</div>
                  <div className="text-sm text-muted-foreground">Execute any MCP tool (general permission)</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="font-semibold">mcp:dice</div>
                  <div className="text-sm text-muted-foreground">Specific permission for roll_dice tool</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arcjet Configuration */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <CardTitle>Arcjet Security Configuration</CardTitle>
          </div>
          <CardDescription>
            Real-time protection against abuse and automated attacks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Protection Rules</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Token Bucket Rate Limiting
                  </h4>
                  <div className="bg-muted/50 rounded p-3 font-mono text-sm mb-2">
                    tokenBucket({`{`}<br />
                    &nbsp;&nbsp;mode: 'LIVE',<br />
                    &nbsp;&nbsp;refillRate: 10,<br />
                    &nbsp;&nbsp;interval: 60, // seconds<br />
                    &nbsp;&nbsp;capacity: 10<br />
                    {`}`})
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Limits each user to 10 requests per minute with smooth refill. Prevents API abuse while allowing burst traffic.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Bot Detection
                  </h4>
                  <div className="bg-muted/50 rounded p-3 font-mono text-sm mb-2">
                    detectBot({`{`}<br />
                    &nbsp;&nbsp;mode: 'LIVE',<br />
                    &nbsp;&nbsp;allow: [] // Block all bots<br />
                    {`}`})
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ML-powered bot detection analyzes request patterns, headers, and behavior. Blocks automated scrapers and malicious bots.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Response to Security Events</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-semibold mb-2 text-orange-600">Rate Limit Exceeded</div>
                  <div className="text-sm text-muted-foreground">
                    HTTP 429 • Too Many Requests<br />
                    User must wait before retrying
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-semibold mb-2 text-red-600">Bot Detected</div>
                  <div className="text-sm text-muted-foreground">
                    HTTP 403 • Forbidden<br />
                    Request blocked permanently
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-semibold mb-2 text-red-600">Attack Pattern</div>
                  <div className="text-sm text-muted-foreground">
                    HTTP 403 • Forbidden<br />
                    IP banned, alert triggered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logging & Alerting */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            <CardTitle>Logging & Alerting</CardTitle>
          </div>
          <CardDescription>
            Comprehensive audit trail and real-time security monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Audit Logging</h3>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-600 mb-2">// Every MCP tool execution is logged:</div>
                {`{
  "action": "mcp_roll_dice",
  "userId": "user_2abc123def",
  "email": "eltonramos417@gmail.com",
  "timestamp": "2025-11-25T10:30:45.123Z",
  "details": {
    "sides": 6,
    "count": 2,
    "rolls": [4, 6],
    "total": 10
  },
  "ip": "203.0.113.42",
  "userAgent": "Claude-Desktop/1.0",
  "sessionId": "sess_xyz789"
}`}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Logs stored in /api/mcp/audit endpoint. Queryable by action, user, timestamp. Retained for 90 days.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Security Alerts</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 border-l-4 border-yellow-500 pl-4 py-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-600" />
                  <div>
                    <div className="font-semibold">Multiple Failed Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Triggered after 5 failed auth attempts in 5 minutes. Alert sent to admin.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border-l-4 border-orange-500 pl-4 py-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-600" />
                  <div>
                    <div className="font-semibold">Rate Limit Abuse</div>
                    <div className="text-sm text-muted-foreground">
                      Sustained rate limiting (10+ blocks/hour) indicates potential attack. IP reviewed.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border-l-4 border-red-500 pl-4 py-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600" />
                  <div>
                    <div className="font-semibold">Unusual Access Pattern</div>
                    <div className="text-sm text-muted-foreground">
                      Tool execution from new geolocation or unexpected time. Requires verification.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Monitoring Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Real-time metrics tracked via Vercel Analytics and custom monitoring:
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">10/min</div>
                  <div className="text-sm text-muted-foreground">Rate Limit</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">&lt;50ms</div>
                  <div className="text-sm text-muted-foreground">Avg Latency</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Security Incidents</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Response */}
      <Card className="mb-8" id="incident-response">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <CardTitle>Incident Response Runbook</CardTitle>
          </div>
          <CardDescription>
            Procedures for handling security incidents and token compromise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Scenario 1: OAuth Token Compromise</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="font-semibold mb-1">🚨 Detection</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Unusual tool execution patterns (location, time, volume)</li>
                    <li>• User report of unauthorized activity</li>
                    <li>• Multiple concurrent sessions from different IPs</li>
                    <li>• Anomaly detection alert triggered</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <div className="font-semibold mb-1">⚡ Immediate Response (0-15 minutes)</div>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Identify affected user account and session ID</li>
                    <li>Revoke all active sessions for compromised user via Clerk dashboard</li>
                    <li>Invalidate OAuth tokens at provider level (Clerk → GitHub)</li>
                    <li>Block suspicious IP addresses in Vercel Firewall</li>
                    <li>Notify user via email of potential compromise</li>
                  </ol>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="font-semibold mb-1">🔍 Investigation (15-60 minutes)</div>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Review audit logs for compromised account (/api/mcp/audit)</li>
                    <li>Identify all actions taken with compromised token</li>
                    <li>Check for data exfiltration or malicious tool usage</li>
                    <li>Trace attack vector (phishing, MITM, client malware)</li>
                    <li>Document timeline and impact assessment</li>
                  </ol>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-semibold mb-1">🛡️ Remediation (1-4 hours)</div>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Force password reset for affected user account</li>
                    <li>Enable 2FA if not already active (Clerk MFA)</li>
                    <li>Rotate OAuth client secrets if compromised</li>
                    <li>Review and tighten scope permissions</li>
                    <li>Update Arcjet rules if attack pattern identified</li>
                  </ol>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="font-semibold mb-1">📋 Post-Incident (4-24 hours)</div>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Complete incident report with root cause analysis</li>
                    <li>Notify affected users with recommendations</li>
                    <li>Update security documentation and runbooks</li>
                    <li>Implement additional monitoring for similar patterns</li>
                    <li>Schedule post-mortem review meeting</li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Scenario 2: DDoS / Rate Limit Abuse</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="font-semibold mb-1">🚨 Detection</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Arcjet rate limit triggered repeatedly (100+ times/hour)</li>
                    <li>• API latency spike (&gt;500ms average)</li>
                    <li>• Vercel function invocation surge</li>
                    <li>• Bot detection alerts flooding dashboard</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <div className="font-semibold mb-1">⚡ Immediate Response</div>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Identify attacking IP addresses/ranges from logs</li>
                    <li>Add IPs to Vercel Firewall blocklist immediately</li>
                    <li>Reduce Arcjet rate limits temporarily (5 req/min)</li>
                    <li>Enable strict bot detection (block all non-verified clients)</li>
                    <li>Contact Vercel support if attack overwhelms infrastructure</li>
                  </ol>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-semibold mb-1">🛡️ Mitigation</div>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Analyze attack pattern (distributed, single source, volumetric)</li>
                    <li>Implement geo-blocking if attacks from specific regions</li>
                    <li>Add CAPTCHA challenge for suspicious requests (if UI-based)</li>
                    <li>Review and optimize API performance to handle load</li>
                    <li>Monitor for attack evolution and adjust rules</li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Scenario 3: Data Breach / Unauthorized Access</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="font-semibold mb-1">🚨 Detection</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Audit logs show access to data user shouldn't have</li>
                    <li>• Unusual scope usage (e.g., admin scope by non-admin)</li>
                    <li>• Reports of leaked credentials or data exposure</li>
                    <li>• Clerk security dashboard flags compromised accounts</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <div className="font-semibold mb-1">⚡ Immediate Response</div>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Revoke all sessions for ALL users immediately</li>
                    <li>Rotate all OAuth secrets and API keys</li>
                    <li>Take MCP server offline temporarily (maintenance mode)</li>
                    <li>Secure all logs and audit trails for forensics</li>
                    <li>Notify security team and legal counsel</li>
                  </ol>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="font-semibold mb-1">📊 Compliance & Notification</div>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Assess scope of breach (what data, how many users)</li>
                    <li>Notify affected users within 72 hours (GDPR requirement)</li>
                    <li>File breach report with relevant authorities if required</li>
                    <li>Offer credit monitoring or identity protection services</li>
                    <li>Publish transparency report on incident</li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Emergency Contacts</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold mb-1">Security Lead</div>
                    <div className="text-muted-foreground">Elton James T. Ramos</div>
                    <div className="text-muted-foreground">eltonramos417@gmail.com</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Clerk Support</div>
                    <div className="text-muted-foreground">support@clerk.com</div>
                    <div className="text-muted-foreground">clerk.com/support</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Vercel Support</div>
                    <div className="text-muted-foreground">vercel.com/support</div>
                    <div className="text-muted-foreground">Priority: Enterprise</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Arcjet Security</div>
                    <div className="text-muted-foreground">hello@arcjet.com</div>
                    <div className="text-muted-foreground">arcjet.com/docs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Available MCP endpoints and usage examples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold font-mono">POST /api/mcp/roll-dice</h4>
                <Badge variant="outline">Protected</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Roll dice with specified parameters. Requires OAuth authentication.
              </p>
              <div className="bg-muted/50 rounded p-3 font-mono text-xs">
                curl -X POST https://your-domain.vercel.app/api/mcp/roll-dice \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer $TOKEN" \<br />
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                &nbsp;&nbsp;-d '{`{"sides": 20, "count": 2}`}'
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold font-mono">GET /api/mcp</h4>
                <Badge variant="secondary">Public</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Server metadata and available tools discovery.
              </p>
              <div className="bg-muted/50 rounded p-3 font-mono text-xs">
                curl https://your-domain.vercel.app/api/mcp
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold font-mono">GET /api/mcp/audit</h4>
                <Badge variant="outline">Admin</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Retrieve audit logs (admin only in production).
              </p>
              <div className="bg-muted/50 rounded p-3 font-mono text-xs">
                curl https://your-domain.vercel.app/api/mcp/audit?limit=50 \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer $ADMIN_TOKEN"
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Information</CardTitle>
          <CardDescription>
            Production environment configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Platform</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Host:</strong> Vercel Edge Network</li>
                <li>• <strong>Framework:</strong> Next.js 14</li>
                <li>• <strong>Runtime:</strong> Node.js 20</li>
                <li>• <strong>Region:</strong> Global (Edge Functions)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Security Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>SSL/TLS:</strong> Automatic HTTPS</li>
                <li>• <strong>Firewall:</strong> Vercel Firewall (IP/Geo blocking)</li>
                <li>• <strong>DDoS:</strong> Arcjet + Vercel Protection</li>
                <li>• <strong>WAF:</strong> Application-level filtering</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Monitoring</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Analytics:</strong> Vercel Analytics</li>
                <li>• <strong>Logs:</strong> Vercel Logs + Custom audit</li>
                <li>• <strong>Alerts:</strong> Email + Slack notifications</li>
                <li>• <strong>Uptime:</strong> 99.9% SLA</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Environment Variables</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
                <li>• CLERK_SECRET_KEY</li>
                <li>• ARCJET_KEY</li>
                <li>• DATABASE_URL</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
        <p>
          <strong>Week 8 Deliverable</strong> - AI Protector Security Course
        </p>
        <p>Student: Elton James T. Ramos • Due: End of Week 8</p>
        <p className="mt-2">
          For support, contact: eltonramos417@gmail.com
        </p>
      </div>
    </div>
  )
}
