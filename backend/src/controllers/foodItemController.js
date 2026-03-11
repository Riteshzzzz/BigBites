const FoodItem = require('../models/FoodItem');
const { z } = require('zod');

const foodItemSchema = z.object({
  menuID: z.string(),
  restaurantID: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  category: z.string(),
  dietary: z.array(z.string()).optional(),
  spiceLevel: z.enum(['Mild', 'Medium', 'Spicy']).optional(),
  preparationTime: z.number().optional(),
  isAvailable: z.boolean().optional()
});

// @desc    Get food item details
// @route   GET /api/food-items/:id
// @access  Public
exports.getFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Food item not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        item
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get food items by menu
// @route   GET /api/food-items/menu/:menuId
// @access  Public
exports.getFoodItemsByMenu = async (req, res) => {
    try {
      const items = await FoodItem.find({ 
        menuID: req.params.menuId,
        isAvailable: true 
      });
  
      res.status(200).json({
        success: true,
        data: {
          items
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

// @desc    Create new food item
// @route   POST /api/food-items
// @access  Private (Admin Role)
exports.createFoodItem = async (req, res) => {
  try {
    const validatedData = foodItemSchema.parse(req.body);
    validatedData.foodItemID = `FI-${Date.now()}`;
    
    // In a real scenario, handle Cloudinary image upload here
    // validatedData.image = req.file.path

    const item = await FoodItem.create(validatedData);

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update food item
// @route   PUT /api/food-items/:id
// @access  Private (Admin Role)
exports.updateFoodItem = async (req, res) => {
  try {
    let item = await FoodItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Food item not found' });
    }

    item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete food item
// @route   DELETE /api/food-items/:id
// @access  Private (Admin Role)
exports.deleteFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Food item not found' });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
