import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

interface AuditLogEntry {
  id: string
  action: string
  userId: string
  email: string
  timestamp: string
  details: Record<string, any>
  ip?: string
  userAgent?: string
}

// In-memory audit log (replace with database in production)
const auditLogs: AuditLogEntry[] = []

/**
 * MCP Audit Logging Endpoint
 * Captures security events and tool usage
 */
export async function POST(req: NextRequest) {
  try {
    // Authentication required
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    const logEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      action: body.action,
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      timestamp: new Date().toISOString(),
      details: body.details || {},
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    }

    auditLogs.push(logEntry)
    
    console.log('[AUDIT]', logEntry)

    return NextResponse.json({ success: true, logId: logEntry.id }, { status: 201 })
  } catch (error) {
    console.error('[ERROR] Audit Logging:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to retrieve audit logs
 * Admin only in production
 */
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Add admin role check in production
    
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action')
    
    let filteredLogs = [...auditLogs]
    
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action)
    }
    
    // Return most recent logs first
    filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    
    return NextResponse.json({
      logs: filteredLogs.slice(0, limit),
      total: filteredLogs.length,
    })
  } catch (error) {
    console.error('[ERROR] Retrieve Audit Logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
