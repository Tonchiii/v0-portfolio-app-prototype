import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { admin_users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check user's 2FA status from database
    const [dbUser] = await db
      .select()
      .from(admin_users)
      .where(eq(admin_users.email, user.emailAddresses[0]?.emailAddress))
      .limit(1)

    if (!dbUser) {
      // User doesn't exist in admin_users table yet, return default
      return NextResponse.json({ mfaEnabled: false })
    }

    return NextResponse.json({ 
      mfaEnabled: dbUser.mfa_enabled === "true" || dbUser.mfa_enabled === "enabled" 
    })
  } catch (error) {
    console.error("Error fetching 2FA status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { enabled } = await request.json()

    // Update or create user in database
    const email = user.emailAddresses[0]?.emailAddress
    const [existingUser] = await db
      .select()
      .from(admin_users)
      .where(eq(admin_users.email, email))
      .limit(1)

    if (existingUser) {
      // Update existing user
      await db
        .update(admin_users)
        .set({
          mfa_enabled: enabled ? "enabled" : "disabled",
          updated_at: new Date(),
        })
        .where(eq(admin_users.email, email))
    } else {
      // Create new user entry
      await db.insert(admin_users).values({
        id: userId,
        name: user.fullName || user.firstName || "User",
        email: email,
        role: "user",
        status: "active",
        last_login: new Date().toISOString(),
        mfa_enabled: enabled ? "enabled" : "disabled",
        login_count: "1",
      })
    }

    return NextResponse.json({ 
      success: true, 
      mfaEnabled: enabled 
    })
  } catch (error) {
    console.error("Error updating 2FA status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
