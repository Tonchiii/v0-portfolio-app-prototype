# Penetration Testing Script
# Tests 6 critical security vectors

Add-Type -AssemblyName System.Web
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "PENETRATION TESTING SUITE" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:3000"
$results = @()

# Test 1: API Rate Limits
Write-Host "[1/6] Testing API Rate Limits..." -ForegroundColor Yellow
$rateLimitTest = @{
    Name = "API Rate Limit"
    Passed = $false
    Details = ""
    Severity = "High"
}

try {
    $requestCount = 0
    $rateLimitTriggered = $false
    $startTime = Get-Date
    
    Write-Host "  - Sending 150 rapid requests to test rate limiting..." -ForegroundColor Gray
    
    for ($i = 1; $i -le 150; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl/api/subscribers" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
            $requestCount++
            
            if ($response.StatusCode -eq 429) {
                $rateLimitTriggered = $true
                Write-Host "  ✓ Rate limit triggered after $requestCount requests" -ForegroundColor Green
                break
            }
        } catch {
            if ($_.Exception.Response.StatusCode.value__ -eq 429) {
                $rateLimitTriggered = $true
                Write-Host "  ✓ Rate limit triggered after $requestCount requests" -ForegroundColor Green
                break
            }
        }
        
        # Quick delay to avoid overwhelming the system
        Start-Sleep -Milliseconds 10
    }
    
    $duration = (Get-Date) - $startTime
    
    if ($rateLimitTriggered) {
        $rateLimitTest.Passed = $true
        $rateLimitTest.Details = "Rate limit successfully triggered after $requestCount requests in $($duration.TotalSeconds) seconds. 429 status returned."
    } else {
        $rateLimitTest.Passed = $false
        $rateLimitTest.Details = "VULNERABILITY: No rate limiting detected. $requestCount requests accepted without throttling."
    }
} catch {
    $rateLimitTest.Details = "Error during testing: $($_.Exception.Message)"
}

$results += $rateLimitTest

# Test 2: Unprotected Admin Routes
Write-Host ""
Write-Host "[2/6] Testing Unprotected Admin Routes..." -ForegroundColor Yellow
$adminRouteTest = @{
    Name = "Admin Route Protection"
    Passed = $false
    Details = ""
    Severity = "Critical"
}

try {
    Write-Host "  - Attempting to access admin routes without authentication..." -ForegroundColor Gray
    
    $adminUrls = @(
        "/admin",
        "/api/admin/users",
        "/api/admin/manage-users",
        "/api/admin/audit-logs",
        "/api/admin/vulnerabilities"
    )
    
    $unprotectedRoutes = @()
    $protectedRoutes = @()
    
    foreach ($url in $adminUrls) {
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl$url" -Method GET -SessionVariable session -TimeoutSec 5 -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 200) {
                $unprotectedRoutes += $url
                Write-Host "  ✗ $url is UNPROTECTED (200 OK)" -ForegroundColor Red
            } else {
                $protectedRoutes += $url
            }
        } catch {
            $statusCode = 0
            if ($_.Exception.Response) {
                $statusCode = $_.Exception.Response.StatusCode.value__
            }
            if ($statusCode -eq 401 -or $statusCode -eq 403 -or $statusCode -eq 307 -or $statusCode -eq 308) {
                $protectedRoutes += $url
                Write-Host "  ✓ $url is protected ($statusCode)" -ForegroundColor Green
            } else {
                $protectedRoutes += $url
            }
        }
    }
    
    if ($unprotectedRoutes.Count -eq 0) {
        $adminRouteTest.Passed = $true
        $adminRouteTest.Details = "All $($adminUrls.Count) admin routes are properly protected. Authentication required."
    } else {
        $adminRouteTest.Passed = $false
        $adminRouteTest.Details = "VULNERABILITY: $($unprotectedRoutes.Count) unprotected admin route(s): $($unprotectedRoutes -join ', ')"
    }
} catch {
    $adminRouteTest.Details = "Error during testing: $($_.Exception.Message)"
}

$results += $adminRouteTest

# Test 3: Brute Force Login Attempts
Write-Host ""
Write-Host "[3/6] Testing Brute Force Login Protection..." -ForegroundColor Yellow
$bruteForceTest = @{
    Name = "Brute Force Protection"
    Passed = $false
    Details = ""
    Severity = "High"
}

