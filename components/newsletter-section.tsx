"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { subscribeToNewsletter } from "@/app/actions"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    const result = await subscribeToNewsletter(email)

    if (result.success) {
      setStatus("success")
      setMessage(result.message)
      setEmail("")
    } else {
      setStatus("error")
      setMessage(result.message)
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus("idle")
      setMessage("")
    }, 5000)
  }

  return (
    <section id="newsletter" className="py-24 bg-secondary/20">
      <div className="w-full px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
            <CardHeader className="text-center relative z-10 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto">
                <Mail className="w-8 h-8 text-cyan-400" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold text-balance">
                Stay Updated on Security Trends
              </CardTitle>
              <CardDescription className="text-lg text-pretty max-w-2xl mx-auto">
                Get the latest cybersecurity insights, threat intelligence, and best practices delivered directly to
                your inbox. Join 1,000+ security professionals.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading" || status === "success"}
                  className="flex-1 bg-background/50 border-border/50 focus:border-cyan-500 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                />
                <Button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105"
                >
                  {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>

              {/* Status messages */}
              {message && (
                <div
                  className={`mt-4 p-4 rounded-lg flex items-center gap-3 max-w-xl mx-auto ${
                    status === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {status === "success" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{message}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center mt-6">
                By subscribing, you agree to receive security updates and insights. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
