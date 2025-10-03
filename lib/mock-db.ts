// Mock database for prototype - simulates Neon Postgres functionality
// In production, this would be replaced with actual database queries

export interface Subscriber {
  id: string
  email: string
  subscribedAt: Date
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

// Mock subscribers data
const mockSubscribers: Subscriber[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    subscribedAt: new Date("2024-01-15"),
    status: "active",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    subscribedAt: new Date("2024-02-20"),
    status: "active",
  },
  {
    id: "3",
    email: "security.pro@example.com",
    subscribedAt: new Date("2024-03-10"),
    status: "active",
  },
]

// Mock blog posts data
export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Zero Trust Architecture: The Future of Network Security",
    excerpt:
      "Exploring how Zero Trust principles are reshaping enterprise security strategies and why traditional perimeter-based security is no longer sufficient.",
    content: "Full blog content here...",
    author: "Security Specialist",
    publishedAt: new Date("2024-03-15"),
    readTime: "8 min read",
    category: "Network Security",
    imageUrl: "/zero-trust-network-security-architecture.jpg",
  },
  {
    id: "2",
    title: "Advanced Threat Detection with AI and Machine Learning",
    excerpt:
      "How artificial intelligence is revolutionizing threat detection and response times in modern security operations centers.",
    content: "Full blog content here...",
    author: "Security Specialist",
    publishedAt: new Date("2024-03-08"),
    readTime: "6 min read",
    category: "AI Security",
    imageUrl: "/ai-machine-learning-cybersecurity-threat-detection.jpg",
  },
  {
    id: "3",
    title: "Securing Cloud Infrastructure: Best Practices for 2024",
    excerpt:
      "A comprehensive guide to implementing robust security measures in cloud environments, from IAM to encryption strategies.",
    content: "Full blog content here...",
    author: "Security Specialist",
    publishedAt: new Date("2024-02-28"),
    readTime: "10 min read",
    category: "Cloud Security",
    imageUrl: "/cloud-security-infrastructure-protection.jpg",
  },
  {
    id: "4",
    title: "The Rise of Ransomware: Prevention and Response Strategies",
    excerpt:
      "Understanding the evolving ransomware landscape and implementing effective defense mechanisms to protect your organization.",
    content: "Full blog content here...",
    author: "Security Specialist",
    publishedAt: new Date("2024-02-15"),
    readTime: "7 min read",
    category: "Threat Intelligence",
    imageUrl: "/ransomware-prevention-cybersecurity-defense.jpg",
  },
]

// Mock database operations (Server-side only)
export async function getSubscribers(): Promise<Subscriber[]> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockSubscribers
}

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Check if email already exists
  const exists = mockSubscribers.some((sub) => sub.email === email)
  if (exists) {
    return { success: false, message: "Email already subscribed" }
  }

  // Add new subscriber
  const newSubscriber: Subscriber = {
    id: String(mockSubscribers.length + 1),
    email,
    subscribedAt: new Date(),
    status: "active",
  }

  mockSubscribers.push(newSubscriber)
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