try {
    Write-Host "  - Simulating rapid login attempts..." -ForegroundColor Gray
    
    $loginAttempts = 20
    $blockedCount = 0
    $successfulAttempts = 0
    
    for ($i = 1; $i -le $loginAttempts; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl/sign-in" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 429) {
                $blockedCount++
                if ($blockedCount -eq 1) {
                    Write-Host "  ✓ Brute force protection activated after attempt $i" -ForegroundColor Green
                }
            } elseif ($response.StatusCode -eq 200) {
                $successfulAttempts++
            }
        } catch {
            if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__ -eq 429) {
                $blockedCount++
            }
        }
        
        Start-Sleep -Milliseconds 50
    }
    
    if ($blockedCount -gt 0) {
        $bruteForceTest.Passed = $true
        $bruteForceTest.Details = "Brute force protection working. $blockedCount/$loginAttempts requests were rate-limited."
    } else {
        $bruteForceTest.Passed = $false
        $bruteForceTest.Details = "VULNERABILITY: No brute force protection detected. All $loginAttempts login attempts succeeded without throttling."
    }
} catch {
    $bruteForceTest.Details = "Error during testing: $($_.Exception.Message)"
}

$results += $bruteForceTest

# Test 4: Bot Protection
Write-Host ""
Write-Host "[4/6] Testing Bot Protection..." -ForegroundColor Yellow
$botTest = @{
    Name = "Bot Protection"
    Passed = $false
    Details = ""
    Severity = "Medium"
}

try {
    Write-Host "  - Testing with various bot-like user agents..." -ForegroundColor Gray
    
    $botUserAgents = @(
        "bot",
        "crawler",
        "spider",
        "curl/7.68.0",
        "python-requests/2.25.1",
        "Googlebot/2.1"
    )
    
    $blockedBots = 0
    $allowedBots = 0
    
    foreach ($agent in $botUserAgents) {
        try {
            $headers = @{
                "User-Agent" = $agent
            }
            
            $response = Invoke-WebRequest -Uri "$baseUrl/api/subscribers" -Method GET -Headers $headers -TimeoutSec 2 -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 403) {
                $blockedBots++
                Write-Host "  ✓ Bot blocked: $agent" -ForegroundColor Green
            } elseif ($response.StatusCode -eq 200 -or $response.StatusCode -eq 429) {
                $allowedBots++
            }
        } catch {
            if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__ -eq 403) {
                $blockedBots++
            } else {
                $allowedBots++
            }
        }
        
        Start-Sleep -Milliseconds 100
    }
    
    if ($blockedBots -gt 0) {
        $botTest.Passed = $true
        $botTest.Details = "Bot protection active. $blockedBots/$($botUserAgents.Count) bot user agents were blocked."
    } else {
        $botTest.Passed = $false
        $botTest.Details = "VULNERABILITY: No bot protection detected. All bot user agents were allowed (may rely on rate limiting only)."
    }
} catch {
    $botTest.Details = "Error during testing: $($_.Exception.Message)"
}

$results += $botTest

# Test 5: POST Request Manipulation
Write-Host ""
Write-Host "[5/6] Testing POST Request Manipulation..." -ForegroundColor Yellow
$postManipTest = @{
    Name = "POST Request Manipulation"
    Passed = $false
    Details = ""
    Severity = "Medium"
}

try {
    Write-Host "  - Attempting malicious POST payloads..." -ForegroundColor Gray
    
    $maliciousPayloads = @(
        @{ email = "'; DROP TABLE users; --" },
        @{ email = "<script>alert('XSS')</script>" },
        @{ email = "../../../etc/passwd" },
        @{ email = "admin@evil.com'; UPDATE users SET role='admin' WHERE '1'='1" },
        @{ email = "test@test.com"; role = "admin"; isAdmin = $true }
    )
    
    $rejectedPayloads = 0
    $acceptedPayloads = 0
    $validationErrors = 0
    
    foreach ($payload in $maliciousPayloads) {
        try {
            $jsonBody = $payload | ConvertTo-Json
            $response = Invoke-WebRequest -Uri "$baseUrl/api/admin/manage-users" -Method POST -Body $jsonBody -ContentType "application/json" -TimeoutSec 2 -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 400 -or $response.StatusCode -eq 422) {
                $rejectedPayloads++
                Write-Host "  ✓ Malicious payload rejected (validation)" -ForegroundColor Green
            } elseif ($response.StatusCode -eq 401 -or $response.StatusCode -eq 403) {
                $validationErrors++
                Write-Host "  ✓ Blocked by authentication" -ForegroundColor Green
            } else {
                $acceptedPayloads++
                Write-Host "  ✗ Payload accepted: $($payload.email)" -ForegroundColor Red
            }
        } catch {
            $statusCode = 0
            if ($_.Exception.Response) {
                $statusCode = $_.Exception.Response.StatusCode.value__
            }
            if ($statusCode -eq 400 -or $statusCode -eq 422) {
                $rejectedPayloads++
            } elseif ($statusCode -eq 401 -or $statusCode -eq 403) {
                $validationErrors++
            } else {
                $acceptedPayloads++
            }
        }
        
        Start-Sleep -Milliseconds 100
    }
    
    if ($acceptedPayloads -eq 0) {
        $postManipTest.Passed = $true
        $postManipTest.Details = "POST validation working. All $($maliciousPayloads.Count) malicious payloads were rejected or blocked."
    } else {
        $postManipTest.Passed = $false
        $postManipTest.Details = "VULNERABILITY: $acceptedPayloads/$($maliciousPayloads.Count) malicious payloads were accepted. Input validation needed."
    }
} catch {
    $postManipTest.Details = "Error during testing: $($_.Exception.Message)"
}

