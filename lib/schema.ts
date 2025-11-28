import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// USERS TABLE
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// PROJECTS TABLE
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  cover_image: text("cover_image"),
  github_url: text("github_url"),
  live_url: text("live_url"),
  created_at: timestamp("created_at").defaultNow(),
});

// BLOG POSTS TABLE
export const blog_posts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  cover_image: text("cover_image"),
  author: text("author").notNull(),
  read_time: text("read_time"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// SUBSCRIBERS TABLE
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// ADMIN USERS TABLE
export const admin_users = pgTable("admin_users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(),
  last_login: text("last_login"),
  mfa_enabled: text("mfa_enabled").notNull(),
  login_count: text("login_count").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// AUDIT LOGS TABLE
export const audit_logs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp").notNull(),
  event: text("event").notNull(),
  user: text("user").notNull(),
  status: text("status").notNull(),
  ip: text("ip").notNull(),
  details: text("details").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// VULNERABILITIES TABLE
export const vulnerabilities = pgTable("vulnerabilities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  severity: text("severity").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(),
  discovered: text("discovered").notNull(),
  cve: text("cve"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// NETWORK ALERTS TABLE
export const network_alerts = pgTable("network_alerts", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp").notNull(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  source: text("source").notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// BLOCKED USERS TABLE
export const blocked_users = pgTable("blocked_users", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(),
  email: text("email").notNull(),
  blocked_by: text("blocked_by").notNull(),
  reason: text("reason"),
  created_at: timestamp("created_at").defaultNow(),
});

// ACCOUNT LOCKOUTS TABLE (for brute force protection)
export const account_lockouts = pgTable("account_lockouts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  failed_attempts: serial("failed_attempts").notNull().default(0),
  locked_until: timestamp("locked_until"),
  last_attempt: timestamp("last_attempt").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
