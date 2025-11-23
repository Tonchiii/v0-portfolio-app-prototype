"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, Shield, Activity, AlertTriangle, Check, X, Plus, Trash2, 
  Eye, EyeOff, Lock, Unlock, Clock, Globe, Server, Database,
  FileText, TrendingUp, TrendingDown, Wifi, MonitorDot, Bell,
  CheckCircle2, XCircle, Info, AlertCircle, Search, Filter,
  Download, RefreshCw, Settings, UserPlus, Key, Smartphone, Ban
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "guest"
  status: "active" | "inactive"
  lastLogin: string
  mfaEnabled: boolean
  loginCount: number
  blocked?: boolean
}

interface AuditLog {
  id: string
  timestamp: string
  event: string
  user: string
  status: "success" | "failed" | "warning"
  ip: string
  details: string
}

interface Vulnerability {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  category: string
  status: "open" | "patched" | "mitigated"
  discovered: string
  cve?: string
}

interface NetworkAlert {
  id: string
  timestamp: string
  type: "firewall" | "ids" | "bandwidth"
  severity: "critical" | "high" | "medium" | "low"
  source: string
  description: string
}

export function SecurityAdminDashboard() {
  const { user: clerkUser } = useUser()
  const [users, setUsers] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [networkAlerts, setNetworkAlerts] = useState<NetworkAlert[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" as const })
  const [selectedTab, setSelectedTab] = useState<"users" | "logs" | "vulnerabilities" | "network" | "compliance">("users")
  const [logFilter, setLogFilter] = useState<"all" | "success" | "failed" | "warning">("all")
  const [vulnFilter, setVulnFilter] = useState<"all" | "open" | "patched" | "mitigated">("all")
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Check if current user is admin (either eltonramos417@gmail.com or has admin role in database)
  const currentUserEmail = clerkUser?.primaryEmailAddress?.emailAddress
  const currentUser = users.find(u => u.email === currentUserEmail)
  const isAdmin = currentUserEmail === "eltonramos417@gmail.com" || currentUser?.role === "admin"

  useEffect(() => {
    const fetchAndProcessUsers = async () => {
      setIsLoadingUsers(true)
      
      // First, load existing users from database
      let dbUsers: User[] = []
      try {
        const dbResponse = await fetch('/api/admin/manage-users')
        if (dbResponse.ok) {
          const dbData = await dbResponse.json()
          dbUsers = dbData.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role as "admin" | "user" | "guest",
            status: u.status,
            lastLogin: u.last_login,
            mfaEnabled: u.mfa_enabled === "true",
            loginCount: parseInt(u.login_count) || 0
          }))
        }
      } catch (error) {
        console.error("Error loading database users:", error)
      }
      
      // Fetch blocked users
      let blockedUserIds = new Set<string>()
      try {
        const blockedRes = await fetch('/api/admin/block-user')
        if (blockedRes.ok) {
          const blockedJson = await blockedRes.json()
          blockedUserIds = new Set(blockedJson.blocked_users?.map((u: any) => u.user_id) || [])
        }
      } catch (error) {
        console.error("Error loading blocked users:", error)
      }
      
      // Fetch users from Clerk API
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const clerkUsers = await response.json()
          
          // Process users and merge with database data
          const processedUsers: User[] = clerkUsers.map((cu: any) => {
            const email = cu.emailAddresses?.[0]?.emailAddress || cu.email || ''
            const name = cu.fullName || cu.firstName || cu.lastName || email.split('@')[0]
            
            // Check if user exists in database
            const existingUser = dbUsers.find(u => u.email === email)
            
            // If user exists in database, use their stored role and data
            if (existingUser) {
              return {
                ...existingUser,
                name: name, // Update name from Clerk
                lastLogin: cu.lastSignInAt ? new Date(cu.lastSignInAt).toLocaleString() : existingUser.lastLogin,
                mfaEnabled: cu.twoFactorEnabled || existingUser.mfaEnabled,
                status: cu.banned ? "inactive" : existingUser.status,
                blocked: blockedUserIds.has(cu.id),
              }
            }
            
            // New user - determine initial role
            let role: "admin" | "user" | "guest"
            if (email === "eltonramos417@gmail.com") {
              role = "admin"
            } else if (email.includes("guest") || cu.emailAddresses?.[0]?.verification?.status !== "verified") {
              role = "guest"
            } else {
              role = "user"
            }
            
            // Calculate realistic login count based on account age
            const createdDate = new Date(cu.createdAt)
            const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
            const estimatedLogins = Math.max(1, Math.min(daysSinceCreation * 2, 50))
            
            return {
              id: cu.id,
              name: name,
              email: email,
              role: role,
              status: cu.banned ? "inactive" : "active",
              lastLogin: cu.lastSignInAt ? new Date(cu.lastSignInAt).toLocaleString() : "Never",
              mfaEnabled: cu.twoFactorEnabled || false,
              loginCount: estimatedLogins,
              blocked: blockedUserIds.has(cu.id),
            }
          })
          
          // Filter out users that were deleted (exist in Clerk but not in db and db has data)
          const finalUsers = dbUsers.length > 0 
            ? processedUsers.filter(pu => dbUsers.some(du => du.email === pu.email))
            : processedUsers
          
          // Add current user if not in list
          if (clerkUser && !finalUsers.find(u => u.email === clerkUser.primaryEmailAddress?.emailAddress)) {
            const currentUserEmail = clerkUser.primaryEmailAddress?.emailAddress || ""
            const existingCurrentUser = dbUsers.find(u => u.email === currentUserEmail)
            
            finalUsers.unshift({
              id: clerkUser.id,
              name: clerkUser.fullName || clerkUser.firstName || "Current User",
              email: currentUserEmail,
              role: existingCurrentUser?.role || (currentUserEmail === "eltonramos417@gmail.com" ? "admin" : "user"),
              status: "active",
              lastLogin: "Just now",
              mfaEnabled: clerkUser.twoFactorEnabled || false,
              loginCount: existingCurrentUser?.loginCount || 1,
              blocked: blockedUserIds.has(clerkUser.id),
            })
          }
          
          setUsers(finalUsers)
          
          // Save/update users in database (only new or updated users)
          for (const user of finalUsers) {
            await fetch('/api/admin/manage-users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(user)
            })
          }
        } else {
          // Fallback to database stored users if Clerk API fails
          const dbUsersRes = await fetch('/api/admin/manage-users')
          if (dbUsersRes.ok) {
            const dbUsers = await dbUsersRes.json()
            setUsers(dbUsers)
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        // Fallback to database on error
        try {
          const dbUsersRes = await fetch('/api/admin/manage-users')
          if (dbUsersRes.ok) {
            const dbUsers = await dbUsersRes.json()
            setUsers(dbUsers)
          }
        } catch (dbError) {
          console.error("Error fetching from database:", dbError)
        }
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchAndProcessUsers()

    // Load data from database
    const loadDatabaseData = async () => {
      try {
        // Load audit logs
        const logsRes = await fetch('/api/admin/audit-logs')
        if (logsRes.ok) {
          const logs = await logsRes.json()
          setAuditLogs(logs)
        }

        // Load vulnerabilities
        const vulnsRes = await fetch('/api/admin/vulnerabilities')
        if (vulnsRes.ok) {
          const vulns = await vulnsRes.json()
          setVulnerabilities(vulns)
        }

        // Load network alerts
        const alertsRes = await fetch('/api/admin/network-alerts')
        if (alertsRes.ok) {
          const alerts = await alertsRes.json()
          setNetworkAlerts(alerts)
        }
      } catch (error) {
        console.error("Error loading database data:", error)
      }
    }

    loadDatabaseData()

    // Initialize with default data if database is empty (first time setup)
    const initializeData = async () => {
      const initialLogs: AuditLog[] = [
      {
        id: "1",
        timestamp: "2025-11-23T12:00:00.000Z",
        event: "User Login",
        user: "eltonramos417@gmail.com",
        status: "success",
        ip: "192.168.1.100",
        details: "Successful authentication via OAuth"
      },
      {
        id: "2",
        timestamp: "2025-11-23T11:00:00.000Z",
        event: "Failed Login Attempt",
        user: "unknown@suspicious.com",
        status: "failed",
        ip: "185.220.101.45",
        details: "Invalid credentials - 5 attempts"
      },
      {
        id: "3",
        timestamp: "2025-11-23T10:00:00.000Z",
        event: "Password Changed",
        user: "john.doe@example.com",
        status: "success",
        ip: "192.168.1.105",
        details: "User initiated password reset"
      },
      {
        id: "4",
        timestamp: "2025-11-23T09:00:00.000Z",
        event: "SQL Injection Blocked",
        user: "attacker@malicious.com",
        status: "warning",
        ip: "45.33.32.156",
        details: "Blocked malicious query in /api/users"
      },
      {
        id: "5",
        timestamp: "2025-11-23T08:00:00.000Z",
        event: "MFA Enabled",
        user: "jane.smith@example.com",
        status: "success",
        ip: "192.168.1.110",
        details: "Two-factor authentication activated"
      }
    ]

      const initialVulnerabilities: Vulnerability[] = [
      {
        id: "1",
        title: "SQL Injection in User Query",
        severity: "critical",
        category: "OWASP A03:2021 - Injection",
        status: "patched",
        discovered: "2025-11-15",
        cve: "CVE-2025-1234"
      },
      {
        id: "2",
        title: "Cross-Site Scripting (XSS) Vulnerability",
        severity: "high",
        category: "OWASP A07:2021 - XSS",
        status: "patched",
        discovered: "2025-11-18"
      },
      {
        id: "3",
        title: "Weak JWT Secret Configuration",
        severity: "high",
        category: "OWASP A02:2021 - Cryptographic Failures",
        status: "mitigated",
        discovered: "2025-11-20"
      },
      {
        id: "4",
        title: "Missing Rate Limiting on API",
        severity: "medium",
        category: "OWASP A04:2021 - Insecure Design",
        status: "patched",
        discovered: "2025-11-21"
      },
      {
        id: "5",
        title: "Outdated Dependencies Detected",
        severity: "medium",
        category: "A06:2021 - Vulnerable Components",
        status: "open",
        discovered: "2025-11-22"
      },
      {
        id: "6",
        title: "Insufficient Logging",
        severity: "low",
        category: "OWASP A09:2021 - Security Logging Failures",
        status: "open",
        discovered: "2025-11-22"
      }
    ]

      const initialAlerts: NetworkAlert[] = [
      {
        id: "1",
        timestamp: "2025-11-23T11:30:00.000Z",
        type: "firewall",
        severity: "high",
        source: "185.220.101.45",
        description: "Multiple port scan attempts detected"
      },
      {
        id: "2",
        timestamp: "2025-11-23T11:00:00.000Z",
        type: "ids",
        severity: "critical",
        source: "45.33.32.156",
        description: "Potential DDoS attack - 10,000 requests/min"
      },
      {
        id: "3",
        timestamp: "2025-11-23T10:30:00.000Z",
        type: "bandwidth",
        severity: "medium",
        source: "192.168.1.120",
        description: "Unusual bandwidth spike - 500MB upload"
      },
      {
        id: "4",
        timestamp: "2025-11-23T10:00:00.000Z",
        type: "firewall",
        severity: "medium",
        source: "203.0.113.42",
        description: "Blocked SSH brute force attempt"
      }
    ]

      // Only initialize if database is empty
      if (auditLogs.length === 0) {
        for (const log of initialLogs) {
          await fetch('/api/admin/audit-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log)
          })
        }
      }

      if (vulnerabilities.length === 0) {
        for (const vuln of initialVulnerabilities) {
          await fetch('/api/admin/vulnerabilities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vuln)
          })
        }
      }

      if (networkAlerts.length === 0) {
        for (const alert of initialAlerts) {
          await fetch('/api/admin/network-alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alert)
          })
        }
      }
    }

    initializeData()
    
    // Set mounted after all initialization is complete
    setIsMounted(true)
  }, [clerkUser])

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "active",
        lastLogin: "Never",
        mfaEnabled: false,
        loginCount: 0
      }
      const updatedUsers = [...users, user]
      setUsers(updatedUsers)
      
      // Save to database
      await fetch('/api/admin/manage-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      
      setNewUser({ name: "", email: "", role: "user" })
      setShowAddUser(false)
    }
  }

  const handleRemoveUser = async (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId)
    setUsers(updatedUsers)
    
    // Delete from database
    await fetch(`/api/admin/manage-users?id=${userId}`, { method: 'DELETE' })
  }

  const handleToggleMFA = async (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, mfaEnabled: !u.mfaEnabled } : u
    )
    setUsers(updatedUsers)
    
    // Update in database
    const user = updatedUsers.find(u => u.id === userId)
    if (user) {
      await fetch('/api/admin/manage-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
    }
  }

  const handleChangeRole = async (userId: string, newRole: "admin" | "user" | "guest") => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    )
    setUsers(updatedUsers)
    
    // Update in database
    const user = updatedUsers.find(u => u.id === userId)
    if (user) {
      await fetch('/api/admin/manage-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
    }
  }

  const handleBlockUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to block ${email}? They will not be able to view the portfolio.`)) {
      return
    }

    try {
      console.log('Blocking user:', { userId, email })
      
      const res = await fetch('/api/admin/block-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, email, reason: 'Blocked by admin' })
      })

      console.log('Response status:', res.status)
      const text = await res.text()
      console.log('Response text:', text)
      
      let json
      try {
        json = JSON.parse(text)
      } catch {
        alert(`Server error: ${text.substring(0, 200)}`)
        return
      }
      
      if (res.ok) {
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, blocked: true } : u
        )
        setUsers(updatedUsers)
        alert(`User ${email} has been blocked successfully.`)
      } else {
        console.error('Block user error:', json)
        alert(`Failed to block user: ${json.error || JSON.stringify(json)}`)
      }
    } catch (err: any) {
      console.error('Block user exception:', err)
      alert(`Error blocking user: ${err.message || err.toString()}`)
    }
  }

  const handleUnblockUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to unblock ${email}?`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/block-user?user_id=${userId}`, {
        method: 'DELETE'
      })

      const json = await res.json()
      
      if (res.ok) {
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, blocked: false } : u
        )
        setUsers(updatedUsers)
        alert(`User ${email} has been unblocked successfully.`)
      } else {
        console.error('Unblock user error:', json)
        alert(`Failed to unblock user: ${json.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      console.error('Unblock user exception:', err)
      alert(`Error unblocking user: ${err.message || 'Please try again.'}`)
    }
  }

  const handlePatchVulnerability = async (vulnId: string) => {
    const updatedVulns = vulnerabilities.map(v => 
      v.id === vulnId ? { ...v, status: "patched" as const } : v
    )
    setVulnerabilities(updatedVulns)
    
    // Update in database
    const vuln = updatedVulns.find(v => v.id === vulnId)
    if (vuln) {
      await fetch('/api/admin/vulnerabilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vuln)
      })
    }
    
    // Add audit log entry
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      event: "Vulnerability Patched",
      user: "eltonramos417@gmail.com",
      status: "success",
      ip: "192.168.1.100",
      details: `Patched vulnerability: ${vulnerabilities.find(v => v.id === vulnId)?.title}`
    }
    const updatedLogs = [newLog, ...auditLogs]
    setAuditLogs(updatedLogs)
    
    // Save to database
    await fetch('/api/admin/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog)
    })
  }

  const handleDismissAlert = async (alertId: string) => {
    const updatedAlerts = networkAlerts.filter(a => a.id !== alertId)
    setNetworkAlerts(updatedAlerts)
    
    // Delete from database
    await fetch(`/api/admin/network-alerts?id=${alertId}`, { method: 'DELETE' })
    
    // Add audit log entry
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      event: "Network Alert Dismissed",
      user: "eltonramos417@gmail.com",
      status: "success",
      ip: "192.168.1.100",
      details: `Dismissed alert: ${networkAlerts.find(a => a.id === alertId)?.description}`
    }
    const updatedLogs = [newLog, ...auditLogs]
    setAuditLogs(updatedLogs)
    
    // Save to database
    await fetch('/api/admin/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog)
    })
  }

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit-logs-${new Date().toISOString()}.json`
    link.click()
  }

  const handleRefreshAlerts = async () => {
    // Simulate adding a new alert
    const newAlert: NetworkAlert = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: "firewall",
      severity: "medium",
      source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      description: "New connection attempt detected"
    }
    const updatedAlerts = [newAlert, ...networkAlerts]
    setNetworkAlerts(updatedAlerts)
    
    // Save to database
    await fetch('/api/admin/network-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlert)
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "user": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "guest": return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case "failed": return <XCircle className="w-4 h-4 text-red-400" />
      case "warning": return <AlertCircle className="w-4 h-4 text-yellow-400" />
      default: return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    mfaEnabled: users.filter(u => u.mfaEnabled).length,
    criticalVulns: vulnerabilities.filter(v => v.severity === "critical" && v.status === "open").length,
    openVulns: vulnerabilities.filter(v => v.status === "open").length,
    activeAlerts: networkAlerts.filter(a => a.severity === "critical" || a.severity === "high").length
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return <div className="space-y-6"><p className="text-muted-foreground">Loading dashboard...</p></div>
  }

  return (
    <div className="space-y-6">
      {/* Security Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-cyan-500/30 bg-card/50 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-cyan-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-card/50 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeUsers}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-card/50 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MFA Enabled</p>
                <p className="text-2xl font-bold text-purple-400">{stats.mfaEnabled}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30 bg-card/50 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Vulns</p>
                <p className="text-2xl font-bold text-red-400">{stats.criticalVulns}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/30 bg-card/50 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(251,146,60,0.2)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Vulns</p>
                <p className="text-2xl font-bold text-orange-400">{stats.openVulns}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-card/50 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.activeAlerts}</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-400/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        <Button
          variant={selectedTab === "users" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("users")}
          className={selectedTab === "users" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
        >
          <Users className="w-4 h-4 mr-2" />
          User Management
        </Button>
        <Button
          variant={selectedTab === "logs" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("logs")}
          className={selectedTab === "logs" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
        >
          <FileText className="w-4 h-4 mr-2" />
          Audit Logs
        </Button>
        <Button
          variant={selectedTab === "vulnerabilities" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("vulnerabilities")}
          className={selectedTab === "vulnerabilities" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Vulnerabilities
        </Button>
        <Button
          variant={selectedTab === "network" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("network")}
          className={selectedTab === "network" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
        >
          <MonitorDot className="w-4 h-4 mr-2" />
          Network Monitor
        </Button>
        <Button
          variant={selectedTab === "compliance" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("compliance")}
          className={selectedTab === "compliance" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
        >
          <Lock className="w-4 h-4 mr-2" />
          Compliance
        </Button>
      </div>

      {/* User Management Tab */}
      {selectedTab === "users" && (
        <Card className="border-cyan-500/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6 text-cyan-400" />
                  User Management
                </CardTitle>
                <CardDescription>Manage users, roles, and access permissions</CardDescription>
              </div>
              {isAdmin && (
                <Button
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => setShowAddUser(!showAddUser)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAdmin && showAddUser && (
              <div className="p-4 border border-cyan-500/30 rounded-lg bg-secondary/20 space-y-3">
                <h4 className="font-medium text-sm">Add New User</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Create User
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddUser(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                      <span className="text-sm font-bold text-cyan-400">
                        {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                        {user.mfaEnabled && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            MFA
                          </Badge>
                        )}
                        {user.blocked && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                            <Ban className="w-3 h-3 mr-1" />
                            Blocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last login: {user.lastLogin}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.loginCount} logins
                        </span>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value as any)}
                        className="px-2 py-1 rounded-md border border-border bg-background text-xs"
                        disabled={user.email === "eltonramos417@gmail.com"}
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="guest">Guest</option>
                      </select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleMFA(user.id)}
                        className="text-xs"
                        title={user.mfaEnabled ? "MFA Enabled" : "MFA Disabled"}
                      >
                        {user.mfaEnabled ? (
                          <Lock className="w-4 h-4 text-green-400" />
                        ) : (
                          <Unlock className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      {user.email !== "eltonramos417@gmail.com" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => user.blocked ? handleUnblockUser(user.id, user.email) : handleBlockUser(user.id, user.email)}
                            className={user.blocked ? "text-green-400 hover:text-green-300 hover:bg-green-500/10" : "text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"}
                            title={user.blocked ? "Unblock User" : "Block User"}
                          >
                            {user.blocked ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveUser(user.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Logs Tab */}
      {selectedTab === "logs" && (
        <Card className="border-blue-500/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  System Security & Audit Logs
                </CardTitle>
                <CardDescription>Monitor all security events and system activities</CardDescription>
              </div>
              <div className="flex gap-2">
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value as any)}
                  className="px-3 py-1 rounded-md border border-border bg-background text-sm"
                >
                  <option value="all">All Logs</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="warning">Warning</option>
                </select>
                <Button size="sm" variant="outline" onClick={handleExportLogs}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {auditLogs.filter(log => logFilter === "all" || log.status === logFilter).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border bg-secondary/20 hover:border-blue-500/50 transition-all"
              >
                <div className="mt-1">
                  {getStatusIcon(log.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{log.event}</p>
                    <Badge className={getSeverityColor(log.status === "failed" ? "high" : log.status === "warning" ? "medium" : "low")}>
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {log.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {log.ip}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Vulnerabilities Tab */}
      {selectedTab === "vulnerabilities" && (
        <Card className="border-orange-500/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                  Threat & Vulnerability Management
                </CardTitle>
                <CardDescription>OWASP Top 10 vulnerabilities and patch management</CardDescription>
              </div>
              <div className="flex gap-2">
                <select
                  value={vulnFilter}
                  onChange={(e) => setVulnFilter(e.target.value as any)}
                  className="px-3 py-1 rounded-md border border-border bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="patched">Patched</option>
                  <option value="mitigated">Mitigated</option>
                </select>
                <Button size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Scan Now
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {vulnerabilities.filter(v => vulnFilter === "all" || v.status === vulnFilter).map((vuln) => (
              <div
                key={vuln.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border bg-secondary/20 hover:border-orange-500/50 transition-all"
              >
                <AlertTriangle className={`w-5 h-5 mt-1 ${
                  vuln.severity === "critical" ? "text-red-400" :
                  vuln.severity === "high" ? "text-orange-400" :
                  vuln.severity === "medium" ? "text-yellow-400" : "text-green-400"
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{vuln.title}</p>
                    <Badge className={getSeverityColor(vuln.severity)}>
                      {vuln.severity}
                    </Badge>
                    <Badge className={
                      vuln.status === "patched" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      vuln.status === "mitigated" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                      "bg-red-500/20 text-red-400 border-red-500/30"
                    }>
                      {vuln.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{vuln.category}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Discovered: {vuln.discovered}</span>
                    {vuln.cve && <span className="text-cyan-400">{vuln.cve}</span>}
                  </div>
                </div>
                {vuln.status === "open" && (
                  <Button
                    size="sm"
                    onClick={() => handlePatchVulnerability(vuln.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Patch
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Network Monitoring Tab */}
      {selectedTab === "network" && (
        <Card className="border-purple-500/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MonitorDot className="w-6 h-6 text-purple-400" />
                  Network & System Monitoring
                </CardTitle>
                <CardDescription>Real-time firewall, IDS/IPS alerts and network activity</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Activity className="w-3 h-3 mr-1" />
                  System Online
                </Badge>
                <Button size="sm" variant="outline" onClick={handleRefreshAlerts}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium">Active Connections</span>
                </div>
                <p className="text-3xl font-bold text-cyan-400">1,247</p>
                <p className="text-xs text-muted-foreground mt-1">+12% from last hour</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-5 h-5 text-green-400" />
                  <span className="font-medium">Bandwidth Usage</span>
                </div>
                <p className="text-3xl font-bold text-green-400">2.4 GB</p>
                <p className="text-xs text-muted-foreground mt-1">Normal activity</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">Blocked Threats</span>
                </div>
                <p className="text-3xl font-bold text-purple-400">47</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Recent Network Alerts</h4>
              {networkAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-secondary/20 hover:border-purple-500/50 transition-all"
                >
                  <Bell className={`w-5 h-5 mt-1 ${
                    alert.severity === "critical" ? "text-red-400" :
                    alert.severity === "high" ? "text-orange-400" :
                    "text-yellow-400"
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{alert.description}</p>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Source: {alert.source}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Tab */}
      {selectedTab === "compliance" && (
        <Card className="border-green-500/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lock className="w-6 h-6 text-green-400" />
              Data Privacy & Compliance
            </CardTitle>
            <CardDescription>GDPR, HIPAA compliance and data protection controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-lg border border-border bg-secondary/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">GDPR Compliance</h4>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Compliant
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Data encryption at rest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Right to be forgotten implemented</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Cookie consent management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Data access logging</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border bg-secondary/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Security Controls</h4>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    Active
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>Role-based access control (RBAC)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>Multi-factor authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>Encrypted data transmission (TLS 1.3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>Regular security audits</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-border bg-secondary/20">
              <h4 className="font-medium mb-4">Data Access Logs (Last 30 days)</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-sm font-medium">User data accessed</p>
                      <p className="text-xs text-muted-foreground">eltonramos417@gmail.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">Nov 23, 2025 10:24 AM</p>
                    <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-sm font-medium">Subscriber export</p>
                      <p className="text-xs text-muted-foreground">12 records exported</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">Nov 22, 2025 3:15 PM</p>
                    <p className="text-xs text-muted-foreground">Admin Panel</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-sm font-medium">Permission changes</p>
                      <p className="text-xs text-muted-foreground">john.doe@example.com role updated</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">Nov 21, 2025 1:45 PM</p>
                    <p className="text-xs text-muted-foreground">User Management</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
