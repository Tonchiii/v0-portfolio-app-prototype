import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { admin_users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // Get webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env')
  }

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  console.log(`Webhook event: ${eventType}`)

  try {
    if (eventType === 'user.created' || eventType === 'session.created') {
      // Type guard for user events
      if ('email_addresses' in evt.data) {
        const userId = evt.data.id as string
        const email = evt.data.email_addresses?.[0]?.email_address || ''
        const firstName = 'first_name' in evt.data ? evt.data.first_name : ''
        const lastName = 'last_name' in evt.data ? evt.data.last_name : ''
        const name = firstName || lastName 
          ? `${firstName || ''} ${lastName || ''}`.trim()
          : email.split('@')[0]

        console.log(`Processing user: ${email}`)

        // Check if user already exists in database
        const existingUser = await db
          .select()
          .from(admin_users)
          .where(eq(admin_users.email, email))
          .limit(1)

        if (existingUser.length === 0) {
          // Determine role (admin if specific email, otherwise user)
          const role = email === 'eltonramos417@gmail.com' ? 'admin' : 'user'
          const now = new Date().toISOString()

          // Insert new user into database
          await db.insert(admin_users).values({
            id: userId,
            name: name,
            email: email,
            role: role,
            status: 'active',
            mfa_enabled: 'disabled',
            login_count: '0',
            last_login: now,
            created_at: new Date(),
            updated_at: new Date(),
          })

          console.log(`✓ New user saved to database: ${email} (${role})`)
        } else {
          // Update last login time
          const now = new Date().toISOString()
          await db
            .update(admin_users)
            .set({
              last_login: now,
              login_count: String(parseInt(existingUser[0].login_count || '0') + 1),
              updated_at: new Date(),
            })
            .where(eq(admin_users.email, email))

          console.log(`✓ User login updated: ${email}`)
        }
      }
    } else if (eventType === 'user.updated') {
      // Update user information in database
      if ('email_addresses' in evt.data) {
        const email = evt.data.email_addresses?.[0]?.email_address || ''
        const firstName = 'first_name' in evt.data ? evt.data.first_name : ''
        const lastName = 'last_name' in evt.data ? evt.data.last_name : ''
        const name = firstName || lastName 
          ? `${firstName || ''} ${lastName || ''}`.trim()
          : email.split('@')[0]

        await db
          .update(admin_users)
          .set({
            name: name,
            updated_at: new Date(),
          })
          .where(eq(admin_users.email, email))

        console.log(`✓ User updated in database: ${email}`)
      }
    } else if (eventType === 'user.deleted') {
      // Remove user from database
      if ('id' in evt.data) {
        const userId = evt.data.id as string
        
        await db
          .delete(admin_users)
          .where(eq(admin_users.id, userId))

        console.log(`✓ User deleted from database: ${userId}`)
      }
    }

    return new Response('Webhook processed successfully', { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Error processing webhook', { status: 500 })
  }
}
