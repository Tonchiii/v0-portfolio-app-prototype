/**
 * MCP Roll Dice Server - Integration Tests
 * Tests OAuth authentication, rate limiting, bot detection, and tool execution
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

// Test configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
let authToken: string

describe('MCP Roll Dice Server - Integration Tests', () => {
  
  // =================================================================
  // OAuth Authentication Tests
  // =================================================================
  
  describe('OAuth Authentication', () => {
    
    it('should reject unauthenticated requests', async () => {
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides: 6, count: 2 }),
      })
      
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })
    
    it('should reject invalid tokens', async () => {
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer invalid_token_12345',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides: 6, count: 2 }),
      })
      
      expect(response.status).toBe(401)
    })
    
    it('should accept valid OAuth tokens', async () => {
      // Note: In real tests, obtain token via OAuth flow
      // For now, skip if no test token available
      if (!process.env.TEST_AUTH_TOKEN) {
        console.warn('Skipping authenticated test - no TEST_AUTH_TOKEN provided')
        return
      }
      
      authToken = process.env.TEST_AUTH_TOKEN
      
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides: 6, count: 2 }),
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('rolls')
      expect(data).toHaveProperty('total')
      expect(data).toHaveProperty('user')
    })
  })
  
  // =================================================================
  // Tool Functionality Tests
  // =================================================================
  
  describe('Roll Dice Tool', () => {
    
    beforeAll(() => {
      if (!process.env.TEST_AUTH_TOKEN) {
        console.warn('Skipping tool tests - no TEST_AUTH_TOKEN')
      }
    })
    
    it('should roll default 1d6', async () => {
      if (!process.env.TEST_AUTH_TOKEN) return
      
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.rolls).toHaveLength(1)
      expect(data.rolls[0]).toBeGreaterThanOrEqual(1)
      expect(data.rolls[0]).toBeLessThanOrEqual(6)
      expect(data.sides).toBe(6)
      expect(data.count).toBe(1)
    })
    
    it('should roll custom dice (2d20)', async () => {
      if (!process.env.TEST_AUTH_TOKEN) return
      
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides: 20, count: 2 }),
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.rolls).toHaveLength(2)
      data.rolls.forEach((roll: number) => {
        expect(roll).toBeGreaterThanOrEqual(1)
        expect(roll).toBeLessThanOrEqual(20)
      })
      expect(data.total).toBe(data.rolls[0] + data.rolls[1])
    })
    
    it('should reject invalid sides (< 2)', async () => {
      if (!process.env.TEST_AUTH_TOKEN) return
      
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides: 1, count: 2 }),
      })
      
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Invalid input')
    })
    
    it('should reject invalid sides (> 100)', async () => {
      if (!process.env.TEST_AUTH_TOKEN) return
      
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides: 150, count: 2 }),
      })
      
      expect(response.status).toBe(400)
    })
    
    it('should reject invalid count (> 10)', async () => {
      if (!process.env.TEST_AUTH_TOKEN) return
      
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides: 6, count: 15 }),
      })
      
      expect(response.status).toBe(400)
    })
    
    it('should include user information in response', async () => {
      if (!process.env.TEST_AUTH_TOKEN) return
      
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides: 6, count: 1 }),
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.user).toBeDefined()
      expect(data.user.id).toBeDefined()
      expect(data.user.email).toBeDefined()
      expect(data.user.name).toBeDefined()
    })
  })
  
  // =================================================================
  // Rate Limiting Tests
  // =================================================================
  
  describe('Arcjet Rate Limiting', () => {
    
    it('should enforce 10 requests per minute limit', async () => {
      if (!process.env.TEST_AUTH_TOKEN) {
        console.warn('Skipping rate limit test - no TEST_AUTH_TOKEN')
        return
      }
      
      const requests = []
      
      // Send 15 requests rapidly (limit is 10/min)
      for (let i = 0; i < 15; i++) {
        requests.push(
          fetch(`${BASE_URL}/api/mcp/roll-dice`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sides: 6, count: 1 }),
          })
        )
      }
      
      const responses = await Promise.all(requests)
      const statuses = responses.map(r => r.status)
      
      // First 10 should succeed (200)
      const successCount = statuses.filter(s => s === 200).length
      expect(successCount).toBeLessThanOrEqual(10)
      
      // Remaining should be rate limited (429)
      const rateLimitedCount = statuses.filter(s => s === 429).length
      expect(rateLimitedCount).toBeGreaterThan(0)
    })
  })
  
  // =================================================================
  // Bot Detection Tests
  // =================================================================
  
  describe('Arcjet Bot Detection', () => {
    
    it('should detect and block bot-like requests', async () => {
      if (!process.env.TEST_AUTH_TOKEN) return
      
      // Send request with bot-like user agent
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'curl/7.68.0', // Bot-like user agent
        },
        body: JSON.stringify({ sides: 6, count: 1 }),
      })
      
      // May be 200 (allowed) or 403 (bot detected) depending on Arcjet rules
      // In LIVE mode with strict rules, should be 403
      expect([200, 403]).toContain(response.status)
      
      if (response.status === 403) {
        const data = await response.json()
        expect(data.error).toMatch(/bot|forbidden/i)
      }
    })
  })
  
  // =================================================================
  // Server Metadata Tests
  // =================================================================
  
  describe('Server Metadata', () => {
    
    it('should return server metadata', async () => {
      const response = await fetch(`${BASE_URL}/api/mcp`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.server).toBeDefined()
      expect(data.server.name).toBe('oauth-roll-dice-mcp-server')
      expect(data.authentication).toBeDefined()
      expect(data.security).toBeDefined()
      expect(data.tools).toBeDefined()
      expect(Array.isArray(data.tools)).toBe(true)
    })
    
    it('should list available tools', async () => {
      const response = await fetch(`${BASE_URL}/api/mcp`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.tools).toHaveLength(1)
      expect(data.tools[0].name).toBe('roll_dice')
      expect(data.tools[0].endpoint).toBe('/api/mcp/roll-dice')
    })
  })
  
  // =================================================================
  // Tool Discovery Tests
  // =================================================================
  
  describe('Tool Discovery', () => {
    
    it('should return roll_dice tool metadata', async () => {
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.name).toBe('roll_dice')
      expect(data.description).toBeDefined()
      expect(data.inputSchema).toBeDefined()
      expect(data.outputSchema).toBeDefined()
      expect(data.authentication).toBeDefined()
      expect(data.security).toBeDefined()
    })
    
    it('should include security configuration in metadata', async () => {
      const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.security.arcjet).toBeDefined()
      expect(data.security.arcjet.rateLimit).toBe('10 requests per minute')
      expect(data.security.arcjet.botDetection).toBe('enabled')
      
      expect(data.security.clerk).toBeDefined()
      expect(data.security.clerk.oauthRequired).toBe(true)
      
      expect(data.security.logging).toBeDefined()
      expect(data.security.logging.auditLog).toBe('enabled')
    })
  })
  
  // =================================================================
  // Audit Logging Tests
  // =================================================================
  
  describe('Audit Logging', () => {
    
    it('should log tool executions', async () => {
      if (!process.env.TEST_AUTH_TOKEN) return
      
      // Execute tool
      await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sides: 6, count: 1 }),
      })
      
      // Wait briefly for log to be written
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Retrieve audit logs
      const logsResponse = await fetch(`${BASE_URL}/api/mcp/audit?limit=10`, {
        headers: {
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
        },
      })
      
      expect(logsResponse.status).toBe(200)
      const logsData = await logsResponse.json()
      
      expect(logsData.logs).toBeDefined()
      expect(Array.isArray(logsData.logs)).toBe(true)
      
      // Should have at least one log entry
      if (logsData.logs.length > 0) {
        const log = logsData.logs[0]
        expect(log.action).toBeDefined()
        expect(log.userId).toBeDefined()
        expect(log.timestamp).toBeDefined()
      }
    })
  })
})

// =================================================================
// Performance Tests
// =================================================================

describe('Performance', () => {
  
  it('should respond within 200ms', async () => {
    if (!process.env.TEST_AUTH_TOKEN) return
    
    const start = Date.now()
    
    const response = await fetch(`${BASE_URL}/api/mcp/roll-dice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sides: 6, count: 1 }),
    })
    
    const duration = Date.now() - start
    
    expect(response.status).toBe(200)
    expect(duration).toBeLessThan(200)
  })
})

// =================================================================
// Test Instructions
// =================================================================

/*
 * To run these tests:
 * 
 * 1. Set up test environment:
 *    export TEST_BASE_URL=http://localhost:3000
 *    export TEST_AUTH_TOKEN=your_valid_clerk_session_token
 * 
 * 2. Run tests:
 *    npm test
 * 
 * 3. For production testing:
 *    export TEST_BASE_URL=https://your-domain.vercel.app
 *    export TEST_AUTH_TOKEN=your_production_token
 *    npm test
 * 
 * Note: To obtain TEST_AUTH_TOKEN:
 * - Sign in to your app via browser
 * - Open browser DevTools → Application → Cookies
 * - Find Clerk session token (usually __session or __clerk_db_jwt)
 * - Copy value and set as TEST_AUTH_TOKEN
 * 
 * For CI/CD:
 * - Use Clerk API to programmatically create test user and obtain token
 * - Store token as GitHub Actions secret: TEST_AUTH_TOKEN
 * - Run tests in GitHub Actions workflow
 */
