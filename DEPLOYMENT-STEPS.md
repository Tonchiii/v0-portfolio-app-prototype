# Week 8 Vercel Production Deployment Guide

**Student:** Elton James T. Ramos  
**Date:** November 25, 2025  
**Project:** OAuth MCP Roll-Dice Server

---

## Prerequisites Checklist

- [x] Vercel CLI installed (`npm install -g vercel`)
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub repository pushed
- [ ] All environment variables documented
- [ ] Clerk OAuth configured

---

## Step 1: Login to Vercel CLI

```powershell
vercel login
```

This will open your browser to authenticate. Choose your preferred method:
- GitHub
- GitLab
- Email

---

## Step 2: Prepare Environment Variables

You'll need these environment variables ready. Copy them from your `.env.local`:

### Required Variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Arcjet Security
ARCJET_KEY=ajkey_...

# Database (Optional - for audit logs)
DATABASE_URL=postgresql://...

# OAuth Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Get Your Values:

1. **Clerk Keys**: https://dashboard.clerk.com/apps → Your App → API Keys
2. **Arcjet Key**: https://app.arcjet.com/ → Your Project → Settings
3. **Database URL**: Your Neon/Vercel Postgres connection string

---

## Step 3: Initial Vercel Project Setup

```powershell
# Navigate to your project
cd C:\Users\ramos\v0-portfolio-app-prototype

# Initialize Vercel project (first time only)
vercel
```

**You'll be prompted:**

1. **"Set up and deploy?"** → YES
2. **"Which scope?"** → Select your account
3. **"Link to existing project?"** → NO (first time) or YES (if already exists)
4. **"What's your project's name?"** → `v0-portfolio-app` (or your choice)
5. **"In which directory is your code located?"** → `.` (current directory)
6. **"Want to override the settings?"** → NO (use detected Next.js settings)

This creates a **preview deployment** first.

---

## Step 4: Configure Environment Variables in Vercel Dashboard

### Option A: Via Dashboard (Recommended for sensitive values)

1. Go to: https://vercel.com/dashboard
2. Select your project: `v0-portfolio-app`
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Value**: `pk_test_...`
   - **Environments**: Check **Production**, **Preview**, **Development**
   - Click **Save**

Repeat for all variables listed in Step 2.

### Option B: Via CLI (faster for multiple variables)

```powershell
# Add production environment variables
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production
vercel env add ARCJET_KEY production
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_APP_URL production
```

You'll be prompted to paste each value.

---

## Step 5: Update Clerk OAuth Redirect URIs

### Get Your Production URL First

After your first deployment, Vercel assigns a URL like:
- `https://v0-portfolio-app-xyz123.vercel.app`
- OR custom domain: `https://yourdomain.com`

### Update Clerk Configuration

1. Go to: https://dashboard.clerk.com/apps
2. Select your app
3. Navigate to: **Configure** → **SSO Connections** → **GitHub**
4. Update **Authorized Redirect URIs**:

**Add Production URLs:**
```
https://v0-portfolio-app-xyz123.vercel.app/api/auth/callback
https://v0-portfolio-app-xyz123.vercel.app/sign-in
https://v0-portfolio-app-xyz123.vercel.app/sign-up
```

**Keep Development URLs:**
```
http://localhost:3000/api/auth/callback
http://localhost:3000/sign-in
http://localhost:3000/sign-up
```

5. **Save changes**

---

## Step 6: Deploy to Production

```powershell
# Deploy to production
vercel --prod
```

**What happens:**
1. Builds your Next.js app
2. Uploads to Vercel Edge Network
3. Runs production optimizations
4. Assigns production URL
5. Configures serverless functions

**Expected Output:**
```
🔍  Inspect: https://vercel.com/your-account/v0-portfolio-app/xyz123
✅  Production: https://v0-portfolio-app-xyz123.vercel.app [1s]
```

---

## Step 7: Verify Deployment

### Test OAuth Flow

1. Open production URL: `https://v0-portfolio-app-xyz123.vercel.app`
2. Click **Sign In**
3. Authenticate with GitHub
4. Verify redirect back to your app
5. Check user profile displays correctly

### Test MCP Endpoints

```powershell
# Get your production URL from Step 6
$PROD_URL = "https://v0-portfolio-app-xyz123.vercel.app"

# 1. Test server metadata (no auth required)
Invoke-WebRequest -Uri "$PROD_URL/api/mcp" -Method GET

# 2. Sign in via browser and get token from cookies
# Then test authenticated endpoints:

$TOKEN = "your-jwt-token-from-browser-devtools"

# Test roll-dice endpoint
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}
$body = @{
    sides = 20
    count = 2
} | ConvertTo-Json

Invoke-WebRequest -Uri "$PROD_URL/api/mcp/roll-dice" -Method POST -Headers $headers -Body $body
```

### Test Security Features

