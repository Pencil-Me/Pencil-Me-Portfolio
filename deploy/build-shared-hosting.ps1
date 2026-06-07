#Requires -Version 5.1
<#
.SYNOPSIS
  Baut Deploy-Pakete fuer Shared Hosting (FTP + PHP): Frontend, REST API, Mailer.

.DESCRIPTION
  1. Prueft deploy.config.local.json und .env.prod der PHP-Apps
  2. npm build (Frontend) mit Prod-Keys aus deploy.config + .env.prod
  3. composer install --no-dev fuer REST API und Mailer
  4. Erzeugt uploadfertige Ordner unter deploy/out/
  5. Optional: FTP-Upload via WinSCP (falls installiert)

.EXAMPLE
  .\deploy\build-shared-hosting.ps1

.EXAMPLE
  .\deploy\build-shared-hosting.ps1 -SkipNpmInstall -SkipComposer -Zip

.EXAMPLE
  .\deploy\build-shared-hosting.ps1 -Upload
#>
[CmdletBinding()]
param(
    [string]$OutputDir = '',
    [switch]$SkipFrontend,
    [switch]$SkipRestApi,
    [switch]$SkipMailer,
    [switch]$SkipDatabase,
    [switch]$SkipNpmInstall,
    [switch]$SkipComposer,
    [switch]$Zip,
    [switch]$Upload
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'Deploy-Helpers.ps1')

$RepoRoot = Get-RepoRoot
$ConfigPath = Join-Path $PSScriptRoot 'deploy.config.local.json'
$ConfigExample = Join-Path $PSScriptRoot 'deploy.config.example.json'

if (-not (Test-Path $ConfigPath)) {
    if (Test-Path $ConfigExample) {
        Copy-Item $ConfigExample $ConfigPath
        Write-Host "deploy.config.local.json aus Example erzeugt - URLs/FTP bitte pruefen." -ForegroundColor Yellow
    } else {
        Write-Error "deploy.config.local.json fehlt und deploy.config.example.json nicht gefunden."
    }
}

$config = Get-Content $ConfigPath -Raw | ConvertFrom-Json

$paths = @{
    Frontend    = Join-Path $RepoRoot 'applications/frontend'
    RestApi     = Join-Path $RepoRoot 'applications/php-rest-api'
    Mailer      = Join-Path $RepoRoot 'applications/php-mailer-api'
    RestEnvProd = Join-Path $RepoRoot 'applications/php-rest-api/src/Inc/.env.prod'
    MailerEnvProd = Join-Path $RepoRoot 'applications/php-mailer-api/src/Inc/.env.prod'
    SqlDump     = Join-Path $RepoRoot 'applications/db/init-scripts/dll.sql'
    Templates   = Join-Path $PSScriptRoot 'templates'
}

if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $PSScriptRoot 'out'
}

$out = @{
    Root     = $OutputDir
    Database = Join-Path $OutputDir '1-database'
    Mailer   = Join-Path $OutputDir '2-mailer'
    RestApi  = Join-Path $OutputDir '3-rest-api'
    Frontend = Join-Path $OutputDir '4-frontend'
}

function Assert-Prerequisites {
    if (-not $SkipFrontend) {
        if (-not (Test-CommandAvailable 'npm')) { throw 'npm nicht gefunden (Node.js installieren)' }
    }
    if ((-not $SkipRestApi) -or (-not $SkipMailer)) {
        if (-not (Test-CommandAvailable 'composer')) { throw 'composer nicht gefunden' }
    }
    if (-not $SkipRestApi) {
        if (-not (Test-Path $paths.RestEnvProd)) {
            throw "REST .env.prod fehlt: $($paths.RestEnvProd)`n  cp applications/php-rest-api/src/Inc/.env.example -> .env.prod"
        }
    }
    if (-not $SkipMailer -and -not (Test-Path $paths.MailerEnvProd)) {
        throw "Mailer .env.prod fehlt: $($paths.MailerEnvProd)`n  cp applications/php-mailer-api/src/Inc/.env.example -> .env.prod"
    }
}

function Test-KeyConsistency {
    param(
        [Parameter(Mandatory)][hashtable]$RestEnv,
        [Parameter(Mandatory)][hashtable]$MailerEnv
    )

    $mailApiKey = $RestEnv['MAIL_API_KEY']
    $mailerBeKey = $MailerEnv['API_KEY_BE']
    if ($mailApiKey -ne $mailerBeKey) {
        throw "MAIL_API_KEY (REST) und API_KEY_BE (Mailer) stimmen nicht ueberein."
    }
}

