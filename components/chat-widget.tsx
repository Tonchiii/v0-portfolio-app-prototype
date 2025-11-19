"use client"

import React, { useEffect, useRef, useState } from "react"
import { MessageSquare, X, Send } from "lucide-react"

type ChatMessage = { role: "user" | "assistant"; text: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // restore history from localStorage
    try {
      const raw = localStorage.getItem("chat_history")
      if (raw) setMessages(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("chat_history", JSON.stringify(messages))
    } catch (e) {}
    // scroll to bottom when messages change
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text) return
    const newMsgs: ChatMessage[] = [...messages, { role: "user" as const, text }]
    setMessages(newMsgs)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, history: newMsgs }),
      })
      const json = await res.json()
      if (json.reply) {
        setMessages((m) => [...m, { role: "assistant" as const, text: String(json.reply) }])
      } else if (json.error) {
        setMessages((m) => [...m, { role: "assistant" as const, text: "Error: " + String(json.error) }])
      } else {
        setMessages((m) => [...m, { role: "assistant" as const, text: "No response" }])
      }
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant" as const, text: "Network error" }])
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

  return (
    <div className="fixed top-4 right-4 z-50">
      {open ? (
        <div className="w-80 max-w-sm bg-card/90 border border-border/50 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <div className="font-medium">AI Assistant</div>
            </div>
            <button
              aria-label="Close chat"
              className="p-1 rounded hover:bg-secondary/10"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={listRef} className="p-3 h-64 overflow-y-auto space-y-3 text-sm">
            {messages.length === 0 && <div className="text-muted-foreground">Ask me about security, the site, or recent posts.</div>}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                    m.role === "user" ? "bg-cyan-600 text-white" : "bg-background/50"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border/50">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={loading ? "Thinking..." : "Type a question and press Enter"}
                className="flex-1 bg-background/5 border border-border/30 rounded px-3 py-2 text-sm focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={send}
                className="inline-flex items-center justify-center px-3 py-2 bg-cyan-600 text-white rounded"
                disabled={loading}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-cyan-600 text-white shadow"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">Chat</span>
        </button>
      )}
    </div>
  )
}
