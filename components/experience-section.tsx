import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { experiences, skills } from "@/lib/types"
import { GraduationCap, Award } from "lucide-react"
import Image from "next/image"

export function ExperienceSection() {
  return (
    <section id="experience" className="py-8 bg-secondary/20">
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

          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold">Interests & Passions</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Beyond coding and security, these are the things that fuel my creativity and keep me balanced
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-cyan-500/30 bg-card/50 backdrop-blur-sm hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-[1.03] group">
                <CardHeader>
                  <CardTitle className="text-xl text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    Technology Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Passionate about staying at the cutting edge of tech. I love exploring emerging technologies, following industry trends, and experimenting with new tools that push the boundaries of what's possible.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-card/50 backdrop-blur-sm hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-[1.03] group">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-400 group-hover:text-blue-300 transition-colors">
                    Software Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Building clean, efficient code is my craft. I enjoy solving complex problems, learning new frameworks, and creating applications that make a real impact. Every project is an opportunity to grow.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/30 bg-card/50 backdrop-blur-sm hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-[1.03] group">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-400 group-hover:text-purple-300 transition-colors">
                    Cybersecurity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Protecting digital assets and understanding security vulnerabilities fascinates me. I'm driven by the challenge of thinking like an attacker to build better defenses and keep systems secure.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-card/50 backdrop-blur-sm hover:border-green-400 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-[1.03] group">
                <CardHeader>
                  <CardTitle className="text-xl text-green-400 group-hover:text-green-300 transition-colors">
                    Badminton
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    My favorite way to stay active and competitive. Whether it's a casual game or an intense match, badminton helps me clear my mind and maintain physical fitness while having fun.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-500/30 bg-card/50 backdrop-blur-sm hover:border-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-[1.03] group">
                <CardHeader>
                  <CardTitle className="text-xl text-orange-400 group-hover:text-orange-300 transition-colors">
                    Driving & Automotive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    There's something therapeutic about being on the road. I appreciate the mechanics of vehicles, enjoy long drives, and love the sense of freedom and adventure that comes with exploring new routes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/30 bg-card/50 backdrop-blur-sm hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-[1.03] group">
                <CardHeader>
                  <CardTitle className="text-xl text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    Nature Exploration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Disconnecting from screens and reconnecting with nature helps me recharge. Hiking, camping, and discovering new trails remind me of the beauty beyond the digital world.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-500/30 bg-card/50 backdrop-blur-sm hover:border-pink-400 hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all duration-300 hover:scale-[1.03] group">
                <CardHeader>
                  <CardTitle className="text-xl text-pink-400 group-hover:text-pink-300 transition-colors">
                    Social Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Building meaningful connections with people energizes me. I enjoy hanging out with friends, networking events, and any opportunity to share experiences and learn from others.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-indigo-500/30 bg-card/50 backdrop-blur-sm hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-[1.03] group">
                <CardHeader>
                  <CardTitle className="text-xl text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    Gaming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Gaming is where strategy meets entertainment. I love the immersive stories, competitive challenges, and the community aspect that brings players together from around the world.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-rose-500/30 bg-card/50 backdrop-blur-sm hover:border-rose-400 hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all duration-300 hover:scale-[1.03] group">
                <CardHeader>
                  <CardTitle className="text-xl text-rose-400 group-hover:text-rose-300 transition-colors">
                    Cooking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Creating delicious meals is both an art and a science. I enjoy experimenting with new recipes, flavors, and techniques. Cooking is my creative outlet that brings joy to others through food.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
