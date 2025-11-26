# Portfolio Functionality Test Guide

**Date:** November 26, 2025  
**Testing:** All 5 key deliverable features

---

## 🎯 **Pre-Test Checklist**

- [x] Development server running on `http://localhost:3000`
- [x] `.env` file contains all required keys
- [ ] Google Analytics Measurement ID added (NEXT_PUBLIC_GA_ID)
- [x] Clerk OAuth configured
- [x] Browser ready (Chrome/Edge recommended)

---

## 🧪 **Test 1: Security Center Page (`/security`)**

### **Steps:**
1. Open browser: `http://localhost:3000`
2. Click **"Sign In"** in top navigation
3. Complete GitHub OAuth flow via Clerk
4. Navigate to: `http://localhost:3000/security`

### **What to Verify:**
- ✅ **Account Overview Card** shows your email
- ✅ **Phone Number Section** allows adding/removing phone
- ✅ **Password & Credentials** has "Change Password" button
- ✅ **2FA Toggle** with Enable/Disable functionality
- ✅ **Active Sessions** shows current device
- ✅ **Connected Accounts** displays GitHub (connected) and Google (not connected)

### **Expected Behavior:**
- All sections render without errors
- OAuth connection status reflects actual state
- 2FA toggle updates in real-time
- Sessions persist in localStorage

### **Screenshot Locations:**
- Full page view (signed in)
- OAuth Connected Accounts section
- 2FA toggle with status badge

---

## 🧪 **Test 2: MCP Integration Demo (`/mcp-integration`)**

### **Steps:**
1. Navigate to: `http://localhost:3000/mcp-integration`
2. Ensure you're signed in (if not, click "Sign In to Continue")
3. Click **"Roll 2d6"** button
4. Click **"Roll 1d20"** button
5. Click **"Roll 4d6"** button

### **What to Verify:**
- ✅ **Hero Section** displays with 3 security badges
- ✅ **Authentication Required** message if not signed in
- ✅ **Roll Dice Tool** executes and shows results
- ✅ **Audit Trail** populates with each roll
- ✅ **OAuth Flow Visualization** shows 9 numbered steps
- ✅ **Security Controls** section displays 3 cards
- ✅ **API Documentation** shows cURL example

### **Expected Behavior:**
- Dice rolls return random results
- Total is calculated correctly
- Audit logs update in real-time
- No errors in browser console

### **Test API Directly:**
```bash
# Get your token from browser DevTools > Application > Cookies
# Look for "__session" cookie value

curl -X POST http://localhost:3000/api/mcp/roll-dice \
  -H "Content-Type: application/json" \
  -b "__session=YOUR_CLERK_SESSION_COOKIE" \
  -d '{"sides": 6, "count": 2}'
```

### **Screenshot Locations:**
- Hero section with badges
- Authenticated dice roller with results
- Audit trail with multiple logs
- OAuth flow diagram (full 9 steps)
- Security controls cards

---

## 🧪 **Test 3: Case Study Page (`/case-studies/oauth-mcp`)**

### **Steps:**
1. Navigate to: `http://localhost:3000/case-studies/oauth-mcp`
2. Scroll through entire page

### **What to Verify:**
- ✅ **Executive Summary** with 3 metric cards
- ✅ **Related LMS Modules** section lists 4 modules
- ✅ **Technical Implementation** details architecture
- ✅ **Security Controls** shows 12 implemented features
- ✅ **Results & Metrics** displays 4 performance cards
- ✅ **Lessons Learned** sections present
- ✅ **Action Buttons** link to demo, docs, GitHub

### **Expected Behavior:**
- All sections render properly
- Links work (test "Try Live Demo" → goes to `/mcp-integration`)
- No broken images or missing content

### **Screenshot Locations:**
- Executive summary metrics
- LMS modules section (all 4 modules visible)
- Security controls grid
- Results & metrics cards

---

## 🧪 **Test 4: Executive Dashboard & Reports**

### **A. Dashboard Metrics**

**Steps:**
1. Navigate to: `http://localhost:3000/portfolio-security`
2. Scroll to "Executive Security Dashboard" section

**What to Verify:**
- ✅ **WAF Protection Card** shows metrics
- ✅ **Authentication Card** displays stats
- ✅ **MCP Server Card** shows performance data

**Screenshot:** Full metrics grid (3 cards)

---

### **B. Report Downloads**

**Test Each Report Endpoint:**

1. **Executive Briefing:**
   ```
   http://localhost:3000/api/reports/executive-briefing
   ```
   - Should download: `Executive-Security-Briefing-YYYY-MM-DD.txt`
   - Contains: Full executive summary (scroll through file)

2. **Security Metrics:**
   ```
   http://localhost:3000/api/reports/security-metrics
   ```
   - Should download: `Security-Metrics-Report-YYYY-MM-DD.txt`
   - Contains: WAF, Auth, MCP metrics

