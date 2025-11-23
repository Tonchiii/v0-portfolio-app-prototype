export interface Experience {
  title: string
  company: string
  period: string
  description: string
  technologies: string[]
  image?: string
  link?: string
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
    title: "Dental Clinic Appointment Management System with Decision Support",
    company: "St. Paul University Philippines - Capstone Project",
    period: "2024-2025",
    description:
      "Published capstone project in The Light Explorer journal. Developed a comprehensive appointment management system with decision support for dental clinics, featuring real-time booking, automated reminders, centralized patient records, and urgency-based scheduling. Evaluated by IT experts and achieved 'Very Great Extent' compliance with ISO/IEC 25010 software quality standards. Co-authored with Erika Kaye Bancud, Sheena Gumarang, and Marifel Grace C. Kummer.",
    technologies: ["Health Informatics", "Decision Support Systems", "Database Management", "ISO/IEC 25010", "Patient Management", "Scheduling Algorithms"],
    link: "https://www.thelight-explorer.com/dental-clinic-appointment-management-system/",
  },
  {
    title: "CyberSummit 2022",
    company: "St. Paul University Philippines",
    period: "2022",
    description:
      "Participated in CyberSummit 2022, a cybersecurity conference focused on emerging threats, security best practices, and ethical hacking techniques.",
    technologies: ["Cybersecurity", "Ethical Hacking", "Security Best Practices", "Threat Analysis"],
  },
  {
    title: "CyberSummit 2023",
    company: "St. Paul University Philippines",
    period: "2023",
    description:
      "Participated in CyberSummit 2023, advancing knowledge in network security, penetration testing, and modern cybersecurity frameworks.",
    technologies: ["Network Security", "Penetration Testing", "Security Frameworks", "Threat Detection"],
  },
  {
    title: "CyberSummit 2024",
    company: "St. Paul University Philippines",
    period: "2024",
    description:
      "Participated in CyberSummit 2024, focusing on advanced threat intelligence, cloud security, and incident response strategies.",
    technologies: ["Cloud Security", "Threat Intelligence", "Incident Response", "Security Operations"],
  },
  {
    title: "HackTheNorth Seminar 2025",
    company: "St. Paul University Philippines",
    period: "2025",
    description:
      "Participated in HackTheNorth Seminar 2025, exploring cutting-edge hacking techniques, vulnerability assessment, and defensive security measures.",
    technologies: ["Vulnerability Assessment", "Defensive Security", "Hacking Techniques", "Security Tools"],
  },
  {
    title: "Rich Media Film Showing - Top 4",
    company: "St. Paul University Philippines",
    period: "2024",
    description:
      "Achieved Top 4 in Rich Media Film Showing competition, demonstrating creativity and technical skills in multimedia production.",
    technologies: ["Video Production", "Multimedia", "Storytelling", "Creative Design"],
  },
  {
    title: "HTML & CSS Certification (Information Technology Specialist)",
    company: "Certiport / Pearson VUE",
    period: "November 6, 2025",
    description:
      "Passed the HTML and CSS certification (Information Technology Specialist). Certificate awarded November 6, 2025. Certificate ID: c69Y-uSrs.",
    technologies: ["HTML", "CSS", "Responsive Design", "Flexbox", "Grid"],
    image: "/certificates/html-css-cert.png",
  },
]

export const skills: Skill[] = [
  { name: "Laravel / PHP", category: "tools", level: 85 },
  { name: "Python", category: "tools", level: 75 },
  { name: "Database Management", category: "tools", level: 80 },
  { name: "Software Development", category: "security", level: 78 },
  { name: "Cyber Security", category: "security", level: 72 },
  { name: "System Solutions", category: "cloud", level: 70 },
  { name: "HTML", category: "tools", level: 100 },
  { name: "CSS", category: "tools", level: 100 },
]
