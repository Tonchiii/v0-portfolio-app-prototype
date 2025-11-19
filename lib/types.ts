export interface Experience {
  title: string
  company: string
  period: string
  description: string
  technologies: string[]
}

export interface Skill {
  name: string
  category: "security" | "tools" | "compliance" | "cloud"
  level: number
}

export const experiences: Experience[] = [
  {
    title: "BSIT",
    company: "St. Paul University Philippines",
    period: "Current Student",
    description:
      "Pursuing degree in Information Technology with focus on software development, cyber security, and database management. Building strong foundation in modern development practices and system architecture.",
    technologies: ["Laravel", "PHP", "Python", "Database Management", "Software Development", "Cyber Security"],
  },
  {
    title: "HTML & CSS Certification",
    company: "Certification Exam",
    period: "2025",
    description:
      "Passed an HTML and CSS certification exam demonstrating proficiency in semantic HTML5, responsive CSS layouts, Flexbox, and Grid.",
    technologies: ["HTML", "CSS", "Responsive Design", "Flexbox", "Grid"],
  },
]

export const skills: Skill[] = [
  { name: "Laravel / PHP", category: "tools", level: 85 },
  { name: "Python", category: "tools", level: 75 },
  { name: "Database Management", category: "tools", level: 80 },
  { name: "Software Development", category: "security", level: 78 },
  { name: "Cyber Security", category: "security", level: 72 },
  { name: "System Solutions", category: "cloud", level: 70 },
]
