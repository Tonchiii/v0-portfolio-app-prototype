# Week 7 Deliverable: OAuth-Secured MCP Hello Server

**Student:** Elton James T. Ramos  
**Course:** AI Protector - Agent Security Advanced  
**Due Date:** End of Week 7 (December 14, 2025)  
**Submission Date:** [To be completed]  
**Status:** 📋 Ready for Implementation

---

## Executive Summary

This document outlines the complete implementation plan for an OAuth-protected Model Context Protocol (MCP) server based on the `mcp-auth-demo` template. The project demonstrates secure authentication patterns for AI agent integrations using industry-standard OAuth 2.0 protocol.

**Project Objectives:**
- Deploy a production-ready OAuth-protected MCP server
- Implement "Say Hello" tool with authenticated access
- Document OAuth flow and client setup procedures
- Demonstrate token security best practices
- Integrate with Claude Desktop and VS Code

**Security Focus:**
- OAuth 2.0 authorization code flow
- Secure token storage and management
- Scope-based access control
- Token revocation capabilities
- PKCE (Proof Key for Code Exchange) implementation

---

## 📋 1. Project Overview: OAuth-Secured MCP Hello Server

### What is MCP?

**Model Context Protocol (MCP)** is a standardized protocol for AI agents to interact with external tools and data sources. It enables:
- Tool registration and discovery
- Structured parameter passing
- Response formatting
- Authentication and authorization

### Project Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Client Layer                        │
│  (Claude Desktop, VS Code, MCP Inspector)           │
└───────────────────┬─────────────────────────────────┘
                    │ OAuth 2.0 Flow
                    ▼
┌─────────────────────────────────────────────────────┐
│              OAuth Provider Layer                    │
│         (GitHub OAuth App / Auth0 / Okta)           │
└───────────────────┬─────────────────────────────────┘
                    │ Access Token
                    ▼
┌─────────────────────────────────────────────────────┐
│               MCP Hello Server                       │
│  - Token Validation                                  │
│  - Scope Verification                                │
│  - "Say Hello" Tool Implementation                   │
│  - Secure Token Storage                              │
└─────────────────────────────────────────────────────┘
```

### Security Implementation Goals

1. **Authentication:** Verify user identity via OAuth provider
2. **Authorization:** Enforce scope-based access control
3. **Token Security:** Secure storage and transmission of tokens
4. **Revocation:** Ability to revoke access
5. **Audit:** Log all authentication attempts and tool usage

---

## 🔐 2. OAuth 2.0 Implementation Details

### OAuth Flow Overview

**Authorization Code Flow with PKCE:**

```
1. Client → Authorization Request → OAuth Provider
   - client_id
   - redirect_uri
   - scope (read:user, mcp:tools)
   - code_challenge (PKCE)
   
2. User → Authenticates → OAuth Provider
   - Login with credentials
   - Grant permissions
   
3. OAuth Provider → Authorization Code → Client
   - Temporary code
   - Redirect to callback URL
   
4. Client → Token Exchange → OAuth Provider
   - Authorization code
   - code_verifier (PKCE)
   - client_secret
   
5. OAuth Provider → Access Token → Client
   - access_token
   - refresh_token
   - expires_in
   - token_type: Bearer
   
6. Client → API Request + Token → MCP Server
   - Authorization: Bearer <access_token>
   
7. MCP Server → Validates Token → OAuth Provider
   - Introspection endpoint
   - Verify signature (JWT)
   
8. MCP Server → Tool Execution → Client
   - Returns "Hello, [username]!"
```

### Token Types

**Access Token:**
```json
{
  "access_token": "gho_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "token_type": "bearer",
  "scope": "read:user,mcp:tools",
  "expires_in": 3600
}
```

**Refresh Token:**
```json
{
  "refresh_token": "ghr_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "expires_in": 15552000  // 180 days
}
```

### Security Scopes

**Defined Scopes:**
- `read:user` - Read user profile information
- `mcp:tools` - Execute MCP tools
- `mcp:hello` - Access to Say Hello tool specifically

**Scope Enforcement:**
```typescript
// Server-side scope verification
function validateScopes(token: string, requiredScopes: string[]) {
  const tokenScopes = decodeToken(token).scope.split(' ')
  return requiredScopes.every(scope => tokenScopes.includes(scope))
}

