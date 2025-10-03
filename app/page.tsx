import { HeroSection } from "@/components/hero-section"
import { ExperienceSection } from "@/components/experience-section"
import { BlogSection } from "@/components/blog-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ExperienceSection />
        <BlogSection />
        <NewsletterSection />
      </main>
    </div>
  )
}
