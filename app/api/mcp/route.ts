import { NextRequest, NextResponse } from 'next/server'

/**
 * MCP Server Metadata Endpoint
 * Provides server information and available tools
 */
export async function GET(req: NextRequest) {
  const metadata = {
    server: {
      name: 'oauth-roll-dice-mcp-server',
      version: '1.0.0',
      description: 'OAuth-secured MCP server with roll-dice tool',
      student: 'Elton James T. Ramos',
      course: 'AI Protector - Agent Security Advanced',
      week: 8,
    },
    authentication: {
      type: 'oauth2',
      provider: 'clerk',
      flows: ['authorization_code'],
      tokenEndpoint: '/api/auth/token',
      authorizeEndpoint: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
      scopes: ['read:user', 'mcp:tools', 'mcp:dice'],
    },
    security: {
      arcjet: {
        enabled: true,
        features: ['rate-limiting', 'bot-detection'],
      },
      vercelFirewall: {
        enabled: true,
        features: ['ip-blocking', 'geo-blocking'],
      },
      auditLogging: {
        enabled: true,
        endpoint: '/api/mcp/audit',
      },
    },
    tools: [
      {
        name: 'roll_dice',
        description: 'Roll dice with specified sides and count',
        endpoint: '/api/mcp/roll-dice',
        methods: ['POST', 'GET'],
        authentication: 'required',
        rateLimit: '10 requests per minute',
      },
    ],
    documentation: {
      architecture: '/mcp-security',
      incidentResponse: '/mcp-security#incident-response',
      oauth: '/mcp-security#oauth',
    },
    deployment: {
      platform: 'Vercel',
      url: process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000',
      environment: process.env.VERCEL_ENV || 'development',
    },
  }

  return NextResponse.json(metadata, {
    headers: {
      'Content-Type': 'application/json',
      'X-MCP-Version': '1.0.0',
    },
  })
}
