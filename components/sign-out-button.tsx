"use client"

import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/sign-in")
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20"
    >
      Sign Out
    </button>
  )
}
