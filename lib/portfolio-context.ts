// Portfolio context loader - reads all portfolio data to provide to AI
import { experiences, skills } from "./types"
import { mockBlogPosts } from "./mock-db"

export interface PortfolioContext {
  personal: {
    name: string
    title: string
    location: string
    email: string
    phone: string
    linkedin: string
    about: string
  }
  education: Array<{
    title: string
    institution: string
    period: string
    description: string
    skills: string[]
  }>
  certifications: Array<{
    title: string
    issuer: string
    date: string
    id?: string
    skills: string[]
  }>
  skills: Array<{
    name: string
    category: string
    level: number
  }>
  projects: Array<{
    title: string
    description: string
    technologies: string[]
  }>
  blog: Array<{
    id: string
    title: string
    excerpt: string
    category: string
    publishedAt: string
  }>
}

export function getPortfolioContext(): PortfolioContext {
  // Personal information
  const personal = {
    name: "Elton James T. Ramos",
    title: "IT Student & Software Developer",
    location: "Calocan City, Manila, Philippines",
    email: "eltonramos417@gmail.com",
    phone: "09919043753",
    linkedin: "https://www.linkedin.com/in/elton-james-ramos",
    about: "Detail-oriented IT student with experience in software development and cyber security. Skilled in PHP/Laravel, Python, and database management. Seeking to apply my technical skills in an innovative role to contribute to efficient system solutions.",
  }

  // Education and certifications from experiences array
  const education: Array<{
    title: string
    institution: string
    period: string
    description: string
    skills: string[]
  }> = []

  const certifications: Array<{
    title: string
    issuer: string
    date: string
    id?: string
    skills: string[]
  }> = []

  experiences.forEach((exp) => {
    if (exp.company.toLowerCase().includes("university") || exp.company.toLowerCase().includes("school")) {
      education.push({
        title: exp.title,
        institution: exp.company,
        period: exp.period,
        description: exp.description,
        skills: exp.technologies,
      })
    } else if (
      exp.title.toLowerCase().includes("certification") ||
      exp.company.toLowerCase().includes("certiport") ||
      exp.company.toLowerCase().includes("certification")
    ) {
      // Extract certificate ID from description if available
      const certIdMatch = exp.description.match(/Certificate ID:\s*([^\s.]+)/i)
      certifications.push({
        title: exp.title,
        issuer: exp.company,
        date: exp.period,
        id: certIdMatch ? certIdMatch[1] : undefined,
        skills: exp.technologies,
      })
    }
  })

  // Skills mapping
  const skillsData = skills.map((skill) => ({
    name: skill.name,
    category: skill.category,
    level: skill.level,
  }))

  // Projects (from experiences that aren't education/certs)
  const projects = experiences
    .filter(
      (exp) =>
        !exp.company.toLowerCase().includes("university") &&
        !exp.company.toLowerCase().includes("certiport") &&
        !exp.title.toLowerCase().includes("certification")
    )
    .map((exp) => ({
      title: exp.title,
      description: exp.description,
      technologies: exp.technologies,
    }))

  // Blog posts
  const blog = mockBlogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    publishedAt: post.publishedAt.toISOString(),
  }))

  return {
    personal,
    education,
    certifications,
    skills: skillsData,
    projects,
    blog,
  }
}

export function buildPortfolioPrompt(): string {
  const context = getPortfolioContext()

  return `You are an AI assistant for ${context.personal.name}'s portfolio website. You can only answer questions about information in this portfolio. If asked about something not in the portfolio, politely say you don't have that information.

PORTFOLIO INFORMATION:

## Personal Info
- Name: ${context.personal.name}
- Title: ${context.personal.title}
- Location: ${context.personal.location}
- Email: ${context.personal.email}
- Phone: ${context.personal.phone}
- LinkedIn: ${context.personal.linkedin}
- About: ${context.personal.about}

## Education
${context.education.map((edu) => `- ${edu.title} at ${edu.institution} (${edu.period})\n  ${edu.description}\n  Skills: ${edu.skills.join(", ")}`).join("\n")}

## Certifications
${context.certifications.map((cert) => `- ${cert.title} from ${cert.issuer} (${cert.date})${cert.id ? `\n  Certificate ID: ${cert.id}` : ""}\n  Skills: ${cert.skills.join(", ")}`).join("\n")}

## Technical Skills
${context.skills.map((skill) => `- ${skill.name} (${skill.category}, proficiency: ${skill.level}%)`).join("\n")}

## Projects
${context.projects.map((proj) => `- ${proj.title}\n  ${proj.description}\n  Technologies: ${proj.technologies.join(", ")}`).join("\n")}

## Blog Posts
${context.blog.map((post) => `- ${post.title} (${post.category})\n  ${post.excerpt}`).join("\n")}

INSTRUCTIONS:
- Only answer based on the portfolio information above
- Be concise and helpful
- If asked about something not in the portfolio, say you don't have that information
- Keep responses under 200 words
- Be professional and friendly`
}
