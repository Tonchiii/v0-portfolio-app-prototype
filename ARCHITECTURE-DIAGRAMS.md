# OAuth MCP Server Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  Claude    │  │   VS Code  │  │    API     │  │   Browser  │ │
│  │  Desktop   │  │    MCP     │  │   Client   │  │   Client   │ │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘ │
└────────┼───────────────┼───────────────┼───────────────┼────────┘
         │               │               │               │
         │  ┌────────────▼───────────────▼───────────────▼────────┐
         │  │         OAuth Authorization Request                  │
         │  │  • client_id, redirect_uri, scope, state            │
         │  │  • PKCE: code_challenge, code_challenge_method      │
         │  └────────────┬─────────────────────────────────────────┘
         │               │
         │  ┌────────────▼─────────────────────────────────────────┐
         │  │          OAUTH PROVIDER LAYER (Clerk + GitHub)       │
         │  │  ┌──────────────────────────────────────────────┐   │
         │  │  │  1. User Authentication (GitHub)             │   │
         │  │  │  2. Consent Screen (read:user, mcp:tools)    │   │
         │  │  │  3. Authorization Code Generation            │   │
         │  │  │  4. Token Exchange                           │   │
         │  │  └──────────────────────────────────────────────┘   │
         │  └────────────┬─────────────────────────────────────────┘
         │               │
         │  ┌────────────▼─────────────────────────────────────────┐
         │  │          Access Token (JWT)                          │
         │  │  • user_id, email, name, scopes                     │
         │  │  • Expiration: 1 hour                               │
         │  │  • Signed by Clerk                                  │
         │  └────────────┬─────────────────────────────────────────┘
         │               │
┌────────▼───────────────▼─────────────────────────────────────────┐
│                    MCP REQUEST WITH TOKEN                         │
│  POST /api/mcp/roll-dice                                          │
│  Authorization: Bearer eyJhbGci...                                │
│  Content-Type: application/json                                   │
│  Body: {"sides": 20, "count": 2}                                  │
└────────┬──────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ARCJET SECURITY LAYER                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 1: Rate Limit Check (Token Bucket)                 │  │
│  │  • Capacity: 10 requests                                 │  │
│  │  • Refill: 10 per minute                                 │  │
│  │  • Action: 429 if exceeded                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 2: Bot Detection (ML-Powered)                      │  │
│  │  • Analyze: User-Agent, behavior patterns                │  │
│  │  • Fingerprint: Browser/device characteristics           │  │
│  │  • Action: 403 if bot detected                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Decision: ALLOW ✅ | DENY (429/403) ❌                          │
└─────────┬───────────────────────────────────────────────────────┘
          │ ALLOW
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION MIDDLEWARE                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 1: Extract Token from Authorization Header         │  │
│  │  • Parse: "Bearer <token>"                               │  │
│  │  • Validate: Not null, not malformed                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 2: Validate Token with Clerk                       │  │
│  │  • Verify: JWT signature                                 │  │
│  │  • Check: Not expired                                    │  │
│  │  • Extract: User claims (id, email, name)               │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 3: Scope Verification                              │  │
│  │  • Required: mcp:tools OR mcp:dice                       │  │
│  │  • Action: 403 if insufficient scopes                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Result: User object or 401 error                                │
└─────────┬───────────────────────────────────────────────────────┘
          │ Authenticated
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INPUT VALIDATION LAYER                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Validate Request Body                                    │  │
│  │  • sides: number, 2-100                                  │  │
│  │  • count: number, 1-10                                   │  │
│  │  • Action: 400 if invalid                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────┬───────────────────────────────────────────────────────┘
          │ Valid input
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ROLL DICE TOOL EXECUTION                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  for (let i = 0; i < count; i++) {                       │  │
│  │    rolls.push(                                            │  │
│  │      Math.floor(Math.random() * sides) + 1               │  │
│  │    )                                                      │  │
│  │  }                                                        │  │
│  │  total = rolls.reduce((sum, roll) => sum + roll, 0)      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────┬───────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUDIT LOGGING LAYER                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  console.log('[AUDIT]', {                                │  │
│  │    action: 'mcp_roll_dice',                              │  │
│  │    userId: user.id,                                      │  │
│  │    email: user.email,                                    │  │
│  │    sides, count, rolls, total,                           │  │
│  │    timestamp: new Date().toISOString(),                  │  │
│  │    ip: req.headers.get('x-forwarded-for'),               │  │
│  │    userAgent: req.headers.get('user-agent')              │  │
│  │  })                                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Stored in: /api/mcp/audit endpoint (queryable)                  │
└─────────┬───────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE GENERATION                           │
│  {                                                                │
│    "rolls": [15, 8],                                              │
│    "total": 23,                                                   │
│    "sides": 20,                                                   │
│    "count": 2,                                                    │
│    "user": {                                                      │
│      "id": "user_2abc123def",                                     │
│      "email": "eltonramos417@gmail.com",                          │
│      "name": "Elton James T. Ramos"                               │
│    },                                                             │
│    "timestamp": "2025-11-25T10:30:45.123Z"                        │
│  }                                                                │
└─────────┬───────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE TO CLIENT                            │
│  HTTP 200 OK                                                      │
│  Content-Type: application/json                                   │
│  X-MCP-Version: 1.0.0                                             │
└───────────────────────────────────────────────────────────────────┘
```

## Security Layers Summary

```
┌──────────────────────────────────────────────────────────────┐
│  Layer 1: OAuth 2.0 Authentication (Clerk + GitHub)          │
│  ✓ Prevents unauthorized access                              │
│  ✓ Cryptographically verifies user identity                  │
│  ✓ Scope-based permission model                              │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│  Layer 2: Arcjet Protection (Rate Limit + Bot Detection)     │
│  ✓ Prevents API abuse (10 req/min per user)                  │
│  ✓ Blocks automated bots and scrapers                        │
│  ✓ DDoS protection                                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│  Layer 3: Vercel Firewall (Edge Network)                     │
│  ✓ IP blocking for malicious traffic                         │
│  ✓ Geo-blocking (optional)                                   │
│  ✓ Automatic DDoS mitigation                                 │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│  Layer 4: Input Validation                                    │
│  ✓ Prevents injection attacks                                │
│  ✓ Enforces business logic constraints                       │
│  ✓ Type checking and sanitization                            │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│  Layer 5: Audit Logging                                       │
│  ✓ Complete audit trail for compliance                       │
│  ✓ Forensic analysis capability                              │
│  ✓ Anomaly detection data                                    │
└──────────────────────────────────────────────────────────────┘
```

## Token Lifecycle

```
1. USER INITIATES OAUTH
   ↓
   Browser → /sign-in
   ↓
