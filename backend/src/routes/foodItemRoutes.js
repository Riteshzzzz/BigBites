const express = require('express');
const { getFoodItem, getFoodItemsByMenu, createFoodItem, updateFoodItem, deleteFoodItem } = require('../controllers/foodItemController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin', 'restaurant_owner'), createFoodItem);

router.route('/menu/:menuId')
  .get(getFoodItemsByMenu);

router.route('/:id')
  .get(getFoodItem)
  .put(protect, authorize('admin', 'restaurant_owner'), updateFoodItem)
  .delete(protect, authorize('admin', 'restaurant_owner'), deleteFoodItem);

module.exports = router;
