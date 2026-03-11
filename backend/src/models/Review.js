const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  foodItemID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  images: [String],
  response: {
    text: String,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: Date
  },
  isVerified: {
    type: Boolean,
    default: true // verified purchase
  },
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

reviewSchema.index({ restaurantID: 1, rating: -1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
