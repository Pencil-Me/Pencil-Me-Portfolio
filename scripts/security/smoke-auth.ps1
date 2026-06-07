# Security smoke tests — Auth, CORS, rate limit (requires stack on :8080)
param(
    [string]$Base = 'http://localhost:8080',
    [string]$ApiKeyFe = 'secretApiFEkey',
    [string]$ApiKeyBe = 'secretApiBEkey'
)

$ErrorActionPreference = 'Continue'
$script:failed = 0

function Assert-Status {
    param(
        [string]$Name,
        [int]$Expected,
        [string]$Url,
        [string]$Method = 'GET',
        [hashtable]$Headers = @{},
        [string[]]$Form = @(),
        [int[]]$ExpectedAny = @()
    )
    $args = @('-s', '-o', 'NUL', '-w', '%{http_code}', '-X', $Method)
    foreach ($k in $Headers.Keys) { $args += @('-H', "$k`: $($Headers[$k])") }
    foreach ($f in $Form) { $args += @('-F', $f) }
    $args += $Url
    $code = [int](curl.exe @args)
    $ok = ($code -eq $Expected) -or ($ExpectedAny -contains $code)
    if (-not $ok) {
        $expectLabel = if ($ExpectedAny.Count -gt 0) { ($ExpectedAny -join '|') } else { "$Expected" }
        Write-Host "FAIL $Name : expected $expectLabel got $code ($Url)" -ForegroundColor Red
        $script:failed++
    } else {
        Write-Host "OK   $Name : $code"
    }
}

Write-Host "=== smoke-auth.ps1 ===" -ForegroundColor Cyan

Assert-Status 'REST all_projects no key' 401 "$Base/api2/all_projects"
Assert-Status 'REST all_projects fe_key' 200 "$Base/api2/all_projects" -Headers @{ 'API-Key' = $ApiKeyFe }
Assert-Status 'Python project no key' 401 "$Base/api/project"
Assert-Status 'Python project be_key' 200 "$Base/api/project" -Headers @{ 'API-Key' = $ApiKeyBe }
Assert-Status 'Mailer not exposed via gateway' 404 "$Base/mailer/send_email" -Method POST -ExpectedAny @(404, 405) -Form @(
    'sender=a@b.com', 'recipient=c@d.com', 'subject=T', 'message=M'
)
Assert-Status 'Honeypot' 400 "$Base/api2/send_email" -Method POST -Headers @{ 'API-Key' = $ApiKeyFe } -Form @(
    'contactByFax=1', 'name=x', 'email=a@b.com', 'message=x'
)

$cors = curl.exe -s -I -H "Origin: https://evil.example" -H "API-Key: $ApiKeyBe" "$Base/api/project" 2>&1
if ($cors -match 'Access-Control-Allow-Origin:\s*https://evil\.example') {
    Write-Host 'FAIL CORS reflects evil origin' -ForegroundColor Red
    $script:failed++
} else {
    Write-Host 'OK   CORS does not reflect evil origin (or no ACAO header)'
}

if ($script:failed -gt 0) {
    Write-Host "`n$($script:failed) check(s) failed" -ForegroundColor Red
    exit 1
}
Write-Host "`nAll checks passed" -ForegroundColor Green
exit 0
