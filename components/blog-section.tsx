import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockBlogPosts } from "@/lib/mock-db"
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function BlogSection() {
  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Insights & Analysis</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Latest Security Insights</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Deep dives into cybersecurity trends, threat analysis, and best practices
            </p>
          </div>

          {/* Featured post */}
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={mockBlogPosts[0].imageUrl || "/placeholder.svg"}
                  alt={mockBlogPosts[0].title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-cyan-600 text-white">Featured</Badge>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                      {mockBlogPosts[0].category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{mockBlogPosts[0].publishedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{mockBlogPosts[0].readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-balance">{mockBlogPosts[0].title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{mockBlogPosts[0].excerpt}</p>
                  <Button className="w-fit bg-cyan-600 hover:bg-cyan-700 text-white" asChild>
                    <Link href={`/blog/${mockBlogPosts[0].id}`}>
                      Read Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Blog grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {mockBlogPosts.slice(1).map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-colors group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                      {post.category}
                    </Badge>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 text-balance">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-pretty">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group-hover:text-cyan-400" asChild>
                    <Link href={`/blog/${post.id}`}>
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
