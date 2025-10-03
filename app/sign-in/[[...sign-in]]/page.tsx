"use client"

import { Shield, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockSignIn } from "@/lib/mock-auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleMockSignIn = async () => {
    setIsLoading(true)
    await mockSignIn()
    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span>CyberSec Pro</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Admin Sign In</h1>
          <p className="text-muted-foreground mt-2">Access the admin dashboard</p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              Mock Authentication
            </CardTitle>
            <CardDescription>
              This is a prototype with mock authentication. Click below to sign in as admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
              <p className="text-sm font-mono">eltonramos417@gmail.com</p>
            </div>

            <Button
              onClick={handleMockSignIn}
              disabled={isLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              size="lg"
            >
              {isLoading ? "Signing in..." : "Sign In as Admin"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              In production, this would use Clerk with Google OAuth
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
