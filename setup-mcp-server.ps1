# Week 8 Deliverable - OAuth MCP Roll-Dice Server
# Quick Setup Script for Development

Write-Host "=====================================" -ForegroundColor Green
Write-Host " OAuth MCP Server - Quick Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check Node.js installation
Write-Host "Checking prerequisites..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    
    $envTemplate = @"
# Clerk OAuth Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# GitHub OAuth (via Clerk)
OAUTH_PROVIDER=github
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OAUTH_REDIRECT_URI=http://localhost:3000/oauth/callback

# Arcjet Security
ARCJET_KEY=ajkey_your_key_here

# Database (Optional for development)
DATABASE_URL=postgresql://user:password@host:5432/database

# Token Encryption (generate with: openssl rand -hex 32)
TOKEN_ENCRYPTION_KEY=your_32_byte_hex_key_here

# Optional: GROQ AI
GROQ_API_KEY=your_groq_key_here
"@
    
    [System.IO.File]::WriteAllText("$PWD\.env", $envTemplate)
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit .env and add your actual credentials" -ForegroundColor Yellow
    Write-Host ""
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host " Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure OAuth providers:" -ForegroundColor White
Write-Host "   • Sign up at clerk.com" -ForegroundColor Gray
Write-Host "   • Create GitHub OAuth app" -ForegroundColor Gray
Write-Host "   • Update .env with credentials" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configure Arcjet:" -ForegroundColor White
Write-Host "   • Sign up at arcjet.com" -ForegroundColor Gray
Write-Host "   • Create project and get API key" -ForegroundColor Gray
Write-Host "   • Update ARCJET_KEY in .env" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Generate encryption key:" -ForegroundColor White
Write-Host "   • Run: openssl rand -hex 32" -ForegroundColor Gray
Write-Host "   • Or use: node -e ""console.log(require('crypto').randomBytes(32).toString('hex'))""" -ForegroundColor Gray
Write-Host "   • Update TOKEN_ENCRYPTION_KEY in .env" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Visit documentation:" -ForegroundColor White
Write-Host "   http://localhost:3000/mcp-security" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed setup instructions, see:" -ForegroundColor White
Write-Host "• OAUTH-MCP-README.md" -ForegroundColor Cyan
Write-Host "• VERCEL-DEPLOYMENT-CONFIG.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
