import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSubscribers } from "@/lib/mock-db"
import { Users, Mail, TrendingUp, Calendar, Download, Linkedin } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"

export default async function AdminDashboard() {
  const subscribers = await getSubscribers()
  const activeSubscribers = subscribers.filter((sub) => sub.status === "active")

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage your newsletter subscribers and analytics</p>
            </div>
            <AdminHeader />
          </div>

          {/* Profile contact information card */}
          <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Profile Contact Information</CardTitle>
              <CardDescription>Your professional contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href="mailto:eltonramos417@gmail.com"
                      className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      eltonramos417@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <a
                      href="https://www.linkedin.com/in/elton-james-ramos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Elton James Ramos
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats cards */}
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
                <div className="text-3xl font-bold">{activeSubscribers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently subscribe</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Growth Rate</CardTitle>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">+12%</div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                <Calendar className="w-4 h-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {
                    subscribers.filter((sub) => {
                      const subDate = new Date(sub.subscribedAt)
                      const now = new Date()
                      return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </div>
                <p className="text-xs text-muted-foreground mt-1">New subscribers</p>
              </CardContent>
            </Card>
          </div>

          {/* Subscribers table */}
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
                      <tr
                        key={subscriber.id}
                        className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                              <Mail className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="font-medium">{subscriber.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={subscriber.status === "active" ? "default" : "secondary"}
                            className={
                              subscriber.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : ""
                            }
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
        </div>
      </div>
    </div>
  )
}
