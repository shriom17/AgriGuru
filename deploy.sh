#!/bin/bash

# AgriGuru Deployment Script for Vercel

echo "🌾 AgriGuru Deployment Setup"
echo "============================"

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the AgriGuru root directory"
    exit 1
fi

# Build the frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend build successful"

# Go back to root
cd ..

echo "🚀 Deployment Configuration Complete!"
echo ""
echo "Next steps:"
echo "1. Push all changes to GitHub"
echo "2. Go to https://vercel.com"
echo "3. Sign in with GitHub"
echo "4. Import your repository"
echo "5. Set Root Directory to: frontend"
echo "6. Set Build Command to: npm run build"
echo "7. Set Output Directory to: build"
echo "8. Deploy!"
echo ""
echo "📋 Files created:"
echo "- vercel.json (root)"
echo "- frontend/vercel.json"
echo "- frontend/public/_redirects"
echo "- DEPLOYMENT_GUIDE.md"
