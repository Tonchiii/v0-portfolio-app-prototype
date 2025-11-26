'use client'

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Lock, 
  Server, 
  Activity, 
  Target, 
  BookOpen, 
  Download,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Eye,
  Code,
  Terminal,
  FileText,
  Play,
  ArrowRight,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { 
  downloadExecutiveBriefing, 
  downloadSecurityMetrics,
  downloadPenetrationTestingReport,
  downloadComplianceReport
} from "@/lib/pdf-generator"

interface SecurityMetrics {
  waf: {
    requestsBlocked: number
    botAttempts: number
    rateLimitHits: number
    successRate: string
  }
  auth: {
    activeUsers: number
    totalUsers: number
    oauthSessions: number
    failedAttempts: number
    authSuccessRate: string
  }
  mcp: {
    toolExecutions: number
    auditLogs: number
    avgLatency: string
    uptime: string
  }
}

export default function PortfolioSecurityPage() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/security/metrics')
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error('Error fetching metrics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 mb-6 animate-pulse">
                <Shield className="w-10 h-10 text-cyan-400" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
                Security Portfolio &<br />Implementation Showcase
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Comprehensive security engineering portfolio featuring OAuth-secured MCP servers, 
                penetration testing, and enterprise security architecture implementations
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <Badge variant="outline" className="text-sm px-4 py-2 border-cyan-400/50 text-cyan-400">
                  <Shield className="w-4 h-4 mr-2" />
                  AI Protector Security Course
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  10 Weeks Completed
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <Activity className="w-4 h-4 mr-2" />
                  Production Deployed
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="bg-cyan-600 hover:bg-cyan-700">
                  <Link href="#mcp-demo">
                    <Play className="w-4 h-4 mr-2" />
                    View MCP Demo
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#executive-dashboard">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Executive Dashboard
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#case-studies">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Case Studies
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-background">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">10</div>
                  <div className="text-sm text-muted-foreground">Weeks Implementation</div>
                </CardContent>
              </Card>
              <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-background">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">6</div>
                  <div className="text-sm text-muted-foreground">Security Domains</div>
                </CardContent>
              </Card>
              <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-background">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">10/10</div>
                  <div className="text-sm text-muted-foreground">OWASP Top 10</div>
                </CardContent>
              </Card>
              <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-background">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime Target</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-8 md:px-16 py-16 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Security Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* MCP Server Project */}
            <Card className="border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                    <Server className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">OAuth MCP Server</CardTitle>
                    <CardDescription>Week 8 Deliverable</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Production-ready Model Context Protocol server with OAuth 2.0 authentication, 
                  Arcjet protection, and comprehensive audit logging. Features roll_dice tool 
                  with enterprise security controls.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">OAuth 2.0</Badge>
                  <Badge variant="outline" className="text-xs">Arcjet</Badge>
                  <Badge variant="outline" className="text-xs">Rate Limiting</Badge>
                  <Badge variant="outline" className="text-xs">Audit Logs</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Clerk GitHub OAuth Integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>10 req/min Rate Limiting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>ML-Powered Bot Detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Incident Response Runbooks</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" asChild className="flex-1">
                    <Link href="/mcp-integration">
                      <Play className="w-4 h-4 mr-2" />
                      Live Demo
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href="/mcp-security">
                      <FileText className="w-4 h-4 mr-2" />
                      Documentation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Penetration Testing Project */}
            <Card className="border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-full bg-orange-500/20 border border-orange-500/30">
                    <Target className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Penetration Testing Sprint</CardTitle>
                    <CardDescription>Week 5 Deliverable</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Comprehensive security testing using Kali Linux tools including ffuf fuzzing, 
                  SQL injection testing, brute force attempts, and API rate limit validation. 
                  All vulnerabilities documented and remediated.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Kali Linux</Badge>
                  <Badge variant="outline" className="text-xs">ffuf</Badge>
                  <Badge variant="outline" className="text-xs">SQLMap</Badge>
                  <Badge variant="outline" className="text-xs">Hydra</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>6 Attack Vectors Tested</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>All Findings Remediated</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Firewall Rules Implemented</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Post-Remediation Verified</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" asChild className="flex-1">
                    <Link href="/security-plan#section-4">
                      <Eye className="w-4 h-4 mr-2" />
                      View Results
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href="/case-studies/pentesting">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Case Study
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Architecture */}
            <Card className="border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/30">
                    <Lock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Security Architecture</CardTitle>
                    <CardDescription>Weeks 1-10 Implementation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security architecture implementing multi-layer defense 
                  across authentication, edge protection, application security, and monitoring. 
                  Complete OWASP Top 10 coverage.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Clerk Auth</Badge>
                  <Badge variant="outline" className="text-xs">Arcjet WAF</Badge>
                  <Badge variant="outline" className="text-xs">Vercel Edge</Badge>
                  <Badge variant="outline" className="text-xs">Next.js 14</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>OAuth + MFA Authentication</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Edge-Based Rate Limiting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Real-Time Threat Detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Comprehensive Audit Logging</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" asChild className="flex-1">
                    <Link href="/security-plan">
                      <FileText className="w-4 h-4 mr-2" />
                      Full Report
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href="/case-studies/architecture">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Case Study
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Executive Dashboard */}
            <Card className="border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Executive Dashboard</CardTitle>
                    <CardDescription>Real-Time Security Metrics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Executive-level security dashboard aggregating WAF metrics, Arcjet telemetry, 
                  MCP server statistics, and threat intelligence. Downloadable reports for 
                  stakeholder presentations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Real-Time</Badge>
                  <Badge variant="outline" className="text-xs">Downloadable</Badge>
                  <Badge variant="outline" className="text-xs">Metrics</Badge>
                  <Badge variant="outline" className="text-xs">Compliance</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>WAF Block Statistics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Authentication Metrics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>MCP Tool Usage Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Threat Intelligence Feed</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" asChild className="flex-1">
                    <Link href="#executive-dashboard">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Dashboard
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* MCP Demo Section */}
      <section id="mcp-demo" className="px-8 md:px-16 py-16 bg-muted/30 border-b border-border scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">OAuth MCP Server Demonstration</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Live demonstration of OAuth-secured Model Context Protocol server with roll_dice tool. 
              Watch the complete authentication flow and tool execution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="border-cyan-400/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  Interactive Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Try the MCP server yourself! Sign in with GitHub OAuth and execute the roll_dice tool 
                  to see real-time audit logging and security controls in action.
                </p>
                <Button asChild className="w-full">
                  <Link href="/mcp-integration">
                    <Play className="w-4 h-4 mr-2" />
                    Launch Interactive Demo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Technical Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Comprehensive documentation covering architecture, OAuth flow, API endpoints, 
                  security controls, and incident response procedures.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/mcp-security">
                    <FileText className="w-4 h-4 mr-2" />
                    View Documentation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Demo Video Placeholder */}
          <Card className="border-cyan-400/20">
            <CardContent className="p-8">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                <div className="text-center space-y-4">
                  <Play className="w-16 h-16 text-cyan-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">MCP Server Walkthrough</h3>
                    <p className="text-sm text-muted-foreground">
                      Video demonstration coming soon. For now, explore the interactive demo.
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/mcp-integration">
                      Launch Demo
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Executive Dashboard Section */}
      <section id="executive-dashboard" className="px-8 md:px-16 py-16 border-b border-border scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Executive Security Dashboard</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Real-time security metrics and telemetry aggregated from WAF, Arcjet, and MCP server. 
              Downloadable executive summary reports available.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-cyan-400/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  WAF Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center text-muted-foreground">Loading...</div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Requests Blocked</span>
                      <span className="font-semibold">{metrics?.waf.requestsBlocked || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bot Attempts</span>
                      <span className="font-semibold">{metrics?.waf.botAttempts || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate Limit Hits</span>
                      <span className="font-semibold">{metrics?.waf.rateLimitHits || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-semibold text-green-400">{metrics?.waf.successRate || '0%'}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center text-muted-foreground">Loading...</div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Users</span>
                      <span className="font-semibold">{metrics?.auth.activeUsers || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">OAuth Sessions</span>
                      <span className="font-semibold">{metrics?.auth.oauthSessions || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Failed Attempts</span>
                      <span className="font-semibold">{metrics?.auth.failedAttempts || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Auth Success</span>
                      <span className="font-semibold text-green-400">{metrics?.auth.authSuccessRate || '0%'}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  MCP Server
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center text-muted-foreground">Loading...</div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tool Executions</span>
                      <span className="font-semibold">{metrics?.mcp.toolExecutions || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Latency</span>
                      <span className="font-semibold">{metrics?.mcp.avgLatency || '0ms'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Audit Logs</span>
                      <span className="font-semibold">{metrics?.mcp.auditLogs || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-semibold text-green-400">{metrics?.mcp.uptime || '0%'}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Download Reports */}
          <Card className="border-cyan-400/20">
            <CardHeader>
              <CardTitle>Downloadable Reports</CardTitle>
              <CardDescription>Professional PDF reports for stakeholder presentations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={downloadSecurityMetrics}
                  disabled={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Security Metrics Report (PDF)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={downloadExecutiveBriefing}
                  disabled={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Executive Briefing (PDF)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={downloadPenetrationTestingReport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Penetration Testing Summary (PDF)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={downloadComplianceReport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Compliance Status Report (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="px-8 md:px-16 py-16 bg-muted/30 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Security Case Studies</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Detailed case studies documenting the security implementation journey, 
              referencing AI Protector LMS modules and real-world findings.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "OAuth MCP Server Implementation",
                week: "Week 8",
                description: "Production-ready OAuth-secured Model Context Protocol server with comprehensive security controls",
                modules: ["OAuth 2.0 Fundamentals", "API Security", "Incident Response"],
                link: "/case-studies/oauth-mcp"
              },
              {
                title: "Penetration Testing Sprint",
                week: "Week 5",
                description: "Comprehensive security testing using Kali Linux with documentation of findings and remediation",
                modules: ["Penetration Testing", "Kali Linux Tools", "Vulnerability Assessment"],
                link: "/case-studies/pentesting"
              },
              {
                title: "Enterprise Security Architecture",
                week: "Weeks 1-10",
                description: "Multi-layer security implementation covering authentication, edge protection, and monitoring",
                modules: ["Security Architecture", "Defense in Depth", "OWASP Top 10"],
                link: "/case-studies/architecture"
              }
            ].map((study, index) => (
              <Card key={index} className="border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{study.week}</Badge>
                        <CardTitle className="text-xl">{study.title}</CardTitle>
                      </div>
                      <CardDescription>{study.description}</CardDescription>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={study.link}>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {study.modules.map((module, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {module}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LMS Integration */}
      <section className="px-8 md:px-16 py-16 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">AI Protector Course Integration</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
            All implementations directly reference AI Protector LMS modules with documented learning outcomes 
            and practical applications of course concepts.
          </p>
          <Button size="lg" asChild>
            <Link href="/security-plan">
              <FileText className="w-4 h-4 mr-2" />
              View Complete Security Plan
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
