#Requires -Version 5.1
<#
.SYNOPSIS
  Entfernt lokale Build-Artefakte und Deploy-Output.

.EXAMPLE
  .\deploy\clean.ps1
  .\deploy\clean.ps1 -IncludeFrontendDist
  .\deploy\clean.ps1 -All
#>
[CmdletBinding()]
param(
    [switch]$IncludeFrontendDist,
    [switch]$IncludeNodeModules,
    [switch]$All
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ($All) {
    $IncludeFrontendDist = $true
}

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

$targets = @(
    (Join-Path $PSScriptRoot 'out'),
    (Join-Path $RepoRoot 'applications/php-rest-api/.phpunit.result.cache'),
    (Join-Path $RepoRoot 'applications/php-rest-api/.phpunit.cache'),
    (Join-Path $RepoRoot 'applications/php-mailer-api/.phpunit.result.cache'),
    (Join-Path $RepoRoot 'applications/php-mailer-api/.phpunit.cache'),
    (Join-Path $RepoRoot 'applications/frontend/src/environments/environment.deploy.ts'),
    (Join-Path $RepoRoot 'applications/frontend/.angular'),
    (Join-Path $RepoRoot 'applications/frontend/coverage')
)

if ($IncludeFrontendDist) {
    $targets += (Join-Path $RepoRoot 'applications/frontend/dist')
}

if ($IncludeNodeModules) {
    $targets += (Join-Path $RepoRoot 'applications/frontend/node_modules')
}

$removed = 0
foreach ($path in $targets) {
    if (-not (Test-Path $path)) { continue }
    Write-Host "Entferne: $path" -ForegroundColor DarkGray
    Remove-Item $path -Recurse -Force
    $removed++
}

Write-Host "Cleanup abgeschlossen ($removed Eintraege entfernt)." -ForegroundColor Green
