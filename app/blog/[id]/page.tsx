import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getBlogPost, mockBlogPosts } from "@/lib/mock-db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    id: post.id,
  }))
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16">
        <article className="container px-4 max-w-4xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" className="mb-8" asChild>
            <Link href="/#blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {/* Article header */}
          <div className="space-y-6 mb-8">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.publishedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <span>•</span>
              <span>By {post.author}</span>
            </div>
          </div>

          {/* Featured image */}
          <div className="relative h-96 rounded-lg overflow-hidden mb-12">
            <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>

          {/* Article content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">{post.excerpt}</p>

            <h2>Introduction</h2>
            <p>
              In today's rapidly evolving digital landscape, cybersecurity has become more critical than ever. This
              article explores the latest trends, challenges, and solutions in the field of information security.
            </p>

            <h2>Key Concepts</h2>
            <p>
              Understanding the fundamental principles is essential for implementing effective security measures. We'll
              dive deep into the technical aspects and practical applications that security professionals need to know.
            </p>

            <h3>Technical Implementation</h3>
            <p>
              The implementation phase requires careful planning and execution. Security teams must balance protection
              with usability while maintaining compliance with industry standards and regulations.
            </p>

            <h2>Best Practices</h2>
            <ul>
              <li>Implement defense-in-depth strategies across all layers</li>
              <li>Maintain continuous monitoring and threat intelligence</li>
              <li>Regular security audits and penetration testing</li>
              <li>Employee training and security awareness programs</li>
              <li>Incident response planning and regular drills</li>
            </ul>

            <h2>Conclusion</h2>
            <p>
              As cyber threats continue to evolve, staying informed and proactive is crucial. By implementing these
              strategies and maintaining vigilance, organizations can significantly improve their security posture.
            </p>
          </div>

          {/* Share section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Share this article</span>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  )
}
