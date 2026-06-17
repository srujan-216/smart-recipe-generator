const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', default: null },
    lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', default: null },
    dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', default: null },
    snacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  { _id: false }
);

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planName: { type: String, default: 'Weekly Meal Plan' },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    meals: [mealSchema],
    notes: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    totalEstimatedCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MealPlan', mealPlanSchema);
