// Example: How to use brute force protection in your sign-in API route
// Add this to your authentication endpoint

import { checkAccountLockout, recordFailedAttempt, resetFailedAttempts } from "@/lib/brute-force-protection"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Step 1: Check if account is locked
  const lockoutStatus = await checkAccountLockout(email)

  if (lockoutStatus.isLocked) {
    return NextResponse.json(
      {
        error: "Account temporarily locked due to too many failed attempts",
        lockedUntil: lockoutStatus.lockedUntil,
        message: `Please try again after ${lockoutStatus.lockedUntil?.toLocaleString()}`,
      },
      { status: 429 }
    )
  }

  // Step 2: Apply progressive delay if needed
  if (lockoutStatus.requiresDelay > 0) {
    await new Promise(resolve => setTimeout(resolve, lockoutStatus.requiresDelay))
  }

  // Step 3: Attempt authentication (your existing Clerk logic)
  try {
    // Your Clerk authentication here
    // const session = await signIn(email, password)

    // If successful, reset failed attempts
    await resetFailedAttempts(email)

    return NextResponse.json({ success: true })
  } catch (error) {
    // If authentication fails, record the failed attempt
    await recordFailedAttempt(email)

    // Get updated status
    const updatedStatus = await checkAccountLockout(email)

    return NextResponse.json(
      {
        error: "Invalid credentials",
        attemptsRemaining: updatedStatus.attemptsRemaining,
        ...(updatedStatus.attemptsRemaining <= 2 && {
          warning: `${updatedStatus.attemptsRemaining} attempts remaining before lockout`,
        }),
      },
      { status: 401 }
    )
  }
}
