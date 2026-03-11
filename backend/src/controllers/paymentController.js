const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order in our DB
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
         return res.status(500).json({ success: false, error: 'Razorpay keys not configured' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(order.totalAmount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${order._id}`
    };

    const razorpayOrder = await instance.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
    }

    res.status(200).json({
      success: true,
      data: razorpayOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful
      
      // 1. Create Payment record
      const order = await Order.findById(orderId);
      
      const payment = await Payment.create({
        orderID: orderId,
        customerID: order.customerID,
        amount: order.totalAmount,
        paymentMethod: 'UPI/Card (Razorpay)',
        paymentStatus: 'success',
        transactionID: razorpay_payment_id,
        paymentGateway: 'razorpay'
      });

      // 2. Update Order status
      order.orderStatus = 'confirmed'; // Automatically confirm order on payment success
      order.statusHistory.push({
          status: 'confirmed',
          updatedBy: req.user.id
      });
      await order.save();

      res.status(200).json({ success: true, message: "Payment verified successfully", payment });
    } else {
      res.status(400).json({ success: false, error: "Invalid payment signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
