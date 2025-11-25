# Vercel Deployment Configuration for OAuth MCP Server

## Environment Variables

Configure these in Vercel Dashboard → Project Settings → Environment Variables:

### Required Variables

```bash
# Clerk OAuth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret

# GitHub OAuth (via Clerk)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
OAUTH_REDIRECT_URI=https://your-domain.vercel.app/api/auth/callback

# Arcjet Security
ARCJET_KEY=ajkey_your_production_key

# Database (Optional - for persistent audit logs)
DATABASE_URL=postgresql://user:password@host:5432/database

# Token Encryption
TOKEN_ENCRYPTION_KEY=your_32_byte_hex_production_key

# OAuth Provider
OAUTH_PROVIDER=github
```

## Vercel Firewall Configuration

### IP Blocking

**Path:** Vercel Dashboard → Project → Security → Firewall → IP Rules

**Recommended Rules:**

1. **Blocklist Known Malicious IPs:**
   - Add IP addresses from security incident logs
   - Update regularly based on audit log analysis
   - Format: `203.0.113.42` or CIDR `203.0.113.0/24`

2. **Allowlist Trusted IPs (Optional):**
   - Your organization's office IPs
   - CI/CD pipeline IPs
   - Monitoring service IPs

### Geo-Blocking (Optional)

**Path:** Vercel Dashboard → Project → Security → Firewall → Geo Rules

**Options:**
- Block specific countries if attack traffic originates from there
- Allow only specific regions if your user base is localized
- Example: Allow US, EU, Asia-Pacific; Block others

**⚠️ Caution:** Only use if justified by attack patterns. Avoid unnecessarily limiting legitimate users.

### Rate Limiting

**Path:** Vercel Dashboard → Project → Security → Firewall → Rate Limiting

**Configuration:**
```yaml
# Vercel-level rate limiting (complements Arcjet)
- Path: /api/mcp/*
  Limit: 100 requests per minute per IP
  Action: Block temporarily (10 minutes)

- Path: /api/mcp/roll-dice
  Limit: 20 requests per minute per IP
  Action: Return 429 status
```

**Note:** This is in addition to Arcjet's per-user rate limiting (10 req/min).

### DDoS Protection

**Automatic:** Vercel provides automatic DDoS protection at the edge.

**Additional Settings:**
- Enable "Advanced DDoS Protection" in Enterprise plan
- Configure attack mode thresholds
- Set up auto-scaling limits

## Deployment Settings

### Build Configuration

**Path:** Vercel Dashboard → Project → Settings → General

```yaml
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### Node.js Version

```yaml
Node.js Version: 20.x (LTS)
```

**Set in `package.json`:**
```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### Environment-Specific Variables

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `OAUTH_REDIRECT_URI` | `https://your-domain.vercel.app/api/auth/callback` | `https://preview-*.vercel.app/api/auth/callback` | `http://localhost:3000/api/auth/callback` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Production key | Development key | Development key |
| `CLERK_SECRET_KEY` | Production secret | Development secret | Development secret |

## Custom Domains

### Setup

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add custom domain: `mcp.yourdomain.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: mcp
   Value: cname.vercel-dns.com
   ```
4. Wait for SSL certificate provisioning (automatic)
5. Update OAuth redirect URIs to use custom domain

### SSL/TLS Configuration

- **Automatic HTTPS:** Enabled by default
- **Certificate:** Let's Encrypt (auto-renewal)
- **TLS Version:** 1.2+ only
- **HSTS:** Enabled with 1-year max-age

## Monitoring & Alerts

### Vercel Analytics

**Enable:**
1. Vercel Dashboard → Project → Analytics
2. Click "Enable Analytics"
3. View real-time and historical data

**Metrics Tracked:**
- Page views
- API route requests
- Response times
- Error rates
- Bandwidth usage

### Log Drains

**Path:** Vercel Dashboard → Project → Settings → Log Drains

**Configure external logging:**

```yaml
# Example: Send logs to external service
Provider: Datadog / LogTail / Axiom
Endpoint: https://logs.example.com/ingest
API Key: your_logging_service_api_key
```

**Logs Captured:**
- Function execution logs
- Build logs
- Edge function logs
- Audit logs (from your app)

### Alerts Configuration

**Path:** Vercel Dashboard → Project → Settings → Notifications

**Recommended Alerts:**

1. **Deployment Failed:**
   - Channel: Email + Slack
   - Recipients: Development team

2. **High Error Rate:**
   - Threshold: >5% of requests
   - Channel: Email + Slack
   - Recipients: Security team

3. **Function Timeout:**
   - Threshold: >10 timeouts per hour
   - Channel: Email
   - Recipients: Development team

4. **Bandwidth Limit:**
   - Threshold: 80% of monthly limit
   - Channel: Email
   - Recipients: Operations team

## Security Headers

### Configuration

Add to `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/mcp/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

## Deployment Workflow

### Automatic Deployments

**Trigger:** Push to `main` branch

**Process:**
1. Vercel detects push via GitHub integration
2. Build starts automatically
3. Environment variables loaded
4. Next.js build executes
5. Tests run (if configured)
6. Deploy to production (if build succeeds)
7. DNS updated automatically
8. Old deployment kept as rollback option

### Preview Deployments

**Trigger:** Push to any branch or Pull Request

**Benefits:**
- Test changes before merging to production
- Unique URL per preview: `https://preview-abc123.vercel.app`
- Same configuration as production
- Automatically deleted after PR merge

### Manual Deployment