2. CLERK REDIRECTS TO GITHUB
   ↓
   https://github.com/login/oauth/authorize?
     client_id=...
     redirect_uri=...
     scope=read:user
     state=...
   ↓
3. USER AUTHENTICATES
   ↓
   GitHub login page
   User enters credentials
   ↓
4. USER GRANTS PERMISSIONS
   ↓
   Consent screen
   "Authorize application to access your profile"
   ↓
5. GITHUB REDIRECTS WITH CODE
   ↓
   https://your-domain.vercel.app/api/auth/callback?
     code=abc123...
     state=...
   ↓
6. CLERK EXCHANGES CODE FOR TOKEN
   ↓
   POST https://github.com/login/oauth/access_token
   Body: { code, client_id, client_secret }
   ↓
7. CLERK ISSUES JWT
   ↓
   {
     "user_id": "user_2abc123def",
     "email": "user@example.com",
     "scopes": ["read:user", "mcp:tools"],
     "exp": 1732540245
   }
   Signed with Clerk secret key
   ↓
8. TOKEN STORED IN COOKIE
   ↓
   Set-Cookie: __session=eyJhbGci...; HttpOnly; Secure; SameSite=Lax
   ↓
9. CLIENT INCLUDES TOKEN IN REQUESTS
   ↓
   Authorization: Bearer eyJhbGci...
   ↓
10. SERVER VALIDATES TOKEN
    ↓
    • Verify signature
    • Check expiration
    • Extract user claims
    ↓
11. TOKEN EXPIRES (1 hour)
    ↓
    User must re-authenticate or use refresh token
```

## Error Flow

```
REQUEST
   │
   ▼
[Arcjet Check]
   │
   ├─ Rate Limit? → YES → 429 Too Many Requests
   │                       "Too many requests. Please try again later."
   │
   ├─ Bot Detected? → YES → 403 Forbidden
   │                         "Automated requests are not allowed."
   │
   ▼ NO (Allowed)
[Auth Check]
   │
   ├─ No Token? → YES → 401 Unauthorized
   │                     "Authentication required. Please sign in."
   │
   ├─ Invalid Token? → YES → 401 Unauthorized
   │                          "Invalid or expired token."
   │
   ├─ Insufficient Scopes? → YES → 403 Forbidden
   │                                "Insufficient permissions."
   │
   ▼ NO (Authenticated)
[Input Validation]
   │
   ├─ Invalid sides? → YES → 400 Bad Request
   │                          "Sides must be between 2 and 100."
   │
   ├─ Invalid count? → YES → 400 Bad Request
   │                          "Count must be between 1 and 10."
   │
   ▼ NO (Valid)
[Execute Tool]
   │
   ├─ Exception? → YES → 500 Internal Server Error
   │                      "An error occurred. Please try again."
   │
   ▼ NO
[Success]
   │
   ▼
200 OK + Response JSON
```

## Monitoring & Alerting Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    EVENT OCCURS                               │
│  • Tool execution                                             │
│  • Authentication failure                                     │
│  • Rate limit hit                                             │
│  • Bot detected                                               │
│  • Error/exception                                            │
└─────────────┬────────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│                    LOGGING LAYER                              │
│  • Console logs (stdout/stderr)                               │
│  • Audit log storage (/api/mcp/audit)                         │
│  • Vercel logs                                                │
└─────────────┬────────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│                    ANALYSIS                                   │
│  • Pattern detection                                          │
│  • Threshold checking                                         │
│  • Anomaly identification                                     │
└─────────────┬────────────────────────────────────────────────┘
              │
              ├─ Normal → Archive for retention
              │
              ├─ Warning → Alert to monitoring dashboard
              │
              ▼ Critical
┌──────────────────────────────────────────────────────────────┐
│                    ALERT GENERATION                           │
│  • Email notification                                         │
│  • Slack webhook (optional)                                   │
│  • Vercel dashboard alert                                     │
└─────────────┬────────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│                    INCIDENT RESPONSE                          │
│  • Security team notified                                     │
│  • Runbook executed                                           │
│  • Mitigation actions taken                                   │
│  • Post-mortem scheduled                                      │
└──────────────────────────────────────────────────────────────┘
```

---

**These diagrams illustrate the complete architecture, security layers, and operational flows of the OAuth MCP Roll-Dice Server.**

**Week 8 Deliverable - AI Protector Security Course**  
**Student: Elton James T. Ramos**  
**Last Updated: November 25, 2025**