function Sync-MailerEnvProduction {
    $lines = Get-Content $paths.MailerEnvProd -Encoding UTF8
    $hasAppEnv = $false
    $newLines = foreach ($line in $lines) {
        if ($line -match '^\s*APP_ENV\s*=') {
            $hasAppEnv = $true
            'APP_ENV=production'
        } else {
            $line
        }
    }
    if (-not $hasAppEnv) { $newLines += 'APP_ENV=production' }
    Set-Content -Path $paths.MailerEnvProd -Value $newLines -Encoding UTF8
}

function Sync-RestEnvFromConfig {
    $envVars = Read-DotEnvFile -Path $paths.RestEnvProd
    $feKey = $envVars['API_KEY_FE']
    $beKey = $envVars['API_KEY_BE']

    if ([string]::IsNullOrWhiteSpace($feKey) -or $feKey -eq 'secretApiFEkey') {
        Write-Warning 'API_KEY_FE in .env.prod ist noch Dev-Default - fuer Production aendern!'
    }
    if ([string]::IsNullOrWhiteSpace($beKey) -or $beKey -eq 'secretApiBEkey') {
        Write-Warning 'API_KEY_BE in .env.prod ist noch Dev-Default - fuer Production aendern!'
    }

    $origins = @($config.frontendDomain)
    if ($config.frontendDomain -match '^https://www\.(.+)$') {
        $origins += "https://$($Matches[1])"
    } elseif ($config.frontendDomain -match '^https://([^/]+)$') {
        $origins += "https://www.$($Matches[1])"
    }
    $originList = ($origins | Select-Object -Unique) -join ','

    $mailerBase = $config.mailerBaseUrl.TrimEnd('/')
    $updates = @{
        MAIL_ENDPOINT    = "$mailerBase/send_email"
        HEALTH_ENDPOINT  = "$mailerBase/healthcheck"
        APP_ENV          = 'production'
        ALLOWED_ORIGINS  = $originList
    }

    $lines = Get-Content $paths.RestEnvProd -Encoding UTF8
    $keysWritten = @{}
    $newLines = foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed -eq '' -or $trimmed.StartsWith('#')) { $line; continue }
        $idx = $trimmed.IndexOf('=')
        if ($idx -lt 1) { $line; continue }
        $key = $trimmed.Substring(0, $idx).Trim()
        if ($updates.ContainsKey($key)) {
            $keysWritten[$key] = $true
            "$key=$($updates[$key])"
        } else {
            $line
        }
    }
    foreach ($key in $updates.Keys) {
        if (-not $keysWritten.ContainsKey($key)) {
            $newLines += "$key=$($updates[$key])"
        }
    }
    Set-Content -Path $paths.RestEnvProd -Value $newLines -Encoding UTF8
    Write-Host 'REST .env.prod: MAIL_ENDPOINT, HEALTH_ENDPOINT, ALLOWED_ORIGINS synchronisiert' -ForegroundColor Green

    return @{
        ApiKeyFe = $feKey
        ApiKeyBe = $beKey
    }
}

function Build-FrontendPackage {
    param(
        [Parameter(Mandatory)][string]$ApiKeyFe,
        [Parameter(Mandatory)][string]$ApiBaseUrl
    )

    $envDeployPath = Join-Path $paths.Frontend 'src/environments/environment.deploy.ts'
    $envContent = @"
import type { Environment } from './environment.model';

/** Auto-generiert von deploy/build-shared-hosting.ps1 - nicht committen */
export const environment: Environment = {
  production: true,
  API_KEY: '$ApiKeyFe',
  API_BASE_URL: '$ApiBaseUrl',
};
"@
    Set-Content -Path $envDeployPath -Value $envContent -Encoding UTF8 -NoNewline

    if (-not $SkipNpmInstall) {
        Invoke-External -Name 'npm' -WorkingDirectory $paths.Frontend -Arguments @('ci')
    }
    Invoke-External -Name 'npx' -WorkingDirectory $paths.Frontend -Arguments @('ng', 'build', '--configuration', 'deploy')

    $browserOut = Join-Path $paths.Frontend 'dist/portfolio/browser'
    if (-not (Test-Path $browserOut)) {
        throw "Frontend-Build fehlt: $browserOut"
    }

    Reset-Directory -Path $out.Frontend
    Copy-Tree -Source $browserOut -Destination $out.Frontend

    Copy-FrontendRootAssets -FrontendOutDir $out.Frontend -AssetsRootSource (Join-Path $paths.Frontend 'src/assets/root')

    $htaccessSrc = Join-Path $paths.Frontend 'src/assets/root/.htaccess'
    if (Test-Path $htaccessSrc) {
        Copy-Item $htaccessSrc (Join-Path $out.Frontend '.htaccess') -Force
    }

    Assert-FrontendDeployPackage -FrontendOutDir $out.Frontend

    if (Test-Path $envDeployPath) {
        Remove-Item $envDeployPath -Force
    }

    Write-Host "Frontend-Paket: $($out.Frontend)" -ForegroundColor Green
}

