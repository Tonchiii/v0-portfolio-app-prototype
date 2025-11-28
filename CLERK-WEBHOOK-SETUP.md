# Clerk Webhook Setup Guide

This webhook automatically saves users to your database when they sign up or sign in through Clerk authentication.

## What It Does

- **user.created**: Saves new user to database immediately after signup
- **session.created**: Updates last login time and login count when user signs in
- **user.updated**: Updates user information when profile changes
- **user.deleted**: Removes user from database when account is deleted

## Setup Steps

### 1. Get Your Webhook Signing Secret

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Webhooks** in the left sidebar
4. Click **Add Endpoint**
5. Add your webhook URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - **Production**: `https://your-domain.vercel.app/api/webhooks/clerk`

6. Subscribe to these events:
   - ✅ `user.created`
   - ✅ `session.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`

7. Click **Create**
8. Copy the **Signing Secret** (starts with `whsec_`)

### 2. Add Secret to Environment Variables

#### Local Development (.env.local or .env)
```bash
CLERK_WEBHOOK_SECRET=whsec_your_signing_secret_here
```

#### Production (Vercel)
1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key**: `CLERK_WEBHOOK_SECRET`
   - **Value**: `whsec_your_signing_secret_here`
   - **Environment**: Production (and Preview if needed)
4. Redeploy your application

### 3. Testing Locally with ngrok

Since Clerk needs a public URL to send webhooks, use ngrok for local testing:

```bash
# Install ngrok (if not installed)
# Download from: https://ngrok.com/download

# Start your Next.js server
pnpm dev

# In a new terminal, start ngrok
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and add `/api/webhooks/clerk` to it in Clerk Dashboard.

### 4. Verify It's Working

#### Method 1: Check Console Logs
When a user signs up or signs in, you should see in your terminal:
```
Webhook event: user.created for user email@example.com
✓ New user saved to database: email@example.com (user)
```

#### Method 2: Check Database
Query your database to see if users are being saved:
```sql
SELECT * FROM admin_users ORDER BY created_at DESC LIMIT 10;
```

#### Method 3: Check Admin Dashboard
1. Go to `/admin` in your application
2. Navigate to the **User Management** tab
3. You should see newly signed-up users immediately

### 5. Testing the Webhook

#### Option 1: Test in Clerk Dashboard
1. Go to **Webhooks** in Clerk Dashboard
2. Click on your webhook endpoint
3. Click **Send Test Event**
4. Select event type (e.g., `user.created`)
5. Click **Send**
6. Check the **Recent Deliveries** section for status

#### Option 2: Create a Real Test User
1. Sign up with a new test account
2. Check your console logs
3. Check your database
4. Verify the user appears in your admin dashboard

## Troubleshooting

### Webhook Not Receiving Events

**Check if webhook URL is correct:**
- Development: Must be a public URL (use ngrok)
- Production: Should be your Vercel domain

**Verify environment variable:**
```bash
# Check if secret is set
echo $CLERK_WEBHOOK_SECRET
```

**Check Clerk Dashboard → Webhooks → Your Endpoint:**
- Look at "Recent Deliveries"
- Check for error messages
- Verify response status codes

### Database Not Saving Users

**Check console for errors:**
```
Error processing webhook: [error message]
```

**Verify database connection:**
- Check DATABASE_URL is set correctly
- Test database connection manually

**Check user data:**
- Verify email is not null
- Check for duplicate entries

### Webhook Returns 400 Error

**Common causes:**
1. **Missing svix headers**: Clerk is not sending proper headers
2. **Incorrect signing secret**: Check `CLERK_WEBHOOK_SECRET` matches Clerk Dashboard
3. **Body verification failed**: Ensure you're not modifying the request body

**Solution:**
- Double-check the signing secret from Clerk Dashboard
- Ensure you copied the full secret including `whsec_` prefix
- Verify environment variable is loaded (restart your server after adding)

## Security Best Practices

1. **Never commit webhook secret**: Add to `.gitignore`
2. **Use different secrets for dev/prod**: Create separate webhook endpoints
3. **Verify all webhook requests**: The code automatically verifies using svix
4. **Monitor webhook logs**: Check Clerk Dashboard regularly
5. **Rate limit webhook endpoint**: Already handled by middleware

## What Gets Saved

When a user signs up, the following information is saved to your `admin_users` table:

```typescript
{
  id: "user_abc123",           // Clerk user ID
  name: "John Doe",             // From Clerk profile
  email: "john@example.com",    // Primary email
  role: "user",                 // Default role (admin for specific email)
  status: "active",             // Active status
  mfa_enabled: "disabled",      // MFA status
  login_count: "1",             // Login counter
  last_login: "2025-11-28...",  // Timestamp
  created_at: "2025-11-28...",  // Creation timestamp
  updated_at: "2025-11-28..."   // Last update timestamp
}
```

## Admin Role Assignment

By default, users get the "user" role. To make someone an admin:

1. **Automatic**: If email is `eltonramos417@gmail.com`, they get "admin" role automatically
2. **Manual**: Edit the webhook code to add more admin emails
3. **Dashboard**: Change role in the admin dashboard after user signs up

---

**Need help?** Check the Clerk documentation: https://clerk.com/docs/integrations/webhooks
