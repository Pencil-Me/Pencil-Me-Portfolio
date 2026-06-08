function Get-RepoRoot {
    return (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
}

function Read-DotEnvFile {
    param([Parameter(Mandatory)][string]$Path)

    if (-not (Test-Path $Path)) {
        throw "Env-Datei fehlt: $Path"
    }

    $vars = @{}
    Get-Content $Path -Encoding UTF8 | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq '' -or $line.StartsWith('#')) { return }
        $idx = $line.IndexOf('=')
        if ($idx -lt 1) { return }
        $key = $line.Substring(0, $idx).Trim()
        $value = $line.Substring($idx + 1).Trim()
        if ($value.StartsWith('"') -and $value.EndsWith('"')) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        $vars[$key] = $value
    }
    return $vars
}

function Test-CommandAvailable {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Invoke-External {
    param(
        [Parameter(Mandatory)][string]$Name,
        [Parameter(Mandatory)][string]$WorkingDirectory,
        [string[]]$Arguments = @()
    )

    Write-Host ">> $Name $($Arguments -join ' ')" -ForegroundColor DarkGray
    Push-Location $WorkingDirectory
    try {
        & $Name @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "$Name fehlgeschlagen (Exit $LASTEXITCODE)"
        }
    } finally {
        Pop-Location
    }
}

function Reset-Directory {
    param([Parameter(Mandatory)][string]$Path)

    if (Test-Path $Path) {
        Remove-Item $Path -Recurse -Force
    }
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
}

function Get-DeployPhpEnvExcludeNames {
    return @('.env.dev', '.env.example', '.env.prod', 'logs')
}

<#
    Kopiert PHP-src ohne Env-Dateien; .env.prod nur explizit aus dem validierten Quellpfad.
#>
function Copy-PhpSourceForDeploy {
    param(
        [Parameter(Mandatory)][string]$Source,
        [Parameter(Mandatory)][string]$Destination,
        [Parameter(Mandatory)][string]$EnvProdFile,
        [string]$EnvProdRelative = 'Inc/.env.prod'
    )

    if (-not (Test-Path $EnvProdFile)) {
        throw ".env.prod fehlt: $EnvProdFile"
    }

    Copy-Tree -Source $Source -Destination $Destination -ExcludeNames (Get-DeployPhpEnvExcludeNames)

    $envDest = Join-Path $Destination $EnvProdRelative
    $envDestDir = Split-Path $envDest -Parent
    if (-not (Test-Path $envDestDir)) {
        New-Item -ItemType Directory -Path $envDestDir -Force | Out-Null
    }
    Copy-Item -Path $EnvProdFile -Destination $envDest -Force
}

