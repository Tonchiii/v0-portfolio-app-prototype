"use client"

import React, { useEffect, useRef, useState } from "react"
import { Bot, X, Send, Sparkles } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

type ChatMessage = { role: "user" | "assistant"; text: string }

export default function AskAI() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  // Load chat history from localStorage
  useEffect(() => {
    if (!isSignedIn) return
    
    try {
      const raw = localStorage.getItem("ask_ai_history")
      if (raw) setMessages(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [isSignedIn])

  // Save chat history to localStorage
  useEffect(() => {
    if (!isSignedIn) return
    
    try {
      localStorage.setItem("ask_ai_history", JSON.stringify(messages))
    } catch (e) {}
    
    // Auto-scroll to bottom
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, isSignedIn])

  // Handle opening widget
  const handleOpen = () => {
    if (!isLoaded) return
    
    if (!isSignedIn) {
      // Redirect to sign-in if not authenticated
      router.push("/sign-in")
      return
    }
    
    setOpen(true)
  }

  async function send() {
    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    const text = input.trim()
    if (!text) return

    const newMsgs: ChatMessage[] = [...messages, { role: "user", text }]
    setMessages(newMsgs)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, history: newMsgs }),
      })

      if (res.status === 401) {
        // Not authenticated, redirect to sign-in
        router.push("/sign-in")
        setLoading(false)
        return
      }

      const json = await res.json()
      
      if (json.reply) {
        setMessages((m) => [...m, { role: "assistant", text: String(json.reply) }])
      } else if (json.error) {
        setMessages((m) => [...m, { role: "assistant", text: `Error: ${String(json.error)}` }])
      } else {
        setMessages((m) => [...m, { role: "assistant", text: "No response received." }])
      }
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", text: "Network error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function clearHistory() {
    setMessages([])
    localStorage.removeItem("ask_ai_history")
  }

  if (!isLoaded) {
    return null // Don't render until Clerk is loaded
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-96 max-w-[calc(100vw-3rem)] bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold flex items-center gap-2">
                  Ask AI
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xs text-muted-foreground">Powered by Groq + Llama 3.3</div>
              </div>
            </div>
            <button
              aria-label="Close chat"
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="p-4 h-96 overflow-y-auto space-y-4 text-sm bg-background/50">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="w-12 h-12 mx-auto mb-3 text-cyan-400/50" />
                <p className="font-medium mb-2">Ask me anything about this portfolio!</p>
                <p className="text-xs">Education • Skills • Projects • Experience</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                      : "bg-secondary/80 backdrop-blur-sm border border-border/30"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{m.text}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary/80 backdrop-blur-sm border border-border/30 px-4 py-3 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors mb-2"
              >
                Clear history
              </button>
            )}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={loading ? "Thinking..." : "Ask about skills, education, projects..."}
                className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                disabled={loading}
              />
              <button
                onClick={send}
                className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          aria-label="Open Ask AI"
          onClick={handleOpen}
          className="group inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
          <span className="text-sm font-medium">Ask AI</span>
        </button>
      )}
    </div>
  )
}
