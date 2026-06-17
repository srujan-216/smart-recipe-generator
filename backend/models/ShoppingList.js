const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: '' },
    category: {
      type: String,
      enum: [
        'grains',
        'pulses',
        'vegetables',
        'fruits',
        'dairy',
        'spices',
        'oils',
        'meats',
        'seafood',
        'condiments',
        'others',
      ],
      default: 'others',
    },
    isPurchased: { type: Boolean, default: false },
    estimatedCost: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const shoppingListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
    items: [itemSchema],
    totalEstimatedCost: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 },
    listName: { type: String, default: 'Shopping List' },
    dueDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