function Assert-DeployPackageHasNoEnvDev {
    param(
        [Parameter(Mandatory)][string[]]$PackageRoots,
        [Parameter(Mandatory)][string]$PackageLabel
    )

    foreach ($root in $PackageRoots) {
        if (-not (Test-Path $root)) {
            continue
        }
        $found = @(Get-ChildItem -Path $root -Recurse -Force -Filter '.env.dev' -File -ErrorAction SilentlyContinue)
        if ($found.Count -eq 0) {
            continue
        }
        $rel = $found | ForEach-Object {
            $_.FullName.Substring($root.Length).TrimStart('\', '/')
        }
        throw "$PackageLabel enthaelt .env.dev (verboten): $($rel -join ', ')"
    }

    Write-Host "${PackageLabel}: .env.dev nicht enthalten (OK)" -ForegroundColor Green
}

function Copy-Tree {
    param(
        [Parameter(Mandatory)][string]$Source,
        [Parameter(Mandatory)][string]$Destination,
        [string[]]$ExcludeNames = @()
    )

    if (-not (Test-Path $Source)) {
        throw "Quelle fehlt: $Source"
    }

    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    Get-ChildItem -Path $Source -Force | ForEach-Object {
        if ($ExcludeNames -contains $_.Name) { return }
        $target = Join-Path $Destination $_.Name
        if ($_.PSIsContainer) {
            Copy-Tree -Source $_.FullName -Destination $target -ExcludeNames $ExcludeNames
        } else {
            Copy-Item -Path $_.FullName -Destination $target -Force
        }
    }
}

function Get-DeployFrontendOrigins {
    param([Parameter(Mandatory)][string]$FrontendDomain)

    $origins = @($FrontendDomain.TrimEnd('/'))
    if ($FrontendDomain -match '^https://www\.(.+)$') {
        $origins += "https://$($Matches[1])"
    } elseif ($FrontendDomain -match '^https://([^/]+)$') {
        $origins += "https://www.$($Matches[1])"
    }

    return @($origins | Select-Object -Unique)
}

function New-RestApiRootHtaccess {
    param([Parameter(Mandatory)][string[]]$AllowedOrigins)

    # Shared-Hosting-safe: nur RewriteEngine/RewriteRule (kein Header, SetEnv, Options).
    return @(
        'RewriteEngine On'
        'RewriteCond %{REQUEST_FILENAME} !-f'
        'RewriteCond %{REQUEST_FILENAME} !-d'
        'RewriteRule ^ index.php [QSA,L]'
    ) -join "`r`n"
}

function New-FrontendRootHtaccess {
    param(
        [Parameter(Mandatory)][string]$FrontendDomain,
        [Parameter(Mandatory)][string]$ApiBaseUrl,
        [string]$ApiBackendUrl = ''
    )

    $canonicalHost = $FrontendDomain.TrimEnd('/')
    if ($canonicalHost -notmatch '^https://') {
        throw "frontendDomain muss mit https:// beginnen: $FrontendDomain"
    }

    $lines = @(
        'RewriteEngine On'
        'RewriteBase /'
        '# Redirection to HTTPS:'
        'RewriteCond %{SERVER_PORT} !=443'
        "RewriteRule ^(.*)$ $canonicalHost/`$1 [R=301,L]"
        ''
    )

    $useProxy = ($ApiBaseUrl -match '^/') -and (-not [string]::IsNullOrWhiteSpace($ApiBackendUrl))
    if ($useProxy) {
        $prefix = $ApiBaseUrl.Trim('/').Replace('/', '\/')
        $backend = $ApiBackendUrl.TrimEnd('/')
        $lines += @(
            '# REST-API Proxy (gleiche Origin - kein Browser-CORS auf separater API-Subdomain)'
            "RewriteRule ^$prefix/(.*)$ $backend/`$1 [P,L,NC]"
            ''
        )
    }

    $lines += @(
        '# Redirection of requests to index.html'
        'RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]'
        'RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d'
        'RewriteRule ^.*$ - [NC,L]'
        '# Redirect all non-file routes to index.html'
        'RewriteRule ^(?!.*\.).*$ /index.html [NC,L]'
    )

    return ($lines -join "`r`n") + "`r`n"
}

function Get-FrontendRootAssetNames {
    return @(
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-384x384.png',
        'mstile-150x150.png',
        'site.webmanifest',
        'safari-pinned-tab.svg',
        'browserconfig.xml',
        'robots.txt',
        'sitemap.xml'
    )
}

function Copy-FrontendRootAssets {
    param(
        [Parameter(Mandatory)][string]$FrontendOutDir,
        [Parameter(Mandatory)][string]$AssetsRootSource
    )

    $rootAssetNames = Get-FrontendRootAssetNames
    $copied = 0

    foreach ($name in $rootAssetNames) {
        $fromDist = Join-Path (Join-Path $FrontendOutDir 'assets/root') $name
        $fromSrc = Join-Path $AssetsRootSource $name
        $source = if (Test-Path $fromDist) { $fromDist } elseif (Test-Path $fromSrc) { $fromSrc } else { $null }
        if ($null -eq $source) {
            Write-Warning "Root-Asset fehlt: $name"
            continue
        }
        Copy-Item $source (Join-Path $FrontendOutDir $name) -Force
        $copied++
    }

    Write-Host "Frontend Root-Assets: $copied/$($rootAssetNames.Count) nach Deploy-Root kopiert" -ForegroundColor Green
}

function Assert-FrontendDeployPackage {
    param([Parameter(Mandatory)][string]$FrontendOutDir)

    $missing = @()
    foreach ($name in (Get-FrontendRootAssetNames)) {
        if (-not (Test-Path (Join-Path $FrontendOutDir $name))) {
            $missing += $name
        }
    }

    if (-not (Test-Path (Join-Path $FrontendOutDir '.htaccess'))) {
        $missing += '.htaccess'
    }
    if (-not (Test-Path (Join-Path $FrontendOutDir 'index.html'))) {
        $missing += 'index.html'
    }
    if (-not (Get-ChildItem (Join-Path $FrontendOutDir 'assets/logos') -ErrorAction SilentlyContinue)) {
        $missing += 'assets/logos/*'
    }
    if (-not (Test-Path (Join-Path $FrontendOutDir 'assets/root/utilitarian-graphics.webp'))) {
        $missing += 'assets/root/utilitarian-graphics.webp'
    }

    if ($missing.Count -gt 0) {
        throw "Frontend-Deploy unvollstaendig - fehlend: $($missing -join ', ')"
    }

    Write-Host "Frontend-Deploy Check: OK (Favicons, robots, sitemap, manifest, .htaccess, Logos)" -ForegroundColor Green
}

function Write-DeployManifest {
    param(
        [Parameter(Mandatory)][string]$OutDir,
        [Parameter(Mandatory)][hashtable]$Info
    )

    $lines = @(
        'Pencil-Me-Portfolio - Shared-Hosting Deploy-Paket'
        "Erzeugt: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        ''
        'Upload-Reihenfolge (FTP):'
        '  1) 1-database/portfolio_db.sql  -> phpMyAdmin importieren'
        '  2) 2-mailer/                      -> Document Root mailer-Subdomain'
        '  3) 3-rest-api/                    -> Document Root api-Subdomain'
        '  4) 4-frontend/                    -> Document Root Hauptdomain'
        ''
        'Konfiguration:'
        "  Frontend:     $($Info.frontendDomain)"
        "  REST API:     $($Info.apiBaseUrl)"
        "  Mailer:       $($Info.mailerBaseUrl)"
        "  API_KEY_FE:   $($Info.apiKeyFeMasked)"
    )
    if ($Info.apiBackendUrl) {
        $lines += "  API Backend:  $($Info.apiBackendUrl)"
    }
    $lines += ''
    $lines += 'Smoke-Tests nach Upload:'
    $lines += "  curl $($Info.mailerBaseUrl)/healthcheck"
    if ($Info.apiBaseUrl -match '^/') {
        $lines += "  curl -H `"API-Key: <API_KEY_FE>`" $($Info.frontendDomain)$($Info.apiBaseUrl)/all_projects"
    } else {
        $lines += "  curl -H `"API-Key: <API_KEY_FE>`" $($Info.apiBaseUrl)/all_projects"
    }
    $lines += "  Browser: $($Info.frontendDomain)"
    $lines += @(
        ''
        'Hinweis: Nur .env.prod im Paket (.env.dev wird nie nach deploy/out kopiert).'
        '         rest-api: src/Inc/.env.prod | mailer: Inc/.env.prod - nicht oeffentlich verlinken.'
    )

    Set-Content -Path (Join-Path $OutDir 'MANIFEST.txt') -Value ($lines -join "`r`n") -Encoding UTF8
}
