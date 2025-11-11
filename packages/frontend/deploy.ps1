# Auto-Deploy Script for Vercel
Write-Host "====================================" -ForegroundColor Green
Write-Host "   DEPLOYING TO VERCEL AUTOMATICALLY" -ForegroundColor Green  
Write-Host "====================================" -ForegroundColor Green

Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Step 2: Building the application..." -ForegroundColor Yellow
npm run build

Write-Host "Step 3: Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod --yes

Write-Host "====================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

Read-Host "Press Enter to exit"