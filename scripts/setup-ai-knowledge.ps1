#Requires -Version 5.1
<#
.SYNOPSIS
  Einrichtung AI-Wissenssystem: Symlink .ai-brain + .agent aus Template.

.EXAMPLE
  .\scripts\setup-ai-knowledge.ps1
  .\scripts\setup-ai-knowledge.ps1 -SkipAgent
#>
[CmdletBinding()]
param([switch]$SkipAgent)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path $PSScriptRoot -Parent
$GlobalBrain = Join-Path $env:USERPROFILE '.ai-brain'
$LinkPath = Join-Path $RepoRoot '.ai-brain'
$AgentPath = Join-Path $RepoRoot '.agent'
$AgentExample = Join-Path $RepoRoot '.agent.example'

if (-not (Test-Path $GlobalBrain)) {
    Write-Error "Globales Brain fehlt: $GlobalBrain`nBitte zuerst ~/.ai-brain anlegen oder aus Backup wiederherstellen."
}

if (Test-Path $LinkPath) {
    $item = Get-Item $LinkPath -Force
    if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        Write-Host ".ai-brain Link existiert bereits." -ForegroundColor Green
    } else {
        Write-Error ".ai-brain existiert als normaler Ordner — bitte manuell entfernen und Skript erneut ausfuehren."
    }
} else {
    $mklink = Start-Process -FilePath 'cmd.exe' -ArgumentList @(
        '/c', 'mklink', '/J', "`"$LinkPath`"", "`"$GlobalBrain`""
    ) -Wait -PassThru -NoNewWindow
    if ($mklink.ExitCode -ne 0) {
        Write-Warning "Junction fehlgeschlagen. Manuell (Admin): cmd /c mklink /J `"$LinkPath`" `"$GlobalBrain`""
    } else {
        Write-Host "Junction erstellt: .ai-brain -> $GlobalBrain" -ForegroundColor Green
    }
}

if (-not $SkipAgent) {
    if (Test-Path $AgentPath) {
        Write-Host ".agent/ existiert bereits — uebersprungen." -ForegroundColor Yellow
    } elseif (-not (Test-Path $AgentExample)) {
        Write-Error ".agent.example/ fehlt."
    } else {
        Copy-Item -Path $AgentExample -Destination $AgentPath -Recurse
        Write-Host ".agent/ aus .agent.example/ erstellt." -ForegroundColor Green
        Write-Host "Als Naechstes: .agent/memory/production-state.md mit echten URLs pflegen." -ForegroundColor Cyan
    }
}

Write-Host "Fertig. Einstieg: AGENTS.md" -ForegroundColor Green
