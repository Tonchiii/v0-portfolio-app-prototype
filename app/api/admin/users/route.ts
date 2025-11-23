import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verify admin authentication
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch users from Clerk
    const client = await clerkClient()
    const response = await client.users.getUserList({
      limit: 100,
      orderBy: "-created_at"
    })

    // Transform Clerk user data to our format
    const users = response.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      emailAddresses: user.emailAddresses,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      banned: user.banned,
      createdAt: new Date(user.createdAt).toISOString(),
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString() : null,
      emailVerified: user.emailAddresses[0]?.verification?.status === "verified",
      twoFactorEnabled: user.twoFactorEnabled,
      externalAccounts: user.externalAccounts
    }))

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
