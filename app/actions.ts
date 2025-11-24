"use server"

import { addSubscriber } from "@/lib/mock-db"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { admin_users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function subscribeToNewsletter(email: string, name?: string) {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Please enter a valid email address" }
    }

    const result = await addSubscriber(email, name)
    
    // Check if user is logged in and update their role (regardless of subscription result)
    // This handles cases where email is already subscribed but role wasn't updated
    try {
      const user = await currentUser()
      if (user?.primaryEmailAddress?.emailAddress === email) {
        // Check if user exists in admin_users table
        const [existingUser] = await db
          .select()
          .from(admin_users)
          .where(eq(admin_users.email, email))
          .limit(1)
        
        if (existingUser) {
          // Only update if role is not already subscriber or admin
          if (existingUser.role !== 'subscriber' && existingUser.role !== 'admin') {
            await db
              .update(admin_users)
              .set({ 
                role: 'subscriber',
                updated_at: new Date()
              })
              .where(eq(admin_users.email, email))
            
            // If subscription failed because already subscribed, but we updated the role, change the message
            if (!result.success && result.message === "Email already subscribed") {
              return { success: true, message: "Your subscriber access has been activated!" }
            }
          }
        } else {
          // Create new admin_users entry with subscriber role
          await db.insert(admin_users).values({
            id: user.id,
            name: user.fullName || user.firstName || 'Subscriber',
            email: email,
            role: 'subscriber',
            status: 'active',
            last_login: new Date().toLocaleString(),
            mfa_enabled: 'false',
            login_count: '0',
            created_at: new Date(),
            updated_at: new Date()
          })
          
          // If subscription failed because already subscribed, but we created the user, change the message
          if (!result.success && result.message === "Email already subscribed") {
            return { success: true, message: "Your subscriber access has been activated!" }
          }
        }
      }
    } catch (dbError) {
      console.error("[v0] Failed to update user role:", dbError)
      // Don't fail the subscription if role update fails
    }
    
    return result
  } catch (error) {
    console.error("[v0] Newsletter subscription error:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }
}
