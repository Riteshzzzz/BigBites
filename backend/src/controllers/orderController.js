const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const socket = require('../utils/socket');
const { z } = require('zod');

const orderItemSchema = z.object({
  foodItemID: z.string(),
  itemName: z.string(),
  itemPrice: z.number().min(0),
  quantity: z.number().min(1),
  subtotal: z.number().min(0),
  specialInstructions: z.string().optional()
});

const createOrderSchema = z.object({
  restaurantID: z.string(),
  deliveryAddress: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    pincode: z.string().optional(),
    instructions: z.string().optional()
  }),
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number().min(0),
  deliveryCharges: z.number().min(0),
  tax: z.number().min(0),
  totalAmount: z.number().min(0)
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    
    // Create the main order
    const orderData = {
      orderID: `ORD-${Date.now()}`,
      customerID: req.user.id,
      restaurantID: validatedData.restaurantID,
      deliveryAddress: validatedData.deliveryAddress,
      totalAmount: validatedData.totalAmount,
      subtotal: validatedData.subtotal,
      deliveryCharges: validatedData.deliveryCharges,
      tax: validatedData.tax,
      statusHistory: [{
        status: 'pending',
        updatedBy: req.user.id
      }]
    };

    const order = await Order.create(orderData);

    // Create order details
    const orderDetailsData = validatedData.items.map(item => ({
      orderDetailID: `OD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderID: order._id,
      foodItemID: item.foodItemID,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
      specialInstructions: item.specialInstructions
    }));

    await OrderDetail.insertMany(orderDetailsData);

    // Emit socket event to restaurant owner
    const io = socket.getIO();
    io.to(order.restaurantID.toString()).emit('new_order', order);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerID: req.user.id })
      .populate('restaurantID', 'name image location')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantID', 'name location contactNumber')
      .populate('customerID', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Ensure only the customer who placed the order OR an admin/restaurant owner can view it
    if (order.customerID._id.toString() !== req.user.id && !['admin', 'restaurant_owner'].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this order' });
    }

    const orderDetails = await OrderDetail.find({ orderID: order._id });

    res.status(200).json({
      success: true,
      data: {
        order,
        items: orderDetails
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Restaurant Owner)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status: status,
      updatedBy: req.user.id
    });

    if (status === 'delivered') {
        order.actualDeliveryTime = Date.now();
    }

    await order.save();

    // Emit socket event to customer
    const io = socket.getIO();
    io.to(order.customerID.toString()).emit('order_status_updated', {
      orderId: order._id,
      status: order.orderStatus
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all orders (Admin/Restaurant Owner)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
    try {
      let query = {};
      
      // If restaurant owner, ideally filter by their restaurantID
      // For simplicity in this demo, if admin return all, if restaurant return theirs
      if (req.user.role === 'restaurant_owner' && req.user.restaurantID) {
          query = { restaurantID: req.user.restaurantID };
      }

      const orders = await Order.find(query)
        .populate('restaurantID', 'name')
        .populate('customerID', 'name email')
        .sort('-createdAt');
  
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
