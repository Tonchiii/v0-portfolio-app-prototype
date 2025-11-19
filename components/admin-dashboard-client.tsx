"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, TrendingUp, Calendar, Download } from "lucide-react"

type Subscriber = {
  id: string
  email: string
  subscribedAt: string
  status: "active" | "unsubscribed"
}

function calcGrowthRate(subscribers: Subscriber[]) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recent = subscribers.filter((s) => new Date(s.subscribedAt) >= thirtyDaysAgo).length
  const previous = subscribers.filter((s) => new Date(s.subscribedAt) >= sixtyDaysAgo && new Date(s.subscribedAt) < thirtyDaysAgo).length

  if (previous === 0) return recent > 0 ? 100 : 0
  return Math.round(((recent - previous) / previous) * 100)
}

export function AdminDashboardClient() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [activeViewers, setActiveViewers] = useState<number>(0)

  // client id for presence tracking
  useEffect(() => {
    let clientId = localStorage.getItem("admin-presence-id")
    if (!clientId) {
      clientId = Math.random().toString(36).slice(2)
      localStorage.setItem("admin-presence-id", clientId)
    }

    let mounted = true

    async function ping() {
      try {
        await fetch(`/api/admin/presence`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: clientId }),
        })
        const res = await fetch(`/api/admin/presence`)
        const json = await res.json()
        if (mounted) setActiveViewers(json.active || 0)
      } catch (e) {
        // ignore for prototype
      }
    }

    // initial ping + interval
    ping()
    const t = setInterval(ping, 10_000)
    return () => {
      mounted = false
      clearInterval(t)
    }
  }, [])

  // poll for subscribers
  useEffect(() => {
    let mounted = true

    async function fetchSubs() {
      try {
        const res = await fetch(`/api/subscribers`, { cache: "no-store" })
        const json = await res.json()
        if (mounted && Array.isArray(json.subscribers)) setSubscribers(json.subscribers)
      } catch (e) {
        // ignore in prototype
      }
    }

    fetchSubs()
    const i = setInterval(fetchSubs, 5_000)
    return () => {
      mounted = false
      clearInterval(i)
    }
  }, [])

  const activeSubscribers = subscribers.filter((s) => s.status === "active").length
  const growth = calcGrowthRate(subscribers)
  const thisMonth = subscribers.filter((s) => {
    const d = new Date(s.subscribedAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
            <Users className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
            <Mail className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeSubscribers}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently subscribe</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Growth Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{growth >= 0 ? `+${growth}%` : `${growth}%`}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{thisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">New subscribers</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Newsletter Subscribers</CardTitle>
              <CardDescription className="mt-1">View and manage all newsletter subscribers</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subscribed Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="font-medium">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={subscriber.status === "active" ? "default" : "secondary"}
                        className={subscriber.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : ""}
                      >
                        {subscriber.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {new Date(subscriber.subscribedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-sm">#{subscriber.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {subscribers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No subscribers yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">Active admin viewers: {activeViewers}</div>
    </div>
  )
}

export default AdminDashboardClient
