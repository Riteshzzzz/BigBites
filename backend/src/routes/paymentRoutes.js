const express = require('express');
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/create-order').post(protect, createRazorpayOrder);
router.route('/verify').post(protect, verifyPayment);

module.exports = router;
