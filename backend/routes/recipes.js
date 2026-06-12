const express    = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { body, validationResult } = require('express-validator');
const Recipe     = require('../models/Recipe');
const User       = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.use(protect);

// ── POST /api/recipes/generate ───────────────────────────
router.post(
  '/generate',
  [body('ingredients').trim().notEmpty().withMessage('Ingredients are required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const {
        ingredients,
        cuisine   = '',
        dietary   = [],
        meal_type = 'any',
        max_time  = '',
        servings  = 2,
      } = req.body;

      const prompt = `You are a professional chef. Create a detailed recipe using these ingredients: ${ingredients}.
Cuisine: ${cuisine || 'any'}.
Dietary requirements: ${dietary.length ? dietary.join(', ') : 'none'}.
Meal type: ${meal_type}.
Maximum cooking time: ${max_time ? max_time + ' minutes' : 'no limit'}.
Servings: ${servings}.

Return ONLY a valid JSON object — no markdown, no backticks, no explanation, nothing else.
Use exactly this structure:
{
  "name": "recipe name",
  "description": "1-2 sentence description",
  "cuisine": "cuisine type",
  "meal_type": "breakfast/lunch/dinner/snack/dessert",
  "prep_time": "X mins",
  "cook_time": "X mins",
  "total_time": "X mins",
  "servings": 2,
  "difficulty": "Easy",
  "spice_level": "Mild",
  "ingredients": [
    { "name": "ingredient name", "qty": "amount" }
  ],
  "steps": [
    "Step 1 description",
    "Step 2 description"
  ],
  "nutrition": {
    "calories": "400kcal",
    "protein": "30g",
    "carbs": "20g",
    "fat": "15g",
    "fiber": "5g"
  },
  "chef_tip": "one useful cooking tip"
}`;

      const model   = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result  = await model.generateContent(prompt);
      const rawText = result.response.text().trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      const recipeData = JSON.parse(rawText);

      const recipe = await Recipe.create({
        user:             req.user._id,
        ...recipeData,
        inputIngredients: ingredients,
        inputDietary:     dietary,
        emoji:            '🍽',
      });

      // ── Update streak ────────────────────────────────────
      const today = new Date(); today.setHours(0, 0, 0, 0);
      let streak = req.user.streak || 0;

      if (!req.user.lastActive) {
        streak = 1;
      } else {
        const last = new Date(req.user.lastActive); last.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today - last) / 86400000);
        if (diffDays === 1)     streak += 1;
        else if (diffDays > 1) streak = 1;
        // diffDays === 0 → same day, streak unchanged
      }

      await User.findByIdAndUpdate(req.user._id, { streak, lastActive: new Date() });

      res.status(201).json({ success: true, recipe });
    } catch (err) {
      console.error('Recipe generation error:', err.message);
      next(err);
    }
  }
);

// ── GET /api/recipes ──────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { cuisine, meal_type, search, favourite, page = 1, limit = 20 } = req.query;

    const filter = { user: req.user._id };
    if (cuisine)              filter.cuisine     = { $regex: cuisine,   $options: 'i' };
    if (meal_type)            filter.meal_type   = { $regex: meal_type, $options: 'i' };
    if (favourite === 'true') filter.isFavourite = true;
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisine:     { $regex: search, $options: 'i' } },
      ];
    }

    const skip    = (Number(page) - 1) * Number(limit);
    const total   = await Recipe.countDocuments(filter);
    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), recipes });
  } catch (err) { next(err); }
});

// ── GET /api/recipes/stats ────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user._id;
    const freshUser = await User.findById(userId);
    const [total, favourites, cuisines] = await Promise.all([
      Recipe.countDocuments({ user: userId }),
      Recipe.countDocuments({ user: userId, isFavourite: true }),
      Recipe.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$cuisine', count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
        { $limit: 6 },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        favourites,
        cuisinesExplored: cuisines.length,
        streak:           freshUser.streak || 0,
        topCuisines:      cuisines.map(c => ({ cuisine: c._id, count: c.count })),
      },
    });
  } catch (err) { next(err); }
});

// ── GET /api/recipes/:id ──────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe)
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.json({ success: true, recipe });
  } catch (err) { next(err); }
});

// ── PATCH /api/recipes/:id/favourite ─────────────────────
router.patch('/:id/favourite', async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe)
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    recipe.isFavourite = !recipe.isFavourite;
    await recipe.save();
    res.json({ success: true, isFavourite: recipe.isFavourite });
  } catch (err) { next(err); }
});

// ── DELETE /api/recipes/:id ───────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!recipe)
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.json({ success: true, message: 'Recipe deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
