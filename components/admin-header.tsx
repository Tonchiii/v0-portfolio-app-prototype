"use client"

import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { mockSignOut } from "@/lib/mock-auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function AdminHeader() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await mockSignOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
          <User className="w-4 h-4 text-cyan-400" />
        </div>
        <span className="text-muted-foreground">eltonramos417@gmail.com</span>
      </div>
      <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isLoading}>
        <LogOut className="w-4 h-4 mr-2" />
        {isLoading ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  )
}
