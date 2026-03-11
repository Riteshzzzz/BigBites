const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');
const { z } = require('zod');

// Validation schemas
const restaurantSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().email().optional(),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    coordinates: z.object({
      lat: z.number().optional(),
      lng: z.number().optional()
    }).optional()
  }).optional(),
  cuisine: z.array(z.string()).optional(),
  priceRange: z.enum(['₹', '₹₹', '₹₹₹']).optional(),
  deliveryTime: z.string().optional(),
  isOpen: z.boolean().optional(),
  minimumOrder: z.number().optional(),
  deliveryRadius: z.number().optional()
});

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let queryStr = { isActive: true };
    
    // Filtering
    if (req.query.cuisine) {
      queryStr.cuisine = { $in: req.query.cuisine.split(',') };
    }
    
    if (req.query.city) {
      queryStr['location.city'] = new RegExp(req.query.city, 'i');
    }

    const sort = req.query.sort ? req.query.sort.split(',').join(' ') : '-rating';

    const restaurants = await Restaurant.find(queryStr)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalRestaurants = await Restaurant.countDocuments(queryStr);

    res.status(200).json({
      success: true,
      data: {
        restaurants,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalRestaurants / limit),
          totalRestaurants,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    // Get menus for this restaurant
    const menus = await Menu.find({ restaurantID: restaurant._id, isActive: true });

    res.status(200).json({
      success: true,
      data: {
        restaurant,
        menus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Invalid Restaurant ID or internal error' });
  }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private (Admin Role)
exports.createRestaurant = async (req, res) => {
  try {
    const validatedData = restaurantSchema.parse(req.body);
    
    // Add owner ID and generate custom ID
    validatedData.ownerId = req.user.id;
    validatedData.restaurantID = `REST-${Date.now()}`;

    const restaurant = await Restaurant.create(validatedData);

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Admin Role)
exports.updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    // Allow partial updates
    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Admin Role)
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
