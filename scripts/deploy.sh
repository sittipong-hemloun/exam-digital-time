#!/bin/bash

# Deploy script for exam-digital-time
# This script will pull latest code, build, and reload PM2

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Step 1: Git pull
echo ""
echo "📥 Step 1/3: Pulling latest code from git..."
git pull

if [ $? -ne 0 ]; then
  echo "❌ Git pull failed. Aborting deployment."
  exit 1
fi

echo "✅ Git pull completed successfully"

# Step 2: Build
echo ""
echo "🔨 Step 2/3: Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting deployment."
  exit 1
fi

echo "✅ Build completed successfully"

# Step 3: Reload PM2
echo ""
echo "🔄 Step 3/3: Reloading PM2..."
pm2 reload exam-digital-time

if [ $? -ne 0 ]; then
  echo "❌ PM2 reload failed."
  exit 1
fi

echo "✅ PM2 reload completed successfully"

# Done
echo ""
echo "🎉 Deployment completed successfully!"
echo ""
