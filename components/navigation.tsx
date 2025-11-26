"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { usePathname } from "next/navigation"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAdminMessage, setShowAdminMessage] = useState(false)
  const [userRole, setUserRole] = useState<string>('user')
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()
  const isAdmin = userRole === 'admin' || user?.primaryEmailAddress?.emailAddress === 'eltonramos417@gmail.com'
  const isSubscriber = userRole === 'subscriber'
  const canAccessSecurityCenter = isAdmin || isSubscriber

  // Fetch user role
  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      fetch('/api/admin/manage-users')
        .then(res => res.json())
        .then(users => {
          const currentUser = users.find((u: any) => u.email === user.primaryEmailAddress?.emailAddress)
          if (currentUser) {
            setUserRole(currentUser.role)
          }
        })
        .catch(err => console.error('Error fetching user role:', err))
    }
  }, [isSignedIn, user])

  const handleAdminDashboardClick = (e: React.MouseEvent) => {
    if (!canAccessSecurityCenter) {
      e.preventDefault()
      setShowAdminMessage(true)
      setTimeout(() => setShowAdminMessage(false), 3000)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16 max-w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span>Open Learning</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] ${
                pathname === '/' ? 'font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-105' : ''
              }`}
            >
              Homepage
            </Link>
            <Link 
              href="/portfolio-security" 
              className={`text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] ${
                pathname === '/portfolio-security' ? 'font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-105' : ''
              }`}
            >
              Security Portfolio
            </Link>
            <Link 
              href="/mcp-integration" 
              className={`text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] ${
                pathname === '/mcp-integration' ? 'font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-105' : ''
              }`}
            >
              MCP Demo
            </Link>
            <Link 
              href="/security-plan" 
              className={`text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] ${
                pathname === '/security-plan' ? 'font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-105' : ''
              }`}
            >
              Security Plan
            </Link>
            {!isAdmin && (
              <Link href="/#newsletter" className="text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                Subscribe
              </Link>
            )}
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <ThemeSwitcher />
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild={canAccessSecurityCenter}
                    onClick={handleAdminDashboardClick}
                    className={!canAccessSecurityCenter ? "cursor-not-allowed opacity-70" : ""}
                  >
                    {canAccessSecurityCenter ? (
                      <Link href="/admin">
                        {isSubscriber && <Lock className="w-3 h-3 mr-1 inline" />}
                        Admin Dashboard
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Admin Dashboard
                      </span>
                    )}
                  </Button>
                  {showAdminMessage && (
                    <div className="absolute top-full mt-2 right-0 bg-orange-500/90 text-white text-xs px-3 py-2 rounded-md shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        Subscribe to have access
                      </div>
                    </div>
                  )}
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    },
                  }}
                  afterSignOutUrl="/sign-in"
                />
              </div>
            ) : (
              <>
                <ThemeSwitcher />
                <Button variant="outline" size="sm" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <Link
              href="/"
              className={`block text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-2 ${
                pathname === '/' ? 'font-bold text-cyan-400 translate-x-2' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Homepage
            </Link>
            <Link
              href="/portfolio-security"
              className={`block text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-2 ${
                pathname === '/portfolio-security' ? 'font-bold text-cyan-400 translate-x-2' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Security Portfolio
            </Link>
            <Link
              href="/mcp-integration"
              className={`block text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-2 ${
                pathname === '/mcp-integration' ? 'font-bold text-cyan-400 translate-x-2' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              MCP Demo
            </Link>
            <Link
              href="/security-plan"
              className={`block text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-2 ${
                pathname === '/security-plan' ? 'font-bold text-cyan-400 translate-x-2' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Security Plan
            </Link>
            {!isAdmin && (
              <Link
                href="/#newsletter"
                className="block text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscribe
              </Link>
            )}
            {isSignedIn ? (
              <div className="space-y-3">
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full bg-transparent ${!canAccessSecurityCenter ? "cursor-not-allowed opacity-70" : ""}`}
                    asChild={canAccessSecurityCenter}
                    onClick={handleAdminDashboardClick}
                  >
                    {canAccessSecurityCenter ? (
                      <Link href="/admin" className="flex items-center justify-center gap-1">
                        {isSubscriber && <Lock className="w-3 h-3" />}
                        Admin Dashboard
                      </Link>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" />
                        Admin Dashboard
                      </span>
                    )}
                  </Button>
                  {showAdminMessage && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-orange-500/90 text-white text-xs px-3 py-2 rounded-md shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        Subscribe to have access
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <ThemeSwitcher />
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9",
                      },
                    }}
                    afterSignOutUrl="/sign-in"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <ThemeSwitcher />
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
