const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  orderDetailID: {
    type: String,
    unique: true
  },
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  foodItemID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true
  },
  itemName: {
    type: String,
    required: true
  }, // snapshot at order time
  itemPrice: {
    type: Number,
    required: true
  }, // snapshot at order time
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  customizations: [{
    name: String,
    selectedOption: String,
    additionalPrice: Number
  }],
  subtotal: {
    type: Number,
    required: true
  }, // quantity * (itemPrice + customization prices)
  specialInstructions: String
}, {
  timestamps: true
});

// Indexes
orderDetailSchema.index({ orderID: 1 });
orderDetailSchema.index({ foodItemID: 1 });

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);
module.exports = OrderDetail;
