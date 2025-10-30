1. GitHub Actions Workflow (.github/workflows/deploy-to-iis.yml)

  Features:
  - ✅ Auto-trigger เมื่อ push ไป main branch
  - ✅ Manual trigger ผ่าน GitHub UI
  - ✅ รัน tests อัตโนมัติก่อน deploy
  - ✅ Build Next.js สำหรับ IIS
  - ✅ สร้าง backup ก่อน deploy
  - ✅ Deploy ผ่าน SSH + SCP
  - ✅ Zero downtime deployment (stop/start IIS App Pool)

  Workflow มี 2 Jobs:
  1. Build and Test - Build และทดสอบ
  2. Deploy to IIS - Deploy ไปยัง IIS server

  2. PowerShell Deploy Script (scripts/deploy-iis.ps1)

  สำหรับ manual deployment จาก Windows server:
  .\scripts\deploy-iis.ps1

  Features:
  - ✅ ต้องรันด้วย Administrator
  - ✅ สร้าง backup อัตโนมัติ
  - ✅ Stop/Start IIS App Pool
  - ✅ Verify deployment status
  - ✅ Error handling

  3. CI/CD Setup Guide (CICD-SETUP.md)

  เอกสารครบถ้วนรวม:
  - 📖 Server setup (OpenSSH, IIS configuration)
  - 📖 SSH key generation และ configuration
  - 📖 GitHub secrets configuration
  - 📖 Troubleshooting guide
  - 📖 Rollback procedures

  🚀 วิธีใช้งาน:

  ขั้นตอนที่ 1: Setup Windows Server

  # 1. Enable SSH Server
  Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
  Start-Service sshd
  Set-Service -Name sshd -StartupType 'Automatic'

  # 2. Create IIS Application
  New-WebAppPool -Name "exam-digital-time"
  New-WebApplication -Name "exam-digital-time" -Site "Default Web Site" -PhysicalPath "C:\inetpub\wwwroot\exam-digital-time" -ApplicationPool "exam-digital-time"

  # 3. Create backup directory
  New-Item -ItemType Directory -Path "C:\inetpub\backups" -Force

  ขั้นตอนที่ 2: Generate SSH Keys

  # สร้าง SSH key pair
  ssh-keygen -t rsa -b 4096 -C "github-actions" -f github-actions-key

  ขั้นตอนที่ 3: Configure GitHub Secrets

  ไปที่ GitHub repository → Settings → Secrets and variables → Actions

  เพิ่ม secrets ต่อไปนี้:
  - IIS_SERVER_HOST - IP/hostname ของ Windows VM
  - IIS_SERVER_USER - SSH username (เช่น Administrator)
  - IIS_SERVER_SSH_KEY - Private SSH key content
  - IIS_SERVER_PORT - SSH port (default: 22)

  ขั้นตอนที่ 4: Deploy!

  # Auto deploy เมื่อ push ไป main
  git add .
  git commit -m "Enable CI/CD"
  git push origin main

  # หรือ manual trigger จาก GitHub Actions UI

  📊 Deployment Flow:

  ┌─────────────────────┐
  │  Push to GitHub     │
  │  (main branch)      │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Run Tests          │
  │  ✓ Unit tests       │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Build Next.js      │
  │  ✓ npm run build:iis│
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Upload to VM       │
  │  ✓ SCP via SSH      │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Deploy to IIS      │
  │  ✓ Backup           │
  │  ✓ Stop App Pool    │
  │  ✓ Deploy files     │
  │  ✓ Start App Pool   │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  ✅ Success!        │
  └─────────────────────┘

  📁 ไฟล์ที่สร้างขึ้น:

  .github/
    └── workflows/
        └── deploy-to-iis.yml    # GitHub Actions workflow

  scripts/
    ├── deploy.sh                # Linux/Mac deployment (PM2)
    ├── deploy-iis.ps1          # Windows IIS deployment
    └── README.md               # Scripts documentation

  CICD-SETUP.md                 # Complete setup guide

  🔐 ความปลอดภัย:

  - ✅ ใช้ SSH key authentication (ไม่ใช้ password)
  - ✅ Secrets เก็บปลอดภัยใน GitHub
  - ✅ Backup ก่อน deploy ทุกครั้ง
  - ✅ Rollback ได้ง่าย
  - ✅ Zero downtime deployment

  📖 เอกสารเพิ่มเติม:

  อ่านรายละเอียดเพิ่มเติมใน CICD-SETUP.md รวมถึง:
  - Troubleshooting guide
  - Manual deployment instructions
  - Rollback procedures
  - Monitoring tips