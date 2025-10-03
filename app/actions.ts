"use server"

import { addSubscriber } from "@/lib/mock-db"

export async function subscribeToNewsletter(email: string) {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Please enter a valid email address" }
    }

    const result = await addSubscriber(email)
    return result
  } catch (error) {
    console.error("[v0] Newsletter subscription error:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }
}
