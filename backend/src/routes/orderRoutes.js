const express = require('express');
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, getOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin', 'restaurant_owner'), getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, authorize('admin', 'restaurant_owner'), updateOrderStatus);

module.exports = router;
