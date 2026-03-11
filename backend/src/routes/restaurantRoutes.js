const express = require('express');
const { getRestaurants, getRestaurant, createRestaurant, updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, authorize('admin', 'restaurant_owner'), createRestaurant);

router.route('/:id')
  .get(getRestaurant)
  .put(protect, authorize('admin', 'restaurant_owner'), updateRestaurant)
  .delete(protect, authorize('admin'), deleteRestaurant);

module.exports = router;
