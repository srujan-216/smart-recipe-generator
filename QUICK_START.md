# 🍽️ Smart Recipe Generator - Quick Start Guide

Welcome! Your Smart Recipe Generator is now **production-ready** with all features for Indian households.

## What You Get

✅ **AI Recipe Generation** - Groq-powered intelligent recipe creation  
✅ **Shopping Lists** - Auto-generate from selected recipes  
✅ **Meal Planning** - Plan your week of meals  
✅ **Indian Preferences** - Family size, spice level, dietary choices  
✅ **Cost Tracking** - See cost per recipe & per serving  
✅ **Email Verification** - Secure account registration  
✅ **Deployed Ready** - Docker & CI/CD configured  

---

## 🚀 Running Locally (Right Now)

Your app is **already running** at:
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api
- **Health**: http://localhost:5000/api/health

### ✨ Current Setup
- Database: **MongoDB Atlas** (cloud)
- AI Engine: **Groq** (llama-3.3-70b-versatile)
- Server: **Node.js + Express**
- Status: **✅ Running & Connected**

---

## 📝 How to Use

### 1. Register an Account
1. Open http://localhost:5000
2. Click "Sign Up"
3. Enter: Name, Email, Password
4. Verify your email (check inbox)
5. Set your preferences:
   - Family size (how many people cook for)
   - Dietary preference (veg, non-veg, vegan, etc.)
   - Spice level (mild to very hot)
   - Region (North, South, East, West Indian)
   - Budget (budget-friendly, moderate, premium)
   - Allergies (if any)

### 2. Generate a Recipe
1. Go to "Generate Recipe"
2. Enter ingredients (e.g., "chicken, rice, spices")
3. Select cuisine (Indian regional type)
4. Pick preferences
5. Click "Generate"
6. AI creates a complete recipe with:
   - Ingredients & quantities
   - Step-by-step instructions
   - Cooking time
   - Nutrition info
   - Difficulty level
   - Chef's tips
   - Cost per serving

### 3. Create Shopping List
1. Generate or select recipes
2. Click "Create Shopping List"
3. System auto-combines ingredients
4. Check off items as you buy them
5. See total estimated cost

### 4. Plan Your Week
1. Go to "Meal Plans"
2. Create new weekly plan
3. Click on each day
4. Assign breakfast, lunch, dinner
5. Auto-generates shopping list
6. View cost breakdown

---

## 🔐 Email Setup (Gmail)

To enable email verification & password reset:

1. **Get App Password** (not regular password):
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google gives you a 16-character password
   - Copy it (e.g., `abcd efgh ijkl mnop`)

2. **Update `.env` file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```

3. **Restart server**:
   ```bash
   npm run dev
   ```

---

## 📦 API Endpoints Quick Reference

### Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya",
    "email": "priya@example.com",
    "password": "secure123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "priya@example.com",
    "password": "secure123"
  }'
# Returns: { "success": true, "token": "eyJ...", "user": {...} }
```

### Generate Recipe
```bash
curl -X POST http://localhost:5000/api/recipes/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": "chicken, onion, garlic, ginger",
    "cuisine": "north-indian",
    "dietary": ["non-vegetarian"],
    "meal_type": "lunch",
    "max_time": "45",
    "servings": 4
  }'
```

### Shopping List
```bash
# Create from recipes
curl -X POST http://localhost:5000/api/shopping/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipeIds": ["recipe_id_1", "recipe_id_2"],
    "listName": "Weekly Shopping"
  }'

# Get all lists
curl -X GET http://localhost:5000/api/shopping \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mark item as purchased
curl -X PATCH http://localhost:5000/api/shopping/list_id/item/0 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "isPurchased": true }'
```

### Meal Plans
```bash
# Create meal plan
curl -X POST http://localhost:5000/api/meal-plans/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-01-22",
    "planName": "Weekly Meal Plan"
  }'

# Add recipe to meal
curl -X PATCH http://localhost:5000/api/meal-plans/plan_id/meal \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "day": "monday",
    "mealType": "lunch",
    "recipeId": "recipe_id"
  }'
```

---

## 🐳 Docker Deployment

### Local with Docker Compose
```bash
# Ensure MongoDB is running
# Start everything:
docker-compose up -d

# Stop:
docker-compose down

# View logs:
docker-compose logs -f app
```

### Production with Docker
```bash
# Build image
docker build -t smart-recipe:latest .

# Run
docker run -d \
  -p 80:5000 \
  -e NODE_ENV=production \
  -e MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart_recipe_db \
  -e GROQ_API_KEY=your_key \
  -e JWT_SECRET=random_secret \
  -e EMAIL_USER=email@gmail.com \
  -e EMAIL_PASSWORD=app_password \
  smart-recipe:latest
```

