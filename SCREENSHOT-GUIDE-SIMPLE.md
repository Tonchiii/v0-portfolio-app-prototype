# 📸 Simple Screenshot Guide (Step-by-Step)

**You'll take screenshots from:** `http://localhost:3000` (your computer)

---

## 🎯 **Before You Start:**

1. **Make sure your server is running:**
   - Open PowerShell in your project folder
   - Type: `npm run dev`
   - Wait for message: "Local: http://localhost:3000"

2. **Open a web browser** (Chrome, Edge, or Firefox)

3. **Go to:** `http://localhost:3000`

---

## 📷 **Screenshot 1: Homepage**

### **Steps:**
1. Browser address bar, type: `http://localhost:3000`
2. Press Enter
3. Wait for page to load
4. Press `Windows Key + Shift + S` (Screenshot tool)
5. Drag to capture the whole page
6. Save as: `01-homepage.png`

**What you should see:** Your portfolio homepage with navigation menu

---

## 📷 **Screenshot 2: Sign In (If Not Signed In Yet)**

### **Steps:**
1. On homepage, find "Sign In" button (top right corner)
2. Click it
3. You'll see Clerk sign-in page
4. Take screenshot (`Windows Key + Shift + S`)
5. Save as: `02-signin.png`
6. Click "Sign in with GitHub"
7. Complete the login
8. You'll return to homepage (now signed in)

---

## 📷 **Screenshot 3: Security Center Page**

### **Steps:**
1. Browser address bar, type: `http://localhost:3000/security`
2. Press Enter
3. You'll see your security settings page
4. Scroll to see all sections
5. Take full page screenshot
6. Save as: `03-security-page.png`

**What you should see:**
- Your email address
- Phone number section
- 2FA toggle
- Active Sessions
- Connected Accounts (GitHub, Google)

---

## 📷 **Screenshot 4: MCP Integration - Dice Roller**

### **Steps:**
1. Browser address bar, type: `http://localhost:3000/mcp-integration`
2. Press Enter
3. Find the "Roll 2d6" button (left side)
4. Click it
5. Wait for results to appear
6. Take screenshot showing the result and the dice numbers
7. Save as: `04-mcp-dice-results.png`

**What you should see:**
- Dice rolls: [3, 5] (or other random numbers)
- Total: 8 (or sum of your rolls)
- Timestamp

---

## 📷 **Screenshot 5: MCP Integration - Audit Logs**

### **Steps:**
1. Stay on same page (`/mcp-integration`)
2. Look at right side - "Audit Trail" panel
3. You should see your dice roll recorded
4. Click "Roll 1d20" and "Roll 4d6" buttons to add more logs
5. Take screenshot of the Audit Trail panel
6. Save as: `05-mcp-audit-logs.png`

**What you should see:**
- Multiple log entries with timestamps
- User email, dice rolls, totals

---

## 📷 **Screenshot 6: OAuth Flow Diagram**

### **Steps:**
1. Stay on `/mcp-integration` page
2. Scroll down until you see "OAuth Authentication Flow"
3. You'll see numbered circles (1 through 9) with colored backgrounds
4. Take screenshot of entire section
5. Save as: `06-oauth-flow-diagram.png`

**What you should see:**
- 9 numbered steps from "User clicks Sign In" to "Return Response"
- Colorful circles and connecting lines

---

## 📷 **Screenshot 7: Case Study - LMS Modules**

### **Steps:**
1. Browser address bar, type: `http://localhost:3000/case-studies/oauth-mcp`
2. Press Enter
3. Scroll down until you see "Related LMS Modules"
4. You'll see 4 modules listed with checkmarks
5. Take screenshot showing all 4 modules
6. Save as: `07-case-study-lms-modules.png`

**What you should see:**
- "OAuth 2.0 Fundamentals"
- "API Security Best Practices"
- "Incident Response Planning"
- "Security Architecture Design"

---

## 📷 **Screenshot 8: Case Study - Metrics**

### **Steps:**
1. Stay on case study page
2. Scroll to top where it says "Executive Summary"
3. You'll see 3 boxes showing numbers:
   - "3 API Endpoints"
   - "10/min Rate Limit"
   - "100% Audit Coverage"
4. Take screenshot of these 3 boxes
5. Save as: `08-case-study-metrics.png`

---

## 📷 **Screenshot 9: Executive Dashboard**

### **Steps:**
1. Browser address bar, type: `http://localhost:3000/portfolio-security`
2. Press Enter
3. Scroll down until you see "Executive Security Dashboard"
4. You'll see 3 cards:
   - WAF Protection (847 requests blocked)
   - Authentication (156 active users)
   - MCP Server (1,234 tool executions)
