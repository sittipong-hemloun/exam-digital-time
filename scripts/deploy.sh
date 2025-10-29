#!/bin/bash

# Deploy script for exam-digital-time
# This script will pull latest code, build, and reload PM2

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Step 1: Git pull
echo ""
echo "📥 Step 1/5: Pulling latest code from git..."
git pull

if [ $? -ne 0 ]; then
  echo "❌ Git pull failed. Aborting deployment."
  exit 1
fi

echo "✅ Git pull completed successfully"

# Step 2: Install dependencies
echo ""
echo "📦 Step 2/5: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ npm install failed. Aborting deployment."
  exit 1
fi

echo "✅ Dependencies installed successfully"

# Step 3: Build
echo ""
echo "🔨 Step 3/5: Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting deployment."
  exit 1
fi

echo "✅ Build completed successfully"

# Step 4: Generate Prisma Client
echo ""
echo "🗄️  Step 4/5: Generating Prisma client..."
pm2 stop exam-digital-time
npx prisma generate

if [ $? -ne 0 ]; then
  echo "❌ Prisma generate failed. Aborting deployment."
  exit 1
fi

echo "✅ Prisma client generated successfully"

# Step 5: Reload PM2
echo ""
echo "🔄 Step 5/5: Reloading PM2..."
pm2 start exam-digital-time

if [ $? -ne 0 ]; then
  echo "❌ PM2 start failed."
  exit 1
fi

echo "✅ PM2 reloaded successfully"

# Done
echo ""
echo "🎉 Deployment completed successfully!"
echo ""