function Build-RestApiPackage {
    if (-not $SkipComposer) {
        Invoke-External -Name 'composer' -WorkingDirectory $paths.RestApi -Arguments @(
            'install', '--no-dev', '--optimize-autoloader', '--no-interaction'
        )
    }

    Reset-Directory -Path $out.RestApi

    Copy-Item (Join-Path $paths.RestApi 'public/index.php') (Join-Path $out.RestApi 'index.php') -Force
    Copy-Tree -Source (Join-Path $paths.RestApi 'vendor') -Destination (Join-Path $out.RestApi 'vendor')
    Copy-Tree -Source (Join-Path $paths.RestApi 'src') -Destination (Join-Path $out.RestApi 'src') -ExcludeNames @('.env.dev', '.env.example')

    $indexPath = Join-Path $out.RestApi 'index.php'
    $indexPhp = Get-Content $indexPath -Raw
    $indexPhp = $indexPhp.Replace("__DIR__ . '/../vendor", "__DIR__ . '/vendor")
    $indexPhp = $indexPhp.Replace("__DIR__ . '/../src", "__DIR__ . '/src")
    Set-Content -Path $indexPath -Value $indexPhp -Encoding UTF8 -NoNewline

    Copy-Item (Join-Path $paths.Templates 'rest-api-root.htaccess') (Join-Path $out.RestApi '.htaccess') -Force
    Copy-Item (Join-Path $paths.Templates 'src-deny.htaccess') (Join-Path $out.RestApi 'src/.htaccess') -Force

    $logsDir = Join-Path $out.RestApi 'src/logs'
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
    Set-Content -Path (Join-Path $logsDir '.gitkeep') -Value '' -Encoding UTF8

    Write-Host "REST-API-Paket: $($out.RestApi)" -ForegroundColor Green
}

function Build-MailerPackage {
    if (-not $SkipComposer) {
        Invoke-External -Name 'composer' -WorkingDirectory $paths.Mailer -Arguments @(
            'install', '--no-dev', '--optimize-autoloader', '--no-interaction'
        )
    }

    Reset-Directory -Path $out.Mailer

    Copy-Tree -Source (Join-Path $paths.Mailer 'src') -Destination $out.Mailer -ExcludeNames @('.env.dev', '.env.example')
    Copy-Tree -Source (Join-Path $paths.Mailer 'vendor') -Destination (Join-Path $out.Mailer 'vendor')

    $indexPath = Join-Path $out.Mailer 'index.php'
    $indexPhp = Get-Content $indexPath -Raw
    $indexPhp = $indexPhp.Replace("dirname(__DIR__) . '/vendor", "__DIR__ . '/vendor")
    Set-Content -Path $indexPath -Value $indexPhp -Encoding UTF8 -NoNewline

    Copy-Item (Join-Path $paths.Templates 'mailer-root.htaccess') (Join-Path $out.Mailer '.htaccess') -Force

    $logsDir = Join-Path $out.Mailer 'logs'
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
    Set-Content -Path (Join-Path $logsDir '.gitkeep') -Value '' -Encoding UTF8

    Write-Host "Mailer-Paket: $($out.Mailer)" -ForegroundColor Green
}

function Copy-DatabasePackage {
    if (-not (Test-Path $paths.SqlDump)) {
        throw "SQL-Dump fehlt: $($paths.SqlDump)"
    }
    Reset-Directory -Path $out.Database
    Copy-Item $paths.SqlDump (Join-Path $out.Database 'portfolio_db.sql') -Force
    Write-Host "Datenbank-Dump: $($out.Database)/portfolio_db.sql" -ForegroundColor Green
}

