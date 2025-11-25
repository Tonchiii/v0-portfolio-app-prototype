# OAuth MCP Server - Quick Test Script
# Tests all major endpoints and functionality

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$AuthToken = $env:TEST_AUTH_TOKEN
)

Write-Host "=====================================" -ForegroundColor Green
Write-Host " OAuth MCP Server - Quick Test" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

if (-not $AuthToken) {
    Write-Host "⚠️  Warning: No auth token provided" -ForegroundColor Yellow
    Write-Host "   Some tests will be skipped" -ForegroundColor Yellow
    Write-Host "   To test authenticated endpoints:" -ForegroundColor Yellow
    Write-Host "   `$env:TEST_AUTH_TOKEN = 'your_token'" -ForegroundColor Cyan
    Write-Host "   .\test-mcp-server.ps1" -ForegroundColor Cyan
    Write-Host ""
}

$testResults = @{
    Passed = 0
    Failed = 0
    Skipped = 0
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [int]$ExpectedStatus = 200,
        [bool]$RequiresAuth = $false
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Cyan
    
    if ($RequiresAuth -and -not $AuthToken) {
        Write-Host "  ⊘ Skipped (requires auth)" -ForegroundColor Yellow
        $script:testResults.Skipped++
        return
    }
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params -ErrorAction Stop
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "  ✅ Passed (Status: $($response.StatusCode))" -ForegroundColor Green
            $script:testResults.Passed++
        } else {
            Write-Host "  ❌ Failed (Expected: $ExpectedStatus, Got: $($response.StatusCode))" -ForegroundColor Red
            $script:testResults.Failed++
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  ✅ Passed (Status: $statusCode)" -ForegroundColor Green
            $script:testResults.Passed++
        } else {
            Write-Host "  ❌ Failed (Expected: $ExpectedStatus, Got: $statusCode)" -ForegroundColor Red
            Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Red
            $script:testResults.Failed++
        }
    }
}

Write-Host "Base URL: $BaseUrl" -ForegroundColor White
Write-Host ""

# =================================================================
# Server Metadata Tests
# =================================================================

Write-Host "--- Server Metadata Tests ---" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint `
    -Name "Get server metadata" `
    -Url "$BaseUrl/api/mcp" `
    -ExpectedStatus 200

Test-Endpoint `
    -Name "Get roll_dice tool metadata" `
    -Url "$BaseUrl/api/mcp/roll-dice" `
    -Method "GET" `
    -ExpectedStatus 200

Write-Host ""

# =================================================================
# Authentication Tests
# =================================================================

Write-Host "--- Authentication Tests ---" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint `
    -Name "Reject unauthenticated request" `
    -Url "$BaseUrl/api/mcp/roll-dice" `
    -Method "POST" `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body '{"sides":6,"count":1}' `
    -ExpectedStatus 401

Test-Endpoint `
    -Name "Reject invalid token" `
    -Url "$BaseUrl/api/mcp/roll-dice" `
    -Method "POST" `
    -Headers @{ 
        "Authorization" = "Bearer invalid_token_12345"
        "Content-Type" = "application/json" 
    } `
    -Body '{"sides":6,"count":1}' `
    -ExpectedStatus 401

if ($AuthToken) {
    Test-Endpoint `
        -Name "Accept valid token" `
        -Url "$BaseUrl/api/mcp/roll-dice" `
        -Method "POST" `
        -Headers @{ 
            "Authorization" = "Bearer $AuthToken"
            "Content-Type" = "application/json" 
        } `
        -Body '{"sides":6,"count":1}' `
        -ExpectedStatus 200 `
        -RequiresAuth $true
}

Write-Host ""

# =================================================================
# Tool Functionality Tests
# =================================================================

Write-Host "--- Tool Functionality Tests ---" -ForegroundColor Magenta
Write-Host ""

if ($AuthToken) {
    # Test default roll (1d6)
    Test-Endpoint `
        -Name "Roll default dice (1d6)" `
        -Url "$BaseUrl/api/mcp/roll-dice" `
        -Method "POST" `
        -Headers @{ 
            "Authorization" = "Bearer $AuthToken"
            "Content-Type" = "application/json" 
        } `
        -Body '{}' `
        -ExpectedStatus 200 `
        -RequiresAuth $true
    
    # Test custom roll (2d20)
    Test-Endpoint `
        -Name "Roll custom dice (2d20)" `
        -Url "$BaseUrl/api/mcp/roll-dice" `
        -Method "POST" `
        -Headers @{ 
            "Authorization" = "Bearer $AuthToken"
            "Content-Type" = "application/json" 
        } `
        -Body '{"sides":20,"count":2}' `
        -ExpectedStatus 200 `
        -RequiresAuth $true
}

Write-Host ""

# =================================================================
# Input Validation Tests
# =================================================================

Write-Host "--- Input Validation Tests ---" -ForegroundColor Magenta
Write-Host ""

if ($AuthToken) {
    # Test invalid sides (< 2)
    Test-Endpoint `
        -Name "Reject invalid sides (< 2)" `
        -Url "$BaseUrl/api/mcp/roll-dice" `
        -Method "POST" `
        -Headers @{ 
            "Authorization" = "Bearer $AuthToken"
            "Content-Type" = "application/json" 
        } `
        -Body '{"sides":1,"count":2}' `
        -ExpectedStatus 400 `
        -RequiresAuth $true
    
    # Test invalid sides (> 100)
    Test-Endpoint `
        -Name "Reject invalid sides (> 100)" `
        -Url "$BaseUrl/api/mcp/roll-dice" `
        -Method "POST" `
        -Headers @{ 
            "Authorization" = "Bearer $AuthToken"
            "Content-Type" = "application/json" 
        } `
        -Body '{"sides":150,"count":2}' `
        -ExpectedStatus 400 `
        -RequiresAuth $true
    
    # Test invalid count (> 10)
    Test-Endpoint `
        -Name "Reject invalid count (> 10)" `
        -Url "$BaseUrl/api/mcp/roll-dice" `
        -Method "POST" `
        -Headers @{ 
            "Authorization" = "Bearer $AuthToken"
            "Content-Type" = "application/json" 
        } `
        -Body '{"sides":6,"count":15}' `
        -ExpectedStatus 400 `
        -RequiresAuth $true
}