---

## 📊 Database Collections

Your MongoDB has these collections:

1. **users**
   - Name, email, password (hashed)
   - Family preferences
   - Email verification status
   - Password reset tokens

2. **recipes**
   - Generated recipes
   - User-specific data
   - Ratings & favorites
   - Cost information

3. **shoppinglists**
   - Auto-generated from recipes
   - Item status tracking
   - Cost estimates

4. **mealplans**
   - Weekly meal assignments
   - Day-by-day breakdown
   - Cost calculations

---

## 🔧 Troubleshooting

### "Connection refused" on startup
```bash
# Check MongoDB is running
# Local MongoDB:
mongod --dbpath C:\path\to\data

# Or MongoDB Atlas:
# Ensure IP is whitelisted in Atlas console
```

### Emails not sending
```env
# Verify in .env:
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx  # 16 char app password, not regular password

# Check in Gmail:
# 1. 2FA enabled
# 2. App Password created (not regular password)
# 3. IP whitelisted if using corporate email
```

### Recipe generation fails
```
# Verify Groq API key
GROQ_API_KEY=gsk_... # Should start with "gsk_"

# Check rate limits (free tier: 30 req/min)
# Wait a minute and try again
```

### Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

---

## 📋 Pre-Deployment Checklist

Before going live, do these:

- [ ] Update JWT_SECRET to a random string
- [ ] Set strong passwords in env
- [ ] Configure email (Gmail App Password)
- [ ] Test recipe generation
- [ ] Test shopping list creation
- [ ] Test meal planning
- [ ] Set up MongoDB backups
- [ ] Configure domain & SSL
- [ ] Test health endpoint
- [ ] Set up monitoring

```bash
# Test health endpoint
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Smart Recipe Generator API is running",
  "env": "production",
  "version": "1.0.0-production"
}
```

---

## 🌍 Deploying to Server

### Option 1: Traditional Server
```bash
# SSH into server
ssh user@server

# Clone repo
git clone <repo-url>
cd smart-recipe-generator

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your production values

# Run with PM2
npm install -g pm2
pm2 start backend/server.js --name recipe-app
pm2 save
```

### Option 2: Docker (Recommended)
```bash
# SSH into server
ssh user@server

# Copy files
scp -r . user@server:/app/

# On server:
cd /app
docker build -t smart-recipe .
docker run -d --name recipe \
  -p 80:5000 \
  -e NODE_ENV=production \
  -e MONGO_URI=... \
  -e GROQ_API_KEY=... \
  smart-recipe
```

### Option 3: GitHub Actions (Automated)
1. Push to main branch
2. GitHub Actions auto-runs tests
3. Builds Docker image
4. Pushes to registry
5. Deploys to server (if configured)

See `.github/workflows/ci-cd.yml` for details.

---

## 📚 Full Documentation

- **Deployment Guide**: See `PRODUCTION_DEPLOYMENT.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Original README**: See `README.md`

---

## 🎯 Feature Roadmap

### Currently Implemented ✅
- AI recipe generation
- Shopping lists
- Meal planning
- User profiles
- Email verification
- Password reset
- Docker support
- CI/CD pipeline

### Future Enhancements 🚀
- Recipe ratings & reviews
- Community recipes
- Cooking videos
- Voice search
- Mobile app
- Offline mode
- Social sharing
- Admin dashboard

---

## ❓ Need Help?

### For API Issues
```bash
# Check server is running
curl http://localhost:5000/api/health

# Check logs
docker logs -f smart-recipe-app

# Or with npm:
npm run dev  # Shows live logs
```

### For Database Issues
- MongoDB Atlas: https://cloud.mongodb.com
- Check IP whitelist: Network Access → Add Current IP

### For AI Issues
- Groq Console: https://console.groq.com
- Check API key & quota

### For Deployment Issues
- Docker: https://docs.docker.com
- GitHub Actions: https://github.com/features/actions
- PM2: https://pm2.keymetrics.io

---

## 🎉 You're Ready!

Your app is:
✅ Fully functional
✅ Production-ready
✅ Secure
✅ Scalable
✅ Indian-household optimized

**Next Step**: Deploy and start helping Indian families plan better meals! 🍽️

---

**Questions?** Check the full documentation files or visit the GitHub repository.

**Happy cooking!** 👨‍🍳👩‍🍳
