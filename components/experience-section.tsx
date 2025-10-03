import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { experiences, skills } from "@/lib/types"
import { GraduationCap, Award } from "lucide-react"

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 bg-secondary/20">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Education & Skills</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Education & Expertise</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Building technical skills through academic excellence and hands-on project experience
            </p>
          </div>

          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <CardTitle className="text-2xl">{exp.title}</CardTitle>
                      <CardDescription className="text-base mt-1">{exp.company}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {exp.period}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="border-cyan-500/30 text-cyan-400">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skills section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
                <Award className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium">Core Competencies</span>
              </div>
              <h3 className="text-3xl font-bold">Technical Skills</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">18-05-2003</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Place of Birth</p>
                    <p className="font-medium">Caloocan City, Manila</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">Filipino</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Marital Status</p>
                    <p className="font-medium">Single</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Driving License</p>
                    <p className="font-medium">A, B</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <a
                      href="https://linkedin.com/in/elton-james-ramos"
                      className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Elton James Ramos
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Interests</h3>
            <div className="flex justify-center">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-base px-6 py-2">
                Interested in Technology
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
