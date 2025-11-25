/**
 * MCP Roll Dice Client Example
 * Demonstrates how to integrate with the OAuth-secured MCP server
 */

// =================================================================
// TypeScript Client Library
// =================================================================

interface DiceRollRequest {
  sides?: number
  count?: number
}

interface DiceRollResponse {
  rolls: number[]
  total: number
  sides: number
  count: number
  user: {
    id: string
    email: string
    name: string
  }
  timestamp: string
}

interface ServerMetadata {
  server: {
    name: string
    version: string
    description: string
  }
  authentication: {
    type: string
    provider: string
  }
  security: {
    arcjet: {
      enabled: boolean
    }
  }
  tools: Array<{
    name: string
    endpoint: string
  }>
}

class MCPRollDiceClient {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Set OAuth access token
   * Obtain this via Clerk authentication flow
   */
  setAccessToken(token: string) {
    this.accessToken = token
  }

  /**
   * Get server metadata
   */
  async getServerMetadata(): Promise<ServerMetadata> {
    const response = await fetch(`${this.baseUrl}/api/mcp`)
    
    if (!response.ok) {
      throw new Error(`Failed to get server metadata: ${response.statusText}`)
    }
    
    return await response.json()
  }

  /**
   * Roll dice with specified parameters
   */
  async rollDice(params?: DiceRollRequest): Promise<DiceRollResponse> {
    if (!this.accessToken) {
      throw new Error('Access token not set. Call setAccessToken() first.')
    }

    const response = await fetch(`${this.baseUrl}/api/mcp/roll-dice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params || {}),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Roll dice failed: ${error.message || response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Get audit logs (admin only)
   */
  async getAuditLogs(limit = 50): Promise<any[]> {
    if (!this.accessToken) {
      throw new Error('Access token not set. Call setAccessToken() first.')
    }

    const response = await fetch(
      `${this.baseUrl}/api/mcp/audit?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get audit logs: ${response.statusText}`)
    }

    const data = await response.json()
    return data.logs
  }
}

// =================================================================
// Usage Examples
// =================================================================

async function exampleUsage() {
  // Initialize client
  const client = new MCPRollDiceClient('https://your-domain.vercel.app')

  // Set access token (obtained via Clerk OAuth flow)
  const accessToken = 'your_oauth_access_token_here'
  client.setAccessToken(accessToken)

  try {
    // Get server metadata
    console.log('Getting server metadata...')
    const metadata = await client.getServerMetadata()
    console.log('Server:', metadata.server.name, metadata.server.version)
    console.log('Available tools:', metadata.tools.map(t => t.name).join(', '))

    // Roll default dice (1d6)
    console.log('\nRolling 1d6...')
    const result1 = await client.rollDice()
    console.log(`Result: ${result1.rolls[0]}`)

    // Roll custom dice (2d20)
    console.log('\nRolling 2d20...')
    const result2 = await client.rollDice({ sides: 20, count: 2 })
    console.log(`Rolls: ${result2.rolls.join(', ')}`)
    console.log(`Total: ${result2.total}`)
    console.log(`Rolled by: ${result2.user.name} (${result2.user.email})`)

    // Roll 3d6 (common RPG roll)
    console.log('\nRolling 3d6 for character stats...')
    const result3 = await client.rollDice({ sides: 6, count: 3 })
    console.log(`Stat roll: ${result3.rolls.join(' + ')} = ${result3.total}`)

    // Get audit logs
    console.log('\nFetching recent audit logs...')
    const logs = await client.getAuditLogs(5)
    console.log(`Recent actions: ${logs.length}`)
    logs.forEach(log => {
      console.log(`  - ${log.action} by ${log.email} at ${log.timestamp}`)
    })

  } catch (error) {
    console.error('Error:', error)
  }
}

// =================================================================
// Claude Desktop Integration Example
// =================================================================

/*
 * Claude Desktop Configuration:
 * File: %APPDATA%/Claude/claude_desktop_config.json
 * 
 * {
 *   "mcpServers": {
 *     "roll-dice": {
 *       "command": "node",
 *       "args": ["path/to/mcp-client-wrapper.js"],
 *       "env": {
 *         "MCP_SERVER_URL": "https://your-domain.vercel.app",
 *         "CLERK_API_KEY": "your_clerk_api_key"
 *       }
 *     }
 *   }
 * }
 * 
 * Usage in Claude:
 * "Roll 2d20 for me"
 * "Roll 4d6 and drop the lowest (for D&D character creation)"
 * "Roll a d100"
 */

// =================================================================
// Python Client Example
// =================================================================

/*
import requests
from typing import Optional, Dict, List

class MCPRollDiceClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.access_token: Optional[str] = None
    
    def set_access_token(self, token: str):
        """Set OAuth access token"""
        self.access_token = token
    
    def roll_dice(self, sides: int = 6, count: int = 1) -> Dict:
        """Roll dice with specified parameters"""
        if not self.access_token:
            raise ValueError("Access token not set")
        
        response = requests.post(
            f"{self.base_url}/api/mcp/roll-dice",
            headers={
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            },
            json={"sides": sides, "count": count}
        )
        
        response.raise_for_status()
        return response.json()

# Usage
client = MCPRollDiceClient("https://your-domain.vercel.app")
client.set_access_token("your_token")

result = client.roll_dice(sides=20, count=2)
print(f"Rolls: {result['rolls']}")
print(f"Total: {result['total']}")
*/

// =================================================================
// cURL Examples
// =================================================================

/*
# Get server metadata
curl https://your-domain.vercel.app/api/mcp

# Roll default dice (1d6)
curl -X POST https://your-domain.vercel.app/api/mcp/roll-dice \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# Roll custom dice (2d20)
curl -X POST https://your-domain.vercel.app/api/mcp/roll-dice \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sides": 20, "count": 2}'

# Get tool metadata
curl https://your-domain.vercel.app/api/mcp/roll-dice

# Get audit logs
curl https://your-domain.vercel.app/api/mcp/audit?limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
*/

// =================================================================
// Error Handling
// =================================================================

async function robustExample() {
  const client = new MCPRollDiceClient('https://your-domain.vercel.app')
  client.setAccessToken('your_token')

  try {
    const result = await client.rollDice({ sides: 20, count: 2 })
    console.log('Success:', result)
  } catch (error: any) {
    if (error.message.includes('Rate limit exceeded')) {
      console.error('Too many requests. Wait before retrying.')
      // Implement exponential backoff
      await new Promise(resolve => setTimeout(resolve, 60000)) // Wait 1 minute
    } else if (error.message.includes('Unauthorized')) {
      console.error('Authentication failed. Token may be expired.')
      // Refresh token via Clerk
    } else if (error.message.includes('Bot detected')) {
      console.error('Request blocked by bot detection. Check User-Agent.')
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

// =================================================================
// Rate Limiting Best Practices
// =================================================================

class RateLimitedMCPClient extends MCPRollDiceClient {
  private requestQueue: Array<() => Promise<any>> = []
  private isProcessing = false
  private requestsPerMinute = 10
  private requestInterval = 60000 / this.requestsPerMinute // 6 seconds between requests

  /**
   * Roll dice with automatic rate limiting
   */
  async rollDiceWithRateLimit(params?: DiceRollRequest): Promise<DiceRollResponse> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.rollDice(params)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return

    this.isProcessing = true

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (request) {
        await request()
        // Wait before next request to avoid rate limiting
        if (this.requestQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.requestInterval))
        }
      }
    }

    this.isProcessing = false
  }
}

// Usage with rate limiting
async function rateLimitedExample() {
  const client = new RateLimitedMCPClient('https://your-domain.vercel.app')
  client.setAccessToken('your_token')

  // Fire off 20 requests - they'll be automatically rate-limited
  const promises = []
  for (let i = 0; i < 20; i++) {
    promises.push(client.rollDiceWithRateLimit({ sides: 6, count: 1 }))
  }

  const results = await Promise.all(promises)
  console.log(`Successfully rolled dice ${results.length} times`)
}

// Export for use in other modules
export { MCPRollDiceClient, RateLimitedMCPClient }
export type { DiceRollRequest, DiceRollResponse, ServerMetadata }
