# Clerk OAuth Setup Guide for Production

## Issue
Google OAuth connections fail in production with "does not comply with Google policies" error.

## Solution: Configure Clerk for Production

### Step 1: Add Your Production Domain to Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **"Configure" → "Domains"**
4. Click **"Add Domain"**
5. Enter your Vercel domain (e.g., `your-portfolio.vercel.app`)
6. Click **"Add"** and verify if needed

### Step 2: Configure OAuth Providers

1. In Clerk Dashboard, go to **"User & Authentication" → "Social Connections"**
2. For **Google**:
   - Toggle it **ON** if not already enabled
   - Click on **Google** to expand settings
   - Verify "Production" environment is selected
   - Click **"Save"** to update settings
   
3. For **GitHub**:
   - Toggle it **ON** if not already enabled
   - Click on **GitHub** to expand settings
   - Verify "Production" environment is selected
   - Click **"Save"** to update settings

### Step 3: Environment Variables in Vercel

Make sure these environment variables are set in Vercel:

1. Go to your Vercel project
2. Click **"Settings" → "Environment Variables"**
3. Add/verify these variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
4. Make sure they're enabled for **Production**, **Preview**, and **Development**

### Step 4: Redeploy

After making changes in Clerk:
1. Go to Vercel Dashboard
2. Click **"Deployments"**
3. Click **"Redeploy"** on your latest deployment
   - OR push a new commit to trigger automatic deployment

### Step 5: Test OAuth Connection

1. Visit your production site
2. Sign in to your account
3. Go to Security Center
4. Try connecting Google or GitHub
5. You should be redirected to the OAuth provider and back successfully

## Common Issues

### "Redirect URI Mismatch"
- **Cause**: Your production domain isn't registered with Clerk
- **Fix**: Follow Step 1 above

### "Access Blocked: This app's request is invalid"
- **Cause**: OAuth provider (Google/GitHub) doesn't recognize your redirect URL
- **Fix**: Clerk handles this automatically, but ensure you're using Clerk's built-in OAuth (not custom credentials)

### "Failed to connect account"
- **Cause**: Network issue or Clerk API error
- **Fix**: Check browser console for detailed error, verify API keys in Vercel

## Using Custom OAuth Credentials (Optional)

If you want to use your own Google OAuth credentials instead of Clerk's:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add these Authorized redirect URIs:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   https://clerk.your-domain.vercel.app/v1/oauth_callback
   ```
6. Copy Client ID and Client Secret
7. In Clerk Dashboard → Social Connections → Google → "Use custom credentials"
8. Paste your credentials and save

## Notes

- Clerk automatically handles OAuth callbacks
- No code changes needed once Clerk is configured
- Development (localhost) and Production use separate OAuth configurations
- GitHub OAuth works the same way as Google

## Support

If issues persist:
- Check Clerk Dashboard → "Logs" for detailed errors
- Visit [Clerk Documentation](https://clerk.com/docs)
- Contact Clerk Support through dashboard