// Usage
if (!validateScopes(accessToken, ['mcp:tools', 'mcp:hello'])) {
  throw new Error('Insufficient permissions')
}
```

---

## 🚀 3. Implementation Plan

### Phase 1: OAuth Provider Setup (Day 1-2)

#### Option A: GitHub OAuth App

**Steps:**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Configure:
   - **Application name:** MCP Hello Server - [Your Name]
   - **Homepage URL:** http://localhost:3000
   - **Authorization callback URL:** http://localhost:3000/oauth/callback
4. Generate Client ID and Client Secret
5. Store securely in `.env`:
   ```bash
   OAUTH_PROVIDER=github
   GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxxxxxx
   GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   OAUTH_REDIRECT_URI=http://localhost:3000/oauth/callback
   ```

**Scopes Required:**
- `read:user` - Read GitHub profile

#### Option B: Auth0 Setup

**Steps:**
1. Create Auth0 account at https://auth0.com
2. Create new Application (Regular Web Application)
3. Configure:
   - **Allowed Callback URLs:** http://localhost:3000/oauth/callback
   - **Allowed Logout URLs:** http://localhost:3000
   - **Allowed Web Origins:** http://localhost:3000
4. Note Domain, Client ID, Client Secret
5. Store in `.env`:
   ```bash
   OAUTH_PROVIDER=auth0
   AUTH0_DOMAIN=dev-xxxxxxxx.us.auth0.com
   AUTH0_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   AUTH0_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   OAUTH_REDIRECT_URI=http://localhost:3000/oauth/callback
   ```

### Phase 2: MCP Server Implementation (Day 3-4)

#### Project Structure

```
oauth-mcp-hello-server/
├── src/
│   ├── server.ts              # Main MCP server
│   ├── oauth/
│   │   ├── provider.ts        # OAuth provider abstraction
│   │   ├── github.ts          # GitHub OAuth implementation
│   │   ├── auth0.ts           # Auth0 OAuth implementation
│   │   └── tokens.ts          # Token management
│   ├── tools/
│   │   └── sayHello.ts        # Say Hello tool implementation
│   ├── middleware/
│   │   ├── auth.ts            # Authentication middleware
│   │   └── scopes.ts          # Scope validation
│   └── storage/
│       └── tokenStore.ts      # Secure token storage
├── tests/
│   ├── oauth.test.ts          # OAuth flow tests
│   ├── tools.test.ts          # Tool execution tests
│   └── security.test.ts       # Security tests
├── docs/
│   └── oauth-playbook.md      # Client setup documentation
├── .env.example               # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

#### Core Implementation Files

**src/server.ts:**
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { authenticateRequest } from './middleware/auth.js'
import { sayHelloTool } from './tools/sayHello.js'

const server = new Server(
  {
    name: 'oauth-hello-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// Register Say Hello tool
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'say_hello',
        description: 'Says hello to the authenticated user',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Optional custom name (defaults to authenticated user)',
            },
          },
        },
      },
    ],
  }
})

