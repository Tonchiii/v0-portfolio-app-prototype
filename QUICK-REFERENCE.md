# 🚀 OAuth MCP Server - Quick Reference

**Week 8 Deliverable - AI Protector Security Course**

---

## 📋 Quick Commands

### Development
```bash
# Setup
npm install
npm run dev

# Test
npm test
.\test-mcp-server.ps1

# Build
npm run build
```

### Production
```bash
# Deploy to Vercel
vercel --prod

# Check deployment
vercel ls
```

---

## 🔗 Important URLs

### Local Development
- **Server:** http://localhost:3000
- **Documentation:** http://localhost:3000/mcp-security
- **Admin Dashboard:** http://localhost:3000/admin

### API Endpoints
- **Roll Dice:** POST http://localhost:3000/api/mcp/roll-dice
- **Metadata:** GET http://localhost:3000/api/mcp
- **Audit Logs:** GET http://localhost:3000/api/mcp/audit

---

## 🔐 Authentication Quick Start

### 1. Get OAuth Token (Browser)
1. Go to http://localhost:3000/sign-in
2. Sign in with GitHub
3. Open DevTools → Application → Cookies
4. Find `__session` or `__clerk_db_jwt`
5. Copy token value

### 2. Use Token in API Calls
```bash
curl -X POST http://localhost:3000/api/mcp/roll-dice \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sides": 20, "count": 2}'
```

### 3. Test with PowerShell
```powershell
$env:TEST_AUTH_TOKEN = "your_token_here"
.\test-mcp-server.ps1
```

---

## 🎲 MCP Tool Usage