3. **Penetration Testing:**
   ```
   http://localhost:3000/api/reports/pentesting
   ```
   - Should download: `Penetration-Testing-Report-YYYY-MM-DD.txt`
   - Contains: Test results and findings

4. **Compliance:**
   ```
   http://localhost:3000/api/reports/compliance
   ```
   - Should download: `Compliance-Report-YYYY-MM-DD.txt`
   - Contains: OWASP, GDPR status

**Expected Behavior:**
- Each URL triggers file download
- Files are readable text format
- Content is properly formatted
- No authentication errors

**Screenshot:** Download folder showing all 4 report files

---

## 🧪 **Test 5: Google Analytics & SEO**

### **A. Google Analytics**

**Prerequisites:**
1. Add your GA4 Measurement ID to `.env`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
2. Restart dev server: `npm run dev`

**Steps:**
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by: `gtag`
4. Navigate to: `http://localhost:3000`

**What to Verify:**
- ✅ Request to `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
- ✅ Status: 200 OK
- ✅ No errors in Console tab

**Test Events:**
- Navigate between pages
- Roll dice on `/mcp-integration`
- Check Network tab for `collect?v=2` requests (GA4 events)

**Screenshot Locations:**
- DevTools Network tab showing gtag.js request
- Browser Console showing no GA errors

---

### **B. SEO Metadata**

**Steps:**
1. Navigate to: `http://localhost:3000`
2. Right-click → **View Page Source** (or Ctrl+U)
3. Search for: `<meta`, `og:`, `twitter:`, `application/ld+json`

**What to Verify:**
- ✅ `<meta name="description">` present
- ✅ `<meta name="keywords">` includes: OAuth MCP, security engineer
- ✅ Open Graph tags: `og:title`, `og:description`, `og:url`
- ✅ Twitter Card tags: `twitter:card`, `twitter:title`
- ✅ Structured Data: JSON-LD with Person schema

**Expected Content:**
```html
<meta name="keywords" content="security engineer, OAuth MCP, penetration testing, AI Protector...">
<meta property="og:title" content="Elton James T. Ramos | Security Engineer...">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Elton James T. Ramos",
  ...
}
</script>
```

**Screenshot Locations:**
- View Source showing meta tags
- View Source showing JSON-LD structured data

---

## 🧪 **Test 6: Admin Dashboard (Bonus)**

### **Steps:**
1. Navigate to: `http://localhost:3000/admin`
2. Sign in if prompted

### **What to Verify:**
- ✅ Access granted (your email is authorized)
- ✅ Security metrics cards visible
- ✅ Audit log section present
- ✅ **Export** button available

**Expected Behavior:**
- If not admin: Redirected or access denied
- If admin: Full dashboard access
- Export logs downloads JSON file

**Screenshot:** Full admin dashboard view

---

## 🎬 **Video Recording Suggestion**

For the "Demo Video Placeholder" at `/portfolio-security`, record:

1. **Intro (5s):** Portfolio homepage
2. **Sign In Flow (10s):** Click Sign In → GitHub OAuth → Success
3. **MCP Demo (20s):** Navigate to `/mcp-integration` → Roll dice → Show results + audit logs
4. **OAuth Flow (10s):** Scroll through 9-step diagram
5. **Reports (10s):** Click report download → Open file
6. **Outro (5s):** Back to homepage

**Tools:** OBS Studio, Windows Game Bar (Win+G), or Loom

---

## 📝 **Test Results Checklist**

After completing all tests, verify:

- [ ] All pages load without errors
- [ ] OAuth authentication works
- [ ] MCP dice roller executes successfully
- [ ] Audit logs populate
- [ ] 4 report downloads work
- [ ] Google Analytics loads (if configured)
- [ ] SEO metadata present in source
- [ ] Admin dashboard accessible
- [ ] No console errors
- [ ] All screenshots captured

---

## 🚨 **Common Issues & Fixes**

### **Issue: "Authentication Required" on MCP page**
**Fix:** Sign in via `/sign-in` first

### **Issue: Report downloads fail**
**Fix:** Check browser console for errors; try incognito mode

### **Issue: Google Analytics not loading**
**Fix:** 
1. Verify `NEXT_PUBLIC_GA_ID` in `.env`
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R`

### **Issue: OAuth callback fails**
**Fix:** Ensure Clerk dashboard has `http://localhost:3000` as allowed domain

### **Issue: Arcjet rate limiting blocks requests**
**Fix:** Wait 1 minute or use different IP

---

## ✅ **Success Criteria**

Your portfolio is **FULLY FUNCTIONAL** when:

1. ✅ All 5 deliverable features work without errors
2. ✅ Authentication flow completes successfully
3. ✅ MCP demo executes and logs actions
4. ✅ All 4 reports download
5. ✅ GA4 loads (if configured)
6. ✅ SEO metadata validates
7. ✅ Screenshots capture all key sections

---

**Ready to Deploy?** See `VERCEL-DEPLOYMENT-CONFIG.md` for production setup.

**Need Help?** Check browser console (F12) for error messages.

**Contact:** eltonramos417@gmail.com
