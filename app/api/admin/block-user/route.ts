import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { blocked_users } from "@/lib/schema"
import { eq } from "drizzle-orm"

// POST - Block a user
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { user_id, email, reason } = data

    console.log("Block user request:", { user_id, email, reason })

    if (!user_id || !email) {
      return NextResponse.json({ error: "User ID and email required" }, { status: 400 })
    }

    // Check if user is already blocked
    const existing = await db.select().from(blocked_users).where(eq(blocked_users.user_id, user_id))
    
    if (existing.length > 0) {
      return NextResponse.json({ error: "User is already blocked" }, { status: 400 })
    }

    // Block the user
    await db.insert(blocked_users).values({
      user_id,
      email,
      blocked_by: userId,
      reason: reason || "No reason provided",
    })

    console.log("User blocked successfully:", email)
    return NextResponse.json({ success: true, message: "User blocked successfully" })
  } catch (error: any) {
    console.error("Error blocking user:", error)
    console.error("Error details:", error.message, error.stack)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// DELETE - Unblock a user
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get("user_id")

    console.log("Unblock user request:", user_id)

    if (!user_id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    await db.delete(blocked_users).where(eq(blocked_users.user_id, user_id))
    console.log("User unblocked successfully:", user_id)
    return NextResponse.json({ success: true, message: "User unblocked successfully" })
  } catch (error: any) {
    console.error("Error unblocking user:", error)
    console.error("Error details:", error.message, error.stack)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// GET - Check if a user is blocked or get all blocked users
export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get("user_id")

    if (user_id) {
      // Check specific user
      const blocked = await db.select().from(blocked_users).where(eq(blocked_users.user_id, user_id))
      return NextResponse.json({ blocked: blocked.length > 0, data: blocked[0] || null })
    } else {
      // Get all blocked users
      const allBlocked = await db.select().from(blocked_users)
      return NextResponse.json({ blocked_users: allBlocked })
    }
  } catch (error) {
    console.error("Error checking blocked user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
