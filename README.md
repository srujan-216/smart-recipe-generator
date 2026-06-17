# Smart Recipe Generator

An AI-powered recipe generation web app. Type in whatever ingredients you have, set your preferences, and get a complete recipe with steps, nutrition info, and a chef's tip — powered by Google Gemini AI.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [1 · Get a Gemini API Key](#1--get-a-gemini-api-key)
- [2 · Set Up MongoDB](#2--set-up-mongodb)
- [3 · Configure Environment Variables](#3--configure-environment-variables)
- [4 · Install Dependencies](#4--install-dependencies)
- [5 · Run Locally](#5--run-locally)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## Features

- AI recipe generation from any ingredients (Google Gemini)
- Cuisine, dietary, meal type, time limit, and servings filters
- Full recipe view — ingredients, steps, nutrition, chef's tip
- Save recipes to favourites
- Search and filter recipe history
- Live dashboard with stats and cuisine breakdown
- Daily streak tracking
- JWT authentication (register, login, session persistence)
- Fully responsive — works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| AI | Google Gemini (`gemini-1.5-flash`) |
| Auth | JWT, bcryptjs |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Dev | nodemon |

---

## Project Structure

```
smart-recipe-generator/
├── backend/
│   ├── server.js               # Express app entry point
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Recipe.js           # Recipe schema
│   └── routes/
│       ├── auth.js             # /api/auth/*
│       ├── recipes.js          # /api/recipes/*
│       └── users.js            # /api/users/*
├── frontend/
│   └── public/
│       ├── index.html          # Single-page frontend
│       └── api.js              # Frontend fetch wrapper
├── .env                        # Environment variables (not committed)
├── .env.example                # Template for .env
├── .gitignore
└── package.json
```

---

## Prerequisites

Make sure you have these installed before you start:

- **Node.js** v18 or higher — https://nodejs.org
- **npm** v9 or higher (comes with Node.js)
- **MongoDB** (local or cloud) — see Step 2 below

Check your versions:

```bash
node -v
npm -v
```

---

## 1 · Get a Gemini API Key

The app uses Google Gemini to generate recipes. The API has a **free tier** that is more than enough for personal use.

1. Go to **https://aistudio.google.com**
2. Sign in with a Google account
3. Click **"Get API key"** in the left sidebar
4. Click **"Create API key"**
5. Copy the key — it looks like `AIzaSy...`

Keep this key safe. You will paste it into `.env` in Step 3.

---

## 2 · Set Up MongoDB

You have two options: run MongoDB locally on your machine, or use a free cloud database (Atlas). Cloud is easier if you don't want to install anything.

### Option A — MongoDB Atlas (Cloud, Recommended)

No installation needed. Free forever on the M0 tier.

1. Go to **https://www.mongodb.com/atlas** and create a free account
2. Click **"Build a Database"** → choose **M0 Free** → pick any region → click **"Create"**
3. When asked to create a user, set a **username** and **password** — write these down
4. Under **"Where would you like to connect from?"**, choose **"My Local Environment"**
   - In the IP Address field, enter `0.0.0.0/0` and click **"Add Entry"** (allows access from anywhere)
5. Click **"Finish and Close"**
6. On the main Clusters page, click **"Connect"** on your cluster
7. Choose **"Drivers"**
8. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `<username>` and `<password>` with the credentials you created in Step 3
10. Add your database name before the `?`:
    ```
    mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/smart_recipe_db?retryWrites=true&w=majority
    ```
11. Use this full string as your `MONGO_URI` in Step 3

### Option B — Local MongoDB

1. Download **MongoDB Community Server** from https://www.mongodb.com/try/download/community
2. Run the installer (Windows: use the MSI installer, check "Install MongoDB as a Service")
3. MongoDB will start automatically. You can verify it's running:
   ```bash
   # Windows (in PowerShell as Administrator)
   Get-Service -Name MongoDB
   ```
4. Your local connection string is simply:
   ```
   mongodb://127.0.0.1:27017/smart_recipe_db
   ```
   This is already set as the default in `.env.example`.

---

## 3 · Configure Environment Variables

The app reads its configuration from a `.env` file in the project root.

A `.env` file was already created for you. Open it and fill in your values:

```env
PORT=5000
NODE_ENV=development

# MongoDB — paste your connection string here
MONGO_URI=mongodb://127.0.0.1:27017/smart_recipe_db

# JWT — change this to any long random string (used to sign login tokens)
JWT_SECRET=change_this_to_a_long_random_secret_before_production
JWT_EXPIRES_IN=7d

# Gemini — paste your API key from aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (leave as-is for local development)
CLIENT_URL=http://localhost:5000
```

**What each variable does:**

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on. Default is `5000`. |
| `NODE_ENV` | Set to `development` locally. Enables detailed error messages. |
| `MONGO_URI` | Full MongoDB connection string. See Step 2. |
| `JWT_SECRET` | Secret key used to sign and verify login tokens. Use any long random string in production. |
| `JWT_EXPIRES_IN` | How long login sessions last. `7d` = 7 days. |
| `GEMINI_API_KEY` | Your Google Gemini API key. See Step 1. |
| `CLIENT_URL` | Allowed CORS origin. Keep as `http://localhost:5000` for local dev. |

> **Important:** The `.env` file is listed in `.gitignore` and will never be committed to Git. Never share this file or paste it publicly.

---

## 4 · Install Dependencies

In the project root folder, run:

```bash
npm install
```

This installs all required packages listed in `package.json`. It creates a `node_modules/` folder — this can take a minute.

---

## 5 · Run Locally

### Development mode (auto-restarts on file changes)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

Once the server starts you will see:

```
  Server running on http://localhost:5000
  Frontend:  http://localhost:5000
  API Base:  http://localhost:5000/api
  Health:    http://localhost:5000/api/health
```

Open **http://localhost:5000** in your browser. That's it.

### Verify the API is working

Open http://localhost:5000/api/health in your browser. You should see:

```json
{
  "success": true,
  "message": "Smart Recipe Generator API is running",
  "env": "development",
  "time": "2025-06-11T..."
}
```

---

## API Reference

All API routes are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Create a new account |
| `POST` | `/api/auth/login` | No | Log in, receive JWT token |
| `GET` | `/api/auth/me` | Yes | Get current user info |

**Register body:**
```json
{ "name": "Jane Smith", "email": "jane@example.com", "password": "secret123" }
```

**Login body:**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

Both return:
```json
{ "success": true, "token": "eyJ...", "user": { "_id": "...", "name": "Jane Smith", ... } }
```

---

### Recipes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/recipes/generate` | Yes | Generate a recipe with AI |
| `GET` | `/api/recipes` | Yes | List all your recipes (filterable) |
| `GET` | `/api/recipes/stats` | Yes | Get dashboard stats |
| `GET` | `/api/recipes/:id` | Yes | Get a single recipe |
| `PATCH` | `/api/recipes/:id/favourite` | Yes | Toggle favourite status |
| `DELETE` | `/api/recipes/:id` | Yes | Delete a recipe |

**Generate body:**
```json
{
  "ingredients": "chicken, garlic, lemon, spinach",
  "cuisine": "Italian",
  "dietary": ["gluten-free"],
  "meal_type": "dinner",
  "max_time": "30",
  "servings": 2
}
```

**List recipes query params:**
- `?search=pasta` — full-text search
- `?cuisine=Italian` — filter by cuisine
- `?meal_type=dinner` — filter by meal type
- `?favourite=true` — only favourites
- `?page=1&limit=20` — pagination

---

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Yes | Get full profile |
| `PUT` | `/api/users/profile` | Yes | Update name |
| `PUT` | `/api/users/change-password` | Yes | Change password |
| `DELETE` | `/api/users/account` | Yes | Delete account and all recipes |

---

## Troubleshooting

**`MongoDB connection failed`**
- If using local MongoDB: make sure the MongoDB service is running.
  - Windows: open Services (`services.msc`) and start "MongoDB"
  - Or in PowerShell (as Admin): `Start-Service -Name MongoDB`
- If using Atlas: check that your IP address is whitelisted in Atlas → Network Access. Add `0.0.0.0/0` to allow all IPs.
- Double-check the `MONGO_URI` in `.env` — no extra spaces, correct username/password.

**`Recipe generation error` / AI not responding**
- Make sure `GEMINI_API_KEY` in `.env` is correct and has no extra spaces.
- The free Gemini tier has rate limits. Wait a minute and try again.
- Check the key is still active at https://aistudio.google.com

**`Port 5000 already in use`**
- Another process is using port 5000. Either stop that process, or change `PORT=5001` in `.env`.

**`Token invalid or expired`**
- Your login session expired (default: 7 days). Log out and log back in.
- If you changed `JWT_SECRET` in `.env` after logging in, all existing tokens are invalidated. Log in again.

**`npm install` fails**
- Make sure you're in the project root folder (where `package.json` is).
- Try deleting `node_modules/` and `package-lock.json`, then run `npm install` again.

**Page loads but shows blank / JS errors**
- Open browser DevTools (F12) → Console tab to see the error.
- Make sure the server is running (`npm run dev`) before opening the browser.
- Hard-refresh the page: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac).