5. Take screenshot of all 3 cards together
6. Save as: `09-executive-dashboard.png`

---

## 📷 **Screenshot 10: Downloaded Reports**

### **Steps:**
1. Open these URLs **one at a time** in your browser:
   - `http://localhost:3000/api/reports/executive-briefing`
   - `http://localhost:3000/api/reports/security-metrics`
   - `http://localhost:3000/api/reports/pentesting`
   - `http://localhost:3000/api/reports/compliance`

2. Each URL will automatically download a text file

3. Open your Downloads folder (press `Windows Key + E`, click Downloads)

4. You should see 4 new `.txt` files

5. Take screenshot showing all 4 files
6. Save as: `10-downloaded-reports.png`

**What you should see:**
- Executive-Security-Briefing-2025-11-26.txt
- Security-Metrics-Report-2025-11-26.txt
- Penetration-Testing-Report-2025-11-26.txt
- Compliance-Report-2025-11-26.txt

---

## 📷 **Screenshot 11: Google Analytics (OPTIONAL - Can Skip)**

### **⚠️ Only do this IF you added your Google Analytics ID to .env file**

### **Steps:**
1. Go to: `http://localhost:3000`
2. Press `F12` key (opens Developer Tools)
3. Click on **"Network"** tab at the top
4. In the filter box, type: `gtag`
5. Press `Ctrl + R` to reload the page
6. Wait 2 seconds
7. Look for a line that says `gtag/js?id=G-...`
8. Take screenshot of the Network tab
9. Save as: `11-google-analytics.png`

**What you should see:**
- A request to `googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
- Status: 200 (green) or 304

**If you DON'T see this:**
- You haven't configured Google Analytics yet
- **This is OK! Skip this screenshot** - it's optional

---

## 📷 **Screenshot 12: SEO Metadata (OPTIONAL)**

### **Steps:**
1. Go to: `http://localhost:3000`
2. Right-click anywhere on the page
3. Click **"View page source"** (or press `Ctrl + U`)
4. A new tab opens with HTML code
5. Press `Ctrl + F` to search
6. Search for: `keywords`
7. You'll see a line like: `<meta name="keywords" content="security engineer, OAuth MCP..."`
8. Take screenshot showing this line
9. Save as: `12-seo-keywords.png`

### **Bonus - Structured Data:**
1. In same source view, press `Ctrl + F` again
2. Search for: `application/ld+json`
3. You'll see JSON code with your name and info
4. Take screenshot showing this JSON
5. Save as: `13-seo-structured-data.png`

**What you should see:**
```html
<meta name="keywords" content="security engineer, software developer, OAuth MCP...">
```

And:
```html
<script type="application/ld+json">
{
  "@type": "Person",
  "name": "Elton James T. Ramos",
  ...
}
</script>
```

---

## ✅ **Done! You Should Have:**

- [ ] 01-homepage.png
- [ ] 02-signin.png
- [ ] 03-security-page.png
- [ ] 04-mcp-dice-results.png
- [ ] 05-mcp-audit-logs.png
- [ ] 06-oauth-flow-diagram.png
- [ ] 07-case-study-lms-modules.png
- [ ] 08-case-study-metrics.png
- [ ] 09-executive-dashboard.png
- [ ] 10-downloaded-reports.png
- [ ] 11-google-analytics.png (optional)
- [ ] 12-seo-keywords.png (optional)
- [ ] 13-seo-structured-data.png (optional)

---

## 🎨 **Screenshot Tips:**

### **Method 1: Windows Snipping Tool (Easiest)**
- Press `Windows Key + Shift + S`
- Drag to select area
- Screenshot saves to clipboard
- Open Paint → Paste → Save

### **Method 2: Full Screen**
- Press `PrtScn` key (Print Screen)
- Open Paint → Paste → Save

### **Method 3: Browser Extension**
- Install "Full Page Screen Capture" extension
- Click extension icon → Saves full page

---

## ❓ **Troubleshooting:**

**Problem: Page won't load**
- Solution: Make sure dev server is running (`npm run dev` in terminal)

**Problem: Not signed in**
- Solution: Click "Sign In" button, complete GitHub OAuth

**Problem: Dice won't roll**
- Solution: Make sure you're signed in first

**Problem: Can't find DevTools**
- Solution: Press `F12` key or right-click → "Inspect"

**Problem: Don't see Google Analytics request**
- Solution: That's OK! It's optional. You haven't configured GA4 yet.

---

## 🚀 **What's Next?**

After screenshots:
1. Put them in a folder called `portfolio-screenshots`
2. You can use them for documentation
3. Ready to deploy to Vercel? See `VERCEL-DEPLOYMENT-CONFIG.md`

---

**Need help?** Ask me which screenshot you're stuck on!
