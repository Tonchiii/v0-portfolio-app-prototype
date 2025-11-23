import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { experiences, skills } from "@/lib/types"
import { GraduationCap, Award } from "lucide-react"
import Image from "next/image"

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 bg-secondary/20">
      <div className="w-full px-4">
        <div className="max-w-5xl mx-auto space-y-16">
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
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] hover:bg-card/80"
              >
                <CardHeader className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div>
                      {exp.link ? (
                        <a 
                          href={exp.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-cyan-400 transition-colors duration-300 group"
                        >
                          <CardTitle className="text-2xl group-hover:underline">{exp.title}</CardTitle>
                        </a>
                      ) : (
                        <CardTitle className="text-2xl">{exp.title}</CardTitle>
                      )}
                      <CardDescription className="text-base mt-1">{exp.company}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {exp.period}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">{exp.description}</p>
                  {exp.image && (
                    <div className="mt-4 flex justify-center">
                      <a href={exp.image} target="_blank" rel="noreferrer noopener" className="max-w-2xl block">
                        <div className="relative w-full rounded-md border border-border shadow-sm hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
                          <img
                            src={exp.image}
                            alt={`${exp.title} certificate`}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </a>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:scale-110 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300 cursor-default">
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

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2 group cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground group-hover:text-cyan-400 transition-colors duration-300">{skill.name}</span>
                    <span className="text-sm text-muted-foreground group-hover:text-cyan-300 transition-colors duration-300">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02]">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="space-y-4 text-center">
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
                <div className="space-y-4 text-center">
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
                      className="font-medium text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] inline-block hover:scale-105"
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
            <div className="flex justify-center flex-wrap gap-3">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-base px-6 py-2 hover:bg-cyan-500/20 hover:border-cyan-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300 cursor-default">
                Technology Innovation
              </Badge>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-base px-6 py-2 hover:bg-blue-500/20 hover:border-blue-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300 cursor-default">
                Software Development
              </Badge>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-base px-6 py-2 hover:bg-purple-500/20 hover:border-purple-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-300 cursor-default">
                Cybersecurity
              </Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-400 text-base px-6 py-2 hover:bg-green-500/20 hover:border-green-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all duration-300 cursor-default">
                Badminton
              </Badge>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-base px-6 py-2 hover:bg-orange-500/20 hover:border-orange-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-all duration-300 cursor-default">
                Driving & Automotive
              </Badge>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-base px-6 py-2 hover:bg-emerald-500/20 hover:border-emerald-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-300 cursor-default">
                Nature Exploration
              </Badge>
              <Badge variant="outline" className="border-pink-500/30 text-pink-400 text-base px-6 py-2 hover:bg-pink-500/20 hover:border-pink-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300 cursor-default">
                Social Activities
              </Badge>
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-base px-6 py-2 hover:bg-indigo-500/20 hover:border-indigo-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-300 cursor-default">
                Gaming
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
