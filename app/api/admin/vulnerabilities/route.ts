import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { vulnerabilities } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET all vulnerabilities
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vulns = await db.select().from(vulnerabilities)
    return NextResponse.json(vulns)
  } catch (error) {
    console.error("Error fetching vulnerabilities:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create or update vulnerability
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    const existing = await db.select().from(vulnerabilities).where(eq(vulnerabilities.id, data.id))
    
    if (existing.length > 0) {
      await db.update(vulnerabilities)
        .set({
          title: data.title,
          severity: data.severity,
          category: data.category,
          status: data.status,
          discovered: data.discovered,
          cve: data.cve,
          updated_at: new Date(),
        })
        .where(eq(vulnerabilities.id, data.id))
    } else {
      await db.insert(vulnerabilities).values({
        id: data.id,
        title: data.title,
        severity: data.severity,
        category: data.category,
        status: data.status,
        discovered: data.discovered,
        cve: data.cve,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving vulnerability:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
