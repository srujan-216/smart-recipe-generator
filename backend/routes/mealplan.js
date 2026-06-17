const express = require('express');
const { body, validationResult } = require('express-validator');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Create meal plan
router.post('/create', [
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('planName').trim().optional(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { startDate, planName } = req.body;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    // Create empty meal plan for the week
    const meals = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ].map(day => ({
      day,
      breakfast: null,
      lunch: null,
      dinner: null,
      snacks: [],
    }));

    const mealPlan = await MealPlan.create({
      user: req.user._id,
      planName: planName || 'Weekly Meal Plan',
      startDate: start,
      endDate: end,
      meals,
    });

    res.status(201).json({ success: true, data: mealPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all meal plans
router.get('/', async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id })
      .populate('meals.breakfast')
      .populate('meals.lunch')
      .populate('meals.dinner')
      .populate('meals.snacks')
      .sort({ startDate: -1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get active meal plan
router.get('/active', async (req, res) => {
  try {
    const today = new Date();
    const plan = await MealPlan.findOne({
      user: req.user._id,
      isActive: true,
      startDate: { $lte: today },
      endDate: { $gte: today },
    })
      .populate('meals.breakfast')
      .populate('meals.lunch')
      .populate('meals.dinner')
      .populate('meals.snacks');

    res.json({ success: true, data: plan || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add recipe to meal plan
router.patch('/:id/meal', [
  body('day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  body('mealType').isIn(['breakfast', 'lunch', 'dinner']),
  body('recipeId').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { day, mealType, recipeId } = req.body;
    const plan = await MealPlan.findOne({ _id: req.params.id, user: req.user._id });

    if (!plan)
      return res.status(404).json({ success: false, message: 'Meal plan not found' });

    const recipe = await Recipe.findById(recipeId);
    if (!recipe)
      return res.status(404).json({ success: false, message: 'Recipe not found' });

    const mealIndex = plan.meals.findIndex(m => m.day === day);
    if (mealIndex !== -1) {
      plan.meals[mealIndex][mealType] = recipeId;
      await plan.save();
    }

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete meal plan
router.delete('/:id', async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan)
      return res.status(404).json({ success: false, message: 'Meal plan not found' });
    res.json({ success: true, message: 'Meal plan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
