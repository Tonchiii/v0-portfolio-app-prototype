param(
  [string]$Target = "http://localhost:3000",
  [string]$Wordlist = "ai-protector/wordlists/ffuf_small.txt",
  [string]$OutTxt = "ai-protector/evidence/ffuf_results.txt",
  [string]$OutJson = "ai-protector/evidence/ffuf_results.json"
)

if (-not (Test-Path $Wordlist)) {
  Write-Error "Wordlist not found: $Wordlist"
  exit 1
}

New-Item -ItemType Directory -Path (Split-Path $OutTxt) -Force | Out-Null

$results = @()
Get-Content $Wordlist | ForEach-Object {
  $path = $_.Trim()
  if ($path -eq "") { return }
  $url = if ($path -match "^https?://") { $path } else { "$Target/$path" }
  try {
    $resp = curl -s -o $null -w "%%{http_code} %%{size_download} %%{time_total}" $url
    $parts = $resp -split " "
    $code = $parts[0]
    $size = $parts[1]
    $time = $parts[2]
    $line = "{0} {1} {2} {3}" -f $code, $size, $time, $url
    $results += @{ url = $url; status = $code; size = [int]$size; time = $time }
    Add-Content -Path $OutTxt -Value $line
    Write-Host $line
  } catch {
    Write-Warning "Request failed: $url"
    $results += @{ url = $url; status = 'ERR'; size = 0; time = 0 }
    Add-Content -Path $OutTxt -Value "ERR 0 0 $url"
  }
}

$results | ConvertTo-Json -Depth 4 | Out-File -FilePath $OutJson -Encoding utf8
Write-Host "Results saved to $OutTxt and $OutJson"
