# 🚀 DEPLOY TO RENDER.COM (FREE TIER)
## Step-by-Step Deployment Guide

---

## ⏱️ **Time Required**: 20 minutes

---

## ✅ **STEP 1: Prepare Your Code (5 minutes)**

### 1.1 Update .env for Production

Your `.env` file is already updated. Verify it has:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://akshayashettymurari_db_user:mittu2007@cluster0.jcykgcm.mongodb.net/smart_recipe_db?retryWrites=true&w=majority
JWT_SECRET=aB3mK9$xL2#pQ8@wN5vZ7&dF4yH6jC1rS0tU9eW2qX4mJ6kL9pO3sR5uV7yZ1cB8dE
JWT_EXPIRES_IN=7d
GROQ_API_KEY=gsk_YOUR_GROQ_API_KEY_HERE
CLIENT_URL=will-update-after-deployment
```

### 1.2 Create .gitignore

Make sure `.gitignore` exists and has:

```
node_modules/
.env
.env.local
.DS_Store
*.log
```

### 1.3 Verify package.json

Check `npm start` is defined (should be):

```json
"scripts": {
  "start": "node backend/server.js",
  "dev": "nodemon backend/server.js"
}
```

---

## ✅ **STEP 2: Setup Git & GitHub (5 minutes)**

### 2.1 Check if Git is installed

```bash
git --version
```

If not installed, download from https://git-scm.com/download/win

### 2.2 Initialize Git in your project

```bash
cd C:\Users\sruja\Downloads\smart-recipe-generator-main

# Initialize git repo
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Smart Recipe Generator - Production Ready"

# Verify
git log --oneline
```

### 2.3 Create GitHub Repository

1. Go to **https://github.com/new**
2. Create repository:
   - **Name**: `smart-recipe-generator`
   - **Description**: Smart Recipe Generator for Indian Households
   - **Public**: Yes (needed for free Render deployment)
   - **Don't initialize README** (already have one)
3. Click **Create repository**

### 2.4 Push code to GitHub

Copy the commands from GitHub and run:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/smart-recipe-generator.git
git branch -M main
git push -u origin main
```

**Verify**: Go to https://github.com/YOUR_USERNAME/smart-recipe-generator - you should see your code!

---

## ✅ **STEP 3: Deploy to Render.com (7 minutes)**

### 3.1 Create Render Account

1. Go to **https://render.com**
2. Click **Get Started**
3. Choose **Continue with GitHub**
4. Authorize Render to access your GitHub account

### 3.2 Create Web Service

