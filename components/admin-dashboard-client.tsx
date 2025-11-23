"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Mail, TrendingUp, Calendar, Download, Search, Filter, Eye, BarChart3, ArrowUpRight, ArrowDownRight, Clock, UserCheck, Shield, LogIn, Activity } from "lucide-react"

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
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "unsubscribed">("all")

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

  // Filter subscribers based on search and status
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || sub.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Export subscribers to CSV
  const handleExportCSV = () => {
    if (filteredSubscribers.length === 0) {
      alert("No data to export. There are no subscribers matching your current filters.")
      return
    }

    // Create CSV content
    const headers = ["Email", "Status", "Subscribed Date", "ID"]
    const rows = filteredSubscribers.map((sub) => [
      sub.email,
      sub.status,
      new Date(sub.subscribedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      sub.id,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `subscribers_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export subscribers to PDF
  const handleExportPDF = () => {
    if (filteredSubscribers.length === 0) {
      alert("No data to export. There are no subscribers matching your current filters.")
      return
    }

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Subscribers Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #06b6d4; margin-bottom: 10px; }
          .meta { color: #666; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #06b6d4; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:hover { background-color: #f5f5f5; }
          .status-active { color: #22c55e; font-weight: bold; }
          .status-inactive { color: #f97316; }
        </style>
      </head>
      <body>
        <h1>Subscribers Report</h1>
        <div class="meta">
          Generated on ${new Date().toLocaleString("en-US", { 
            month: "long", 
            day: "numeric", 
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
          <br>Total Subscribers: ${filteredSubscribers.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Status</th>
              <th>Subscribed Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredSubscribers.map((sub, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${sub.email}</td>
                <td class="status-${sub.status}">${sub.status === "active" ? "✓ Active" : "○ Unsubscribed"}</td>
                <td>${new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `

    // Create a new window and print
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  return (
    <div className="space-y-8">
      {/* Analytics Overview */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-sm hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
              <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-cyan-400">{subscribers.length}</div>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                  All time
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-400">{activeSubscribers}</div>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                  {Math.round((activeSubscribers / (subscribers.length || 1)) * 100)}% active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Growth Rate</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 group-hover:scale-110 transition-transform">
                {growth >= 0 ? <ArrowUpRight className="w-4 h-4 text-blue-400" /> : <ArrowDownRight className="w-4 h-4 text-blue-400" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-400">{growth >= 0 ? `+${growth}%` : `${growth}%`}</div>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
                  Last 30 days
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 group-hover:scale-110 transition-transform">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-400">{thisMonth}</div>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-xs">
                  New subscribers
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subscriber Management */}
      <Card className="border-cyan-500/20 bg-card/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="w-6 h-6 text-cyan-400" />
                Subscriber Management
              </CardTitle>
              <CardDescription className="mt-2">
                View and manage all newsletter subscribers • {filteredSubscribers.length} results
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-400 transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by email address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/20 border-border/50 focus:border-cyan-500 hover:border-cyan-500/50 transition-all duration-300"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
                className={filterStatus === "all" ? "bg-cyan-600 hover:bg-cyan-700" : "hover:bg-cyan-500/10"}
              >
                All ({subscribers.length})
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
                className={filterStatus === "active" ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-500/10"}
              >
                Active ({activeSubscribers})
              </Button>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Subscriber</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Subscribed Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map((subscriber, index) => (
                    <tr 
                      key={subscriber.id} 
                      className="border-b border-border/50 hover:bg-cyan-500/5 transition-all duration-300 group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300">
                            <Mail className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground group-hover:text-cyan-400 transition-colors">{subscriber.email}</p>
                            <p className="text-xs text-muted-foreground">Subscriber #{index + 1}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant="outline"
                          className={subscriber.status === "active" 
                            ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 transition-all" 
                            : "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20 transition-all"
                          }
                        >
                          {subscriber.status === "active" ? "✓ Active" : "○ Unsubscribed"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-sm">
                            {new Date(subscriber.subscribedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded border border-border/50">#{subscriber.id}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSubscribers.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                  {searchQuery ? <Search className="w-8 h-8 text-cyan-400" /> : <Users className="w-8 h-8 text-cyan-400" />}
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  {searchQuery ? "No subscribers found" : "No subscribers yet"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Try adjusting your search or filter" : "Subscribers will appear here once they sign up"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>



      {/* Footer Stats */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/20">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-muted-foreground">
            Active admin viewers: <span className="font-semibold text-cyan-400">{activeViewers}</span>
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardClient
