import type React from "react"
import { Navigation } from "@/components/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">{children}</div>
    </div>
  )
}
