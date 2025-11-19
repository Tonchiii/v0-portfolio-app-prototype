import { NextResponse } from "next/server"

type ReqBody = { message?: string; history?: Array<{ role: string; text: string }> }

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as ReqBody
  const message = body.message || ""
  if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 })

  const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY

  if (!openaiKey) {
    // Prototype fallback when no API key is provided
    const reply = `Echo: ${message}. (Set OPENAI_API_KEY to enable a real AI assistant.)`
    return NextResponse.json({ reply })
  }

  try {
    // Use Chat Completions (gpt-3.5-turbo) as a reliable default
    const system = { role: "system", content: "You are a helpful cybersecurity assistant. Keep answers concise." }
    const user = { role: "user", content: message }
    const messages = [system, ...(body.history || []).map((h) => ({ role: h.role, content: String(h.text) })), user]

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "gpt-3.5-turbo", messages, max_tokens: 300 }),
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => "")
      return NextResponse.json({ error: `AI provider error: ${res.status} ${txt}` }, { status: 502 })
    }

    const data = await res.json()
    const reply = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || ""
    return NextResponse.json({ reply })
  } catch (err) {
    return NextResponse.json({ error: "AI request failed" }, { status: 500 })
  }
}
