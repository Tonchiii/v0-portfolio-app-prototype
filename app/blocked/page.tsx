import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/sign-out-button"

export default async function BlockedPage() {
  const { userId } = await auth()

  // If not signed in, redirect to sign-in
  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950/20 via-background to-orange-950/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-10 h-10 text-red-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-red-400">Access Blocked</h1>

            {/* Message */}
            <div className="space-y-3">
              <p className="text-foreground text-lg">
                Your account has been blocked by the administrator.
              </p>
              <p className="text-muted-foreground text-sm">
                You are currently unable to view the portfolio content. If you believe this is a mistake, please contact the administrator for assistance.
              </p>
            </div>

            {/* User ID */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Your User ID</p>
              <code className="text-sm text-red-400 font-mono break-all">{userId}</code>
            </div>

            {/* Sign Out Button */}
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
