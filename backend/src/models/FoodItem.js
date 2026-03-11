const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  foodItemID: {
    type: String,
    unique: true
  },
  menuID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  restaurantID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: String,
  category: {
    type: String, // 'Veg', 'Non-Veg', 'Vegan'
    required: true
  },
  dietary: [String], // ['Gluten-Free', 'Dairy-Free']
  spiceLevel: {
    type: String,
    enum: ['Mild', 'Medium', 'Spicy']
  },
  preparationTime: Number, // in minutes
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  discount: {
    isActive: { type: Boolean, default: false },
    percentage: Number,
    validUntil: Date
  },
  customizations: [{
    name: String, // 'Size', 'Add-ons'
    options: [{
      name: String,
      price: Number
    }],
    required: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Indexes
foodItemSchema.index({ restaurantID: 1, isAvailable: 1 });
foodItemSchema.index({ category: 1 });
foodItemSchema.index({ name: 'text', description: 'text' });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;
