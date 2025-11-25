# Google Analytics 4 Setup Guide

**For:** v0 Portfolio App - Week 9 Integration  
**Student:** Elton James T. Ramos  
**Date:** November 25, 2025

---

## 📋 Overview

This guide walks you through setting up Google Analytics 4 for your security portfolio to track visitor analytics, user journeys, and engagement metrics.

---

## 🚀 Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account (eltonramos417@gmail.com)
3. Click **"Start measuring"** or **"Admin"** (gear icon)

---

## 🏢 Step 2: Create Account

1. **Account Name:** "Portfolio Security Analytics" (or your preference)
2. **Account Data Sharing Settings:**
   - ✅ Google products & services
   - ✅ Benchmarking
   - ✅ Technical support
   - ✅ Account specialists (optional)
3. Click **"Next"**

---

## 🏠 Step 3: Create Property

1. **Property Name:** "Elton Ramos Security Portfolio"
2. **Reporting Time Zone:** Philippines (GMT+08:00)
3. **Currency:** PHP (Philippine Peso) or USD
4. Click **"Next"**

---

## 🏭 Step 4: Business Information

1. **Industry Category:** "Computers & Electronics" or "Jobs & Education"
2. **Business Size:** "Small" (1-10 employees)
3. **How you plan to use Google Analytics:**
   - ✅ Examine user behavior
   - ✅ Measure advertising ROI (optional)
4. Click **"Create"**
5. Accept Terms of Service
6. Check email preferences (optional)
7. Click **"Accept"**

---

## 📱 Step 5: Set Up Data Stream (Web)

1. Platform: Select **"Web"**
2. **Website URL:** `https://v0-portfolio-app-prototype-weeklate.vercel.app`
3. **Stream Name:** "Security Portfolio Website"
4. **Enhanced Measurement:** Leave all toggles ON (recommended)
   - Page views
   - Scrolls
   - Outbound clicks
   - Site search
   - Video engagement
   - File downloads
5. Click **"Create stream"**

---

## 🔑 Step 6: Get Measurement ID

After creating the stream, you'll see:

```
MEASUREMENT ID
G-XXXXXXXXXX
```

**Example:** `G-AB12CD34EF`

**Important:** Copy this ID - you'll need it for the next step.

---

## ⚙️ Step 7: Configure Environment Variable

### For Local Development

