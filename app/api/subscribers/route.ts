import { NextResponse } from "next/server"
import { getSubscribers } from "@/lib/mock-db"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const subs = await getSubscribers()
    return NextResponse.json({ subscribers: subs })
  } catch (err) {
    return NextResponse.json({ error: "Failed to load subscribers" }, { status: 500 })
  }
}
