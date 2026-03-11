const Review = require('../models/Review');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { z } = require('zod');

const addReviewSchema = z.object({
  restaurantID: z.string(),
  orderID: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  foodItemID: z.string().optional()
});

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const validatedData = addReviewSchema.parse(req.body);

    // Verify order belongs to customer and is delivered
    const order = await Order.findById(validatedData.orderID);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order.customerID.toString() !== req.user.id) {
         return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    if (order.orderStatus !== 'delivered') {
         return res.status(400).json({ success: false, error: 'Can only review delivered orders' });
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ orderID: validatedData.orderID, customerID: req.user.id });
    if (existingReview) {
      return res.status(400).json({ success: false, error: 'Review already submitted for this order' });
    }

    const review = await Review.create({
      ...validatedData,
      customerID: req.user.id
    });

    // Optionally update restaurant's average rating here (for simplicity we can compute it on the fly or aggregate)

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
exports.getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantID: req.params.restaurantId })
      .populate('customerID', 'name profileImage')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
