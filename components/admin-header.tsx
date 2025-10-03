"use client"

import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
          <User className="w-4 h-4 text-cyan-400" />
        </div>
        <span className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
      </div>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}
