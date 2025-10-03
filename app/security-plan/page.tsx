import { Navigation } from "@/components/navigation"
import { Shield, Lock, Key, FileText, Globe, CheckCircle2, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SecurityPlanPage() {
  const securityMeasures = [
    {
      icon: Lock,
      title: "Strong Authentication",
      description: "OAuth and Multi-Factor Authentication (MFA) for enhanced security",
      status: "Planned",
    },
    {
      icon: Key,
      title: "Secure Secrets Handling",
      description: "API keys stored in environment variables, never in code",
      status: "Planned",
    },
    {
      icon: Shield,
      title: "Role-Based Access Control",
      description: "User permissions managed through granular role assignments",
      status: "Planned",
    },
    {
      icon: FileText,
      title: "Audit Logging",
      description: "Comprehensive activity tracking for security monitoring",
      status: "Planned",
    },
    {
      icon: Globe,
      title: "Data Residency Compliance",
      description: "Meeting local regulations for data storage and processing",
      status: "Planned",
    },
  ]

  const principles = [
    "Security by design, not as an afterthought",
    "Zero-trust architecture principles",
    "Regular security audits and updates",
    "Transparent security practices",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-background to-background" />
        <div className="container relative px-4 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 mb-6">
              <Shield className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Security Plan</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              A comprehensive approach to protecting your digital portfolio with enterprise-grade security controls
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-cyan-400 hover:bg-cyan-500 text-black">
                View Implementation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Security Principles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((principle, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-foreground">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container px-4 py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Security Controls</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These security measures will be implemented in phases to ensure robust protection of user data and system
              integrity
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {securityMeasures.map((measure, index) => {
              const Icon = measure.icon
              return (
                <Card
                  key={index}
                  className="border-border bg-card hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/5 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                        {measure.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{measure.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{measure.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-background">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">Implementation Timeline</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Each security control will be thoroughly tested and validated before deployment to production. Our
                    phased approach ensures minimal disruption while maximizing security coverage.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-lg bg-background border border-border">
                      <div className="text-sm text-muted-foreground">Phase 1</div>
                      <div className="font-semibold">Authentication & Secrets</div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-background border border-border">
                      <div className="text-sm text-muted-foreground">Phase 2</div>
                      <div className="font-semibold">Access Control & Logging</div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-background border border-border">
                      <div className="text-sm text-muted-foreground">Phase 3</div>
                      <div className="font-semibold">Compliance & Monitoring</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
