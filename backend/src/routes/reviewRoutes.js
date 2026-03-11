const express = require('express');
const { addReview, getRestaurantReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, addReview);

router.route('/restaurant/:restaurantId')
  .get(getRestaurantReviews);

module.exports = router;
