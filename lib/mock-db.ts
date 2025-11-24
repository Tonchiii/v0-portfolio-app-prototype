// Mock database for prototype - simulates Neon Postgres functionality
// In production, this would be replaced with actual database queries

export interface Subscriber {
  id: string
  email: string
  name?: string
  // Use ISO string for persistence and JSON transport
  subscribedAt: string
  status: "active" | "unsubscribed"
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: Date
  readTime: string
  category: string
  imageUrl: string
}

// In-memory list backed by a simple JSON file so subscriptions survive restarts in dev
import fs from "fs"
import path from "path"

const DATA_DIR = path.resolve(process.cwd(), "data")
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json")

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  } catch (e) {
    // ignore
  }
}

const initialSubscribers: Subscriber[] = [
  { id: "1", email: "john.doe@example.com", subscribedAt: new Date("2024-01-15").toISOString(), status: "active" },
  { id: "2", email: "jane.smith@example.com", subscribedAt: new Date("2024-02-20").toISOString(), status: "active" },
  { id: "3", email: "security.pro@example.com", subscribedAt: new Date("2024-03-10").toISOString(), status: "active" },
]

let mockSubscribers: Subscriber[] = []

// Load persisted subscribers if available
try {
  ensureDataDir()
  if (fs.existsSync(SUBSCRIBERS_FILE)) {
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8")
    mockSubscribers = JSON.parse(raw) as Subscriber[]
  } else {
    mockSubscribers = initialSubscribers
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(mockSubscribers, null, 2), "utf-8")
  }
} catch (err) {
  // Fallback to in-memory seeded list
  mockSubscribers = initialSubscribers
}

// Mock blog posts data
export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "GitHub Copilot: Revolutionizing AI-Powered Development",
    excerpt:
      "Exploring how GitHub Copilot is transforming the way developers write code with AI-powered suggestions, improving productivity and code quality across teams.",
    content: "Full blog content here...",
    author: "Elton James T. Ramos",
    publishedAt: new Date("2024-11-20"),
    readTime: "8 min read",
    category: "AI Development",
    imageUrl: "/ai-machine-learning-cybersecurity-threat-detection.jpg",
  },
  {
    id: "2",
    title: "Clerk Authentication: Modern User Management Made Simple",
    excerpt:
      "How Clerk is revolutionizing authentication and user management with seamless integration, built-in security features, and developer-friendly APIs.",
    content: "Full blog content here...",
    author: "Elton James T. Ramos",
    publishedAt: new Date("2024-11-15"),
    readTime: "6 min read",
    category: "Authentication",
    imageUrl: "/zero-trust-network-security-architecture.jpg",
  },
  {
    id: "3",
    title: "Arcjet Security: Advanced Protection for Modern Applications",
    excerpt:
      "Understanding how Arcjet provides real-time security protection with rate limiting, bot detection, and attack prevention for web applications.",
    content: "Full blog content here...",
    author: "Elton James T. Ramos",
    publishedAt: new Date("2024-11-05"),
    readTime: "7 min read",
    category: "Application Security",
    imageUrl: "/ransomware-prevention-cybersecurity-defense.jpg",
  },
  {
    id: "4",
    title: "Kali Linux: The Essential Toolkit for Penetration Testing",
    excerpt:
      "Deep dive into Kali Linux's powerful suite of security tools, from network scanning to vulnerability assessment and ethical hacking practices.",
    content: "Full blog content here...",
    author: "Elton James T. Ramos",
    publishedAt: new Date("2024-10-28"),
    readTime: "9 min read",
    category: "Penetration Testing",
    imageUrl: "/cloud-security-infrastructure-protection.jpg",
  },
]

// Mock database operations (Server-side only)
export async function getSubscribers(): Promise<Subscriber[]> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  // Return a shallow copy
  return [...mockSubscribers]
}

export async function addSubscriber(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  // Check if email already exists
  const existingIndex = mockSubscribers.findIndex((sub) => sub.email.toLowerCase() === email.toLowerCase())
  
  if (existingIndex !== -1) {
    const existingSubscriber = mockSubscribers[existingIndex]
    
    // If user unsubscribed, allow them to resubscribe
    if (existingSubscriber.status === "unsubscribed") {
      mockSubscribers[existingIndex] = {
        ...existingSubscriber,
        name: name,
        status: "active",
        subscribedAt: new Date().toISOString()
      }
      
      // Persist to disk (best-effort)
      try {
        ensureDataDir()
        fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(mockSubscribers, null, 2), "utf-8")
      } catch (e) {
        console.error("[v0] Failed to persist subscribers:", e)
      }
      
      console.log(`[v0] Subscriber reactivated: ${email}`)
      return { success: true, message: "Successfully resubscribed!" }
    }
    
    // Already an active subscriber - update name if provided
    if (name && name !== existingSubscriber.name) {
      mockSubscribers[existingIndex] = {
        ...existingSubscriber,
        name: name
      }
      
      // Persist to disk (best-effort)
      try {
        ensureDataDir()
        fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(mockSubscribers, null, 2), "utf-8")
      } catch (e) {
        console.error("[v0] Failed to persist subscribers:", e)
      }
      
      console.log(`[v0] Subscriber name updated: ${email}`)
      return { success: true, message: "Subscriber information updated!" }
    }
    
    return { success: false, message: "Email already subscribed" }
  }

  // Add new subscriber
  const newSubscriber: Subscriber = {
    id: String(mockSubscribers.length + 1),
    email,
    name: name,
    subscribedAt: new Date().toISOString(),
    status: "active",
  }

  mockSubscribers.push(newSubscriber)

  // Persist to disk (best-effort)
  try {
    ensureDataDir()
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(mockSubscribers, null, 2), "utf-8")
  } catch (e) {
    console.error("[v0] Failed to persist subscribers:", e)
  }

  console.log(`[v0] New subscriber added: ${email}`)
  return { success: true, message: "Successfully subscribed!" }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockBlogPosts
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockBlogPosts.find((post) => post.id === id) || null
}
