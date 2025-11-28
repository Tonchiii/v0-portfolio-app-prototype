# 🎯 Your Arcjet Security Dashboard

**Dashboard URL:** https://app.arcjet.com/sites/site_01k7rgw2mged8swvc16w2qcnss/requests

---

## 📊 What You'll See in Your Dashboard

### 1. **Requests Overview**
Live feed of all requests to your portfolio with:
- ✅ **ALLOW** - Legitimate traffic (green)
- 🚫 **DENY** - Blocked threats (red)
- ⚠️ **CHALLENGE** - Suspicious (requires verification)

### 2. **Decisions Breakdown**
- **Bot Detection** - ML-identified bots
- **Rate Limiting** - Exceeded request limits
- **Shield Protection** - Attack attempts (SQL injection, XSS, etc.)

### 3. **Real-Time Metrics**
- Requests per minute
- Block rate percentage
- Top blocked IPs
- Attack types detected

---

## 🔍 What to Look For

### ✅ Good Signs (Normal Traffic)
```
Decision: ALLOW
Reason: -
User-Agent: Mozilla/5.0 (Windows NT 10.0...)
IP: Your visitor's IP
```

### 🚫 Security Working (Blocked Threats)
```
Decision: DENY
Reason: BOT_DETECTED
User-Agent: curl/7.68.0
IP: Attacker IP
```

```
Decision: DENY
Reason: RATE_LIMIT
IP: 123.45.67.89
Message: Token bucket exceeded
```

```
Decision: DENY
Reason: SHIELD
IP: 192.168.1.1
Message: Suspicious payload detected
```

---

## 🧪 Test Your Security Live

### Test 1: Normal Request (Should ALLOW)
Open your browser:
```
http://localhost:3001
```
**Expected in Dashboard:** ✅ ALLOW

---

### Test 2: Bot Detection (Should DENY)
```bash
curl -A "bot" http://localhost:3001/
```
**Expected in Dashboard:** 🚫 DENY - BOT_DETECTED

---

### Test 3: Rate Limiting (Should DENY after 100)
```bash
# Windows PowerShell
1..150 | ForEach-Object { 
  Invoke-WebRequest http://localhost:3001/ -ErrorAction SilentlyContinue
}
```
**Expected in Dashboard:** 
- First ~100: ✅ ALLOW
- After 100: 🚫 DENY - RATE_LIMIT

---

### Test 4: Attack Shield (Should DENY)
```bash
curl "http://localhost:3001/api/admin/users?id=' OR '1'='1"
```
**Expected in Dashboard:** 🚫 DENY - SHIELD

---

## 📈 Dashboard Features You Can Use

### 1. **Filter by Decision**
- Click "DENY" to see all blocked requests
- Click "ALLOW" to see allowed traffic
- Analyze patterns

### 2. **Filter by Time**
- Last hour
- Last 24 hours
- Last 7 days
- Custom range

### 3. **Export Data**
- Download CSV of security events
- Share with team
- Compliance reporting

### 4. **IP Analysis**
- Click any IP to see full history
- Identify repeat attackers
- Whitelist/blacklist IPs

### 5. **Rules Configuration**
- Adjust sensitivity
- Customize bot allow list
- Modify rate limits
- Test mode vs Live mode

---

## 🎯 Quick Actions

### View Recent Blocks
1. Go to dashboard
2. Filter: Decision = "DENY"
3. Check reason codes

### Check Bot Activity
1. Filter: Reason = "BOT_DETECTED"
2. Review user agents
3. Whitelist if needed (rare)

### Monitor Rate Limits
1. Filter: Reason = "RATE_LIMIT"
2. Check if legitimate users affected
3. Adjust limits if needed

### Attack Analysis
1. Filter: Reason = "SHIELD"
2. Review attack types
3. Document for security reports

---

## 🔔 Set Up Alerts (Recommended)

