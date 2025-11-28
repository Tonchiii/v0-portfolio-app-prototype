import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { network_alerts } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET all network alerts
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const alerts = await db.select().from(network_alerts)
    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error fetching network alerts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create network alert
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    await db.insert(network_alerts).values({
      id: data.id,
      timestamp: data.timestamp,
      type: data.type,
      severity: data.severity,
      source: data.source,
      description: data.description,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating network alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE network alert
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Alert ID required" }, { status: 400 })
    }

    await db.delete(network_alerts).where(eq(network_alerts.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting network alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
