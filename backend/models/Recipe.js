const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  { name: String, qty: String },
  { _id: false }
);

const nutritionSchema = new mongoose.Schema(
  {
    calories: String,
    protein:  String,
    carbs:    String,
    fat:      String,
    fiber:    String,
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

    // ── AI-generated fields ──────────────────────────────
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    cuisine:     { type: String, default: '' },
    meal_type:   { type: String, default: '' },
    prep_time:   { type: String, default: '' },
    cook_time:   { type: String, default: '' },
    total_time:  { type: String, default: '' },
    servings:    { type: Number, default: 2 },
    difficulty:  { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    spice_level: { type: String, default: '' },
    ingredients: [ingredientSchema],
    steps:       [String],
    nutrition:   nutritionSchema,
    chef_tip:    { type: String, default: '' },

    // ── User meta ────────────────────────────────────────
    isFavourite: { type: Boolean, default: false },
    emoji:       { type: String, default: '🍽' },

    // ── Input that produced this recipe ─────────────────
    inputIngredients: { type: String, default: '' },
    inputDietary:     [String],
  },
  { timestamps: true }
);

// Full-text search index
recipeSchema.index({ name: 'text', description: 'text', cuisine: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
