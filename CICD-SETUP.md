# CI/CD Setup Guide - Deploy to IIS on Windows VM

This guide explains how to set up automated deployment from GitHub to your IIS server on Windows VM.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Server Setup](#server-setup)
4. [GitHub Configuration](#github-configuration)
5. [Manual Deployment](#manual-deployment)
6. [Troubleshooting](#troubleshooting)

## 🎯 Overview

The CI/CD pipeline consists of:

1. **GitHub Actions Workflow** (`.github/workflows/deploy-to-iis.yml`)
   - Triggers on push to `main` branch or manual trigger
   - Runs tests automatically
   - Builds the Next.js application
   - Deploys to IIS server via SSH

2. **PowerShell Deploy Script** (`scripts/deploy-iis.ps1`)
   - For manual deployment from Windows server
   - Handles backup, stop/start IIS, and file deployment

## ✅ Prerequisites

### On Your Windows VM:

- ✅ Windows Server with IIS installed
- ✅ SSH Server enabled (OpenSSH Server)
- ✅ PowerShell 5.1 or higher
- ✅ Git installed (optional, for git-based deployment)
- ✅ `tar` command available (built-in on Windows 10/Server 2019+)

### On GitHub:

- ✅ Repository hosted on GitHub
- ✅ Admin access to repository settings

## 🖥️ Server Setup

### Step 1: Enable SSH Server on Windows

```powershell
# Run as Administrator

# Install OpenSSH Server
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# Start and enable SSH service
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'

# Configure firewall
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

### Step 2: Create IIS Application

```powershell
# Run as Administrator

# Import IIS module
Import-Module WebAdministration

# Create Application Pool
New-WebAppPool -Name "exam-digital-time"
Set-ItemProperty "IIS:\AppPools\exam-digital-time" -Name "managedRuntimeVersion" -Value ""

# Create Website or Application
$appPath = "C:\inetpub\wwwroot\exam-digital-time"
New-Item -ItemType Directory -Path $appPath -Force
New-WebApplication -Name "exam-digital-time" -Site "Default Web Site" -PhysicalPath $appPath -ApplicationPool "exam-digital-time"
```

### Step 3: Create Backup Directory

```powershell
New-Item -ItemType Directory -Path "C:\inetpub\backups" -Force
```

### Step 4: Generate SSH Key for GitHub Actions

```bash
# On your local machine or GitHub Actions runner

# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions" -f github-actions-key

# This creates:
# - github-actions-key (private key) - Add to GitHub Secrets
# - github-actions-key.pub (public key) - Add to Windows VM
```

### Step 5: Add Public Key to Windows VM

```powershell
# On Windows VM

# Create .ssh directory if not exists
New-Item -ItemType Directory -Path "$env:USERPROFILE\.ssh" -Force

# Add public key to authorized_keys
Add-Content -Path "$env:USERPROFILE\.ssh\authorized_keys" -Value "PUBLIC_KEY_CONTENT_HERE"

# Set correct permissions
icacls "$env:USERPROFILE\.ssh\authorized_keys" /inheritance:r
icacls "$env:USERPROFILE\.ssh\authorized_keys" /grant:r "$env:USERNAME:(R)"
```

## 🔐 GitHub Configuration

### Step 1: Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `IIS_SERVER_HOST` | IP or hostname of your Windows VM | `192.168.1.100` or `server.example.com` |
| `IIS_SERVER_USER` | SSH username | `Administrator` or your Windows username |
| `IIS_SERVER_SSH_KEY` | Private SSH key content | Content of `github-actions-key` file |
| `IIS_SERVER_PORT` | SSH port (optional, default: 22) | `22` |

### Step 2: Enable GitHub Actions

1. Go to repository Settings → Actions → General
2. Ensure "Allow all actions and reusable workflows" is selected
3. Save changes

### Step 3: Test Workflow

```bash
# Option 1: Push to main branch
git add .
git commit -m "Setup CI/CD"
git push origin main

# Option 2: Manual trigger
# Go to Actions tab → Deploy to IIS Server → Run workflow
```

## 🚀 Manual Deployment

### Option 1: From Windows VM (PowerShell)

```powershell
# Navigate to project directory
cd C:\path\to\exam-digital-time

# Pull latest code
git pull origin main

# Install dependencies (if needed)
npm ci

# Build
npm run build:iis

# Deploy to IIS
.\scripts\deploy-iis.ps1
```

### Option 2: Using npm script

```bash
# On Linux/Mac with PM2
npm run deploy
```

## 🔍 Workflow Details

### Automatic Triggers

- ✅ Push to `main` branch
- ✅ Manual trigger from GitHub Actions UI

### Workflow Steps

1. **Build and Test Job**
   - Checkout code
   - Setup Node.js 20
   - Install dependencies
   - Run unit tests
   - Build application for IIS
   - Create deployment package
   - Upload artifact

2. **Deploy Job**
   - Download build artifact
   - Upload package to Windows VM via SCP
   - SSH to Windows VM
   - Execute PowerShell deployment script:
     - Create backup
     - Stop IIS Application Pool
     - Clear deployment directory
     - Extract new files
     - Start IIS Application Pool
     - Verify deployment

### Deployment Verification

After deployment, check:

```powershell
# Check Application Pool status
Get-WebAppPoolState -Name "exam-digital-time"

# Check IIS site status
Get-Website | Where-Object { $_.Name -like "*exam-digital-time*" }

# View Application Pool details
Get-IISAppPool -Name "exam-digital-time"

# Test the application
Invoke-WebRequest -Uri "http://localhost/exam-digital-time" -UseBasicParsing
```

## 🐛 Troubleshooting

### SSH Connection Failed

```bash
# Test SSH connection manually
ssh username@server-ip

# Check SSH service on Windows VM
Get-Service sshd

# Restart SSH service if needed
Restart-Service sshd
```

### Deployment Fails - Permission Denied

```powershell
# Give IIS_IUSRS permission to deployment folder
icacls "C:\inetpub\wwwroot\exam-digital-time" /grant "IIS_IUSRS:(OI)(CI)F" /T
```

### Application Pool Won't Start

```powershell
# Check Application Pool
Get-WebAppPoolState -Name "exam-digital-time"

# View Application Pool events
Get-EventLog -LogName Application -Source "IIS*" -Newest 20

# Recycle Application Pool
Restart-WebAppPool -Name "exam-digital-time"
```

### Tar Command Not Found on Windows

```powershell
# Check Windows version (tar is built-in on Windows 10 1803+)
systeminfo | findstr /C:"OS Version"

# If missing, install Git for Windows (includes tar)
# Or use 7-Zip instead
```

### Build Fails in GitHub Actions

- Check Node.js version matches (20.x)
- Verify all dependencies in package.json
- Check for environment-specific issues
- Review build logs in GitHub Actions

### Files Not Updating on IIS

```powershell
# Clear IIS cache
iisreset /stop
Remove-Item "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files\*" -Recurse -Force
iisreset /start

# Clear Application Pool cache
Stop-WebAppPool -Name "exam-digital-time"
Start-Sleep -Seconds 3
Start-WebAppPool -Name "exam-digital-time"
```

## 📊 Monitoring

### View Deployment Logs

```powershell
# View IIS logs
Get-Content "C:\inetpub\logs\LogFiles\W3SVC1\*.log" -Tail 50

# View Application Pool events
Get-EventLog -LogName Application | Where-Object { $_.Source -like "*IIS*" } | Select-Object -First 20
```

### GitHub Actions Logs

- Go to GitHub repository → Actions tab
- Click on the workflow run
- View detailed logs for each step

## 🔄 Rollback

If deployment fails or causes issues:

```powershell
# List available backups
Get-ChildItem "C:\inetpub\backups" | Sort-Object CreationTime -Descending

# Restore from backup
$BackupPath = "C:\inetpub\backups\exam-digital-time-YYYYMMDD-HHMMSS"
$DeployPath = "C:\inetpub\wwwroot\exam-digital-time"

Stop-WebAppPool -Name "exam-digital-time"
Remove-Item "$DeployPath\*" -Recurse -Force
Copy-Item "$BackupPath\*" -Destination $DeployPath -Recurse
Start-WebAppPool -Name "exam-digital-time"
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [IIS Documentation](https://docs.microsoft.com/en-us/iis/)
- [OpenSSH on Windows](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## 🎉 Success!

Your CI/CD pipeline is now set up! Every push to `main` will automatically deploy to your IIS server.

**Deployment Flow:**
```
Push to GitHub → Tests Run → Build → Deploy to IIS → Backup Created → App Pool Restarted → ✅ Done!
```
