const express = require('express');
const { body, validationResult } = require('express-validator');
const ShoppingList = require('../models/ShoppingList');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Create shopping list from recipes
router.post('/create', [
  body('recipeIds').isArray().notEmpty().withMessage('Recipe IDs required'),
  body('listName').trim().optional(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { recipeIds, listName } = req.body;

    // Get all recipes
    const recipes = await Recipe.find({ _id: { $in: recipeIds }, user: req.user._id });
    if (recipes.length === 0)
      return res.status(404).json({ success: false, message: 'No recipes found' });

    // Combine ingredients
    const ingredientMap = {};
    let totalCost = 0;

    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase();
        if (ingredientMap[key]) {
          ingredientMap[key].quantity += parseFloat(ing.qty) || 1;
        } else {
          ingredientMap[key] = {
            name: ing.name,
            quantity: parseFloat(ing.qty) || 1,
            unit: ing.unit,
            category: 'others',
            estimatedCost: ing.cost || 0,
          };
          totalCost += ing.cost || 0;
        }
      });
    });

    const items = Object.values(ingredientMap);

    const shoppingList = await ShoppingList.create({
      user: req.user._id,
      recipes: recipeIds,
      items,
      totalEstimatedCost: totalCost,
      listName: listName || 'Shopping List',
    });

    res.status(201).json({ success: true, data: shoppingList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all shopping lists
router.get('/', async (req, res) => {
  try {
    const lists = await ShoppingList.find({ user: req.user._id })
      .populate('recipes')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: lists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single shopping list
router.get('/:id', async (req, res) => {
  try {
    const list = await ShoppingList.findOne({ _id: req.params.id, user: req.user._id })
      .populate('recipes');
    if (!list)
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update item status
router.patch('/:id/item/:itemIndex', async (req, res) => {
  try {
    const { isPurchased } = req.body;
    const list = await ShoppingList.findOne({ _id: req.params.id, user: req.user._id });

    if (!list)
      return res.status(404).json({ success: false, message: 'Shopping list not found' });

    if (list.items[req.params.itemIndex]) {
      list.items[req.params.itemIndex].isPurchased = isPurchased;
      const purchasedCount = list.items.filter(i => i.isPurchased).length;
      list.completionPercentage = Math.round((purchasedCount / list.items.length) * 100);
      await list.save();
    }

    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete shopping list
router.delete('/:id', async (req, res) => {
  try {
    const list = await ShoppingList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!list)
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    res.json({ success: true, message: 'Shopping list deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
