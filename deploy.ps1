# AgriGuru Deployment Script for Vercel (PowerShell)

Write-Host "🌾 AgriGuru Deployment Setup" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Check if we're in the correct directory
if (-not (Test-Path "package.json") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: Please run this script from the AgriGuru root directory" -ForegroundColor Red
    exit 1
}

# Build the frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend build successful" -ForegroundColor Green

# Go back to root
Set-Location ..

Write-Host "🚀 Deployment Configuration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Push all changes to GitHub" -ForegroundColor White
Write-Host "2. Go to https://vercel.com" -ForegroundColor White
Write-Host "3. Sign in with GitHub" -ForegroundColor White
Write-Host "4. Import your repository" -ForegroundColor White
Write-Host "5. Set Root Directory to: frontend" -ForegroundColor White
Write-Host "6. Set Build Command to: npm run build" -ForegroundColor White
Write-Host "7. Set Output Directory to: build" -ForegroundColor White
Write-Host "8. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "📋 Files created:" -ForegroundColor Cyan
Write-Host "- vercel.json (root)" -ForegroundColor White
Write-Host "- frontend/vercel.json" -ForegroundColor White
Write-Host "- frontend/public/_redirects" -ForegroundColor White
Write-Host "- DEPLOYMENT_GUIDE.md" -ForegroundColor White
