import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db, isDatabaseAvailable } from "@/lib/db"
import { admin_users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET all admin users
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json([]) // Return empty array if DB not available
    }

    const users = await db.select().from(admin_users)
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching admin users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create or update user
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const data = await request.json()
    
    // Check if user exists
    const existing = await db.select().from(admin_users).where(eq(admin_users.id, data.id))
    
    if (existing.length > 0) {
      // Update existing user
      await db.update(admin_users)
        .set({
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status,
          last_login: data.lastLogin,
          mfa_enabled: String(data.mfaEnabled),
          login_count: String(data.loginCount),
          updated_at: new Date(),
        })
        .where(eq(admin_users.id, data.id))
    } else {
      // Insert new user
      await db.insert(admin_users).values({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        last_login: data.lastLogin,
        mfa_enabled: String(data.mfaEnabled),
        login_count: String(data.loginCount),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE user
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    await db.delete(admin_users).where(eq(admin_users.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
