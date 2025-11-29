import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"

// Initialize database connection only if DATABASE_URL is provided
let dbInstance: ReturnType<typeof drizzle> | null = null

try {
  if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL)
    dbInstance = drizzle(sql)
  } else {
    console.warn('[DB] DATABASE_URL not set - database features will be disabled')
  }
} catch (error) {
  console.error('[DB] Failed to initialize database:', error)
}

// Helper to check if database is available
export function isDatabaseAvailable(): boolean {
  return dbInstance !== null
}

// Export db - will throw clear error if used without DATABASE_URL
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!dbInstance) {
      throw new Error('Database not initialized - DATABASE_URL environment variable is missing')
    }
    return (dbInstance as any)[prop]
  }
})
