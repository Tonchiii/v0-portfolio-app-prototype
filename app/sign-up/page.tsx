import { SignUp } from "@clerk/nextjs"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span>Open Learning</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Create an account</h1>
          <p className="text-muted-foreground mt-2">Sign up to access the admin dashboard</p>
        </div>

        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-card/50 backdrop-blur-sm border-border/50",
              },
            }}
            redirectUrl="/admin"
            signInUrl="/sign-in"
          />
        </div>

        <div className="text-center mt-6">
          <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
            ← Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
