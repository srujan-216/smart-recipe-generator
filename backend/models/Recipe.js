const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  {
    name: String,
    qty: String,
    unit: { type: String, default: '' },
    cost: { type: Number, default: 0 },
  },
  { _id: false }
);

const nutritionSchema = new mongoose.Schema(
  {
    calories: String,
    protein: String,
    carbs: String,
    fat: String,
    fiber: String,
    allergens: [String],
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Basic recipe info
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },

    // Indian-specific cuisine classification
    cuisine: {
      type: String,
      enum: [
        'north-indian',
        'south-indian',
        'east-indian',
        'west-indian',
        'northeast-indian',
        'mughlai',
        'fusion',
      ],
      default: 'north-indian',
    },
    region: { type: String, default: '' },

    meal_type: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage'],
      default: 'lunch',
    },

    // Cooking times
    prep_time: { type: String, default: '' },
    cook_time: { type: String, default: '' },
    total_time: { type: String, default: '' },

    // Servings & portions
    servings: { type: Number, default: 4 },
    yield: { type: String, default: '4 servings' },

    // Recipe details
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    spice_level: {
      type: String,
      enum: ['Mild', 'Medium', 'Hot', 'Very Hot'],
      default: 'Medium',
    },
    dietaryType: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'vegan', 'eggetarian'],
      default: 'vegetarian',
    },

    // Ingredients & instructions
    ingredients: [ingredientSchema],
    steps: [String],
    equipmentNeeded: [String],

    // Nutrition & allergens
    nutrition: nutritionSchema,
    chef_tip: { type: String, default: '' },
    tips: [String],

    // Cost information
    estimatedCost: { type: Number, default: 0 },
    costPerServing: { type: Number, default: 0 },
    budget: { type: String, enum: ['budget', 'moderate', 'premium'], default: 'moderate' },

    // User engagement
    isFavourite: { type: Boolean, default: false, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    timesCooked: { type: Number, default: 0 },
    emoji: { type: String, default: '🍽' },

    // Input metadata
    inputIngredients: { type: String, default: '' },
    inputDietary: [String],

    // Flags
    isPublished: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexing for better search performance
recipeSchema.index({ name: 'text', description: 'text', cuisine: 'text' });
recipeSchema.index({ cuisine: 1, meal_type: 1 });
recipeSchema.index({ dietaryType: 1 });
recipeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);