```bash
# Via Vercel CLI
vercel --prod

# Or via Vercel Dashboard
# Project → Deployments → Redeploy
```

## Rollback Procedure

### Instant Rollback

**Path:** Vercel Dashboard → Project → Deployments

**Steps:**
1. Find previous successful deployment
2. Click "..." → "Promote to Production"
3. Confirm promotion
4. DNS updates within seconds

**Use Cases:**
- Critical bug in production
- Security vulnerability discovered
- Performance degradation

### Gradual Rollout (Enterprise Only)

**Path:** Vercel Dashboard → Project → Settings → Gradual Rollout

**Configuration:**
```yaml
# Canary deployment
Initial Traffic: 5%
Increment: 10% per 5 minutes
Monitor: Error rate, latency
Auto-Rollback: If error rate >2%
```

## Scaling Configuration

### Function Configuration

Add to route handlers:

```typescript
// app/api/mcp/roll-dice/route.ts
export const runtime = 'edge' // Use Edge Runtime for global distribution
export const maxDuration = 10 // Max 10 seconds (Edge: 30s max)
export const dynamic = 'force-dynamic' // Always dynamic
```

### Concurrency Limits

**Default:**
- Hobby: 100 concurrent executions
- Pro: 1,000 concurrent executions
- Enterprise: Unlimited (contact sales)

**Monitor:**
- Vercel Dashboard → Project → Analytics → Functions
- Look for "Concurrent Executions" graph

## Cost Optimization

### Bandwidth

**Strategy:**
- Minimize response payload sizes
- Use compression (automatic in Vercel)
- Cache static assets aggressively

**Monitor:**
- Vercel Dashboard → Project → Analytics → Bandwidth
- Set alert at 80% of monthly limit

### Function Invocations

**Strategy:**
- Implement caching where appropriate
- Use Edge Runtime for cheaper execution
- Rate limit appropriately (reduce abuse)

**Monitor:**
- Vercel Dashboard → Project → Analytics → Invocations
- Optimize high-frequency endpoints

### Build Minutes

**Strategy:**
- Use `pnpm` instead of `npm` (faster builds)
- Minimize dependencies
- Use incremental static regeneration (ISR) when possible

## Troubleshooting

### Common Issues

**1. Environment Variables Not Loading**
- Check variable names match exactly (case-sensitive)
- Verify variables set for correct environment (Production/Preview/Development)
- Redeploy after adding variables

**2. OAuth Redirect Fails**
- Update Clerk allowed domains to include Vercel domain
- Verify `OAUTH_REDIRECT_URI` matches Clerk configuration
- Check GitHub OAuth App callback URL

**3. Rate Limiting Too Aggressive**
- Review Arcjet settings in code
- Check Vercel Firewall rate limit rules
- Adjust `refillRate` and `capacity` in Arcjet config

**4. High Latency**
- Use Edge Runtime instead of Node.js Runtime
- Optimize database queries
- Add caching layer (Redis)

**5. Build Failures**
- Check build logs in Vercel Dashboard
- Verify all dependencies in `package.json`
- Test build locally: `npm run build`

## Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] Custom domain configured with SSL
- [ ] Clerk production OAuth app created and configured
- [ ] GitHub OAuth callback URLs updated for production
- [ ] Arcjet production API key configured
- [ ] Vercel Firewall rules reviewed and tested
- [ ] Security headers configured in `next.config.mjs`
- [ ] Monitoring and alerts enabled
- [ ] Log drains configured (optional)
- [ ] Rate limiting tested end-to-end
- [ ] OAuth flow tested on production URL
- [ ] Rollback procedure documented and tested
- [ ] Team members have appropriate Vercel access
- [ ] On-call rotation established for security incidents
- [ ] Incident response runbook accessible to team

## Emergency Procedures

### Take Server Offline

**Quickest Method:**
1. Vercel Dashboard → Project → Settings → Domains
2. Remove custom domain (temporarily)
3. Or: Deploy minimal "Maintenance" page

**Maintenance Page:**
```typescript
// app/page.tsx (emergency)
export default function Maintenance() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Maintenance Mode</h1>
      <p>MCP server is temporarily offline for emergency maintenance.</p>
      <p>Expected return: [Time]</p>
    </div>
  )
}
```

### Rotate All Secrets

```bash
# 1. Generate new secrets
openssl rand -hex 32  # New TOKEN_ENCRYPTION_KEY

# 2. Update in Vercel Dashboard
# - CLERK_SECRET_KEY (regenerate in Clerk)
# - GITHUB_CLIENT_SECRET (regenerate in GitHub)
# - ARCJET_KEY (regenerate in Arcjet)
# - TOKEN_ENCRYPTION_KEY (use newly generated)

# 3. Redeploy
vercel --prod

# 4. Invalidate all existing user sessions
# (Contact Clerk support or use Clerk API to revoke all sessions)
```

### Contact Support

**Vercel Support:**
- Email: support@vercel.com
- Dashboard: vercel.com/support
- Response time: <1 hour (Pro), <24 hours (Hobby)

**Clerk Support:**
- Email: support@clerk.com
- Dashboard: clerk.com/support
- Response time: <2 hours (Pro/Enterprise)

**Arcjet Support:**
- Email: hello@arcjet.com
- Discord: arcjet.com/discord
- Response time: <4 hours (Paid plan)

---

**Last Updated:** November 25, 2025  
**Document Owner:** Elton James T. Ramos  
**Next Review:** After Week 8 deployment
