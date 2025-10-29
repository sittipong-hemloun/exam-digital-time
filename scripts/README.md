# Deploy Scripts

This directory contains deployment scripts for the exam-digital-time application.

## Available Scripts

### `deploy.sh`

Automated deployment script that performs the following steps:

1. **Git Pull** - Pulls the latest code from the repository
2. **Build** - Builds the Next.js application
3. **PM2 Reload** - Reloads the application in PM2 with zero downtime

#### Usage

**Option 1: Using npm script (recommended)**
```bash
npm run deploy
```

**Option 2: Direct execution**
```bash
bash scripts/deploy.sh
```

**Option 3: From scripts directory**
```bash
cd scripts
./deploy.sh
```

#### Features

- ✅ **Error Handling** - Script exits on any error
- ✅ **Status Messages** - Clear output for each step
- ✅ **Zero Downtime** - Uses PM2 reload instead of restart
- ✅ **Safe Execution** - Checks each step before proceeding

#### Requirements

- Git installed and repository initialized
- Node.js and npm installed
- PM2 installed globally (`npm install -g pm2`)
- Application running with name `exam-digital-time` in PM2

#### Error Handling

If any step fails, the script will:
1. Display an error message
2. Stop execution immediately
3. Return a non-zero exit code

#### Example Output

```
🚀 Starting deployment process...

📥 Step 1/3: Pulling latest code from git...
Already up to date.
✅ Git pull completed successfully

🔨 Step 2/3: Building project...
✓ Creating an optimized production build
✅ Build completed successfully

🔄 Step 3/3: Reloading PM2...
[PM2] Applying action reloadProcessId on app [exam-digital-time]
✅ PM2 reload completed successfully

🎉 Deployment completed successfully!
```

## Troubleshooting

### Script Permission Denied
```bash
chmod +x scripts/deploy.sh
```

### PM2 Not Found
```bash
npm install -g pm2
```

### Application Not Running in PM2
```bash
npm run start:pm2
# or
npm run start:pm2:prod
```

### Git Pull Conflicts
Resolve conflicts manually before running the script:
```bash
git status
git stash  # if you have local changes
npm run deploy
```

## Notes

- Always ensure you have committed or stashed local changes before deploying
- The script uses `pm2 reload` which provides zero-downtime deployment
- Build errors will prevent deployment, keeping the current version running
