# Production Deployment Guide

## Overview

Smart Recipe Generator is now production-ready with comprehensive features for Indian households.

## What's New in v1.0.0

### 🔐 Security & Auth
- ✅ Email verification system
- ✅ Password reset functionality
- ✅ Rate limiting on auth endpoints
- ✅ Input sanitization (MongoDB injection protection)
- ✅ Helmet.js for HTTP headers security
- ✅ CORS properly configured

### 🍽️ Indian-Specific Features
- ✅ Regional cuisines (North, South, East, West)
- ✅ Dietary preferences (vegetarian, non-veg, vegan, etc.)
- ✅ Family size preferences (1-20 people)
- ✅ Spice level preferences (Mild to Very Hot)
- ✅ Budget-conscious recipes
- ✅ Cost estimation per recipe & serving

### 📋 Core Features
- ✅ Smart shopping list generation
- ✅ Weekly meal planning
- ✅ Recipe search & advanced filters
- ✅ Recipe ratings & times cooked tracking
- ✅ Allergen warnings
- ✅ Equipment needed suggestions
- ✅ Cooking tips & chef's notes

### 🚀 Production Infrastructure
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD pipeline
- ✅ MongoDB Atlas cloud support
- ✅ Health checks & monitoring
- ✅ Environment-based configuration
- ✅ Comprehensive logging

## Prerequisites

### Local Development
```bash
# Required
- Node.js v18+
- npm v9+
- MongoDB (local or Atlas)
- Groq API key (free tier: https://console.groq.com)

# Optional
- Docker & Docker Compose (for containerization)
- GitHub account (for CI/CD)
```

### Production Server
```bash
- Linux server (Ubuntu 20.04+)
- Docker & Docker Compose installed
- Domain with SSL certificate
- MongoDB Atlas cluster (free tier: https://mongodb.com/atlas)
- Email service (Gmail, SendGrid, etc.)
```

## Setup Instructions

### 1. Local Development Setup

```bash
# Clone repository
git clone <repository-url>
cd smart-recipe-generator

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Required in .env:**
```env
# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/smart_recipe_db

# API
GROQ_API_KEY=your_groq_api_key

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT (change this!)
JWT_SECRET=your-random-secret-key
```

### 2. Start Development Server

```bash
# Using npm
npm run dev

# Using Docker Compose
docker-compose up -d
```

Visit: http://localhost:5000

### 3. Production Deployment

#### Option A: Using Docker (Recommended)

```bash
# Build image
docker build -t smart-recipe-generator:latest .

# Run container
docker run -d \
  -p 80:5000 \
  -e NODE_ENV=production \
  -e MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart_recipe_db \
  -e GROQ_API_KEY=your_key \
  -e JWT_SECRET=your_secret \
  --name smart-recipe \
  smart-recipe-generator:latest
```

#### Option B: Using Docker Compose

```bash
# Copy docker-compose to server
scp docker-compose.yml user@server:/app/

# On server:
cd /app
docker-compose up -d
```

#### Option C: Traditional Setup

```bash
# On server:
git clone <repository-url>
cd smart-recipe-generator
npm install
npm run build  # if applicable
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start backend/server.js --name smart-recipe
pm2 save
```

### 4. MongoDB Atlas Setup

1. Go to https://mongodb.com/atlas
2. Create free M0 cluster
3. Create database user (remember credentials!)
4. Whitelist IP addresses (allow 0.0.0.0/0 for testing)
5. Get connection string: `mongodb+srv://user:pass@cluster.jcykgcm.mongodb.net/smart_recipe_db?retryWrites=true&w=majority`

### 5. Email Configuration (Gmail)

1. Enable 2-factor authentication in Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to .env:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### 6. Groq API Setup

1. Go to https://console.groq.com
2. Create API key
3. Add to .env: `GROQ_API_KEY=your_key`

### 7. GitHub Actions CI/CD Setup (Optional)

1. Go to Settings → Secrets → New repository secret
2. Add secrets:
   - `DEPLOY_KEY`: SSH private key
   - `DEPLOY_HOST`: Server IP/hostname
   - `DEPLOY_USER`: SSH user

## API Endpoints

### Authentication
```
POST   /api/auth/register           - Create account
POST   /api/auth/login              - Login
GET    /api/auth/me                 - Get profile
POST   /api/auth/logout             - Logout
POST   /api/auth/verify-email/:token - Verify email
POST   /api/auth/forgot-password    - Reset password
POST   /api/auth/reset-password     - Set new password
```

### Recipes
```
POST   /api/recipes/generate        - Generate recipe with AI
GET    /api/recipes                 - List recipes (filterable)
GET    /api/recipes/:id             - Get single recipe
PATCH  /api/recipes/:id/favourite   - Toggle favourite
DELETE /api/recipes/:id             - Delete recipe
GET    /api/recipes/stats           - Dashboard stats
```

### Shopping Lists
```
POST   /api/shopping/create         - Create from recipes
GET    /api/shopping                - List all lists
GET    /api/shopping/:id            - Get list details
PATCH  /api/shopping/:id/item/:idx  - Mark item as purchased
DELETE /api/shopping/:id            - Delete list
```

### Meal Plans
```
POST   /api/meal-plans/create       - Create meal plan
GET    /api/meal-plans              - List all plans
GET    /api/meal-plans/active       - Get current week
PATCH  /api/meal-plans/:id/meal     - Add recipe to meal
DELETE /api/meal-plans/:id          - Delete plan
```

### Users
```
GET    /api/users/profile           - Get full profile
PUT    /api/users/profile           - Update profile
PUT    /api/users/change-password   - Change password
DELETE /api/users/account           - Delete account
```

## Monitoring & Logging

### Health Check
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Smart Recipe Generator API is running",
  "env": "production",
  "version": "1.0.0-production"
}
```

### Log Levels
Configure in .env:
```env
LOG_LEVEL=debug    # development
LOG_LEVEL=info     # production
```

### Docker Logs
```bash
docker logs -f smart-recipe-app
```

## Scaling Considerations

1. **Database**: MongoDB Atlas auto-scales M0 tier free
2. **API**: Horizontal scaling with load balancer
3. **Cache**: Add Redis for session caching
4. **CDN**: Cloudflare for static assets
5. **Rate Limiting**: Configured per endpoint

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Failed
- Check MONGO_URI in .env
- Verify IP whitelisting in MongoDB Atlas
- Ensure database user credentials are correct

### Email Not Sending
- Verify Gmail App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASSWORD
- Allow "Less Secure Apps" if not using App Password

### Docker Issues
```bash
# Rebuild without cache
docker build --no-cache -t smart-recipe-generator:latest .

# Check container health
docker inspect --format='{{.State.Health}}' smart-recipe-app
```

## Performance Optimization

1. **Database Indexing**: Already optimized (see models)
2. **API Caching**: Implement Redis layer
3. **Image Compression**: Use image optimization middleware
4. **CDN**: Serve static files from CDN
5. **Monitoring**: Use New Relic or DataDog

## Security Checklist

- [ ] Change JWT_SECRET to random string
- [ ] Enable email verification
- [ ] Setup HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Regular MongoDB backups
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Security headers set (Helmet.js)

## Support & Resources

- GitHub: [Link to repository]
- Groq Docs: https://console.groq.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Node.js Docs: https://nodejs.org/docs

---

**Version**: 1.0.0-production  
**Last Updated**: 2024  
**Status**: Production Ready ✅
