// Brute force protection utilities
import { db } from "@/lib/db"
import { account_lockouts } from "@/lib/schema"
import { eq } from "drizzle-orm"

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const PROGRESSIVE_DELAY_BASE = 1000 // 1 second

export interface LockoutStatus {
  isLocked: boolean
  attemptsRemaining: number
  lockedUntil?: Date
  requiresDelay: number // milliseconds to wait
}

/**
 * Check if an account is locked and return status
 */
export async function checkAccountLockout(email: string): Promise<LockoutStatus> {
  try {
    const [lockout] = await db
      .select()
      .from(account_lockouts)
      .where(eq(account_lockouts.email, email))
      .limit(1)

    if (!lockout) {
      return {
        isLocked: false,
        attemptsRemaining: MAX_FAILED_ATTEMPTS,
        requiresDelay: 0,
      }
    }

    const now = new Date()

    // Check if account is currently locked
    if (lockout.locked_until && lockout.locked_until > now) {
      return {
        isLocked: true,
        attemptsRemaining: 0,
        lockedUntil: lockout.locked_until,
        requiresDelay: 0,
      }
    }

    // If lockout expired, reset attempts
    if (lockout.locked_until && lockout.locked_until <= now) {
      await db
        .update(account_lockouts)
        .set({
          failed_attempts: 0,
          locked_until: null,
          updated_at: now,
        })
        .where(eq(account_lockouts.email, email))

      return {
        isLocked: false,
        attemptsRemaining: MAX_FAILED_ATTEMPTS,
        requiresDelay: 0,
      }
    }

    // Calculate progressive delay (exponential backoff)
    const delay = Math.min(
      PROGRESSIVE_DELAY_BASE * Math.pow(2, lockout.failed_attempts || 0),
      30000 // Max 30 seconds
    )

    return {
      isLocked: false,
      attemptsRemaining: MAX_FAILED_ATTEMPTS - (lockout.failed_attempts || 0),
      requiresDelay: delay,
    }
  } catch (error) {
    console.error("Error checking account lockout:", error)
    // Fail open - don't block login if database error
    return {
      isLocked: false,
      attemptsRemaining: MAX_FAILED_ATTEMPTS,
      requiresDelay: 0,
    }
  }
}

/**
 * Record a failed login attempt
 */
export async function recordFailedAttempt(email: string): Promise<void> {
  try {
    const [existing] = await db
      .select()
      .from(account_lockouts)
      .where(eq(account_lockouts.email, email))
      .limit(1)

    const now = new Date()

    if (!existing) {
      // First failed attempt
      await db.insert(account_lockouts).values({
        email,
        failed_attempts: 1,
        last_attempt: now,
        updated_at: now,
      })
    } else {
      const newAttemptCount = (existing.failed_attempts || 0) + 1

      // Lock account if max attempts reached
      if (newAttemptCount >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS)

        await db
          .update(account_lockouts)
          .set({
            failed_attempts: newAttemptCount,
            locked_until: lockedUntil,
            last_attempt: now,
            updated_at: now,
          })
          .where(eq(account_lockouts.email, email))

        console.warn(`Account locked due to brute force: ${email}`)
      } else {
        await db
          .update(account_lockouts)
          .set({
            failed_attempts: newAttemptCount,
            last_attempt: now,
            updated_at: now,
          })
          .where(eq(account_lockouts.email, email))
      }
    }
  } catch (error) {
    console.error("Error recording failed attempt:", error)
  }
}

/**
 * Reset failed attempts after successful login
 */
export async function resetFailedAttempts(email: string): Promise<void> {
  try {
    await db
      .update(account_lockouts)
      .set({
        failed_attempts: 0,
        locked_until: null,
        updated_at: new Date(),
      })
      .where(eq(account_lockouts.email, email))
  } catch (error) {
    console.error("Error resetting failed attempts:", error)
  }
}

/**
 * Manually unlock an account (admin function)
 */
export async function unlockAccount(email: string): Promise<void> {
  try {
    await db
      .update(account_lockouts)
      .set({
        failed_attempts: 0,
        locked_until: null,
        updated_at: new Date(),
      })
      .where(eq(account_lockouts.email, email))

    console.log(`Account manually unlocked: ${email}`)
  } catch (error) {
    console.error("Error unlocking account:", error)
    throw error
  }
}

/**
 * Get all locked accounts (admin function)
 */
export async function getLockedAccounts() {
  try {
    const now = new Date()
    const locked = await db
      .select()
      .from(account_lockouts)
      .where(eq(account_lockouts.locked_until, now)) // locked_until > now

    return locked
  } catch (error) {
    console.error("Error getting locked accounts:", error)
    return []
  }
}
