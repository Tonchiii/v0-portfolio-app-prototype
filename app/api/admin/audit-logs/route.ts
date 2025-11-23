import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { audit_logs } from "@/lib/schema"

// GET all audit logs
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const logs = await db.select().from(audit_logs)
    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create audit log
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    await db.insert(audit_logs).values({
      id: data.id,
      timestamp: data.timestamp,
      event: data.event,
      user: data.user,
      status: data.status,
      ip: data.ip,
      details: data.details,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating audit log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
