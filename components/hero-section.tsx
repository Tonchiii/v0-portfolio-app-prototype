"use client"
import { Button } from "@/components/ui/button"
import { Shield, MapPin, Mail, Phone, Linkedin, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  const handleViewResume = () => {
    // Open the resume page/image in a new tab
    window.open("/api/resume", "_blank")
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />

      {/* Glowing orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            <div className="relative">
              <div className="profile-float w-72 h-72 rounded-full overflow-hidden border-4 border-cyan-500/50 shadow-2xl shadow-cyan-500/40 bg-secondary/50 hover:border-cyan-400 hover:scale-105 transition-all duration-300 cursor-pointer">
                <Image
                  src="/profile-photo-full.jpg"
                  alt="Elton James T. Ramos"
                  width={288}
                  height={288}
                  className="object-cover object-top hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="text-center md:text-left space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">ELTON JAMES T. RAMOS</h1>
              <p className="text-lg text-muted-foreground">IT Student & Software Developer</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                <a 
                  href="https://www.google.com/maps/search/Neon+Tex+Bantex+Caloocan+City+Manila/@14.6507,120.9833,17z" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-cyan-400 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Calocan City, Manila</span>
                </a>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <a href="mailto:eltonramos417@gmail.com" className="hover:text-cyan-400 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                    eltonramos417@gmail.com
                  </a>
                </div>
                <a href="tel:+639919043753" className="flex items-center gap-2 hover:text-cyan-400 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] cursor-pointer">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>09919043753</span>
                </a>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border backdrop-blur-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-foreground">IT Professional</span>
            </div>
            <Link href="/portfolio-security" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">AI Protector Graduate</span>
            </Link>
            <Link href="/mcp-integration" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur-sm hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">OAuth MCP Certified</span>
            </Link>
          </div>

          {/* Main heading */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance text-center">
            Building Efficient Systems Through
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Software Development & Cyber Security
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed text-center">
            Detail-oriented IT student with hands-on experience in software development and cybersecurity. Skilled in PHP/Laravel, Python, HTML/CSS, and database management. Passionate about building efficient, secure, and user-focused system solutions.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="text-lg px-8 bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-105" asChild>
              <Link href="/portfolio-security">
                <Shield className="w-5 h-5 mr-2" />
                Security Portfolio
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent hover:bg-green-500/10 hover:border-green-400 hover:text-green-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105"
              onClick={handleViewResume}
            >
              <Eye className="w-5 h-5 mr-2" />
              View Resume
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105" asChild>
              <Link href="/mcp-integration">MCP Demo</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-foreground">BSIT</div>
              <div className="text-sm text-muted-foreground">Information Technology</div>
            </div>
            <a 
              href="https://www.linkedin.com/in/elton-james-ramos-7a4731386/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="space-y-2 text-center hover:scale-105 transition-transform duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-center">
                <Linkedin className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-foreground group-hover:text-blue-400 transition-colors">Active</div>
              <div className="text-sm text-muted-foreground group-hover:text-blue-300 transition-colors">LinkedIn Profile</div>
            </a>
            <a 
              href="mailto:eltonramos417@gmail.com"
              className="space-y-2 text-center hover:scale-105 transition-transform duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-center">
                <Mail className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-foreground group-hover:text-cyan-400 transition-colors">Available</div>
              <div className="text-sm text-muted-foreground group-hover:text-cyan-300 transition-colors">For Opportunities</div>
            </a>
            <a 
              href="https://www.google.com/maps/search/Neon+Tex+Bantex+Caloocan+City+Manila/@14.6507,120.9833,17z" 
              target="_blank" 
              rel="noopener noreferrer"
              className="space-y-2 text-center hover:scale-105 transition-transform duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-center">
                <MapPin className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-foreground group-hover:text-blue-400 transition-colors">Manila</div>
              <div className="text-sm text-muted-foreground group-hover:text-blue-300 transition-colors">Philippines</div>
            </a>
          </div>
        </div>
      </div>

    </section>
  )
}
