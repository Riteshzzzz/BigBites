const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantID: {
    type: String,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactNumber: String,
  email: String,
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  coverImage: String,
  logo: String,
  cuisine: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  priceRange: {
    type: String,
    enum: ['₹', '₹₹', '₹₹₹']
  },
  deliveryTime: String,
  isOpen: {
    type: Boolean,
    default: true
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  minimumOrder: {
    type: Number,
    default: 0
  },
  deliveryRadius: Number, // in km
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  offers: [{
    title: String,
    description: String,
    discountPercent: Number,
    validUntil: Date
  }]
}, {
  timestamps: true
});

// Indexes
restaurantSchema.index({ 'location.coordinates': '2dsphere' });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ isActive: 1, featured: -1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