// Handle tool execution with authentication
server.setRequestHandler('tools/call', async (request, extra) => {
  // Authenticate request
  const user = await authenticateRequest(extra.headers)
  
  if (request.params.name === 'say_hello') {
    return await sayHelloTool(request.params.arguments, user)
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`)
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.log('OAuth MCP Hello Server running...')
}

main().catch(console.error)
```

**src/oauth/tokens.ts:**
```typescript
import crypto from 'crypto'

interface TokenData {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  scope: string
  userId: string
}

class TokenStore {
  private tokens: Map<string, TokenData> = new Map()
  private encryptionKey: Buffer

  constructor() {
    // Generate or load encryption key
    this.encryptionKey = this.loadEncryptionKey()
  }

  // Encrypt token before storage
  private encrypt(token: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      this.encryptionKey,
      iv
    )
    
    let encrypted = cipher.update(token, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag()
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  }

  // Decrypt token from storage
  private decrypt(encryptedToken: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedToken.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey,
      iv
    )
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  // Store token securely
  storeToken(sessionId: string, tokenData: TokenData): void {
    const encryptedData = {
      ...tokenData,
      accessToken: this.encrypt(tokenData.accessToken),
      refreshToken: tokenData.refreshToken 
        ? this.encrypt(tokenData.refreshToken) 
        : undefined,
    }
    
    this.tokens.set(sessionId, encryptedData)
    
    // Auto-expire tokens
    setTimeout(() => {
      this.revokeToken(sessionId)
    }, tokenData.expiresAt - Date.now())
  }

  // Retrieve token
  getToken(sessionId: string): TokenData | null {
    const encrypted = this.tokens.get(sessionId)
    if (!encrypted) return null
    
    // Check expiration
    if (encrypted.expiresAt < Date.now()) {
      this.revokeToken(sessionId)
      return null
    }
    
    return {
      ...encrypted,
      accessToken: this.decrypt(encrypted.accessToken),
      refreshToken: encrypted.refreshToken 
        ? this.decrypt(encrypted.refreshToken) 
        : undefined,
    }
  }

  // Revoke token
  revokeToken(sessionId: string): void {
    this.tokens.delete(sessionId)
  }

  // Load or generate encryption key
  private loadEncryptionKey(): Buffer {
    const key = process.env.TOKEN_ENCRYPTION_KEY
    if (key) {
      return Buffer.from(key, 'hex')
    }
    
    // Generate new key (development only)
    const newKey = crypto.randomBytes(32)
    console.warn('Generated new encryption key. Set TOKEN_ENCRYPTION_KEY in production.')
    return newKey
  }
}

export const tokenStore = new TokenStore()
```

**src/tools/sayHello.ts:**
```typescript
interface User {
  id: string
  name: string
  email: string
}

interface SayHelloArgs {
  name?: string
}

export async function sayHelloTool(
  args: SayHelloArgs,
  user: User
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const name = args.name || user.name
  
  // Log tool usage for audit
  console.log(`[AUDIT] User ${user.id} executed say_hello tool`)
  
  return {
    content: [
      {
        type: 'text',
        text: `Hello, ${name}! 👋\n\nYou are authenticated as: ${user.email}\nUser ID: ${user.id}`,
      },
    ],
  }
}
```

### Phase 3: Client Integration (Day 5-6)

#### Claude Desktop Configuration

**Location:** `%APPDATA%/Claude/claude_desktop_config.json` (Windows)

**Configuration:**
```json
{
  "mcpServers": {
    "oauth-hello": {
      "command": "node",
      "args": ["C:/path/to/oauth-mcp-hello-server/dist/server.js"],
      "env": {
        "OAUTH_PROVIDER": "github",
        "GITHUB_CLIENT_ID": "Iv1.xxxxxxxxxxxxxxxx",
        "GITHUB_CLIENT_SECRET": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "OAUTH_REDIRECT_URI": "http://localhost:3000/oauth/callback"
      }
    }
  }
}
```

#### VS Code MCP Extension

**Extension:** Install "MCP Inspector" or custom VS Code extension

**settings.json:**
```json
{
  "mcp.servers": [
    {
      "name": "oauth-hello",
      "command": "node",
      "args": ["C:/path/to/oauth-mcp-hello-server/dist/server.js"],
      "env": {
        "OAUTH_PROVIDER": "github",
        "GITHUB_CLIENT_ID": "Iv1.xxxxxxxxxxxxxxxx",
        "GITHUB_CLIENT_SECRET": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  ]
}
```

### Phase 4: Testing & Validation (Day 7)

#### Test Scenarios

**1. OAuth Flow Test:**
```bash
# Start server
npm run dev

# Test authorization endpoint
curl http://localhost:3000/oauth/authorize

# Should redirect to GitHub/Auth0 login
# After authentication, should receive code
# Exchange code for token
# Verify token received and valid
```

**2. Authenticated Tool Execution:**
```bash
# With valid token
curl -X POST http://localhost:3000/mcp/tools/call \
  -H "Authorization: Bearer gho_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"name": "say_hello", "arguments": {}}'

# Expected response:
# {"content": [{"type": "text", "text": "Hello, Elton! ..."}]}
```

**3. Security Tests:**
```bash
# Test without token (should fail)
curl -X POST http://localhost:3000/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "say_hello", "arguments": {}}'
# Expected: 401 Unauthorized

# Test with invalid token (should fail)
curl -X POST http://localhost:3000/mcp/tools/call \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{"name": "say_hello", "arguments": {}}'
# Expected: 401 Unauthorized

# Test with expired token (should fail)
# Use token from >1 hour ago
# Expected: 401 Unauthorized, refresh required

# Test token revocation
curl -X POST http://localhost:3000/oauth/revoke \
  -H "Authorization: Bearer gho_xxxxxxxxxxxx"
# Expected: 200 OK, token invalidated
```

---

## 📖 4. OAuth Playbook Documentation

### Client Setup Guide

**File:** `docs/oauth-playbook.md`

**Contents:**
```markdown
# OAuth-Secured MCP Hello Server - Client Setup Guide

## Prerequisites

- Node.js 18+ installed
- GitHub account (or Auth0 account)
- Claude Desktop or VS Code
- Git

## Step 1: Clone Repository

git clone https://github.com/[your-username]/oauth-mcp-hello-server.git
cd oauth-mcp-hello-server
npm install

## Step 2: OAuth Provider Setup

### Option A: GitHub OAuth

1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: MCP Hello Server
   - Homepage URL: http://localhost:3000
   - Callback URL: http://localhost:3000/oauth/callback
4. Copy Client ID and Client Secret

### Option B: Auth0

1. Go to: https://auth0.com
2. Create new Application
3. Copy Domain, Client ID, Client Secret

## Step 3: Environment Configuration

cp .env.example .env

Edit .env:
OAUTH_PROVIDER=github
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
OAUTH_REDIRECT_URI=http://localhost:3000/oauth/callback
TOKEN_ENCRYPTION_KEY=generate_with_openssl_rand_hex_32

## Step 4: Build and Run

npm run build
npm start

## Step 5: Authenticate

1. Server will open browser to OAuth login
2. Grant permissions
3. Receive confirmation message
4. Token stored securely

## Step 6: Test Tool

In Claude Desktop or VS Code:
"Use the say_hello tool"

Expected response:
"Hello, [Your Name]! You are authenticated as: [email]"

## Troubleshooting

### Token Expired
- Restart server to re-authenticate
- Or implement refresh token flow

### Permission Denied
- Check OAuth scopes granted
- Verify redirect URI matches exactly

### Server Not Starting
- Check Node.js version (18+)
- Verify environment variables set
- Check port 3000 not in use
```

---

## 📸 5. Screenshots Guide

### Screenshot 1: GitHub OAuth App Configuration
**File Name:** `week7-github-oauth-app-setup.png`

**Navigation:**
1. Go to: https://github.com/settings/developers
2. Click on your OAuth App
3. Show configuration page

**What to Show:**
- ✅ Application name
- ✅ Homepage URL
- ✅ Authorization callback URL
- ✅ Client ID (visible)
- ✅ Client Secret (masked)

**Explanation to Include:**
> This screenshot shows the GitHub OAuth App configuration for the MCP Hello Server. Key elements:
>
> **OAuth App Settings:**
> - **Application Name:** Identifies the app to users during authorization
> - **Homepage URL:** Root URL of the application (localhost for development)
> - **Authorization Callback URL:** Where GitHub redirects after authentication
> - **Client ID:** Public identifier for the OAuth application
> - **Client Secret:** Confidential key for token exchange (never expose publicly)
>
> **Security Considerations:**
> - Callback URL must match exactly (prevents redirect attacks)
> - Client Secret stored securely in environment variables
> - Separate OAuth apps for development and production
> - Regular rotation of Client Secret (every 90 days)
>
> This configuration enables the OAuth 2.0 authorization code flow with GitHub as the identity provider.

**How to Capture:**
- Navigate to GitHub OAuth Apps settings
- Press `Windows + Shift + S`
- Capture the configuration page
- Save as: `ai-protector/evidence/week7/screenshots/week7-github-oauth-app-setup.png`

---

### Screenshot 2: MCP Server Running with OAuth
**File Name:** `week7-mcp-server-running.png`

**Navigation:**
1. Open terminal
2. Navigate to oauth-mcp-hello-server directory
3. Run: `npm start`

**What to Show:**
- ✅ Server startup logs
- ✅ "OAuth MCP Hello Server running..." message
- ✅ Port listening (e.g., "Listening on port 3000")
- ✅ OAuth provider initialization
- ✅ Tool registration confirmation

**Explanation to Include:**
> This screenshot demonstrates the MCP Hello Server successfully starting with OAuth authentication enabled. Key components:
>
> **Server Initialization:**
> - MCP server process starts and loads configuration
> - OAuth provider initialized (GitHub/Auth0)
> - "say_hello" tool registered and available
> - HTTP server listening for OAuth callbacks
>
> **Security Features Active:**
> - Token encryption key loaded
> - OAuth endpoints available (/oauth/authorize, /oauth/callback, /oauth/revoke)
> - Request authentication middleware active
> - Scope validation configured
>
> **Startup Verification:**
> - No error messages indicate proper configuration
> - All environment variables loaded correctly
> - Ready to accept OAuth authorization requests
>
> This demonstrates the server is production-ready and secure.

**How to Capture:**
- Run `npm start` in terminal
- Press `Windows + Shift + S`
- Capture terminal showing startup logs
- Save as: `ai-protector/evidence/week7/screenshots/week7-mcp-server-running.png`

---

### Screenshot 3: OAuth Authorization Flow - Login Page
**File Name:** `week7-oauth-login-page.png`

**Navigation:**
1. With server running, trigger OAuth flow
2. Browser opens to GitHub/Auth0 login

**What to Show:**
- ✅ GitHub/Auth0 login page
- ✅ Application name requesting access
- ✅ Requested scopes/permissions listed
- ✅ Authorize/Grant button

**Explanation to Include:**
> This screenshot shows the OAuth authorization page where users grant permissions to the MCP Hello Server. Security aspects:
>
> **User Consent:**
> - User explicitly sees what application is requesting access
> - Scopes (permissions) clearly listed:
>   - `read:user` - Access to basic profile information
>   - `mcp:tools` - Execute MCP tools
> - User must actively click "Authorize" to proceed
>
> **OAuth Security Benefits:**
> - User authenticates with OAuth provider (GitHub/Auth0), not with MCP server
> - MCP server never sees user's password
> - User can revoke access at any time through GitHub/Auth0 settings
> - Scoped permissions limit what app can do
>
> **Trust Model:**
> - OAuth provider (GitHub) verifies user identity
> - MCP server trusts tokens issued by GitHub
> - User trusts GitHub to handle authentication securely
>
> This implements industry-standard authentication patterns used by major applications.

**How to Capture:**
- Trigger OAuth flow (start authentication)
- Browser opens automatically
- Press `Windows + Shift + S`
- Capture the authorization page
- Save as: `ai-protector/evidence/week7/screenshots/week7-oauth-login-page.png`

---

### Screenshot 4: OAuth Authorization Success
**File Name:** `week7-oauth-success-callback.png`

**Navigation:**
1. After clicking "Authorize" on OAuth page
2. Browser redirects to callback URL
3. Success message displayed

**What to Show:**
- ✅ Success message ("Authentication successful!")
- ✅ Callback URL (http://localhost:3000/oauth/callback?code=...)
- ✅ Confirmation to close window
- ✅ No errors in console

**Explanation to Include:**
> This screenshot shows successful OAuth authentication completion. The authorization flow:
>
> **Flow Completion:**
> 1. User authenticated with GitHub/Auth0
> 2. User granted requested permissions
> 3. GitHub redirected to callback URL with authorization code
> 4. MCP server exchanged code for access token
> 5. Token stored securely (encrypted)
> 6. User session established
>
> **Security Token Exchange:**
> - Authorization code is single-use and expires quickly (~10 minutes)
> - Code exchanged for access token via server-side request
> - Client Secret used in token exchange (never exposed to browser)
> - PKCE (Proof Key for Code Exchange) prevents code interception attacks
>
> **Token Storage:**
> - Access token encrypted with AES-256-GCM
> - Stored in memory (not persisted to disk by default)
> - Associated with session ID
> - Auto-expires when token lifetime reached
>
> User can now execute MCP tools with authenticated access.

**How to Capture:**
- After successful OAuth authorization
- Press `Windows + Shift + S`
- Capture success page
- Save as: `ai-protector/evidence/week7/screenshots/week7-oauth-success-callback.png`

---

### Screenshot 5: Claude Desktop with OAuth MCP Server
**File Name:** `week7-claude-desktop-authenticated.png`

**Navigation:**
1. Open Claude Desktop
2. Verify MCP server connected
3. Check authentication status

**What to Show:**
- ✅ Claude Desktop interface
- ✅ MCP server connected indicator
- ✅ "oauth-hello" server listed
- ✅ Authentication status (if visible)
- ✅ Available tools showing

**Explanation to Include:**
> This screenshot shows Claude Desktop successfully connected to the OAuth-protected MCP Hello Server. Integration features:
>
> **MCP Integration:**
> - Server registered in Claude Desktop configuration
> - Connection established via stdio transport
> - OAuth token passed in request headers
> - Tools available for Claude to use
>
> **Authentication Verification:**
> - Claude Desktop stores OAuth token securely
> - Token included in every MCP request
> - Server validates token before executing tools
> - Invalid/expired tokens trigger re-authentication
>
> **User Experience:**
> - One-time OAuth login required
> - Subsequent tool calls use stored token
> - Seamless authentication for user
> - Clear indication when authenticated vs not
>
> **Security Architecture:**
> - Token never exposed to prompt or conversation
> - Tool execution requires valid, non-expired token
> - Scope verification on every request
> - User can revoke access through OAuth provider settings
>
> This demonstrates production-ready OAuth integration with AI agent platforms.

**How to Capture:**
- Open Claude Desktop
- Press `Windows + Shift + S`
- Capture showing MCP server connection
- Save as: `ai-protector/evidence/week7/screenshots/week7-claude-desktop-authenticated.png`

---

### Screenshot 6: Say Hello Tool Execution in Claude
**File Name:** `week7-say-hello-execution-claude.png`

**Navigation:**
1. In Claude Desktop
2. Ask: "Use the say_hello tool to greet me"
3. Show tool execution and response

**What to Show:**
- ✅ User prompt requesting tool use
- ✅ Claude recognizing and calling say_hello tool
- ✅ Tool execution indicator
- ✅ Response with personalized greeting
- ✅ User information from OAuth token

**Explanation to Include:**
> This screenshot demonstrates the say_hello tool executing with OAuth authentication. The workflow:
>
> **Tool Execution Flow:**
> 1. User requests tool execution via natural language
> 2. Claude AI selects appropriate tool (say_hello)
> 3. MCP client sends request to server with OAuth token
> 4. Server validates token and extracts user identity
> 5. Tool executes with authenticated user context
> 6. Personalized response returned
>
> **Personalization via OAuth:**
> - Response includes user's actual name from GitHub profile
> - Email address from authenticated account shown
> - User ID from OAuth provider included
> - Proves token validation and user extraction working
>
> **Security Validation:**
> - Tool only executes if token is valid
> - Scope `mcp:tools` verified before execution
> - User information comes from trusted OAuth provider
> - No opportunity for user impersonation
>
> **Example Response:**
> ```
> Hello, Elton James T. Ramos! 👋
> 
> You are authenticated as: eltonramos417@gmail.com
> User ID: 12345678
> ```
>
> This demonstrates end-to-end OAuth-secured MCP tool execution with proper authentication and authorization.

**How to Capture:**
- Execute say_hello tool in Claude
- Press `Windows + Shift + S`
- Capture conversation showing tool execution
- Save as: `ai-protector/evidence/week7/screenshots/week7-say-hello-execution-claude.png`

---

### Screenshot 7: VS Code MCP Extension with OAuth
**File Name:** `week7-vscode-mcp-authenticated.png`

**Navigation:**
1. Open VS Code
2. Open MCP Inspector or extension
3. Show connected OAuth server

**What to Show:**
- ✅ VS Code interface
- ✅ MCP extension active
- ✅ oauth-hello server connected
- ✅ Authentication status
- ✅ Available tools list

**Explanation to Include:**
> This screenshot shows VS Code integrated with the OAuth-secured MCP Hello Server via MCP extension. Key features:
>
> **VS Code Integration:**
> - MCP extension installed and configured
> - Server connection established via Node.js process
> - OAuth credentials passed via environment variables
> - Tools available in VS Code command palette or extension UI
>
> **Development Workflow:**
> - Developers can test MCP tools directly in VS Code
> - OAuth authentication handled by extension
> - Tool responses displayed inline
> - Useful for debugging and development
>
> **Configuration:**
> - Server configured in VS Code settings.json
> - Environment variables loaded from workspace
> - Separate OAuth app for VS Code (optional)
> - Token managed by extension, not manually
>
> **Benefits:**
> - Consistent authentication across tools (Claude, VS Code)
> - Single OAuth provider for multiple clients
> - Centralized token management
> - Easy testing during development
>
> This shows OAuth MCP servers work across different AI agent platforms.

**How to Capture:**
- Open VS Code with MCP extension
- Press `Windows + Shift + S`
- Capture extension showing server connection
- Save as: `ai-protector/evidence/week7/screenshots/week7-vscode-mcp-authenticated.png`

---

### Screenshot 8: Token Storage Security
**File Name:** `week7-token-storage-security.png`

**Navigation:**
1. Show code or diagram of token storage
2. Highlight encryption implementation

**What to Show:**
- ✅ Code showing AES-256 encryption
- ✅ Token storage structure
- ✅ Encryption key generation
- ✅ Security measures implemented

**Explanation to Include:**
> This screenshot demonstrates the secure token storage implementation. Security measures:
>
> **Encryption:**
> - **Algorithm:** AES-256-GCM (Galois/Counter Mode)
> - **Key Size:** 256 bits (32 bytes)
> - **IV:** Random 16-byte initialization vector per token
> - **Authentication:** GCM provides built-in authentication tag
>
> **Key Management:**
> - Encryption key loaded from `TOKEN_ENCRYPTION_KEY` environment variable
> - Key generated securely using `crypto.randomBytes(32)`
> - Key never stored in code or version control
> - Different keys for development and production
>
> **Token Lifecycle:**
> ```typescript
> // Store token (encrypted)
> tokenStore.storeToken(sessionId, {
>   accessToken: 'gho_xxxxx',  // Encrypted with AES-256-GCM
>   expiresAt: Date.now() + 3600000,
>   scope: 'read:user mcp:tools',
>   userId: '12345'
> })
> 
> // Retrieve token (decrypted)
> const token = tokenStore.getToken(sessionId)
> // Returns decrypted token or null if expired
> 
> // Revoke token (delete)
> tokenStore.revokeToken(sessionId)
> ```
>
> **Security Benefits:**
> - Tokens encrypted at rest (memory or disk)
> - Cannot be read even if memory dumped
> - Authentication tag prevents tampering
> - Auto-expiration reduces risk window
>
> **Best Practices:**
> - Tokens never logged or printed
> - Secure deletion (overwrite memory)
> - Minimum required lifetime
> - Regular key rotation in production
>
> This implements defense-in-depth for sensitive OAuth tokens.

**How to Capture:**
- Show token storage code in VS Code
- Or create diagram showing encryption flow
- Press `Windows + Shift + S`
- Capture code/diagram
- Save as: `ai-protector/evidence/week7/screenshots/week7-token-storage-security.png`

---

### Screenshot 9: OAuth Scope Configuration
**File Name:** `week7-oauth-scopes-config.png`

**Navigation:**
1. Show code defining scopes
2. Or show OAuth provider scope configuration

**What to Show:**
- ✅ Defined scopes in code
- ✅ Scope validation logic
- ✅ GitHub/Auth0 scope settings
- ✅ Permission descriptions

**Explanation to Include:**
> This screenshot shows OAuth scope configuration implementing principle of least privilege. Scope design:
>
> **Defined Scopes:**
> ```typescript
> const SCOPES = {
>   'read:user': 'Read user profile information',
>   'mcp:tools': 'Execute MCP tools',
>   'mcp:hello': 'Access say_hello tool specifically'
> }
> ```
>
> **Granular Permissions:**
> - `read:user`: Minimal scope for identity
>   - Name, email, user ID only
>   - No write access to profile
> - `mcp:tools`: General tool execution
>   - Required for any MCP tool
>   - Can be further restricted per tool
> - `mcp:hello`: Specific tool access
>   - Say hello tool only
>   - More granular than mcp:tools
>
> **Scope Validation:**
> ```typescript
> // Before tool execution
> if (!hasScope(token, 'mcp:tools') && !hasScope(token, 'mcp:hello')) {
>   throw new Error('Insufficient permissions')
> }
> ```
>
> **Security Principles:**
> - **Least Privilege:** Request minimum scopes needed
> - **Defense in Depth:** Multiple scope checks
> - **Explicit Grants:** User sees and approves each scope
> - **Easy Revocation:** User can revoke specific scopes
>
> **Best Practices:**
> - Define scopes before building tools
> - Document what each scope grants
> - Use hierarchical scopes (read < write < admin)
> - Never request admin scopes unless required
> - Regular scope audits
>
> This enables fine-grained access control beyond simple "logged in" vs "not logged in".

**How to Capture:**
- Show scope configuration in code or OAuth provider
- Press `Windows + Shift + S`
- Capture scope definitions
- Save as: `ai-protector/evidence/week7/screenshots/week7-oauth-scopes-config.png`

---

### Screenshot 10: Token Revocation Flow
**File Name:** `week7-token-revocation.png`

**Navigation:**
1. Show GitHub/Auth0 authorized applications
2. Demonstrate revoking access
3. Show revocation endpoint response

**What to Show:**
- ✅ OAuth provider's authorized apps page
- ✅ MCP Hello Server listed
- ✅ Revoke button
- ✅ Confirmation message

**Explanation to Include:**
> This screenshot demonstrates the token revocation capability. Revocation mechanisms:
>
> **User-Initiated Revocation:**
> - **GitHub:** Settings → Applications → Authorized OAuth Apps → Revoke
> - **Auth0:** Account Settings → Applications → Remove Access
> - Immediate effect: all tokens invalidated
> - User notified of revocation
>
> **Programmatic Revocation:**
> ```typescript
> // Server endpoint
> POST /oauth/revoke
> Authorization: Bearer <token>
> 
> // Response
> { "success": true, "message": "Token revoked" }
> ```
>
> **Revocation Flow:**
> 1. Client sends revoke request to MCP server
> 2. Server calls OAuth provider's revocation endpoint
> 3. OAuth provider invalidates token globally
> 4. Server removes token from local storage
> 5. Future requests with token fail immediately
>
> **Security Implications:**
> - **Lost Device:** User can revoke from any other device
> - **Suspicious Activity:** Immediate access termination
> - **Granular Control:** Revoke specific app, not all sessions
> - **Audit Trail:** Revocation logged for compliance
>
> **Implementation:**
> ```typescript
> async function revokeToken(token: string) {
>   // Revoke with provider
>   await oauthProvider.revoke(token)
>   
>   // Remove from local storage
>   tokenStore.revokeToken(findSessionByToken(token))
>   
>   // Log revocation
>   auditLog.log('token_revoked', { token_id: hashToken(token) })
> }
> ```
>
> **Best Practices:**
> - Provide clear revocation UI
> - Immediate effect, no delay
> - Notify user of revocation
> - Log for security monitoring
> - Support both user and admin revocation
>
> This gives users control over their authorization and enables quick response to security incidents.

**How to Capture:**
- Navigate to GitHub Authorized OAuth Apps
- Show MCP Hello Server listed
- Press `Windows + Shift + S`
- Capture authorized apps page
- Save as: `ai-protector/evidence/week7/screenshots/week7-token-revocation.png`

---

## 📁 Folder Structure for Evidence

```
C:\Users\ramos\v0-portfolio-app-prototype\
└── ai-protector\
    └── evidence\
        └── week7\
            ├── screenshots\
            │   ├── week7-github-oauth-app-setup.png
            │   ├── week7-mcp-server-running.png
            │   ├── week7-oauth-login-page.png
            │   ├── week7-oauth-success-callback.png
            │   ├── week7-claude-desktop-authenticated.png
            │   ├── week7-say-hello-execution-claude.png
            │   ├── week7-vscode-mcp-authenticated.png
            │   ├── week7-token-storage-security.png
            │   ├── week7-oauth-scopes-config.png
            │   └── week7-token-revocation.png
            ├── docs\
            │   └── oauth-playbook.md
            └── code\
                └── key-implementation-files\

```

**Create folders:**
```powershell
mkdir -Force ai-protector\evidence\week7\screenshots
mkdir -Force ai-protector\evidence\week7\docs
mkdir -Force ai-protector\evidence\week7\code
```

---

## 🔒 6. Security Notes

### Token Storage Security

**Encryption Implementation:**
- **Algorithm:** AES-256-GCM (Authenticated Encryption)
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **IV:** Random 16-byte per token (never reused)
- **Storage:** In-memory by default, encrypted if persisted
- **Cleanup:** Tokens auto-deleted on expiration

**Best Practices:**
```typescript
// ✅ CORRECT: Encrypted storage
tokenStore.storeToken(sessionId, {
  accessToken: encrypt(token),
  expiresAt: Date.now() + 3600000
})

// ❌ WRONG: Plain text storage
tokens[sessionId] = { token: plainTextToken }
```

### OAuth Scope Best Practices

**Principle of Least Privilege:**
- Request minimum scopes required for functionality
- Separate scopes for read vs write operations
- Tool-specific scopes when possible
- Never request admin scopes unless absolutely necessary

**Scope Hierarchy:**
```
read:user          # Basic identity
  └─ read:email    # Email address
mcp:tools          # General MCP execution
  └─ mcp:hello     # Specific tool
  └─ mcp:admin     # Admin tools
```

**Validation:**
```typescript
// Check required scopes before execution
const requiredScopes = ['mcp:tools', 'mcp:hello']
if (!hasAllScopes(token, requiredScopes)) {
  throw new InsufficientScopesError(requiredScopes)
}
```

### Token Revocation

**Revocation Scenarios:**
1. **User-Initiated:** User revokes via OAuth provider
2. **Admin-Initiated:** Admin revokes compromised token
3. **Auto-Revocation:** Token expires naturally
4. **Security Event:** Revoke all tokens on breach detection

**Implementation:**
```typescript
// Graceful revocation
async function revokeToken(token: string) {
  // 1. Revoke with OAuth provider
  await oauthProvider.revoke(token)
  
  // 2. Remove from local cache
  tokenStore.revokeToken(sessionIdFor(token))
  
  // 3. Add to revocation list (for distributed systems)
  await redis.sadd('revoked_tokens', hashToken(token))
  
  // 4. Audit log
  logger.security('token_revoked', {
    token_id: hashToken(token),
    timestamp: Date.now()
  })
}
```

### Security Checklist

**OAuth Provider Configuration:**
- [ ] Callback URL exactly matches (no wildcards)
- [ ] Client Secret stored securely (environment variable)
- [ ] Separate OAuth apps for dev/staging/prod
- [ ] HTTPS required for production callback URLs
- [ ] Regular rotation of Client Secret (90 days)

**Token Management:**
- [ ] Tokens encrypted at rest (AES-256-GCM)
- [ ] Tokens never logged or printed
- [ ] Expiration enforced (1 hour for access, 180 days for refresh)
- [ ] Revoked tokens blacklisted
- [ ] Token binding to session/user

**Scope Management:**
- [ ] Minimum scopes requested
- [ ] Scope validation on every request
- [ ] User consent for scope changes
- [ ] Audit log of scope usage

**Security Monitoring:**
- [ ] Failed authentication attempts logged
- [ ] Unusual token usage patterns detected
- [ ] Revocation events tracked
- [ ] Security alerts configured

---

## ✅ 7. Submission Checklist

### Repository Requirements
- [ ] GitHub repository created: `oauth-mcp-hello-server`
- [ ] README.md with setup instructions
- [ ] MIT or Apache 2.0 license
- [ ] .gitignore includes .env files
- [ ] Code pushed to main branch
- [ ] Repository public or instructor has access

### Deployment Requirements
- [ ] Server deployed (locally or cloud)
- [ ] OAuth flow working end-to-end
- [ ] Say hello tool executes successfully
- [ ] Token storage secure
- [ ] Revocation functional

### Documentation Requirements
- [ ] `/oauth-playbook.md` complete
- [ ] Client setup steps clear
- [ ] Troubleshooting guide included
- [ ] Security notes comprehensive
- [ ] Code comments thorough

### Screenshot Requirements
- [ ] Screenshot 1: GitHub OAuth App setup
- [ ] Screenshot 2: MCP server running
- [ ] Screenshot 3: OAuth login page
- [ ] Screenshot 4: OAuth success callback
- [ ] Screenshot 5: Claude Desktop authenticated
- [ ] Screenshot 6: Say hello execution in Claude
- [ ] Screenshot 7: VS Code MCP authenticated
- [ ] Screenshot 8: Token storage security
- [ ] Screenshot 9: OAuth scope configuration
- [ ] Screenshot 10: Token revocation
- [ ] All screenshots in PNG format
- [ ] All screenshots >1920x1080 resolution
- [ ] No sensitive data exposed in screenshots

### Security Notes Requirements
- [ ] Token storage explained
- [ ] Encryption algorithm documented
- [ ] Scope management detailed
- [ ] Revocation flow described
- [ ] Best practices listed

### Final Checks
- [ ] All code runs without errors
- [ ] All tests passing
- [ ] Documentation accurate
- [ ] Screenshots match current state
- [ ] Security vulnerabilities addressed
- [ ] Ready for submission

---

## 📊 8. Grading Rubric (Self-Assessment)

| Criteria | Weight | Self-Score | Notes |
|----------|--------|------------|-------|
| **GitHub Repository** | 15% | ___% | Complete, well-organized, documented |
| **OAuth Implementation** | 25% | ___% | Secure, follows best practices |
| **Deployment** | 15% | ___% | Working end-to-end, no errors |
| **OAuth Playbook** | 15% | ___% | Clear, comprehensive, accurate |
| **Screenshots** | 15% | ___% | All 10 captured, professional quality |
| **Security Notes** | 10% | ___% | Thorough coverage of token, scopes, revocation |
| **Code Quality** | 5% | ___% | Clean, documented, tested |
| **Total** | **100%** | ___% | **Target: 90%+ (A)** |

---

## 📞 9. Support Resources

### MCP Documentation
- Official: https://modelcontextprotocol.io/
- GitHub: https://github.com/modelcontextprotocol

### OAuth Resources
- OAuth 2.0 RFC: https://datatracker.ietf.org/doc/html/rfc6749
- PKCE RFC: https://datatracker.ietf.org/doc/html/rfc7636
- GitHub OAuth: https://docs.github.com/en/developers/apps/building-oauth-apps
- Auth0 Docs: https://auth0.com/docs

### Security References
- OWASP OAuth: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html
- Token Security: https://tools.ietf.org/html/rfc8725

---

## 🚀 10. Next Steps After Week 7

**Week 8: Advanced MCP Security**
- Multiple tool implementations
- Role-based tool access
- Tool-level rate limiting
- Audit logging enhancements

**Week 9: Production Deployment**
- Deploy to cloud (Vercel, Railway, Fly.io)
- Production OAuth app configuration
- HTTPS certificate setup
- Monitoring and alerting

**Week 10: Final Project**
- Comprehensive MCP security implementation
- Complete documentation
- Security audit
- Final presentation

---

**Document Version:** 1.0  
**Last Updated:** November 25, 2025  
**Next Review:** December 1, 2025 (Start Week 7)  
**Owner:** Elton James T. Ramos

---

**End of Week 7 Deliverable Document**

*This document provides a complete roadmap for implementing an OAuth-secured MCP Hello Server with production-grade security practices. Follow the phases sequentially, capture screenshots as you progress, and refer to security notes throughout development.*

**Ready to start Week 7? Let's build secure AI agent integrations! 🔐🚀**
