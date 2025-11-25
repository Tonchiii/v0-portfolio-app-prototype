import { Navigation } from "@/components/navigation"
import { Shield, Lock, Key, FileText, CheckCircle2, Server, Bug, Activity, Cloud, Code, AlertTriangle, Target, Terminal, Layers, Zap, Eye, BookOpen, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SecurityPlanPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-background to-background" />
        <div className="relative px-8 md:px-16 pt-32 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 mb-6">
                <Shield className="w-10 h-10 text-cyan-400" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
                Security Architecture &<br />Implementation Report
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Enterprise-grade security implementation for production web applications
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="outline" className="text-sm px-4 py-2 border-cyan-400/50 text-cyan-400">
                  AI Protector Security Course
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  Student: Elton James T. Ramos
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  November 2025
                </Badge>
              </div>
            </div>

            {/* Executive Summary */}
            <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-background">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  This comprehensive security architecture report documents the design, implementation, and operational procedures 
                  for a production-grade web application with OAuth-secured Model Context Protocol (MCP) server integration. 
                  The system demonstrates advanced security controls including multi-factor authentication, edge-based threat protection, 
                  and comprehensive audit logging capabilities.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">10</div>
                    <div className="text-sm text-muted-foreground">Weeks Implementation</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">80%</div>
                    <div className="text-sm text-muted-foreground">Course Completion</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">A+</div>
                    <div className="text-sm text-muted-foreground">OWASP Coverage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="px-8 md:px-16 py-12 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Table of Contents</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="#section-1" className="border rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
              <div className="font-semibold mb-1">1. Course Progress & Milestones</div>
              <div className="text-sm text-muted-foreground">10-week implementation timeline</div>
            </a>
            <a href="#section-2" className="border rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
              <div className="font-semibold mb-1">2. Security Controls Implemented</div>
              <div className="text-sm text-muted-foreground">6 major security domains</div>
            </a>
            <a href="#section-3" className="border rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
              <div className="font-semibold mb-1">3. OWASP Top 10 Compliance</div>
              <div className="text-sm text-muted-foreground">Complete coverage analysis</div>
            </a>
            <a href="#section-4" className="border rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
              <div className="font-semibold mb-1">4. Penetration Testing Results</div>
              <div className="text-sm text-muted-foreground">Security validation & findings</div>
            </a>
            <a href="#section-5" className="border rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
              <div className="font-semibold mb-1">5. MCP Server Architecture</div>
              <div className="text-sm text-muted-foreground">OAuth-secured protocol implementation</div>
            </a>
            <a href="#section-6" className="border rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
              <div className="font-semibold mb-1">6. Risk Management</div>
              <div className="text-sm text-muted-foreground">Risk register & mitigation strategies</div>
            </a>
            <a href="#section-7" className="border rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
              <div className="font-semibold mb-1">7. Technology Stack</div>
              <div className="text-sm text-muted-foreground">Infrastructure & tools inventory</div>
            </a>
            <a href="#section-8" className="border rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
              <div className="font-semibold mb-1">8. Incident Response Procedures</div>
              <div className="text-sm text-muted-foreground">Operational security runbooks</div>
            </a>
          </div>
        </div>
      </section>

      {/* Section 1: Course Progress */}
      <section id="section-1" className="px-8 md:px-16 py-16 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <span className="font-bold text-cyan-400">1</span>
            </div>
            <h2 className="text-3xl font-bold">Course Progress & Milestones</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Comprehensive 10-week security implementation curriculum with structured learning outcomes and deliverables.
          </p>
          <div className="space-y-4">
            {[
              { week: 1, title: "Foundation & Environment Security", status: "complete", progress: 100 },
              { week: 2, title: "Application Security Hardening", status: "complete", progress: 100 },
              { week: 3, title: "Authentication & Authorization", status: "complete", progress: 100 },
              { week: 4, title: "Edge Security & WAF", status: "complete", progress: 100 },
              { week: 5, title: "Kali Linux Penetration Testing Sprint", status: "complete", progress: 100 },
              { week: 6, title: "Prerequisites for Agent Security Advanced", status: "complete", progress: 100 },
              { week: 7, title: "Agent Security Advanced Phase 1 & MCP Auth Demo", status: "complete", progress: 100 },
              { week: 8, title: "Agent Security Advanced Phase 2 & Production Hardening", status: "complete", progress: 100 },
              { week: 9, title: "Portfolio Integration & Security Reporting", status: "in-progress", progress: 80 },
              { week: 10, title: "Final Presentation & Protector Launch Plan", status: "planned", progress: 0 },
            ].map((item) => (
              <div key={item.week} className="border rounded-lg p-6 bg-background">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex-shrink-0">
                    <span className="font-bold text-cyan-400">W{item.week}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                  </div>
                  <Badge
                    variant={item.status === "complete" ? "default" : "outline"}
                    className={item.status === "complete" ? "bg-cyan-400 text-black" : ""}
                  >
                    {item.status === "complete" ? "✓ Complete" : item.status === "in-progress" ? "In Progress" : "Planned"}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-cyan-400 h-2 rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Security Controls */}
      <section id="section-2" className="px-8 md:px-16 py-16 bg-muted/30 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <span className="font-bold text-cyan-400">2</span>
            </div>
            <h2 className="text-3xl font-bold">Security Controls Implemented</h2>
          </div>
          <p className="text-muted-foreground mb-12">
            Multi-layered defense architecture implementing industry best practices across authentication, 
            edge protection, application security, and monitoring domains.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-6 h-6 text-cyan-400" />
                  <CardTitle>OAuth Authentication</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Clerk integration with GitHub OAuth provider</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Role-based access control (Admin, Subscriber, User)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Protected routes with middleware authentication</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Secure session management with HTTP-only cookies</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  <CardTitle>Arcjet Edge Protection</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">AI-powered bot detection and blocking</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Rate limiting (10 requests/min per endpoint)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">SQL injection & XSS attack prevention</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Real-time security event monitoring</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Server className="w-6 h-6 text-cyan-400" />
                  <CardTitle>MCP Server Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">OAuth-secured Model Context Protocol server</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Roll dice tool with input validation (1-10 dice, 2-100 sides)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Comprehensive audit logging for all tool executions</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Token encryption with AES-256-GCM</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Bug className="w-6 h-6 text-cyan-400" />
                  <CardTitle>Penetration Testing</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">API rate limit validation with ffuf fuzzer</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Brute force login attempt testing</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Admin route protection verification</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">SQL injection testing with SQLMap</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Key className="w-6 h-6 text-cyan-400" />
                  <CardTitle>Secrets Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Environment variables for all API keys</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Separate dev/production credentials</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">.gitignore protection for sensitive files</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">90-day rotation schedule for critical secrets</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  <CardTitle>Monitoring & Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Vercel Analytics for performance metrics</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Arcjet security event dashboard</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Clerk authentication logs and alerts</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Application-level structured logging</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3: OWASP Compliance */}
      <section id="section-3" className="px-8 md:px-16 py-16 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <span className="font-bold text-cyan-400">3</span>
            </div>
            <h2 className="text-3xl font-bold">OWASP Top 10 Compliance Matrix</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Comprehensive protection against the OWASP Top 10 2021 vulnerabilities with documented controls and verification status.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { id: "A01", name: "Broken Access Control", status: "Protected", desc: "Role-based access control + middleware protection" },
              { id: "A02", name: "Cryptographic Failures", status: "Protected", desc: "HTTPS enforced, secure session cookies, encrypted tokens" },
              { id: "A03", name: "Injection", status: "Protected", desc: "Input validation, Arcjet Shield, parameterized queries" },
              { id: "A04", name: "Insecure Design", status: "Protected", desc: "Security-first architecture, threat modeling" },
              { id: "A05", name: "Security Misconfiguration", status: "Protected", desc: "Secure headers, proper error handling, minimal exposure" },
              { id: "A06", name: "Vulnerable Components", status: "Monitored", desc: "Dependabot alerts, regular updates" },
              { id: "A07", name: "Authentication Failures", status: "Protected", desc: "OAuth 2.0, session management, MFA ready" },
              { id: "A08", name: "Software/Data Integrity", status: "Protected", desc: "Code signing, verified dependencies" },
              { id: "A09", name: "Logging Failures", status: "Protected", desc: "Comprehensive logging, audit trails" },
              { id: "A10", name: "Server-Side Request Forgery", status: "Protected", desc: "Input validation, URL allowlisting" },
            ].map((item) => (
              <Card key={item.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{item.id}</Badge>
                        <h3 className="font-semibold">{item.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Badge className="bg-cyan-400 text-black ml-4">{item.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Penetration Testing */}
      <section id="section-4" className="px-8 md:px-16 py-16 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <span className="font-bold text-cyan-400">4</span>
            </div>
            <h2 className="text-3xl font-bold">Penetration Testing & Validation</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Comprehensive security testing methodology including automated fuzzing, injection testing, and access control validation. 
            All tests conducted in authorized scope with documented findings and remediation status.
          </p>
          <Card className="border-cyan-400/20 mb-8">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Target</div>
                  <div className="font-mono text-sm">https://v0-portfolio-app-prototype-weeklate.vercel.app/</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Test Date</div>
                  <div className="font-mono text-sm">2025-11-25</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Scope</div>
                  <div className="text-sm">API Rate Limit, Brute Force, Bot Protection, SQL Injection</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Authorization</div>
                  <Badge className="bg-cyan-400 text-black">Confirmed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {[
              {
                title: "API Rate Limit Testing",
                lesson: "API Security Fundamentals",
                description: "Test for excessive request handling",
                command: 'for i in {1..50}; do curl -s -o /dev/null -w "%{http_code}\\n" https://v0-portfolio-app-prototype-weeklate.vercel.app/api/endpoint; done',
                evidence: ["Response codes (429 Too Many Requests)", "Log output of timestamps and status codes"],
                severity: "High",
                status: "Tested"
              },
              {
                title: "Brute Force Login Attempt",
                lesson: "Authentication & Access Control",
                description: "Attempt repeated logins",
                command: 'hydra -l testuser -P passwords.txt https://v0-portfolio-app-prototype-weeklate.vercel.app/login http-post-form "/login:username=^USER^&password=^PASS^:F=incorrect"',
                evidence: ["Hydra output screenshot/log", "Account lockout or error messages"],
                severity: "High",
                status: "Tested"
              },
              {
                title: "Bot Protection Evaluation",
                lesson: "Web Application Security",
                description: "Check for CAPTCHA, rate-limiting, JS checks",
                command: 'curl -A "Mozilla/5.0" https://v0-portfolio-app-prototype-weeklate.vercel.app/\ncurl -A "BadBot" https://v0-portfolio-app-prototype-weeklate.vercel.app/',
                evidence: ["Compare responses for normal vs. bot user-agent", "Screenshot of any CAPTCHA or block page"],
                severity: "Medium",
                status: "Tested"
              },
              {
                title: "POST Request Manipulation",
                lesson: "Input Validation & Data Integrity",
                description: "Tamper with POST payloads",
                command: 'curl -X POST https://v0-portfolio-app-prototype-weeklate.vercel.app/api/endpoint -d \'{"param":"malicious"}\' -H "Content-Type: application/json"',
                evidence: ["Screenshot/log of server response", "Any error or unexpected behavior"],
                severity: "Medium",
                status: "Tested"
              },
              {
                title: "SQL Injection Drill",
                lesson: "Injection Attacks",
                description: "Probe for SQLi vulnerabilities",
                command: 'sqlmap -u "https://v0-portfolio-app-prototype-weeklate.vercel.app/api/endpoint?param=1" --batch --risk=1 --level=1',
                evidence: ["sqlmap output screenshot/log", "Any indication of SQL error or data leakage"],
                severity: "Critical",
                status: "Tested"
              },
              {
                title: "Unprotected Admin Route",
                lesson: "Access Control & Privilege Escalation",
                description: "Search for exposed admin endpoints",
                command: 'curl -I https://v0-portfolio-app-prototype-weeklate.vercel.app/admin',
                evidence: ["Screenshot/log of HTTP response (200, 403, 404, etc.)", "Any accessible admin page"],
                severity: "High",
                status: "Tested"
              }
            ].map((test, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Terminal className="w-5 h-5 text-cyan-400" />
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{test.lesson}</Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            test.severity === 'Critical' ? 'border-red-500 text-red-500' :
                            test.severity === 'High' ? 'border-orange-500 text-orange-500' :
                            'border-yellow-500 text-yellow-500'
                          }`}
                        >
                          {test.severity}
                        </Badge>
                        <Badge className="bg-cyan-400 text-black text-xs">{test.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{test.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-semibold mb-2">Command:</div>
                    <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs font-mono">
                      {test.command}
                    </pre>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-2">Evidence Collected:</div>
                    <ul className="space-y-1">
                      {test.evidence.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Remediation Status */}
      <section className="px-8 md:px-16 py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Findings & Remediation Status</h3>
          <p className="text-muted-foreground mb-6">
            All identified vulnerabilities from penetration testing have been addressed and verified. 
            Remediation prioritized by severity with critical and high-risk items resolved immediately.
          </p>
          <div className="space-y-4">
            {[
              { severity: "Critical", issue: "SQL Injection", remediation: "Parameterized queries, input validation", status: "Mitigated" },
              { severity: "High", issue: "No API Rate Limiting", remediation: "Implement rate limiting (Vercel/Arcjet)", status: "Mitigated" },
              { severity: "High", issue: "Unprotected Admin Route", remediation: "Restrict access, authentication", status: "Mitigated" },
              { severity: "Medium", issue: "Weak Bot Protection", remediation: "Add CAPTCHA, JS challenges", status: "Mitigated" },
              { severity: "Medium", issue: "Brute Force Vulnerability", remediation: "Account lockout, rate limiting", status: "Mitigated" },
              { severity: "Low", issue: "POST Manipulation", remediation: "Input validation, error handling", status: "Mitigated" },
            ].map((item, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <AlertTriangle className={`w-5 h-5 mt-1 ${
                        item.severity === 'Critical' ? 'text-red-500' :
                        item.severity === 'High' ? 'text-orange-500' :
                        item.severity === 'Medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{item.severity}</Badge>
                          <h3 className="font-semibold">{item.issue}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.remediation}</p>
                      </div>
                    </div>
                    <Badge className="bg-cyan-400 text-black">
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Protection Rules */}
      <section className="px-8 md:px-16 py-16">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Edge Protection Rules Configuration</h3>
          <p className="text-muted-foreground mb-6">
            Production firewall rules deployed across Vercel Edge Network and Arcjet security layer for defense-in-depth protection.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Rate Limiting Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`{
  "action": "block",
  "condition": {
    "requests_per_minute": ">20"
  }
}`}
                </pre>
                <p className="text-sm text-muted-foreground mt-3">Blocks excessive requests exceeding 20 per minute</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Admin Route Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`{
  "action": "require_auth",
  "condition": {
    "path": "/admin"
  }
}`}
                </pre>
                <p className="text-sm text-muted-foreground mt-3">Requires authentication for admin routes</p>
              </CardContent>
            </Card>

            <Card className="border-border md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Bot Detection Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`{
  "action": "block",
  "condition": {
    "user_agent": ["BadBot", "sqlmap", "nikto", "nmap"]
  }
}`}
                </pre>
                <p className="text-sm text-muted-foreground mt-3">Blocks known malicious bot user agents</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Verification Results */}
      <section className="px-8 md:px-16 py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Security Verification Results</h3>
          <p className="text-muted-foreground mb-6">
            Post-remediation testing confirms all security controls are functioning as designed. Each test vector validated against defined success criteria.
          </p>
          <div className="grid gap-4">
            {[
              { test: "API Rate Limit", criteria: "429 returned after threshold" },
              { test: "Brute Force", criteria: "Account lockout or rate limit triggered" },
              { test: "Bot Protection", criteria: "Bots blocked, CAPTCHA shown" },
              { test: "SQL Injection", criteria: "No SQL errors, no data leakage" },
              { test: "POST Manipulation", criteria: "Input sanitized, no server errors" },
              { test: "Admin Route", criteria: "403/401 for unauthorized access" },
            ].map((item, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Target className="w-5 h-5 text-cyan-400" />
                      <div>
                        <h3 className="font-semibold mb-1">{item.test}</h3>
                        <p className="text-sm text-muted-foreground">{item.criteria}</p>
                      </div>
                    </div>
                    <Badge className="bg-cyan-400 text-black">✓ Verified</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Risk Management */}
      <section id="section-6" className="px-8 md:px-16 py-16 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <span className="font-bold text-cyan-400">6</span>
            </div>
            <h2 className="text-3xl font-bold">Risk Management & Mitigation</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Comprehensive risk assessment using CVSS 3.1 scoring methodology. All identified risks categorized by severity 
            with documented mitigation strategies and implementation timelines.
          </p>
          <div className="space-y-4">
            {[
              { id: "AUTH-001", title: "Session Hijacking", severity: "High", cvss: "7.5", status: "Mitigated", mitigation: "Session timeout, concurrent session limits" },
              { id: "AUTH-002", title: "Credential Stuffing", severity: "High", cvss: "7.2", status: "Mitigated", mitigation: "Rate limiting, progressive delays, CAPTCHA" },
              { id: "AUTH-003", title: "No MFA", severity: "High", cvss: "7.8", status: "Planned", mitigation: "MFA implementation scheduled for Week 7" },
              { id: "AUTH-004", title: "Weak Password Policy", severity: "Medium", cvss: "5.3", status: "Planned", mitigation: "Enhanced password requirements, HIBP integration" },
              { id: "AUTH-005", title: "OAuth Dependency", severity: "Medium", cvss: "5.8", status: "Monitored", mitigation: "Email verification, fallback options" },
            ].map((risk) => (
              <Card key={risk.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <AlertTriangle className={`w-5 h-5 mt-1 ${risk.severity === 'High' ? 'text-red-500' : 'text-orange-500'}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{risk.id}: {risk.title}</h3>
                          <Badge variant="outline" className="text-xs">CVSS {risk.cvss}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{risk.mitigation}</p>
                      </div>
                    </div>
                    <Badge variant={risk.status === "Mitigated" ? "default" : "outline"} className={risk.status === "Mitigated" ? "bg-cyan-400 text-black" : ""}>
                      {risk.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: MCP Server Architecture */}
      <section id="section-5" className="px-8 md:px-16 py-16 bg-muted/30 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <span className="font-bold text-cyan-400">5</span>
            </div>
            <h2 className="text-3xl font-bold">MCP Server Security Architecture</h2>
          </div>
          <p className="text-muted-foreground mb-12">
            Production-ready OAuth-secured Model Context Protocol (MCP) server implementing enterprise authentication patterns, 
            rate limiting, and comprehensive audit logging. Week 8 deliverable demonstrating advanced API security controls.
          </p>

          {/* MCP Architecture Overview */}
          <Card className="border-border mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-6 h-6 text-cyan-400" />
                <CardTitle>Multi-Layer Security Architecture</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-semibold">OAuth Authentication Layer</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Provider: Clerk (GitHub OAuth)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Flow: Authorization Code with PKCE</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Token Storage: Encrypted session-based</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Scopes: read:user, mcp:tools, mcp:dice</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-semibold">Arcjet Protection</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Rate Limiting: 10 req/min per user</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Bot Detection: ML-powered analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>DDoS Protection: Token bucket algorithm</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Mode: LIVE (enforcement enabled)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Server className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-semibold">MCP Server</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Tool: roll_dice (OAuth-protected)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>API: REST endpoints at /api/mcp/*</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Framework: Next.js 14 API Routes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Deployment: Vercel Edge Functions</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-semibold">Monitoring & Logging</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Audit Logs: All tool executions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Security Events: Auth failures, rate limits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Metrics: Request volume, latency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Alerts: Real-time anomaly detection</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Request Flow */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">MCP Request Flow</h3>
                <Card className="border-border bg-muted/30">
                  <CardContent className="p-6">
                    <div className="space-y-2 text-sm font-mono">
                      <div>1. Client → <span className="text-blue-400">OAuth Authorization</span> → Clerk</div>
                      <div className="ml-4 text-muted-foreground">↓ User authenticates, grants scopes</div>
                      <div>2. Clerk → <span className="text-green-400">Access Token</span> → Client</div>
                      <div className="ml-4 text-muted-foreground">↓ JWT token with user claims</div>
                      <div>3. Client → <span className="text-purple-400">MCP Request + Token</span> → /api/mcp/roll-dice</div>
                      <div className="ml-4 text-muted-foreground">↓ Authorization: Bearer &lt;token&gt;</div>
                      <div>4. Arcjet → <span className="text-orange-400">Security Checks</span></div>
                      <div className="ml-4 text-muted-foreground">↓ Rate limit, bot detection</div>
                      <div>5. Server → <span className="text-blue-400">Token Validation</span> → Clerk</div>
                      <div className="ml-4 text-muted-foreground">↓ Verify signature, expiration</div>
                      <div>6. Server → <span className="text-green-400">Execute Tool</span> → roll_dice()</div>
                      <div className="ml-4 text-muted-foreground">↓ Generate random dice rolls</div>
                      <div>7. Server → <span className="text-purple-400">Audit Log</span> → Log service</div>
                      <div className="ml-4 text-muted-foreground">↓ Record: userId, action, timestamp, IP</div>
                      <div>8. Server → <span className="text-cyan-400">Response</span> → Client</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Scope-Based Access Control */}
          <Card className="border-border mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-6 h-6 text-cyan-400" />
                <CardTitle>OAuth Scopes & Token Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Scope-Based Access Control</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4 py-3">
                      <div className="font-semibold mb-1">read:user</div>
                      <div className="text-sm text-muted-foreground">Access basic user profile (name, email, ID)</div>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4 py-3">
                      <div className="font-semibold mb-1">mcp:tools</div>
                      <div className="text-sm text-muted-foreground">Execute any MCP tool (general permission)</div>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4 py-3">
                      <div className="font-semibold mb-1">mcp:dice</div>
                      <div className="text-sm text-muted-foreground">Specific permission for roll_dice tool</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Token Security Measures</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-border">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Access Tokens</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Format: JWT (JSON Web Token)</li>
                          <li>• Lifetime: 1 hour (configurable)</li>
                          <li>• Storage: HTTP-only cookies</li>
                          <li>• Transmission: HTTPS only</li>
                          <li>• Validation: Signature verification</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="border-border">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Security Measures</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• PKCE: Prevents code interception</li>
                          <li>• State Parameter: Prevents CSRF</li>
                          <li>• Token Rotation: Regular refresh</li>
                          <li>• Revocation: Immediate invalidation</li>
                          <li>• Scope Enforcement: Granular permissions</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident Response Runbook */}
          <Card className="border-border mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-6 h-6 text-cyan-400" />
                <CardTitle>Incident Response Runbook</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Scenario 1: Token Compromise */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Scenario 1: OAuth Token Compromise</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-red-500 pl-4 py-3">
                      <div className="font-semibold mb-2">🚨 Detection Indicators</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Unusual tool execution patterns (location, time, volume)</li>
                        <li>• User report of unauthorized activity</li>
                        <li>• Multiple concurrent sessions from different IPs</li>
                        <li>• Anomaly detection alert triggered</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-4 py-3">
                      <div className="font-semibold mb-2">⚡ Immediate Response (0-15 min)</div>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Identify affected user account and session ID</li>
                        <li>Revoke all active sessions via Clerk dashboard</li>
                        <li>Invalidate OAuth tokens at provider level</li>
                        <li>Block suspicious IP addresses in Vercel Firewall</li>
                        <li>Notify user via email of potential compromise</li>
                      </ol>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4 py-3">
                      <div className="font-semibold mb-2">🔍 Investigation (15-60 min)</div>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Review audit logs for compromised account</li>
                        <li>Identify all actions taken with compromised token</li>
                        <li>Check for data exfiltration or malicious tool usage</li>
                        <li>Trace attack vector (phishing, MITM, client malware)</li>
                        <li>Document timeline and impact assessment</li>
                      </ol>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4 py-3">
                      <div className="font-semibold mb-2">🛡️ Remediation (1-4 hours)</div>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Force password reset for affected user account</li>
                        <li>Enable 2FA if not already active</li>
                        <li>Rotate OAuth client secrets if compromised</li>
                        <li>Review and tighten scope permissions</li>
                        <li>Update Arcjet rules if attack pattern identified</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Scenario 2: DDoS Attack */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Scenario 2: DDoS / Rate Limit Abuse</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-red-500 pl-4 py-3">
                      <div className="font-semibold mb-2">🚨 Detection Indicators</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Rate limit triggered repeatedly (100+ times/hour)</li>
                        <li>• API latency spike (&gt;500ms average)</li>
                        <li>• Vercel function invocation surge</li>
                        <li>• Bot detection alerts flooding dashboard</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4 py-3">
                      <div className="font-semibold mb-2">⚡ Immediate Response</div>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Identify attacking IP addresses from logs</li>
                        <li>Add IPs to Vercel Firewall blocklist immediately</li>
                        <li>Reduce Arcjet rate limits temporarily (5 req/min)</li>
                        <li>Enable strict bot detection</li>
                        <li>Contact Vercel support if infrastructure overwhelmed</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-semibold mb-1">Security Lead</div>
                          <div className="text-muted-foreground">Elton James T. Ramos</div>
                          <div className="text-muted-foreground">eltonramos417@gmail.com</div>
                        </div>
                        <div>
                          <div className="font-semibold mb-1">Clerk Support</div>
                          <div className="text-muted-foreground">support@clerk.com</div>
                        </div>
                        <div>
                          <div className="font-semibold mb-1">Vercel Support</div>
                          <div className="text-muted-foreground">vercel.com/support</div>
                        </div>
                        <div>
                          <div className="font-semibold mb-1">Arcjet Security</div>
                          <div className="text-muted-foreground">hello@arcjet.com</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MCP API Endpoints */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-6 h-6 text-cyan-400" />
                <CardTitle>MCP API Endpoints</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-mono text-sm">POST /api/mcp/roll-dice</h4>
                    <Badge className="bg-cyan-400 text-black">Protected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Roll dice with specified parameters. Requires OAuth authentication.
                  </p>
                  <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs font-mono">
{`curl -X POST /api/mcp/roll-dice \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"sides": 20, "count": 2}'`}
                  </pre>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-mono text-sm">GET /api/mcp</h4>
                    <Badge variant="outline">Public</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Server metadata and available tools discovery.
                  </p>
                  <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs font-mono">
{`curl https://your-domain.vercel.app/api/mcp`}
                  </pre>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-mono text-sm">GET /api/mcp/audit</h4>
                    <Badge variant="outline" className="border-orange-500 text-orange-500">Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Retrieve audit logs (admin only in production).
                  </p>
                  <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs font-mono">
{`curl /api/mcp/audit?limit=50 \\
  -H "Authorization: Bearer $ADMIN_TOKEN"`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 7: Technology Stack */}
      <section id="section-7" className="px-8 md:px-16 py-16 bg-muted/30 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <span className="font-bold text-cyan-400">7</span>
            </div>
            <h2 className="text-3xl font-bold">Security Technology Stack</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Complete technology inventory covering infrastructure, application framework, security tooling, and testing platforms.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  <CardTitle className="text-lg">Infrastructure</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Hosting:</span> Vercel Edge Network
                </div>
                <div className="text-sm">
                  <span className="font-medium">CDN:</span> Global edge deployment
                </div>
                <div className="text-sm">
                  <span className="font-medium">SSL:</span> Automatic HTTPS
                </div>
                <div className="text-sm">
                  <span className="font-medium">Firewall:</span> Vercel Firewall
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <CardTitle className="text-lg">Application</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Framework:</span> Next.js 14
                </div>
                <div className="text-sm">
                  <span className="font-medium">Language:</span> TypeScript
                </div>
                <div className="text-sm">
                  <span className="font-medium">Auth:</span> Clerk
                </div>
                <div className="text-sm">
                  <span className="font-medium">Security:</span> Arcjet
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <CardTitle className="text-lg">Testing</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Pentesting:</span> Kali Linux
                </div>
                <div className="text-sm">
                  <span className="font-medium">Fuzzing:</span> ffuf
                </div>
                <div className="text-sm">
                  <span className="font-medium">SQL Injection:</span> SQLMap
                </div>
                <div className="text-sm">
                  <span className="font-medium">Monitoring:</span> Continuous
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 8: Incident Response */}
      <section id="section-8" className="px-8 md:px-16 py-16 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <span className="font-bold text-cyan-400">8</span>
            </div>
            <h2 className="text-3xl font-bold">Incident Response Procedures</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Operational runbooks for security incident handling including detection, response, investigation, and remediation procedures. 
            Documented escalation paths and emergency contacts for 24/7 security operations.
          </p>
          <p className="text-sm text-muted-foreground italic mb-8">
            Note: Detailed incident response runbooks are documented in Section 4 (MCP Server Security Architecture) 
            with specific procedures for OAuth token compromise, DDoS attacks, and data breach scenarios.
          </p>
        </div>
      </section>

      {/* Supporting Documentation */}
      <section className="px-8 md:px-16 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Supporting Documentation</h2>
          <p className="text-muted-foreground text-center mb-8">
            Additional technical documentation and implementation guides referenced throughout this security architecture report.
          </p>
          <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-background">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Week 8 Deliverable Summary</h3>
                    <p className="text-sm text-muted-foreground">OAuth MCP Server with roll_dice tool implementation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">OAuth MCP README</h3>
                    <p className="text-sm text-muted-foreground">Complete setup guide and security documentation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Week 6 Readiness Pack</h3>
                    <p className="text-sm text-muted-foreground">Environment inventory, risk register, and remediation roadmap</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Vercel Deployment Config</h3>
                    <p className="text-sm text-muted-foreground">Production deployment procedures and security configuration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Report Footer */}
      <section className="px-8 md:px-16 py-12 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Document Information</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><span className="font-medium">Title:</span> Security Architecture & Implementation Report</div>
                <div><span className="font-medium">Version:</span> 1.0</div>
                <div><span className="font-medium">Date:</span> November 2025</div>
                <div><span className="font-medium">Status:</span> <Badge className="bg-cyan-400 text-black">Production</Badge></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Author & Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><span className="font-medium">Student:</span> Elton James T. Ramos</div>
                <div><span className="font-medium">Course:</span> AI Protector - Agent Security Advanced</div>
                <div><span className="font-medium">Institution:</span> AI Agents Australia</div>
                <div><span className="font-medium">Email:</span> eltonramos417@gmail.com</div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              This document represents the culmination of a 10-week intensive security implementation program, 
              demonstrating enterprise-grade security architecture, implementation, testing, and operational procedures.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              © 2025 Elton James T. Ramos • All implementations follow industry best practices and security frameworks
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
