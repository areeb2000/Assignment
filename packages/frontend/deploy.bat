@echo off
echo ====================================
echo    DEPLOYING TO VERCEL AUTOMATICALLY
echo ====================================

echo Step 1: Installing dependencies...
call npm install

echo Step 2: Building the application...
call npm run build

echo Step 3: Deploying to Vercel...
call vercel --prod --yes

echo ====================================
echo    DEPLOYMENT COMPLETED!
echo ====================================
pause