import { db } from "../lib/db"
import { sql } from "drizzle-orm"

async function initBlockedUsersTable() {
  try {
    console.log("Creating blocked_users table...")
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS blocked_users (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        blocked_by TEXT NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)
    
    console.log("✓ blocked_users table created successfully!")
  } catch (error) {
    console.error("Error creating table:", error)
  }
  
  process.exit(0)
}

initBlockedUsersTable()