### Roll Default Dice (1d6)
```bash
curl -X POST http://localhost:3000/api/mcp/roll-dice \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Roll Custom Dice (2d20)
```bash
curl -X POST http://localhost:3000/api/mcp/roll-dice \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sides": 20, "count": 2}'
```

### Response Format
```json
{
  "rolls": [15, 8],
  "total": 23,
  "sides": 20,
  "count": 2,
  "user": {
    "id": "user_2abc123def",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "timestamp": "2025-11-25T10:30:45.123Z"
}
```

---

## 🛡️ Security Features

### Rate Limiting
- **Limit:** 10 requests per minute per user
- **Response:** 429 Too Many Requests
- **Reset:** After 60 seconds

### Bot Detection
- **Status:** Enabled (LIVE mode)
- **Response:** 403 Forbidden
- **Action:** IP blocked automatically

### Audit Logging
- **Every request logged:** userId, action, timestamp, IP
- **Access logs:** GET /api/mcp/audit?limit=50
- **Retention:** 90 days (in production)

---

## 🚨 Incident Response

### Token Compromised
```bash
# 1. Revoke sessions in Clerk dashboard
# 2. Block IPs in Vercel Firewall
# 3. Notify user via email
# 4. Review audit logs
```

### DDoS Attack
```bash
# 1. Block attacking IPs in Vercel Firewall
# 2. Reduce rate limits temporarily
# 3. Enable strict bot detection
# 4. Monitor Arcjet dashboard
```

### Emergency Contacts
- **Security Lead:** eltonramos417@gmail.com
- **Clerk Support:** support@clerk.com
- **Vercel Support:** vercel.com/support

---

## 📊 Monitoring

### Check Server Status
```bash
# Server metadata
curl http://localhost:3000/api/mcp

# Health check (implied by metadata response)
curl -I http://localhost:3000/api/mcp
```

### View Audit Logs
```bash
curl http://localhost:3000/api/mcp/audit?limit=10 \
  -H "Authorization: Bearer TOKEN"
```

### Metrics Dashboard
- **Production:** Vercel Dashboard → Analytics
- **Local:** /admin (requires admin auth)

---

## 🔧 Troubleshooting

### "Unauthorized" Error (401)
- ✅ Check token is valid and not expired
- ✅ Verify token format: `Bearer YOUR_TOKEN`
- ✅ Sign in again to get fresh token

### "Rate Limit Exceeded" (429)
- ✅ Wait 60 seconds before retrying
- ✅ Implement exponential backoff
- ✅ Check you're not in a loop

### "Bot Detected" (403)
- ✅ Check User-Agent header
- ✅ Use legitimate client (browser, curl with normal UA)
- ✅ Contact support if false positive

### "Invalid Input" (400)
- ✅ Sides must be 2-100
- ✅ Count must be 1-10
- ✅ Check JSON syntax

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [OAUTH-MCP-README.md](./OAUTH-MCP-README.md) | Complete implementation guide |
| [VERCEL-DEPLOYMENT-CONFIG.md](./VERCEL-DEPLOYMENT-CONFIG.md) | Deployment & configuration |
| [WEEK8-DELIVERABLE-SUMMARY.md](./WEEK8-DELIVERABLE-SUMMARY.md) | Submission summary |
| [/mcp-security](./app/mcp-security/page.tsx) | Interactive documentation |

---

## 🧪 Testing Cheat Sheet

### Quick Manual Test
```bash
# 1. Get token (sign in via browser)
# 2. Test roll dice
curl -X POST http://localhost:3000/api/mcp/roll-dice \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sides":6,"count":2}'

# 3. Check response
# Expected: {"rolls":[...], "total":..., "user":{...}}
```

### Run Full Test Suite
```powershell
# Set token
$env:TEST_AUTH_TOKEN = "your_token"

# Run tests
.\test-mcp-server.ps1

# Test rate limiting
$env:TEST_RATE_LIMIT = "true"
.\test-mcp-server.ps1
```

---

## 🔑 Environment Variables

### Required for Development
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
ARCJET_KEY=ajkey_...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
TOKEN_ENCRYPTION_KEY=... # openssl rand -hex 32
```

### Optional
```bash
DATABASE_URL=postgresql://...
GROQ_API_KEY=gsk_...
OAUTH_PROVIDER=github
OAUTH_REDIRECT_URI=http://localhost:3000/oauth/callback
```

---

## 🎯 Common Use Cases

### Roll Character Stats (D&D)
```bash
# Roll 4d6 (although our max is 3d6)
curl -X POST http://localhost:3000/api/mcp/roll-dice \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sides":6,"count":3}'
```

### Simulate Coin Flip (d2)
```bash
curl -X POST http://localhost:3000/api/mcp/roll-dice \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sides":2,"count":1}'
```

### Percentile Roll (d100)
```bash
curl -X POST http://localhost:3000/api/mcp/roll-dice \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sides":100,"count":1}'
```

---

## 📱 Client Integration

### JavaScript/TypeScript
```typescript
import { MCPRollDiceClient } from './examples/mcp-client-example'

const client = new MCPRollDiceClient('http://localhost:3000')
client.setAccessToken('your_token')

const result = await client.rollDice({ sides: 20, count: 2 })
console.log(result.rolls) // [15, 8]
```

### Python
```python
import requests

response = requests.post(
    'http://localhost:3000/api/mcp/roll-dice',
    headers={'Authorization': 'Bearer your_token'},
    json={'sides': 20, 'count': 2}
)
result = response.json()
print(result['rolls'])
```

---

## 🎓 Learning Resources

### OAuth 2.0
- [OAuth 2.0 RFC](https://datatracker.ietf.org/doc/html/rfc6749)
- [Clerk OAuth Docs](https://clerk.com/docs/authentication/oauth)

### MCP (Model Context Protocol)
- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)

### Security
- [OWASP OAuth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html)
- [Arcjet Documentation](https://docs.arcjet.com/)

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] OAuth redirect URIs updated for production
- [ ] Arcjet configured in LIVE mode
- [ ] Vercel Firewall rules reviewed
- [ ] Security headers configured
- [ ] Monitoring and alerts enabled
- [ ] Incident response runbook accessible
- [ ] Team members have appropriate access
- [ ] Backup and rollback plan documented

---

## 🤝 Support

**Student:** Elton James T. Ramos  
**Email:** eltonramos417@gmail.com  
**Course:** AI Protector - Week 8

**For urgent issues:**
- Check [/mcp-security](./app/mcp-security/page.tsx) documentation
- Review [OAUTH-MCP-README.md](./OAUTH-MCP-README.md)
- Contact support channels listed in incident response

---

**Last Updated:** November 25, 2025  
**Version:** 1.0.0