Write-Host ""

# =================================================================
# Rate Limiting Test (Optional)
# =================================================================

if ($AuthToken -and $env:TEST_RATE_LIMIT -eq "true") {
    Write-Host "--- Rate Limiting Test ---" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Sending 15 rapid requests (limit is 10/min)..." -ForegroundColor Yellow
    
    $rateLimitResults = @{
        Success = 0
        RateLimited = 0
    }
    
    for ($i = 1; $i -le 15; $i++) {
        try {
            $response = Invoke-WebRequest `
                -Uri "$BaseUrl/api/mcp/roll-dice" `
                -Method POST `
                -Headers @{ 
                    "Authorization" = "Bearer $AuthToken"
                    "Content-Type" = "application/json" 
                } `
                -Body '{"sides":6,"count":1}' `
                -UseBasicParsing `
                -ErrorAction Stop
            
            if ($response.StatusCode -eq 200) {
                $rateLimitResults.Success++
                Write-Host "  Request $i`: ✅ Success" -ForegroundColor Green
            }
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            if ($statusCode -eq 429) {
                $rateLimitResults.RateLimited++
                Write-Host "  Request $i`: ⚠️  Rate Limited" -ForegroundColor Yellow
            } else {
                Write-Host "  Request $i`: ❌ Error ($statusCode)" -ForegroundColor Red
            }
        }
        
        Start-Sleep -Milliseconds 100
    }
    
    Write-Host ""
    Write-Host "Rate Limit Test Results:" -ForegroundColor Cyan
    Write-Host "  Successful: $($rateLimitResults.Success)" -ForegroundColor Green
    Write-Host "  Rate Limited: $($rateLimitResults.RateLimited)" -ForegroundColor Yellow
    
    if ($rateLimitResults.RateLimited -gt 0) {
        Write-Host "  ✅ Rate limiting is working correctly" -ForegroundColor Green
        $script:testResults.Passed++
    } else {
        Write-Host "  ⚠️  No rate limiting detected (may need more requests or time)" -ForegroundColor Yellow
        $script:testResults.Skipped++
    }
    
    Write-Host ""
} else {
    Write-Host "--- Rate Limiting Test ---" -ForegroundColor Magenta
    Write-Host "  ⊘ Skipped (set `$env:TEST_RATE_LIMIT = 'true' to enable)" -ForegroundColor Yellow
    $script:testResults.Skipped++
    Write-Host ""
}

# =================================================================
# Audit Logs Test
# =================================================================

Write-Host "--- Audit Logs Test ---" -ForegroundColor Magenta
Write-Host ""

if ($AuthToken) {
    Test-Endpoint `
        -Name "Get audit logs" `
        -Url "$BaseUrl/api/mcp/audit?limit=10" `
        -Method "GET" `
        -Headers @{ "Authorization" = "Bearer $AuthToken" } `
        -ExpectedStatus 200 `
        -RequiresAuth $true
}

Write-Host ""

# =================================================================
# Summary
# =================================================================

Write-Host "=====================================" -ForegroundColor Green
Write-Host " Test Summary" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Passed:  $($testResults.Passed)" -ForegroundColor Green
Write-Host "Failed:  $($testResults.Failed)" -ForegroundColor $(if ($testResults.Failed -gt 0) { "Red" } else { "Green" })
Write-Host "Skipped: $($testResults.Skipped)" -ForegroundColor Yellow
Write-Host ""

if ($testResults.Failed -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ Some tests failed. Check output above." -ForegroundColor Red
    exit 1
}
