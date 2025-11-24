import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSubscribers } from "@/lib/mock-db"
import { Users, Mail, TrendingUp, Calendar, Shield, ExternalLink, Linkedin, Phone, MapPin, GraduationCap, Award, Briefcase, ArrowLeft } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import AdminDashboardClient from "@/components/admin-dashboard-client"
import { SecurityAdminDashboard } from "@/components/security-admin-dashboard"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { admin_users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  // Check user authentication first
  const user = await currentUser()
  
  // Redirect to sign in if not authenticated
  if (!user) {
    redirect('/sign-in')
  }
  
  const subscribers = await getSubscribers()
  const activeSubscribers = subscribers.filter((sub) => sub.status === "active")
  
  // Check user role from database
  let userRole = 'user'
  const userEmail = user.primaryEmailAddress?.emailAddress
  
  if (userEmail) {
    try {
      const [dbUser] = await db
        .select()
        .from(admin_users)
        .where(eq(admin_users.email, userEmail))
        .limit(1)
      
      if (dbUser) {
        userRole = dbUser.role
      }
    } catch (error) {
      console.error('Error checking user role:', error)
    }
  }
  
  const isAdmin = userRole === 'admin' || userEmail === 'eltonramos417@gmail.com'
  const isSubscriber = userRole === 'subscriber'
  const canViewSecurityCenter = isAdmin || isSubscriber
  
  // Redirect non-admin/non-subscriber users to home page
  if (!canViewSecurityCenter) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Professional Header with Gradient */}
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-4 sm:p-6 md:p-8 backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <div className="relative flex flex-col gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <Link href="/" className="w-fit">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Security Center
                      </h1>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">Admin Dashboard & Security Management</p>
                    </div>
                  </div>
                </div>
              </div>
              <AdminHeader />
            </div>
          </div>

          {/* Comprehensive Security Admin Dashboard - Admin Only (non-admins are redirected before reaching here) */}
          <SecurityAdminDashboard userRole={userRole} />

          {/* Client-driven realtime dashboard */}
          <AdminDashboardClient />
        </div>
      </div>
    </div>
  )
}
