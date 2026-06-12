const express  = require('express');
const { body, validationResult } = require('express-validator');
const User     = require('../models/User');
const Recipe   = require('../models/Recipe');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// ── GET /api/users/profile ────────────────────────────────
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedRecipes', 'name cuisine createdAt');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/users/profile ────────────────────────────────
router.put(
  '/profile',
  [body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { name } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name },
        { new: true, runValidators: true }
      );

      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }
);

// ── PUT /api/users/change-password ───────────────────────
router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password min 6 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select('+password');

      if (!(await user.comparePassword(currentPassword)))
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });

      user.password = newPassword;
      await user.save();

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/users/account ─────────────────────────────
router.delete('/account', async (req, res, next) => {
  try {
    await Recipe.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
