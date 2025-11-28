import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Groq from "groq-sdk"
import { buildPortfolioPrompt } from "@/lib/portfolio-context"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

type RequestBody = {
  message: string
  history?: Array<{ role: string; text: string }>
}

export async function POST(req: Request) {
  try {
    // Check authentication with Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to use Ask AI." },
        { status: 401 }
      )
    }

    // Parse request body
    const body: RequestBody = await req.json()
    const userMessage = body.message?.trim()

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key not configured. Please add GROQ_API_KEY to environment variables." },
        { status: 500 }
      )
    }

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    // Build the system prompt with portfolio context
    const systemPrompt = buildPortfolioPrompt()

    // Build message history for context
    const messages: Message[] = [
      {
        role: "system",
        content: systemPrompt,
      },
    ]

    // Add conversation history if provided
    if (body.history && Array.isArray(body.history)) {
      body.history.forEach((msg) => {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({
            role: msg.role as "user" | "assistant",
            content: msg.text,
          })
        }
      })
    }

    // Add current user message
    messages.push({
      role: "user",
      content: userMessage,
    })

    // Call Groq API with updated model and timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", // Using Llama 3.3 70B (latest)
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      })
      clearTimeout(timeoutId)

      const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
      return NextResponse.json({ reply })
    } catch (apiError: any) {
      clearTimeout(timeoutId)
      
      if (apiError.name === 'AbortError') {
        return NextResponse.json(
          { error: "Request timeout. The AI service is taking too long. Please try again." },
          { status: 504 }
        )
      }
      throw apiError
    }

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("[Ask AI] Error:", error)
    console.error("[Ask AI] Error details:", {
      message: error?.message,
      status: error?.status,
      response: error?.response?.data,
      stack: error?.stack,
    })

    // Handle specific Groq errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Invalid Groq API key. Please check your configuration." },
        { status: 500 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a few seconds." },
        { status: 429 }
      )
    }

    if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED' || error?.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: "Unable to connect to AI service. Please check your internet connection and try again." },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: error?.message || "AI service temporarily unavailable. Please try again." },
      { status: 500 }
    )
  }
}
