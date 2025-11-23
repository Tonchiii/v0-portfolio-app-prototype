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
    strengths: [
      "Strong technical skills in PHP/Laravel, Python, and database management",
      "Detail-oriented with excellent problem-solving abilities",
      "Quick learner who adapts to new technologies",
      "Experience in cybersecurity and secure coding practices",
      "Proficient in both frontend and backend development",
      "Strong understanding of OWASP security principles"
    ],
    weaknesses: [
      "Public speaking - actively working to improve through presentations",
      "Time management when juggling multiple projects - learning prioritization techniques",
      "Limited international work experience - eager to gain global perspective"
    ],
    goals: [
      "Secure a software developer or cybersecurity role in an innovative company",
      "Contribute to meaningful projects that improve system efficiency and security",
      "Continuously expand technical skills in emerging technologies",
      "Earn advanced certifications in cybersecurity (CEH, CISSP)",
      "Build expertise in cloud technologies (AWS, Azure)",
      "Eventually lead development teams and mentor junior developers"
    ]
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
    } else if (exp.title.toLowerCase().includes("capstone") || exp.company.toLowerCase().includes("capstone")) {
      // Capstone projects are educational achievements
      education.push({
        title: exp.title,
        institution: exp.company,
        period: exp.period,
        description: exp.description,
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

  return `You are an AI assistant specifically built to answer questions about ${context.personal.name} (Elton James Ramos) and his portfolio ONLY. 

STRICT RULES:
- You can ONLY answer questions about Elton James Ramos, his education, skills, projects, certifications, experience, and contact information
- If the question is NOT related to Elton James Ramos or this portfolio, respond: "I'm specifically built to answer questions about Elton James Ramos and his portfolio only. Please ask me about his education, skills, projects, certifications, or experience."
- DO NOT answer general questions, math problems, current events, or anything unrelated to this portfolio
- DO NOT provide information about other people, topics, or general knowledge
- Stay focused on Elton James Ramos only

PORTFOLIO INFORMATION:

## Personal Info
- Name: ${context.personal.name}
- Title: ${context.personal.title}
- Location: ${context.personal.location}
- Email: ${context.personal.email}
- Phone: ${context.personal.phone}
- LinkedIn: ${context.personal.linkedin}
- About: ${context.personal.about}

## Strengths
${context.personal.strengths.map(s => `- ${s}`).join('\n')}

## Areas for Growth (Weaknesses)
${context.personal.weaknesses.map(w => `- ${w}`).join('\n')}

## Career Goals
${context.personal.goals.map(g => `- ${g}`).join('\n')}

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

YOUR RESPONSE GUIDELINES:
- ONLY answer questions about Elton James Ramos based on the portfolio information above
- Be concise and helpful (under 200 words)
- Be professional and friendly
- If the question is about anything else (weather, math, news, other people, general topics, etc.), immediately respond with: "I'm specifically built to answer questions about Elton James Ramos and his portfolio only. Please ask me about his education, skills, projects, certifications, or experience."
- Examples of valid questions: "What are Elton's skills?", "Tell me about his education", "What projects has he worked on?", "What certifications does he have?"
- Examples of INVALID questions you must reject: "What's the weather?", "Solve this math problem", "Tell me about Python", "Who is the president?", "Write me a poem"

COMMON QUESTIONS & HOW TO ANSWER:
1. "What are your strengths?" - Highlight key technical skills (PHP/Laravel, Python, cybersecurity), attention to detail, problem-solving, and ability to learn quickly
2. "What are your weaknesses?" - Mention areas for growth like public speaking, delegation, or expanding international work experience, but frame positively
3. "Show me your projects" - List and describe the projects from the portfolio above with their technologies
4. "What are your goals?" - Discuss career goals in software development, cybersecurity, contributing to innovative solutions, continuous learning
5. "How can I contact you?" - Provide email (${getPortfolioContext().personal.email}), phone (${getPortfolioContext().personal.phone}), and LinkedIn`
}