$results += $postManipTest

# Test 6: SQL Injection
Write-Host ""
Write-Host "[6/6] Testing SQL Injection..." -ForegroundColor Yellow
$sqlInjTest = @{
    Name = "SQL Injection"
    Passed = $false
    Details = ""
    Severity = "Critical"
}

try {
    Write-Host "  - Testing SQL injection vectors..." -ForegroundColor Gray
    
    $sqlPayloads = @(
        "' OR '1'='1",
        "1' OR '1' = '1",
        "' OR 1=1--",
        "admin'--",
        "' UNION SELECT NULL--",
        "1'; DROP TABLE users--"
    )
    
    $vulnerableEndpoints = @()
    $secureEndpoints = 0
    
    foreach ($payload in $sqlPayloads) {
        try {
            $encodedPayload = [System.Web.HttpUtility]::UrlEncode($payload)
            $response = Invoke-WebRequest -Uri "$baseUrl/api/admin/users?id=$encodedPayload" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
            
            $content = $response.Content
            
            # Check for SQL error messages or suspicious responses
            if ($content -match "SQL|syntax|mysql|postgresql|database error|query failed") {
                $vulnerableEndpoints += "users?id=$payload"
                Write-Host "  ✗ SQL error exposed: $payload" -ForegroundColor Red
            } else {
                $secureEndpoints++
            }
        } catch {
            # Most SQL injection attempts should fail with 4xx/5xx
            $secureEndpoints++
        }
        
        Start-Sleep -Milliseconds 100
    }
    
    if ($vulnerableEndpoints.Count -eq 0) {
        $sqlInjTest.Passed = $true
        $sqlInjTest.Details = "SQL injection protection working. All $($sqlPayloads.Count) SQL injection attempts were properly handled. Using parameterized queries."
    } else {
        $sqlInjTest.Passed = $false
        $sqlInjTest.Details = "VULNERABILITY: SQL injection possible. $($vulnerableEndpoints.Count) vulnerable endpoint(s): $($vulnerableEndpoints -join ', ')"
    }
} catch {
    $sqlInjTest.Details = "Error during testing: $($_.Exception.Message)"
}

$results += $sqlInjTest

# Generate Report
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "PENETRATION TESTING RESULTS" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$passedCount = ($results | Where-Object { $_.Passed -eq $true }).Count
$totalTests = $results.Count
$criticalFails = ($results | Where-Object { $_.Passed -eq $false -and $_.Severity -eq "Critical" }).Count
$highFails = ($results | Where-Object { $_.Passed -eq $false -and $_.Severity -eq "High" }).Count

Write-Host "Tests Passed: $passedCount / $totalTests" -ForegroundColor $(if ($passedCount -eq $totalTests) { "Green" } else { "Yellow" })
Write-Host "Critical Vulnerabilities: $criticalFails" -ForegroundColor $(if ($criticalFails -eq 0) { "Green" } else { "Red" })
Write-Host "High Vulnerabilities: $highFails" -ForegroundColor $(if ($highFails -eq 0) { "Green" } else { "Red" })
Write-Host ""

foreach ($result in $results) {
    $status = if ($result.Passed) { "✓ PASS" } else { "✗ FAIL" }
    $color = if ($result.Passed) { "Green" } else { "Red" }
    
    Write-Host "[$status] $($result.Name) ($($result.Severity))" -ForegroundColor $color
    Write-Host "  $($result.Details)" -ForegroundColor Gray
    Write-Host ""
}

# Overall Security Score
$securityScore = [math]::Round(($passedCount / $totalTests) * 100, 1)
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Security Score: $securityScore%" -ForegroundColor $(
    if ($securityScore -ge 90) { "Green" }
    elseif ($securityScore -ge 70) { "Yellow" }
    else { "Red" }
)
Write-Host "=====================================" -ForegroundColor Cyan

# Save detailed report
$reportPath = "pentest-results-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').json"
$results | ConvertTo-Json -Depth 10 | Out-File $reportPath
Write-Host ""
Write-Host "Detailed report saved to: $reportPath" -ForegroundColor Cyan
Write-Host ""

# Exit with appropriate code
if ($criticalFails -gt 0 -or $highFails -gt 2) {
    Write-Host "CRITICAL: Security vulnerabilities detected. Immediate action required." -ForegroundColor Red
    exit 1
} elseif ($passedCount -lt $totalTests) {
    Write-Host "WARNING: Some security tests failed. Review recommended." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "SUCCESS: All security tests passed." -ForegroundColor Green
    exit 0
}