```powershell
# Test rate limiting (should get 429 after 10 requests)
1..12 | ForEach-Object {
    Write-Host "Request $_"
    Invoke-WebRequest -Uri "$PROD_URL/api/mcp/roll-dice" -Method POST -Headers $headers -Body $body
    Start-Sleep -Milliseconds 100
}
```

---

## Step 8: Test /mcp-security Documentation Page

Visit: `https://v0-portfolio-app-xyz123.vercel.app/mcp-security`

**Verify:**
- ✅ Architecture overview loads
- ✅ OAuth implementation details visible
- ✅ Arcjet configuration documented
- ✅ Incident response runbook present
- ✅ API endpoints documented
- ✅ Deployment information shows production URL

**Take screenshots of all 6 sections for your deliverable!**

---

## Step 9: Configure Vercel Firewall (Optional but Recommended)

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Firewall**
4. Enable **Attack Challenge Mode**:
   - Automatically challenges suspicious requests
   - Blocks known malicious IPs
   - DDoS protection

### Add Custom Rules (if needed):

**Block Specific Countries:**
```
Rule: Country Code
Condition: is NOT
Values: US, CA, GB, EU countries
Action: Deny
```

**Rate Limit by IP:**
```
Rule: IP Address
Condition: Request count
Threshold: 100 requests per minute
Action: Challenge or Deny
```

---

## Step 10: Monitor Your Deployment

### View Real-Time Logs

```powershell
# Stream production logs
vercel logs --follow
```

**Or via dashboard:**
1. https://vercel.com/dashboard → Your Project
2. Click **Logs** tab
3. Filter by **Production** environment

### Check Analytics

1. Dashboard → **Analytics**
2. View:
   - Request count
   - Response times
   - Error rates
   - Geographic distribution

### Monitor Arcjet

1. Go to: https://app.arcjet.com/
2. Select your project
3. View:
   - Rate limit hits
   - Bot detection events
   - Blocked requests

---

## Common Issues & Troubleshooting

### Issue 1: OAuth Redirect Fails

**Symptom:** "redirect_uri_mismatch" error

**Solution:**
1. Check Clerk redirect URIs match exactly (including https://)
2. Update `NEXT_PUBLIC_APP_URL` environment variable
3. Redeploy: `vercel --prod`

### Issue 2: Environment Variables Not Working

**Symptom:** 500 errors, missing configuration

**Solution:**
```powershell
# List all environment variables
vercel env ls

# Pull environment variables locally to verify
vercel env pull .env.production

# Check the file
Get-Content .env.production

# If missing, re-add via dashboard or CLI
```

### Issue 3: Build Fails

**Symptom:** Deployment fails during build

**Solution:**
```powershell
# Test build locally first
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# View detailed build logs
vercel logs --build
```

### Issue 4: Arcjet Blocking Legitimate Requests

**Symptom:** Users getting 403 or 429 errors

**Solution:**
1. Go to Arcjet dashboard
2. Review blocked requests
3. Adjust rate limits in `app/api/mcp/roll-dice/route.ts`:
```typescript
// Increase capacity if needed
capacity: 20, // was 10
refillRate: 20, // was 10
```
4. Redeploy: `vercel --prod`

---

## Rollback Process (If Needed)

### View Previous Deployments

```powershell
vercel ls
```

### Rollback to Previous Version

1. Dashboard → Your Project → **Deployments**
2. Find previous working deployment
3. Click **⋯** menu → **Promote to Production**

**Or via CLI:**
```powershell
# Promote specific deployment
vercel promote <deployment-url>
```

---

## Post-Deployment Checklist

- [ ] Production URL accessible
- [ ] OAuth flow works (GitHub sign-in)
- [ ] `/mcp-security` page loads correctly
- [ ] MCP endpoints respond with authentication
- [ ] Rate limiting triggers after 10 requests
- [ ] Audit logs recording events
- [ ] Environment variables all set
- [ ] Clerk redirect URIs updated
- [ ] Vercel Firewall enabled
- [ ] Screenshots taken for deliverable
- [ ] GitHub repository updated with production URL

---

## Your Production URLs

**Update these after deployment:**

- **Main App**: `https://v0-portfolio-app-xyz123.vercel.app`
- **MCP Security Docs**: `https://v0-portfolio-app-xyz123.vercel.app/mcp-security`
- **MCP API Base**: `https://v0-portfolio-app-xyz123.vercel.app/api/mcp`

---

## Next Steps After Deployment

1. **Take screenshots** of `/mcp-security` page (all 6 sections)
2. **Save to**: `ai-protector/evidence/week8/screenshots/`
3. **Update** `WEEK8-DELIVERABLE-SUMMARY.md` with production URL
4. **Push to GitHub**:
   ```powershell
   git add .
   git commit -m "Week 8: Add production deployment"
   git push origin main
   ```
5. **Submit deliverable** with:
   - Production URL
   - GitHub repo link
   - Screenshots
   - `WEEK8-DELIVERABLE-SUMMARY.md`

---

**Good luck with your deployment! 🚀**
