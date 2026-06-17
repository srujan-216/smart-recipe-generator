const express   = require('express');
const jwt       = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User      = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper: sign JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ── POST /api/auth/register ───────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { name, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing)
        return res.status(409).json({ success: false, message: 'Email already registered' });

      const user  = await User.create({ name, email, password });
      const token = signToken(user._id);

      res.status(201).json({ success: true, token, user });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ success: false, message: 'Invalid email or password' });

      const token = signToken(user._id);
      user.password = undefined; // strip before sending

      res.json({ success: true, token, user });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/auth/me ──────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
