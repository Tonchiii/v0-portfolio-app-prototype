import Link from "next/link"
import { Shield, Github, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="container px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span>Open Learning</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Expert cybersecurity specialist protecting digital assets through advanced security solutions
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#experience" className="text-muted-foreground hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-muted-foreground hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#newsletter" className="text-muted-foreground hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Penetration Testing</li>
              <li>Security Audits</li>
              <li>Incident Response</li>
              <li>Security Architecture</li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-cyan-400 transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyan-400 transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyan-400 transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Open Learning. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
