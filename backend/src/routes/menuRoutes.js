const express = require('express');
const { getMenusByRestaurant, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin', 'restaurant_owner'), createMenu);

router.route('/restaurant/:restaurantId')
  .get(getMenusByRestaurant);

router.route('/:id')
  .put(protect, authorize('admin', 'restaurant_owner'), updateMenu)
  .delete(protect, authorize('admin', 'restaurant_owner'), deleteMenu);

module.exports = router;
