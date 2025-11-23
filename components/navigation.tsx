"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X } from "lucide-react"
import { useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSignedIn, user } = useUser()

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
            <Link href="/#experience" className="text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              Experience
            </Link>
            <Link href="/#blog" className="text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              Blog
            </Link>
            <Link href="/#newsletter" className="text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              Newsletter
            </Link>
            {isSignedIn && (
              <Link href="/security" className="text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Security Center
              </Link>
            )}
            <ThemeSwitcher />
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin">Dashboard</Link>
                </Button>
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
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
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
              className="block text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Experience
            </Link>
            <Link
              href="/#blog"
              className="block text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/#newsletter"
              className="block text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Newsletter
            </Link>
            {isSignedIn && (
              <Link
                href="/security"
                className="block text-sm font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-2 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="w-3.5 h-3.5" />
                Security Center
              </Link>
            )}
            <div className="flex justify-center py-2">
              <ThemeSwitcher />
            </div>
            {isSignedIn ? (
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/admin">Dashboard</Link>
                </Button>
                <div className="flex items-center justify-center pt-2">
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
              <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
