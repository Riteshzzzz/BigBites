const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentID: {
    type: String,
    unique: true,
    required: true
  },
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'wallet', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'cod'],
    required: true
  },
  transactionID: {
    type: String // from payment gateway
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  refundDetails: {
    refundID: String,
    refundAmount: Number,
    refundDate: Date,
    reason: String
  }
}, {
  timestamps: true
});

paymentSchema.index({ orderID: 1 });
paymentSchema.index({ paymentStatus: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
