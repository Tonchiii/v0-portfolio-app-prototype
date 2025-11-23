import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSubscribers } from "@/lib/mock-db"
import { Users, Mail, TrendingUp, Calendar, Shield, ExternalLink, Linkedin, Phone, MapPin, GraduationCap, Award, Briefcase, ArrowLeft } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import AdminDashboardClient from "@/components/admin-dashboard-client"
import { SecurityAdminDashboard } from "@/components/security-admin-dashboard"
import Link from "next/link"

export default async function AdminDashboard() {
  const subscribers = await getSubscribers()
  const activeSubscribers = subscribers.filter((sub) => sub.status === "active")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Professional Header with Gradient */}
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8 backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Link href="/">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 mr-2"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  </Link>
                  <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                    <Shield className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">Welcome to the portfolio of Elton James Ramos</p>
                  </div>
                </div>
              </div>
              <AdminHeader />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/#experience">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">View</p>
                      <p className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">Portfolio</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/security">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Manage</p>
                      <p className="text-lg font-semibold group-hover:text-blue-400 transition-colors">Security</p>
                    </div>
                    <Shield className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/#blog">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300 cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Read</p>
                      <p className="text-lg font-semibold group-hover:text-purple-400 transition-colors">Blog Posts</p>
                    </div>
                    <Briefcase className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/#newsletter">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300 cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Subscribe</p>
                      <p className="text-lg font-semibold group-hover:text-green-400 transition-colors">Newsletter</p>
                    </div>
                    <Mail className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Professional Profile Card */}
          <Card className="border-cyan-500/20 bg-card/50 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-cyan-400" />
                    Professional Profile
                  </CardTitle>
                  <CardDescription className="mt-2">Your public contact information and credentials</CardDescription>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Award className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-border/50 hover:border-cyan-500/50 hover:bg-secondary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                    <a
                      href="mailto:eltonramos417@gmail.com"
                      className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors text-sm truncate block"
                    >
                      eltonramos417@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-border/50 hover:border-blue-500/50 hover:bg-secondary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">LinkedIn Profile</p>
                    <a
                      href="https://www.linkedin.com/in/elton-james-ramos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-400 hover:text-blue-300 transition-colors text-sm truncate block"
                    >
                      Elton James Ramos
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-border/50 hover:border-purple-500/50 hover:bg-secondary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                    <p className="font-medium text-purple-400 text-sm">09919043753</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-border/50 hover:border-green-500/50 hover:bg-secondary/30 transition-all duration-300 group md:col-span-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="font-medium text-green-400 text-sm">Calocan City, Manila, Philippines</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Security Admin Dashboard */}
          <SecurityAdminDashboard />

          {/* Client-driven realtime dashboard */}
          <AdminDashboardClient />
        </div>
      </div>
    </div>
  )
}
