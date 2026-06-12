require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const path         = require('path');
const rateLimit    = require('express-rate-limit');

const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes   = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const userRoutes   = require('./routes/users');

// ── Connect to MongoDB ───────────────────────────────────
connectDB();

const app = express();

// ── Rate limiting ────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { success: false, message: 'Recipe generation limit reached. Please wait a minute.' },
});

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use('/api', limiter);

// ── Serve static frontend ────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ── API Routes ───────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/recipes', generateLimiter, recipeRoutes);
app.use('/api/users',   userRoutes);

// ── Health check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Recipe Generator API is running',
    env:     process.env.NODE_ENV,
    time:    new Date().toISOString(),
  });
});

// ── Catch-all: serve frontend for any unknown route ──────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// ── Global error handler ─────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n  Server running on http://localhost:${PORT}`);
  console.log(`  Frontend:  http://localhost:${PORT}`);
  console.log(`  API Base:  http://localhost:${PORT}/api`);
  console.log(`  Health:    http://localhost:${PORT}/api/health\n`);
});