1. Open your `.env.local` file (create if it doesn't exist)
2. Add the following line:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### For Vercel Production

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **"Add New"**
4. **Name:** `NEXT_PUBLIC_GA_ID`
5. **Value:** `G-XXXXXXXXXX` (your Measurement ID)
6. **Environment:** Select **Production**, **Preview**, and **Development**
7. Click **"Save"**

---

## 🔄 Step 8: Redeploy Application

### For Vercel
1. Go to your Vercel project dashboard
2. Click **"Deployments"** tab
3. Find your latest deployment
4. Click **"···"** (three dots) → **"Redeploy"**
5. Check **"Use existing Build Cache"** (optional, faster)
6. Click **"Redeploy"**

### For Local Testing
```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

---

## ✅ Step 9: Verify Installation

### Method 1: Google Analytics Real-Time Report
1. In Google Analytics, go to **Reports** → **Real-time**
2. Open your portfolio website: `https://v0-portfolio-app-prototype-weeklate.vercel.app`
3. Navigate through pages (Security Portfolio, MCP Demo, etc.)
4. You should see:
   - Active users: 1 (or more)
   - Event count increasing
   - Page views being tracked

### Method 2: Browser Developer Tools
1. Open your portfolio website
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. You should see no errors related to gtag
5. Go to **Network** tab
6. Filter by "analytics"
7. You should see requests to `www.google-analytics.com`

### Method 3: Google Tag Assistant (Chrome Extension)
1. Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Open your portfolio website
3. Click the Tag Assistant icon
4. Click **"Enable"**
5. Refresh the page
6. You should see:
   - Google Analytics: GA4 tag found
   - Tag ID: G-XXXXXXXXXX
   - Status: ✅ Working

---

## 📊 Step 10: Configure Analytics Dashboard

### Create Custom Dashboard

1. In Google Analytics, go to **Explore** → **Blank**
2. Name: "Security Portfolio Dashboard"
3. Add segments:
   - **All Users**
   - **New Users**
   - **Returning Users**
4. Add dimensions:
   - **Page path and screen class** (shows which pages are visited)
   - **Country** (visitor locations)
   - **Device category** (mobile, desktop, tablet)
5. Add metrics:
   - **Sessions** (total visits)
   - **Users** (unique visitors)
   - **Engagement rate** (how engaged users are)
   - **Average session duration**
6. Save dashboard

### Set Up Conversions (Optional)

Track important actions:

1. Go to **Admin** → **Events** → **Create event**
2. **Event Name:** `mcp_demo_used`
3. **Matching conditions:**
   - Parameter: `page_location`
   - Operator: `contains`
   - Value: `/mcp-integration`
4. Create event

Repeat for other key events:
- `security_portfolio_viewed` (page_location contains `/portfolio-security`)
- `case_study_read` (page_location contains `/case-studies`)
- `resume_downloaded` (event_name equals `file_download`)

---

## 🎯 Step 11: Track Custom Events (Optional)

### Add Custom Event Tracking

You can track specific interactions by adding event code to your components.

**Example: Track MCP Dice Roll**

Edit `app/mcp-integration/page.tsx`:

```typescript
const handleRollDice = async (sides: number = 6, count: number = 2) => {
  // ... existing code ...
  
  // Track event in Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'mcp_dice_rolled', {
      dice_sides: sides,
      dice_count: count,
      user_authenticated: isSignedIn
    })
  }
  
  // ... rest of function ...
}
```

**Example: Track Report Downloads**

```typescript
const handleDownloadReport = (reportType: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'report_downloaded', {
      report_type: reportType
    })
  }
  
  // Trigger download
  window.open(`/api/reports/${reportType}`, '_blank')
}
```

---

## 📈 Step 12: Monitor Performance

### Key Metrics to Track

1. **Traffic Overview:**
   - Daily/weekly/monthly visitors
   - Page views per session
   - Bounce rate
   - Average session duration

2. **User Behavior:**
   - Most viewed pages (expect `/portfolio-security`, `/mcp-integration`)
   - User flow (how visitors navigate)
   - Exit pages

3. **Acquisition:**
   - Traffic sources (organic, direct, referral)
   - Geographic distribution
   - Device breakdown (mobile vs desktop)

4. **Engagement:**
   - MCP demo usage (if custom events configured)
   - Case study reads
   - Report downloads
   - Time on security pages

### Set Up Alerts (Optional)

1. Go to **Admin** → **Custom Alerts**
2. Create alert for unusual traffic:
   - **Alert Name:** "Traffic Spike"
   - **Period:** Day
   - **Metric:** Sessions
   - **Condition:** Increases by more than 500%
   - **Send To:** Your email
3. Save alert

---

## 🔍 Troubleshooting

### Problem: No Data Appearing in Real-Time Report

**Solutions:**
1. **Check Measurement ID:**
   - Verify `NEXT_PUBLIC_GA_ID` in Vercel environment variables
   - Ensure ID format is `G-XXXXXXXXXX` (not `UA-XXXXXXXXX`)

2. **Check Browser:**
   - Disable ad blockers (they block analytics)
   - Check browser console for errors
   - Try incognito mode

3. **Check Deployment:**
   - Ensure you redeployed after adding environment variable
   - Check Vercel build logs for errors
   - Verify environment variable is set to "Production"

### Problem: Analytics Not Loading

**Solutions:**
1. **Check Component:**
   - Verify `<GoogleAnalytics />` is in `app/layout.tsx`
   - Check for syntax errors in `components/google-analytics.tsx`

2. **Check Script Loading:**
   - Open Network tab in DevTools
   - Look for `gtag/js?id=G-XXXXXXXXXX` request
   - Should return 200 status code

3. **Check CORS:**
   - Ensure no CSP (Content Security Policy) blocking `googletagmanager.com`
   - Check for any firewall/proxy blocking analytics

### Problem: Events Not Tracking

**Solutions:**
1. **Debug Mode:**
   - Add `&debug_mode=1` to URL: `https://your-site.com?debug_mode=1`
   - Open DevTools Console
   - You'll see detailed gtag debug messages

2. **Check Event Configuration:**
   - Go to **Admin** → **Data display** → **DebugView**
   - Trigger events on your site
   - Watch for events appearing in DebugView

---

## 📝 Best Practices

1. **Respect User Privacy:**
   - Consider adding a cookie consent banner
   - Provide analytics opt-out mechanism
   - Follow GDPR/CCPA guidelines if applicable

2. **Data Retention:**
   - Go to **Admin** → **Data Settings** → **Data Retention**
   - Set to **14 months** (maximum for free tier)

3. **Filter Internal Traffic:**
   - Go to **Admin** → **Data Filters** → **Create filter**
   - Filter out your own IP address
   - Ensures accurate visitor metrics

4. **Regular Monitoring:**
   - Check analytics weekly
   - Review most popular pages
   - Identify drop-off points
   - Optimize based on data

---

## 🎓 Learning Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Google Tag Manager (Advanced)](https://tagmanager.google.com/)

---

## ✅ Completion Checklist

- [ ] Created Google Analytics account
- [ ] Set up GA4 property
- [ ] Configured web data stream
- [ ] Copied Measurement ID
- [ ] Added `NEXT_PUBLIC_GA_ID` to Vercel environment variables
- [ ] Redeployed application
- [ ] Verified installation via Real-Time report
- [ ] Tested on multiple pages
- [ ] Configured custom dashboard (optional)
- [ ] Set up conversions (optional)
- [ ] Enabled DebugView for testing

---

**Setup by:** Elton James T. Ramos  
**Date:** November 25, 2025  
**Course:** AI Protector - Week 9 Integration

For questions or issues, refer to the troubleshooting section or contact support.
