# ⚡ Quick Start Testing Guide

## 🚀 **Start Testing in 5 Minutes**

### **Step 1: Verify Server is Running**
```powershell
# Check if running on port 3000
netstat -ano | Select-String ":3000"

# If NOT running, start it:
npm run dev
```

### **Step 2: Open in Browser**
```
http://localhost:3000
```

### **Step 3: Sign In**
1. Click **"Sign In"** button (top right)
2. Complete GitHub OAuth via Clerk
3. You're authenticated! ✅

---

## 📸 **Screenshot Checklist (10 mins)**

### **Quick Route:**
1. **Homepage** → `http://localhost:3000` → Screenshot
2. **Sign In** → Click button → Screenshot OAuth screen
3. **Security** → `http://localhost:3000/security` → Screenshot (3 cards)
4. **MCP Demo** → `http://localhost:3000/mcp-integration` → Roll dice → Screenshot results
5. **OAuth Flow** → Scroll down on MCP page → Screenshot 9-step diagram
6. **Case Study** → `http://localhost:3000/case-studies/oauth-mcp` → Screenshot LMS modules
7. **Reports** → `http://localhost:3000/portfolio-security` → Scroll to dashboard → Screenshot
8. **Download Report** → `http://localhost:3000/api/reports/executive-briefing` → Downloads file ✅

---

## ✅ **What's ALREADY Working:**

### **1. Security Center** ✓
- URL: `/security`
- Features: OAuth accounts, 2FA, sessions, password management
- **Test:** Sign in → Navigate to page → All cards visible

### **2. MCP Integration** ✓
- URL: `/mcp-integration`
- Features: Live dice roller, audit logs, OAuth flow
- **Test:** Roll dice → See results + logs populate

### **3. Case Study** ✓
- URL: `/case-studies/oauth-mcp`
- Features: LMS modules, metrics, security controls
- **Test:** Navigate → Scroll → All sections present

### **4. Executive Dashboard** ✓
- URL: `/portfolio-security#executive-dashboard`
- Features: Real-time metrics, WAF stats
- **Test:** Navigate → Scroll to dashboard section

### **5. Report Downloads** ✓
- URLs: `/api/reports/*` (4 endpoints)
- Features: Downloadable text reports
- **Test:** Visit URL → File downloads automatically

---

## 🔧 **Optional: Google Analytics (Can Skip)**

### **Current Status:**
- Your `.env` has: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` (placeholder)
- **This is OPTIONAL - portfolio works without it**

### **Want to Enable GA4? (Optional)**
1. Go to https://analytics.google.com
2. Click "Start measuring" → Create property
3. Copy your Measurement ID (looks like `G-ABC123XYZ`)
4. Open `.env` file in your project
5. Replace `G-XXXXXXXXXX` with your real ID
6. Restart server: Press `Ctrl+C` in terminal, then type `npm run dev`

### **Don't Have Google Analytics Account?**
- **Skip this step completely** - not required
- Portfolio works perfectly without it
- You can add it later anytime

---

## 🧪 **Quick Test Commands**

### **Test MCP API Endpoint:**
```powershell
# After signing in, test the API
curl -X POST http://localhost:3000/api/mcp/roll-dice `
  -H "Content-Type: application/json" `
  -d '{\"sides\": 6, \"count\": 2}'
```
*Note: Will return 401 if not authenticated via browser first*

### **Download All Reports at Once:**
```powershell
# Save reports to Desktop
$reports = @('executive-briefing', 'security-metrics', 'pentesting', 'compliance')
foreach ($r in $reports) {
    Invoke-WebRequest "http://localhost:3000/api/reports/$r" -OutFile "~\Desktop\report-$r.txt"
}
```

### **Check for Errors:**
```powershell
# View console logs from server
# (Look for [AUDIT], [ERROR], or [WARN] messages)
```

---

## 📋 **Screenshot Locations Summary**

| Feature | URL | What to Capture |
|---------|-----|-----------------|
| Homepage | `/` | Full page with navigation |
| Sign In | `/sign-in` | OAuth screen |
| Security Center | `/security` | OAuth accounts + 2FA cards |
| MCP Demo | `/mcp-integration` | Dice results + audit logs |
| OAuth Flow | `/mcp-integration` | 9-step diagram |
| Case Study | `/case-studies/oauth-mcp` | LMS modules section |
| Dashboard | `/portfolio-security` | Metrics grid |
| Reports | Download folder | All 4 .txt files |

---

## 🎯 **Production Deployment Checklist**

Before deploying to Vercel:

- [ ] Test all features locally (use this guide)
- [ ] Add real GA4 Measurement ID
- [ ] Take screenshots for documentation
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Update OAuth redirect URLs in Clerk dashboard
- [ ] Test on production URL

See `VERCEL-DEPLOYMENT-CONFIG.md` for deployment steps.

---

## 🆘 **Need Help?**

1. **Server won't start:** Run `npm install` then `npm run dev`
2. **Authentication fails:** Check Clerk dashboard has `localhost:3000` allowed
3. **Reports don't download:** Try in incognito mode or different browser
4. **Can't find something:** Open `FUNCTIONALITY-TEST-GUIDE.md` for detailed instructions

---

**Everything is already built and working!** Just follow this guide to test and screenshot.

**Questions?** eltonramos417@gmail.com