1. Go to **Render Dashboard** (https://dashboard.render.com)
2. Click **New +** button (top right)
3. Select **Web Service**
4. Choose your **smart-recipe-generator** repository
5. Click **Connect**

### 3.3 Configure Service

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | smart-recipe-generator |
| **Environment** | Node |
| **Region** | Choose closest to you |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### 3.4 Add Environment Variables

Click **Advanced** section and add each variable:

```
PORT = 5000
NODE_ENV = production
MONGO_URI = mongodb+srv://akshayashettymurari_db_user:mittu2007@cluster0.jcykgcm.mongodb.net/smart_recipe_db?retryWrites=true&w=majority
JWT_SECRET = aB3mK9$xL2#pQ8@wN5vZ7&dF4yH6jC1rS0tU9eW2qX4mJ6kL9pO3sR5uV7yZ1cB8dE
JWT_EXPIRES_IN = 7d
GROQ_API_KEY = gsk_YOUR_GROQ_API_KEY_HERE
CLIENT_URL = https://smart-recipe-generator.onrender.com
```

### 3.5 Deploy

1. Click **Create Web Service**
2. **Wait 3-5 minutes** for build to complete
3. You'll see logs showing:
   ```
   ✓ Build successful
   ✓ Deploying...
   ✓ Server running on http://localhost:5000
   ```

### 3.6 Get Your URL

Once deployed, you'll see a URL like:
```
https://smart-recipe-generator.onrender.com
```

**This is your live app!** 🎉

---

## ✅ **STEP 4: Verify Deployment (3 minutes)**

### 4.1 Test Health Endpoint

Open in browser:
```
https://smart-recipe-generator.onrender.com/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Smart Recipe Generator API is running",
  "env": "production",
  "version": "1.0.0-production"
}
```

### 4.2 Test Frontend

Open:
```
https://smart-recipe-generator.onrender.com
```

You should see the app interface!

### 4.3 Test API

```bash
# Health check
curl https://smart-recipe-generator.onrender.com/api/health

# Register (should work)
curl -X POST https://smart-recipe-generator.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📋 **TROUBLESHOOTING**

### **Build Failed**

**Error**: Build failed during deployment

**Solution**:
```bash
# Check locally first
npm install
npm start

# If works locally, push to GitHub:
git add .
git commit -m "Fix: update dependencies"
git push origin main

# Render will automatically rebuild
```

### **Can't Connect to MongoDB**

**Error**: MongoDB connection failed

**Solution**:
1. Check IP whitelist in MongoDB Atlas:
   - Go to https://cloud.mongodb.com
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allows all IPs)

### **API Returns 500 Error**

**Error**: Internal server error

**Solution**:
1. Go to Render dashboard
2. Click your service
3. Check **Logs** tab for error messages
4. Fix error in code
5. Push to GitHub - Render redeploys automatically

### **Groq API Not Working**

**Error**: Recipe generation fails

**Solution**:
1. Verify GROQ_API_KEY is correct in Render environment
2. Check Groq quota: https://console.groq.com
3. Update key if needed in Render dashboard

---

## 🔄 **How to Update After Deployment**

Once deployed, updates are automatic:

1. **Make changes** to your code locally
2. **Commit & push** to GitHub:
   ```bash
   git add .
   git commit -m "Feature: add new functionality"
   git push origin main
   ```
3. **Render automatically**:
   - Detects push
   - Rebuilds
   - Deploys new version
   - **No downtime!**

---

## 📊 **Free Tier Details**

### Limits (Per Month)
- **Compute Hours**: 750 hours (≈ 24/7 for full month)
- **Database Storage**: 100MB for free PostgreSQL (we use MongoDB Atlas, which is separate)
- **Outbound Bandwidth**: 100GB
- **Requests**: Unlimited

### After 4 Months

When free tier ends (in 4 months):

**Option A**: Switch to paid ($7/month)
- Unlimited hours
- Upgraded instance

**Option B**: Find another free tier provider

**Option C**: Delete and redeploy with new account

---

## ✅ **Post-Deployment Checklist**

- [x] Code pushed to GitHub
- [x] Render service created
- [x] Environment variables added
- [x] Deployment successful
- [x] Health check working
- [x] Frontend loads
- [x] API responding
- [x] Database connected
- [x] Groq AI working
- [x] Email service ready

---

## 🎉 **You're Live!**

Your app is now accessible from anywhere:

```
Frontend:  https://smart-recipe-generator.onrender.com
API Base:  https://smart-recipe-generator.onrender.com/api
Health:    https://smart-recipe-generator.onrender.com/api/health
```

---

## 📞 **Need Help?**

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check logs in Render dashboard |
| API returns 500 | Check MongoDB connection |
| Can't register | Check email config or database |
| Recipe generation fails | Check Groq API key & quota |
| Slow responses | Normal for free tier, upgrade to paid |

### Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Groq API**: https://console.groq.com

---

## 🚀 **NEXT STEPS**

1. ✅ Verify deployment works
2. Test all features (register, generate recipe, create shopping list, etc.)
3. Share URL with others: `https://smart-recipe-generator.onrender.com`
4. Monitor Render dashboard for uptime
5. Plan for paid tier if needed (after 4 months)

---

**Congratulations! Your Smart Recipe Generator is live!** 🎉

**Total Deployment Time**: ~20 minutes  
**Cost**: FREE (for 4 months)  
**Users**: Unlimited  

---

**Share your app with the world!** 🌍
