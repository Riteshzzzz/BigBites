require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Connect to database
// Connect to database
connectDB().then(async () => {
  const User = require('./models/User');
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bigbites.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'BigBites@Admin2024!';
    
    console.log(`Checking for admin user: ${adminEmail}`);
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword,
        phone: '+919876543210',
        role: 'admin'
      });
      console.log('Successfully seeded default admin user');
    } else {
      // Force update password in case it was seeded incorrectly before
      adminExists.password = adminPassword;
      await adminExists.save();
      console.log('Admin user verified and password synchronized');
    }
  } catch (err) {
    console.error('Failed to seed admin user:', err.message);
  }
});

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const socket = require('./utils/socket');
socket.init(server);

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001',
  'https://frontend-admin-gkebr1759-ritesh-bhardwajs-projects.vercel.app',
  'https://frontend-customer-m1ctotr77-ritesh-bhardwajs-projects.vercel.app'
];

const corsOptions = {
  origin: true, // Allow all origins temporarily to rule out CORS as the cause of login failure
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests per 15 mins
  message: 'Too many requests. Please try again later.'
});
app.use('/api/', apiLimiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const foodItemRoutes = require('./routes/foodItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/food-items', foodItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Big Bites API is running!' });
});

// Debug route to verify admin user (Remove in production)
app.get('/api/debug/admin-check', async (req, res) => {
  try {
    const User = require('./models/User');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bigbites.com';
    const admin = await User.findOne({ email: adminEmail });
    res.json({ 
      exists: !!admin, 
      email: adminEmail,
      role: admin ? admin.role : null,
      isActive: admin ? admin.isActive : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Port configuration
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