function Invoke-FtpUpload {
    $ftp = $config.ftp
    if ($null -eq $ftp -or -not $ftp.enabled) {
        Write-Warning 'FTP upload uebersprungen (deploy.config.local.json -> ftp.enabled = true setzen).'
        return
    }

    $winScp = @(
        "${env:ProgramFiles}\WinSCP\WinSCP.com",
        "${env:ProgramFiles(x86)}\WinSCP\WinSCP.com"
    ) | Where-Object { Test-Path $_ } | Select-Object -First 1

    if (-not $winScp) {
        throw 'WinSCP nicht gefunden. Installieren: https://winscp.net/ - oder MANIFEST.txt befolgen (manueller FTP-Upload).'
    }

    if ([string]::IsNullOrWhiteSpace($ftp.password)) {
        throw 'ftp.password in deploy.config.local.json ist leer.'
    }

    $protocol = if ($ftp.useSsl) { 'ftps' } else { 'ftp' }
    $scriptFile = Join-Path $env:TEMP "pencil-me-deploy-$(Get-Random).txt"

    $scriptLines = @(
        "option batch abort"
        "option confirm off"
        "open ${protocol}://$([Uri]::EscapeDataString($ftp.username)):$([Uri]::EscapeDataString($ftp.password))@$($ftp.host)/"
    )

    $map = @(
        @{ Local = $out.Mailer; Remote = $ftp.remotePaths.mailer },
        @{ Local = $out.RestApi; Remote = $ftp.remotePaths.restApi },
        @{ Local = $out.Frontend; Remote = $ftp.remotePaths.frontend }
    )

    foreach ($item in $map) {
        if ([string]::IsNullOrWhiteSpace($item.Remote)) { continue }
        $scriptLines += "lcd $($item.Local)"
        $scriptLines += "cd $($item.Remote)"
        $scriptLines += "synchronize remote -delete . ."
    }

    $scriptLines += 'exit'
    Set-Content -Path $scriptFile -Value ($scriptLines -join "`n") -Encoding ASCII

    Write-Host "FTP-Upload via WinSCP..." -ForegroundColor Cyan
    & $winScp "/script=$scriptFile"
    if ($LASTEXITCODE -ne 0) {
        throw "WinSCP Upload fehlgeschlagen (Exit $LASTEXITCODE)"
    }
    Remove-Item $scriptFile -Force -ErrorAction SilentlyContinue
    Write-Host 'FTP-Upload abgeschlossen (DB weiterhin manuell per phpMyAdmin importieren).' -ForegroundColor Green
}

# --- Main ---
Write-Host '=== Pencil-Me Shared-Hosting Deploy Build ===' -ForegroundColor Cyan
Assert-Prerequisites

New-Item -ItemType Directory -Path $out.Root -Force | Out-Null

$keys = @{ ApiKeyFe = ''; ApiKeyBe = '' }

if (Test-Path $paths.RestEnvProd) {
    if (-not $SkipRestApi) {
        $keys = Sync-RestEnvFromConfig
    } else {
        $restOnly = Read-DotEnvFile -Path $paths.RestEnvProd
        $keys.ApiKeyFe = $restOnly['API_KEY_FE']
        $keys.ApiKeyBe = $restOnly['API_KEY_BE']
    }
}

if (Test-Path $paths.MailerEnvProd) {
    if (-not $SkipMailer) { Sync-MailerEnvProduction }
}

if ((Test-Path $paths.RestEnvProd) -and (Test-Path $paths.MailerEnvProd) -and (-not $SkipRestApi) -and (-not $SkipMailer)) {
    Test-KeyConsistency -RestEnv (Read-DotEnvFile -Path $paths.RestEnvProd) -MailerEnv (Read-DotEnvFile -Path $paths.MailerEnvProd)
}

if (-not $SkipFrontend -and [string]::IsNullOrWhiteSpace($keys.ApiKeyFe)) {
    throw 'API_KEY_FE fehlt - .env.prod der REST API pruefen oder -SkipFrontend setzen.'
}

if (-not $SkipDatabase) {
    Copy-DatabasePackage
}

if (-not $SkipMailer) {
    Build-MailerPackage
}

if (-not $SkipRestApi) {
    Build-RestApiPackage
}

if (-not $SkipFrontend) {
    Build-FrontendPackage -ApiKeyFe $keys.ApiKeyFe -ApiBaseUrl $config.apiBaseUrl
}

$masked = if ($keys.ApiKeyFe.Length -gt 6) { $keys.ApiKeyFe.Substring(0, 4) + '...' } else { '***' }
Write-DeployManifest -OutDir $out.Root -Info @{
    frontendDomain = $config.frontendDomain
    apiBaseUrl     = $config.apiBaseUrl
    mailerBaseUrl  = $config.mailerBaseUrl
    apiKeyFeMasked = $masked
}

if ($Zip) {
    $zipPath = Join-Path $out.Root ("pencil-me-deploy-{0}.zip" -f (Get-Date -Format 'yyyyMMdd-HHmm'))
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
    Compress-Archive -Path (Join-Path $out.Root '*') -DestinationPath $zipPath -Force
    Write-Host "ZIP: $zipPath" -ForegroundColor Green
}

if ($Upload) {
    Invoke-FtpUpload
}

Write-Host ''
Write-Host "Fertig. Upload-Ordner: $($out.Root)" -ForegroundColor Green
Write-Host "Anleitung: deploy/out/MANIFEST.txt" -ForegroundColor Green
