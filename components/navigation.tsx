"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    // Check if mock auth cookie exists
    const checkAuth = () => {
      const cookies = document.cookie.split(";")
      const authCookie = cookies.find((c) => c.trim().startsWith("mock_admin_auth="))
      setIsSignedIn(authCookie?.includes("true") || false)
    }
    checkAuth()

    // Check periodically for auth changes
    const interval = setInterval(checkAuth, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span>CyberSec Pro</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#experience" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              Experience
            </Link>
            <Link href="/#blog" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              Blog
            </Link>
            <Link href="/#newsletter" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              Newsletter
            </Link>
            {isSignedIn ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Admin</Link>
              </Button>
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
              href="/#experience"
              className="block text-sm font-medium hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Experience
            </Link>
            <Link
              href="/#blog"
              className="block text-sm font-medium hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/#newsletter"
              className="block text-sm font-medium hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Newsletter
            </Link>
            {isSignedIn ? (
              <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                <Link href="/admin">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                <Link href="/sign-in">Admin</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
