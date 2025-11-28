import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// In-memory presence store for prototype only
// Maps clientId -> lastSeen timestamp (ms)
const presence = new Map<string, number>()

function cleanup() {
  const now = Date.now()
  for (const [id, last] of presence.entries()) {
    if (now - last > 60_000) {
      presence.delete(id)
    }
  }
}

export async function GET() {
  try {
    cleanup()
    return NextResponse.json({ active: presence.size })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to get presence' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const id = (body && body.id) || null
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    presence.set(String(id), Date.now())
    cleanup()
    return NextResponse.json({ ok: true, active: presence.size })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update presence' }, { status: 500 })
  }
}