### In Arcjet Dashboard:
1. Go to **Settings** → **Alerts**
2. Enable email notifications for:
   - ⚠️ High attack volume (>10 blocks/min)
   - 🚨 DDoS attempts
   - 🔓 New attack patterns

3. Add your email: `your-email@example.com`

---

## 📊 Weekly Security Review Checklist

- [ ] Check total requests vs blocks ratio
- [ ] Review top blocked IPs
- [ ] Analyze attack patterns
- [ ] Verify legitimate traffic flowing
- [ ] Update whitelist if needed
- [ ] Export security report
- [ ] Share with team

---

## 🎨 Dashboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Filter by DENY | Click "Denied" badge |
| View IP details | Click IP address |
| Export data | "Export" button (top right) |
| Refresh live | Auto-refreshes every 10s |
| Time range | Dropdown (top left) |

---

## 🔧 Troubleshooting

### Not Seeing Requests?

**Check:**
1. Server running? `npm run dev`
2. Making requests? Visit http://localhost:3001
3. ARCJET_KEY set in `.env`?
4. Wait 10-30 seconds for data to appear

**Debug:**
```bash
# Check if Arcjet is working
curl http://localhost:3001/ -v
# Look for X-Arcjet-Decision header
```

### Too Many False Positives?

**Adjust sensitivity in `middleware.ts`:**
```typescript
detectBot({
  mode: "DRY_RUN", // Test mode - logs but doesn't block
  allow: [...] // Add more categories
})
```

### Missing Attack Data?

**Ensure Shield is enabled:**
```typescript
shield({
  mode: "LIVE", // Must be LIVE, not DRY_RUN
})
```

---

## 📚 Understanding Decision Reasons

| Reason | Meaning | Action |
|--------|---------|--------|
| `BOT_DETECTED` | ML identified bot | ✅ Good - bot blocked |
| `RATE_LIMIT` | Too many requests | ✅ Good - DDoS prevented |
| `SHIELD` | Attack detected | 🚨 Review attack type |
| `INVALID` | Malformed request | ✅ Good - bad request |
| `-` (none) | Allowed | ✅ Normal traffic |

---

## 🎯 Key Metrics to Track

### Daily
- **Total Requests** - Understand traffic volume
- **Block Rate** - % of requests blocked (2-10% normal)
- **Top Threats** - Most common attack types

### Weekly
- **Unique Attackers** - How many unique IPs blocked
- **Attack Trends** - Increasing or decreasing?
- **False Positives** - Legitimate users blocked (should be 0)

### Monthly
- **Security Posture** - Overall improvement
- **Compliance** - Data for security audits
- **ROI** - Attacks prevented

---

## 🚀 Pro Tips

1. **Bookmark Your Dashboard**
   - Keep it open during launches
   - Monitor during traffic spikes

2. **Mobile Monitoring**
   - Arcjet dashboard works on mobile
   - Check security on the go

3. **Integration Ideas**
   - Slack alerts for high-severity blocks
   - Weekly email reports
   - Security metrics in admin panel

4. **Regular Reviews**
   - Every Monday: Check past week
   - Before deploys: Baseline traffic
   - After deploys: Monitor for issues

---

## 📞 Need Help?

- **Arcjet Docs:** https://docs.arcjet.com/
- **Support:** support@arcjet.com
- **Discord:** https://discord.gg/arcjet
- **Status:** https://status.arcjet.com/

---

## ✅ Your Current Setup

**Site ID:** site_01k7rgw2mged8swvc16w2qcnss  
**Dashboard:** https://app.arcjet.com/sites/site_01k7rgw2mged8swvc16w2qcnss/requests

**Active Protections:**
- ✅ ML Bot Detection
- ✅ Attack Shield (SQL, XSS, etc.)
- ✅ Token Bucket Rate Limiting (100 req/60s)
- ✅ Fallback Rate Limiting

**Mode:** LIVE (blocking threats)

---

**🎉 Your security is now actively monitored! Visit your dashboard to see it in action.**
