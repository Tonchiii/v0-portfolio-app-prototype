import { Button } from "@/components/ui/button"
import { Shield, MapPin, Mail, Phone, Linkedin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Glowing orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="relative">
              <div className="w-48 h-64 rounded-2xl overflow-hidden border-4 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 bg-secondary/50">
                <Image
                  src="/profile-photo-full.jpg"
                  alt="Elton James T. Ramos"
                  width={192}
                  height={256}
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-cyan-500 rounded-full p-3 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center md:text-left space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">ELTON JAMES T. RAMOS</h1>
              <p className="text-lg text-muted-foreground">IT Student & Software Developer</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Calocan City, Manila</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <a href="mailto:eltonramos417@gmail.com" className="hover:text-cyan-400 transition-colors">
                    eltonramos417@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>09919043753</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border backdrop-blur-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-foreground">IT Professional</span>
            </div>
          </div>

          {/* Main heading */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance text-center">
            Building Efficient Systems Through
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Software Development & Cyber Security
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed text-center">
            Detail-oriented IT student with experience in software development and cyber security. Skilled in
            PHP/Laravel, Python, and database management. Seeking to apply my technical skills in an innovative role to
            contribute to efficient system solutions.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="text-lg px-8 bg-cyan-600 hover:bg-cyan-700 text-white" asChild>
              <Link href="#experience">View Experience</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="#blog">Read Blog</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-foreground">BSc IT</div>
              <div className="text-sm text-muted-foreground">Information Technology</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Linkedin className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-foreground">Active</div>
              <div className="text-sm text-muted-foreground">LinkedIn Profile</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Mail className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-foreground">Available</div>
              <div className="text-sm text-muted-foreground">For Opportunities</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-foreground">Manila</div>
              <div className="text-sm text-muted-foreground">Philippines</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-muted-foreground/50" />
        </div>
      </div>
    </section>
  )
}
