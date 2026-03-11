const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/analytics
// @access  Private (Admin only)
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const totalRevenueResult = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    const totalOrders = await Order.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('customerID', 'name')
      .populate('restaurantID', 'name')
      .sort('-createdAt')
      .limit(5);

    // Revenue by day for the last 7 days (Simplified for demo)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const revenueByDayResult = await Order.aggregate([
      { $match: { orderStatus: 'delivered', createdAt: { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
          revenue: { $sum: '$totalAmount' } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    // Orders by category (Mocking logic since we don't have category mapped securely on Order yet, just random distribution for demo)
    const categoryData = [
      { name: 'North Indian', value: 400 },
      { name: 'South Indian', value: 300 },
      { name: 'Chinese', value: 300 },
      { name: 'Beverages', value: 200 },
    ];

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          totalOrders,
          totalRestaurants,
          totalCustomers
        },
        recentOrders,
        revenueByDay: revenueByDayResult,
        categoryData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
