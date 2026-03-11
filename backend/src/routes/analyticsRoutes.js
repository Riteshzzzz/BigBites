const express = require('express');
const { getDashboardAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getDashboardAnalytics);

module.exports = router;
