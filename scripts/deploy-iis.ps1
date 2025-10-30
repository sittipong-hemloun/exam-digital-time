# PowerShell Deployment Script for IIS
# This script deploys the Next.js application to IIS

param(
    [Parameter(Mandatory=$false)]
    [string]$AppName = "exam-digital-time",
    
    [Parameter(Mandatory=$false)]
    [string]$DeployPath = "C:\inetpub\wwwroot\exam-digital-time",
    
    [Parameter(Mandatory=$false)]
    [string]$SourcePath = ".\out",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBackup
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IIS Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script requires Administrator privileges." -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Import WebAdministration module
Write-Host "📦 Loading IIS module..." -ForegroundColor Yellow
Import-Module WebAdministration -ErrorAction Stop
Write-Host "✅ IIS module loaded" -ForegroundColor Green

# Check if source files exist
if (-not (Test-Path $SourcePath)) {
    Write-Host "❌ Source path not found: $SourcePath" -ForegroundColor Red
    Write-Host "Please run 'npm run build:iis' first" -ForegroundColor Yellow
    exit 1
}

# Create backup
if (-not $SkipBackup -and (Test-Path $DeployPath)) {
    $BackupPath = "C:\inetpub\backups\$AppName-" + (Get-Date -Format 'yyyyMMdd-HHmmss')
    Write-Host "📦 Creating backup..." -ForegroundColor Yellow
    
    if (-not (Test-Path "C:\inetpub\backups")) {
        New-Item -Path "C:\inetpub\backups" -ItemType Directory | Out-Null
    }
    
    Copy-Item -Path $DeployPath -Destination $BackupPath -Recurse
    Write-Host "✅ Backup created: $BackupPath" -ForegroundColor Green
}

# Stop Application Pool
Write-Host "⏸️  Stopping Application Pool: $AppName..." -ForegroundColor Yellow
try {
    $pool = Get-WebAppPoolState -Name $AppName -ErrorAction SilentlyContinue
    if ($pool) {
        Stop-WebAppPool -Name $AppName
        Start-Sleep -Seconds 3
        Write-Host "✅ Application Pool stopped" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Application Pool '$AppName' not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not stop Application Pool: $_" -ForegroundColor Yellow
}

# Clear deployment directory
Write-Host "🗑️  Clearing deployment directory..." -ForegroundColor Yellow
if (Test-Path $DeployPath) {
    Remove-Item -Path "$DeployPath\*" -Recurse -Force -ErrorAction SilentlyContinue
} else {
    New-Item -Path $DeployPath -ItemType Directory | Out-Null
}
Write-Host "✅ Directory cleared" -ForegroundColor Green

# Copy new files
Write-Host "📂 Copying new files..." -ForegroundColor Yellow
Copy-Item -Path "$SourcePath\*" -Destination $DeployPath -Recurse -Force
Write-Host "✅ Files copied successfully" -ForegroundColor Green

# Copy web.config if exists
if (Test-Path ".\web.config") {
    Write-Host "📄 Copying web.config..." -ForegroundColor Yellow
    Copy-Item -Path ".\web.config" -Destination $DeployPath -Force
    Write-Host "✅ web.config copied" -ForegroundColor Green
}

# Start Application Pool
Write-Host "▶️  Starting Application Pool: $AppName..." -ForegroundColor Yellow
try {
    Start-WebAppPool -Name $AppName -ErrorAction Stop
    Start-Sleep -Seconds 2
    
    $poolState = (Get-WebAppPoolState -Name $AppName).Value
    if ($poolState -eq "Started") {
        Write-Host "✅ Application Pool started successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Application Pool state: $poolState" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to start Application Pool: $_" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application: $AppName" -ForegroundColor White
Write-Host "Deploy Path: $DeployPath" -ForegroundColor White
Write-Host "Pool Status: $poolState" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
