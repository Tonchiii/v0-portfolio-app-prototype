"use client"

import { useUser } from "@clerk/nextjs"
import { redirect, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Mail, 
  Key, 
  Monitor, 
  Globe, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Trash2,
  LogOut,
  ShieldAlert,
  ArrowLeft,
  Chrome
} from "lucide-react"
import { useState, useEffect } from "react"

interface Session {
  id: string
  device: string
  browser: string
  os: string
  location: string
  lastActive: string
  current: boolean
}

interface ConnectedAccount {
  id: string
  provider: string
  email: string
  connected: boolean
}

export default function SecurityCenterPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn, user } = useUser()
  const [sessions, setSessions] = useState<Session[]>([])
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [isAddingPhone, setIsAddingPhone] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string>("") 
  const [phoneInput, setPhoneInput] = useState<string>("")
  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isCheckingRole, setIsCheckingRole] = useState(true)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        if (!user?.primaryEmailAddress?.emailAddress) {
          setIsCheckingRole(false)
          return
        }

        const response = await fetch('/api/admin/manage-users')
        if (!response.ok) {
          setUserRole('user')
          setIsCheckingRole(false)
          return
        }

        const users = await response.json()
        const currentUser = users.find(
          (u: any) => u.email === user.primaryEmailAddress?.emailAddress
        )
        
        setUserRole(currentUser?.role || 'user')
        setIsCheckingRole(false)
      } catch (error) {
        console.error('Error checking user role:', error)
        setUserRole('user')
        setIsCheckingRole(false)
      }
    }

    checkUserRole()
  }, [user])

  useEffect(() => {
    // Load sessions from localStorage or initialize with defaults
    const storedSessions = localStorage.getItem('userSessions')
    
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions))
    } else {
      // Initial session data (only set if no stored data exists)
      const initialSessions = [
        {
          id: "1",
          device: "Windows PC",
          browser: "Chrome 120",
          os: "Windows 11",
          location: "Manila, Philippines",
          lastActive: "Now",
          current: true
        },
        {
          id: "2",
          device: "iPhone 15",
          browser: "Safari 17",
          os: "iOS 17",
          location: "Manila, Philippines",
          lastActive: "2 hours ago",
          current: false
        }
      ]
      setSessions(initialSessions)
      localStorage.setItem('userSessions', JSON.stringify(initialSessions))
    }

    // Fetch 2FA status from API
    const fetch2FAStatus = async () => {
      try {
        const response = await fetch('/api/security/2fa')
        if (response.ok) {
          const data = await response.json()
          setMfaEnabled(data.mfaEnabled)
        }
      } catch (error) {
        console.error('Error fetching 2FA status:', error)
      }
    }

    fetch2FAStatus()
    
    // Load phone number from localStorage
    const storedPhone = localStorage.getItem('userPhoneNumber')
    if (storedPhone) {
      setPhoneNumber(storedPhone)
    }
  }, [user])

  if (!isLoaded || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 text-cyan-400 animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading security settings...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    redirect("/sign-in")
  }

  if (userRole && userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-cyan-950/10">
        <div className="max-w-md w-full mx-4">
          <Card className="border-red-500/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-2xl text-red-500">Access Denied</CardTitle>
                <CardDescription className="mt-2">
                  This page is restricted to administrators only
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <p className="text-sm text-muted-foreground">
                  You need administrator permissions to access the Security Center. 
                  If you believe this is an error, please contact the system administrator.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => router.push('/')} 
                  className="w-full"
                  variant="default"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
                <Button 
                  onClick={() => router.push('/admin')} 
                  className="w-full"
                  variant="outline"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getBrowserIcon = (browser: string) => {
    if (browser.includes("Chrome")) return <Chrome className="w-4 h-4 text-cyan-400" />
    if (browser.includes("Firefox")) return <Globe className="w-4 h-4 text-orange-400" />
    if (browser.includes("Safari")) return <Globe className="w-4 h-4 text-blue-400" />
    return <Globe className="w-4 h-4 text-cyan-400" />
  }

  const handleLogoutSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId)
    setSessions(updatedSessions)
    // Persist to localStorage so it stays removed
    localStorage.setItem('userSessions', JSON.stringify(updatedSessions))
  }

  const handleToggleMFA = async (enable: boolean) => {
    try {
      const response = await fetch('/api/security/2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: enable }),
      })

      if (response.ok) {
        const data = await response.json()
        setMfaEnabled(data.mfaEnabled)
      } else {
        console.error('Failed to update 2FA status')
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error)
    }
  }

  const handleAddPhone = () => {
    if (phoneInput.trim()) {
      setPhoneNumber(phoneInput)
      localStorage.setItem('userPhoneNumber', phoneInput)
      setPhoneInput("")
      setShowPhoneInput(false)
    }
  }

  const handleDeletePhone = () => {
    setPhoneNumber("")
    localStorage.removeItem('userPhoneNumber')
  }

  const handleChangePassword = async () => {
    setPasswordError("")
    setPasswordSuccess(false)

    if (!newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    try {
      // Use Clerk's updatePassword method
      await user?.updatePassword({
        newPassword: newPassword,
        signOutOfOtherSessions: true,
      })
      
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      setTimeout(() => {
        setShowPasswordDialog(false)
        setPasswordSuccess(false)
      }, 2000)
    } catch (error: any) {
      console.error("Error changing password:", error)
      setPasswordError(error?.errors?.[0]?.message || "Failed to change password")
    }
  }

  const handleConnectOAuth = async (provider: "oauth_google" | "oauth_github") => {
    try {
      const redirect = `${window.location.origin}/security`
      await user?.createExternalAccount({
        strategy: provider,
        redirectUrl: redirect,
        redirect_url: redirect,
      })
    } catch (error: any) {
      console.error(`Error connecting ${provider}:`, error)
      alert(error?.errors?.[0]?.message || `Failed to connect ${provider}`)
    }
  }

  const handleDisconnectOAuth = async (externalAccountId: string) => {
    try {
      const account = user?.externalAccounts?.find(acc => acc.id === externalAccountId)
      if (account) {
        await account.destroy()
        // Reload user data to reflect changes
        await user?.reload()
      }
    } catch (error: any) {
      console.error("Error disconnecting account:", error)
      alert(error?.errors?.[0]?.message || "Failed to disconnect account")
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="w-full px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-cyan-500/30">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">SECURITY CENTER</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Account <span className="text-cyan-400">Security</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage your account security, authentication methods, and active sessions
            </p>
          </div>

          {/* Account Overview */}
          <Card className="border-cyan-500/30 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                    <Lock className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Account Information</CardTitle>
                    <CardDescription>Your primary account details</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>Email Address</span>
                  </div>
                  <p className="font-medium text-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                  <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Phone Number</span>
                  </div>
                  {phoneNumber ? (
                    <>
                      <p className="font-medium text-foreground">{phoneNumber}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 px-2"
                          onClick={handleDeletePhone}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {showPhoneInput ? (
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            placeholder="+63 XXX XXX XXXX"
                            className="px-3 py-1 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:border-cyan-400"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
                            onClick={handleAddPhone}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setShowPhoneInput(false)
                              setPhoneInput("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-foreground">Not added</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
                            onClick={() => setShowPhoneInput(true)}
                          >
                            Add Phone Number
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password & Authentication */}
          <Card className="border-cyan-500/30 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/30">
                  <Key className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Password & Credentials</CardTitle>
                  <CardDescription>Manage your authentication methods</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:border-cyan-500/50 transition-all duration-300">
                <div className="space-y-1">
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed: {new Date().toLocaleDateString()}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  Change Password
                </Button>
              </div>

              {showPasswordDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <Card className="w-full max-w-md border-cyan-500/30 bg-card shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">Change Password</CardTitle>
                      <CardDescription>Enter your new password below</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {passwordError && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                          {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Password changed successfully!
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="default"
                          className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                          onClick={handleChangePassword}
                          disabled={passwordSuccess}
                        >
                          Change Password
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setShowPasswordDialog(false)
                            setPasswordError("")
                            setPasswordSuccess(false)
                            setCurrentPassword("")
                            setNewPassword("")
                            setConfirmPassword("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:border-cyan-500/50 transition-all duration-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Two-Factor Authentication (2FA)</p>
                    {mfaEnabled ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Disabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mfaEnabled 
                      ? "Your account is protected with 2FA" 
                      : "Add an extra layer of security to your account"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {mfaEnabled ? (
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="hover:bg-red-500/10 hover:border-red-400 hover:text-red-400 transition-all duration-300"
                      onClick={() => handleToggleMFA(false)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Disable 2FA
                    </Button>
                  ) : (
                    <Button 
                      variant="default"
                      size="sm" 
                      className="bg-cyan-600 hover:bg-cyan-700 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300"
                      onClick={() => handleToggleMFA(true)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Enable 2FA
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="border-cyan-500/30 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/30">
                  <Monitor className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Active Sessions</CardTitle>
                  <CardDescription>Devices and locations where you're signed in</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:border-cyan-500/50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all duration-300">
                      {getBrowserIcon(session.browser)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{session.device}</p>
                        {session.current && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.browser} • {session.os}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.location} • {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleLogoutSession(session.id)}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card className="border-cyan-500/30 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30">
                  <Globe className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Connected Accounts</CardTitle>
                  <CardDescription>Third-party services linked to your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const googleAccount = user.externalAccounts?.find(acc => acc.provider === "google")
                return (
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:border-cyan-500/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Google</p>
                        <p className="text-sm text-muted-foreground">
                          {googleAccount ? googleAccount.emailAddress : "Sign in with Google"}
                        </p>
                      </div>
                    </div>
                    {googleAccount ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-green-500/30 text-green-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDisconnectOAuth(googleAccount.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
                        onClick={() => handleConnectOAuth("oauth_google")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                )
              })()}

              {(() => {
                const githubAccount = user.externalAccounts?.find(acc => acc.provider === "github")
                return (
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:border-cyan-500/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-muted-foreground">
                          {githubAccount ? githubAccount.username || githubAccount.emailAddress : "Sign in with GitHub"}
                        </p>
                      </div>
                    </div>
                    {githubAccount ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-green-500/30 text-green-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDisconnectOAuth(githubAccount.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
                        onClick={() => handleConnectOAuth("oauth_github")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                )
              })()}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
