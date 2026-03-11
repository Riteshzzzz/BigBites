const Menu = require('../models/Menu');
const { z } = require('zod');

const menuSchema = z.object({
  restaurantID: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(2),
  isActive: z.boolean().optional()
});

// @desc    Get menus by restaurant
// @route   GET /api/menus/restaurant/:restaurantId
// @access  Public
exports.getMenusByRestaurant = async (req, res) => {
  try {
    const menus = await Menu.find({ 
      restaurantID: req.params.restaurantId,
      isActive: true 
    });

    res.status(200).json({
      success: true,
      data: {
        menus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new menu
// @route   POST /api/menus
// @access  Private (Admin Role)
exports.createMenu = async (req, res) => {
  try {
    const validatedData = menuSchema.parse(req.body);
    validatedData.menuID = `MNU-${Date.now()}`;

    const menu = await Menu.create(validatedData);

    res.status(201).json({
      success: true,
      data: menu
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update menu
// @route   PUT /api/menus/:id
// @access  Private (Admin Role)
exports.updateMenu = async (req, res) => {
  try {
    let menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu not found' });
    }

    menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete menu
// @route   DELETE /api/menus/:id
// @access  Private (Admin Role)
exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu not found' });
    }

    await menu.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
