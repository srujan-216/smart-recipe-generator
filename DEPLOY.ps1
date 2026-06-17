# Smart Recipe Generator - Automated Deployment Script
# This script automates the GitHub push process

Write-Host "`n🚀 Smart Recipe Generator - Deployment Script`n" -ForegroundColor Cyan

# Check if GitHub username is provided
if ($args.Count -eq 0) {
    Write-Host "Usage: .\DEPLOY.ps1 <GITHUB_USERNAME> <GITHUB_TOKEN>`n" -ForegroundColor Yellow
    Write-Host "Example: .\DEPLOY.ps1 john_doe ghp_abc123xyz...`n" -ForegroundColor Yellow
    Write-Host "Steps:`n" -ForegroundColor Cyan
    Write-Host "1. Create GitHub account at https://github.com/signup"
    Write-Host "2. Create repository at https://github.com/new"
    Write-Host "3. Get Personal Access Token at https://github.com/settings/tokens"
    Write-Host "4. Run this script with your username and token`n"
    exit 1
}

$GITHUB_USERNAME = $args[0]
$GITHUB_TOKEN = $args[1]

# Verify inputs
if ([string]::IsNullOrEmpty($GITHUB_USERNAME) -or [string]::IsNullOrEmpty($GITHUB_TOKEN)) {
    Write-Host "❌ Error: GitHub username and token required!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Using GitHub username: $GITHUB_USERNAME`n" -ForegroundColor Green

# Change to project directory
$PROJECT_DIR = "C:\Users\sruja\Downloads\smart-recipe-generator-main"
Set-Location $PROJECT_DIR

Write-Host "📂 Working in: $PROJECT_DIR`n" -ForegroundColor Cyan

# Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Git not initialized. Run: git init" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git repository found`n" -ForegroundColor Green

# Set Git config
Write-Host "🔧 Configuring Git...`n" -ForegroundColor Cyan
git config --local user.name "Smart Recipe Developer"
git config --local user.email "noreply@smartrecipe.com"

# Check for uncommitted changes
$STATUS = git status --short
if ([string]::IsNullOrEmpty($STATUS)) {
    Write-Host "✅ All changes committed`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Uncommitted changes found. Committing...`n" -ForegroundColor Yellow
    git add .
    git commit -m "Update: deployment script" --allow-empty
}

# Set remote URL
$REMOTE_URL = "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/smart-recipe-generator.git"

Write-Host "🔗 Setting up GitHub remote...`n" -ForegroundColor Cyan

# Remove existing remote if it exists
git remote remove origin 2>$null

# Add new remote
git remote add origin $REMOTE_URL

# Verify remote
Write-Host "✅ Remote configured`n" -ForegroundColor Green

# Push to GitHub
Write-Host "📤 Pushing code to GitHub...`n" -ForegroundColor Cyan
Write-Host "This may take a moment..." -ForegroundColor Yellow

git push -u origin main --force

# Check if push succeeded
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Code pushed successfully!`n" -ForegroundColor Green
    Write-Host "📊 Repository: https://github.com/$GITHUB_USERNAME/smart-recipe-generator`n" -ForegroundColor Cyan

    Write-Host "🎯 NEXT STEPS:`n" -ForegroundColor Cyan
    Write-Host "1. Go to https://render.com"
    Write-Host "2. Sign up with GitHub"
    Write-Host "3. Create Web Service"
    Write-Host "4. Select 'smart-recipe-generator' repository"
    Write-Host "5. Configure (see DEPLOY_COMPLETE_GUIDE.md for details)"
    Write-Host "6. Add environment variables (see guide)"
    Write-Host "7. Click 'Create Web Service'"
    Write-Host "8. Wait 3-5 minutes for deployment`n"

    Write-Host "Your app will be live at: https://smart-recipe-generator.onrender.com`n" -ForegroundColor Green
} else {
    Write-Host "`n❌ Push failed. Please check:`n" -ForegroundColor Red
    Write-Host "1. GitHub username is correct"
    Write-Host "2. Personal Access Token is valid"
    Write-Host "3. Repository exists at https://github.com/$GITHUB_USERNAME/smart-recipe-generator"
    Write-Host "4. Run: git remote -v (to check remote URL)`n"
    exit 1
}

# Success!
Write-Host "✨ Deployment setup complete!`n" -ForegroundColor Green
Write-Host "Next: Complete deployment on Render.com (see DEPLOY_COMPLETE_GUIDE.md)`n" -ForegroundColor Cyan
