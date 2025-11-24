import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.resolve(process.cwd(), "data")
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json")

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      )
    }

    // Read current subscribers
    let subscribers = []
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const raw = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8")
      subscribers = JSON.parse(raw)
    }

    // Find subscriber and mark as unsubscribed
    const subscriberIndex = subscribers.findIndex(
      (sub: any) => sub.email.toLowerCase() === email.toLowerCase()
    )

    if (subscriberIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Email not found in subscribers list" },
        { status: 404 }
      )
    }

    // Update status to unsubscribed
    subscribers[subscriberIndex].status = "unsubscribed"

    // Save back to file
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8")

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter"
    })
  } catch (error) {
    console.error("Error unsubscribing:", error)
    return NextResponse.json(
      { success: false, message: "Failed to unsubscribe" },
      { status: 500 }
    )
  }
}
