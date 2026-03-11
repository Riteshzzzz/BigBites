const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  menuID: {
    type: String,
    unique: true
  },
  restaurantID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true // 'Breakfast', 'Lunch', 'Dinner', etc.
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

menuSchema.index({ restaurantID: 1 });

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
