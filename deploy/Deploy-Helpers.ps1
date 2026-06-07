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
        ''
        'Smoke-Tests nach Upload:'
        "  curl $($Info.mailerBaseUrl)/healthcheck"
        "  curl -H `"API-Key: <API_KEY_FE>`" $($Info.apiBaseUrl)/all_projects"
        "  Browser: $($Info.frontendDomain)"
        ''
        'Hinweis: .env.prod liegt in rest-api/src/Inc bzw. mailer/Inc - nicht oeffentlich verlinken.'
    )

    Set-Content -Path (Join-Path $OutDir 'MANIFEST.txt') -Value ($lines -join "`r`n") -Encoding UTF8
}
