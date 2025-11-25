"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, CheckCircle2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { subscribeToNewsletter, unsubscribeFromNewsletter } from "@/app/actions"
import { useUser } from "@clerk/nextjs"

export function NewsletterSection() {
  const { isSignedIn, user } = useUser()
  const [userRole, setUserRole] = useState<string>('user')
  const [isSubscriber, setIsSubscriber] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  // Fetch user role
  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      fetch('/api/admin/manage-users')
        .then(res => res.json())
        .then(users => {
          const currentUser = users.find((u: any) => u.email === user.primaryEmailAddress?.emailAddress)
          if (currentUser) {
            setUserRole(currentUser.role)
            setIsSubscriber(currentUser.role === 'subscriber' || currentUser.role === 'admin')
          }
        })
        .catch(err => console.error('Error fetching user role:', err))
    }
  }, [isSignedIn, user])

  const isAdmin = userRole === 'admin' || user?.primaryEmailAddress?.emailAddress === 'eltonramos417@gmail.com'

  // Hide section for admins
  if (isAdmin) {
    return null
  }

  async function handleUnsubscribe() {
    if (!user?.primaryEmailAddress?.emailAddress) return
    
    setStatus("loading")
    
    const result = await unsubscribeFromNewsletter(user.primaryEmailAddress.emailAddress)
    
    if (result.success) {
      setStatus("success")
      setMessage(result.message)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      setStatus("error")
      setMessage(result.message)
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    // Pass both email and name to subscription
    const result = await subscribeToNewsletter(formData.email, formData.name)

    if (result.success) {
      setStatus("success")
      setMessage(result.message)
      setFormData({ name: "", email: "" })
      
      // Reload the page after 2 seconds to reflect role changes
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      setStatus("error")
      setMessage(result.message)
      
      // Reset status after 5 seconds for errors
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    }
  }

  return (
    <section id="newsletter" className="py-24 bg-secondary/20">
      <div className="w-full px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
            <CardHeader className="text-center relative z-10 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto">
                <Bell className="w-8 h-8 text-cyan-400" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold text-balance">
                Subscribe for Exclusive Access
              </CardTitle>
              <CardDescription className="text-lg text-pretty max-w-2xl mx-auto">
                Get access to my Security Center dashboard, view vulnerability reports, audit logs, and network alerts. Subscribers gain exclusive insights into real-time security monitoring and compliance tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {isSubscriber ? (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="text-center space-y-4">
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <p className="text-cyan-400 font-medium">✓ You are currently subscribed</p>
                      <p className="text-sm text-muted-foreground mt-2">You have access to the Security Center dashboard</p>
                    </div>
                    <Button
                      onClick={handleUnsubscribe}
                      disabled={status === "loading"}
                      variant="outline"
                      className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300"
                    >
                      {status === "loading" ? "Unsubscribing..." : "Unsubscribe"}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={status === "loading" || status === "success"}
                      className="bg-background/50 border-border/50 focus:border-cyan-500 hover:border-cyan-500/50 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={status === "loading" || status === "success"}
                      className="bg-background/50 border-border/50 focus:border-cyan-500 hover:border-cyan-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105"
                >
                  {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed! ✓" : "Subscribe"}
                </Button>
              </form>
              )}

              {/* Status messages */}
              {message && (
                <div
                  className={`mt-4 p-4 rounded-lg flex items-center gap-3 max-w-2xl mx-auto ${
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

              <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
                By subscribing, you agree to receive security updates and insights. Unsubscribe anytime. We respect your privacy and will never share your information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
