# Big Bites - Food Delivery Application
## Complete Implementation Guide

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Feature Modules](#feature-modules)
6. [User Interface Design](#user-interface-design)
7. [Admin Panel](#admin-panel)
8. [Authentication & Security](#authentication--security)
9. [API Endpoints](#api-endpoints)
10. [Deployment Guide](#deployment-guide)
11. [Environment Setup](#environment-setup)

---

## 🎯 Project Overview

**Big Bites** is a full-stack food delivery application designed with a dual-interface approach:
- **Customer Portal**: Beautiful, intuitive interface for browsing restaurants, placing orders, and tracking deliveries
- **Admin Panel**: Comprehensive management dashboard for restaurant owners and platform administrators

### Core Philosophy
- Clean, modern design with hidden complexity
- Role-based access control (RBAC)
- Responsive dual-theme support (Light/Dark)
- Performance-optimized with real-time updates
- Seamless user experience across all devices

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├──────────────────────┬──────────────────────────────────────┤
│  Customer Frontend   │         Admin Panel                  │
│  (React/Next.js)     │      (React/Next.js)                │
│  - Landing Page      │      - Dashboard                     │
│  - Browse Menu       │      - Order Management              │
│  - Place Order       │      - Restaurant Management         │
│  - Track Order       │      - Menu Management               │
│  - User Profile      │      - Reports & Analytics           │
└──────────────────────┴──────────────────────────────────────┘
                            ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (Node.js/Express)            │
├─────────────────────────────────────────────────────────────┤
│  - Authentication Service (JWT + bcrypt)                    │
│  - Order Processing Service                                 │
│  - Payment Integration Service (Razorpay/Stripe)           │
│  - Menu Management Service                                  │
│  - User Management Service                                  │
│  - Notification Service (Email/SMS/Push)                   │
│  - Real-time Updates (Socket.io)                           │
└─────────────────────────────────────────────────────────────┘
                            ↕ MongoDB Driver
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (MongoDB)                  │
├─────────────────────────────────────────────────────────────┤
│  Collections: Users, Restaurants, Menus, Orders,            │
│              Payments, OrderDetails, Reviews                │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend
```javascript
{
  "framework": "Next.js 14 (React 18)",
  "styling": "Tailwind CSS + shadcn/ui",
  "stateManagement": "Zustand / React Context",
  "formHandling": "React Hook Form + Zod",
  "animations": "Framer Motion",
  "icons": "Lucide React",
  "imageOptimization": "Next/Image",
  "realTime": "Socket.io-client"
}
```

### Backend
```javascript
{
  "runtime": "Node.js 20+",
  "framework": "Express.js",
  "database": "MongoDB (MongoDB Atlas - Free Tier)",
  "ODM": "Mongoose",
  "authentication": "JWT + bcrypt",
  "validation": "Joi / Zod",
  "fileUpload": "Multer + Cloudinary",
  "realTime": "Socket.io",
  "email": "Nodemailer + SendGrid",
  "payments": "Razorpay / Stripe"
}
```

### Database Choice: MongoDB Atlas (Free Tier)
**Why MongoDB Atlas?**
- ✅ Free tier: 512MB storage (sufficient for MVP)
- ✅ Fast: Built-in caching and optimized queries
- ✅ Cloud-based: No server maintenance
- ✅ Automatic backups
- ✅ Global deployment options
- ✅ Built-in security features
- ✅ Easy scaling path

**Alternative Free Options:**
1. **Supabase** (PostgreSQL) - 500MB, excellent for relational data
2. **PlanetScale** (MySQL) - Serverless MySQL with generous free tier
3. **Cockroach DB** - Distributed SQL, 5GB free

---

## 🗄️ Database Schema

### Collections Structure

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  role: String, // 'customer' | 'admin' | 'restaurant_owner' | 'delivery_person'
  email: String, // unique, indexed
  password: String, // hashed with bcrypt
  name: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  profileImage: String,
  isVerified: Boolean,
  isActive: Boolean,
  preferences: {
    theme: String, // 'light' | 'dark'
    notifications: Boolean,
    language: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 });
db.users.createIndex({ role: 1 });
```

#### 2. Restaurants Collection
```javascript
{
  _id: ObjectId,
  restaurantID: String, // unique identifier
  name: String,
  description: String,
  ownerId: ObjectId, // ref: Users (admin)
  contactNumber: String,
  email: String,
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  coverImage: String,
  logo: String,
  cuisine: [String], // ['North Indian', 'Chinese', 'Fast Food']
  rating: Number, // average rating
  totalReviews: Number,
  priceRange: String, // '₹' | '₹₹' | '₹₹₹'
  deliveryTime: String, // '30-40 min'
  isOpen: Boolean,
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    // ... other days
  },
  minimumOrder: Number,
  deliveryRadius: Number, // in km
  isActive: Boolean,
  featured: Boolean,
  offers: [{
    title: String,
    description: String,
    discountPercent: Number,
    validUntil: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.restaurants.createIndex({ restaurantID: 1 }, { unique: true });
db.restaurants.createIndex({ 'location.coordinates': '2dsphere' });
db.restaurants.createIndex({ cuisine: 1 });
db.restaurants.createIndex({ isActive: 1, featured: -1 });
```

#### 3. Menus Collection
```javascript
{
  _id: ObjectId,
  menuID: String,
  restaurantID: ObjectId, // ref: Restaurants
  name: String,
  description: String,
  category: String, // 'Breakfast', 'Lunch', 'Dinner', 'Beverages', etc.
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. FoodItems Collection
```javascript
{
  _id: ObjectId,
  foodItemID: String,
  menuID: ObjectId, // ref: Menus
  restaurantID: ObjectId, // ref: Restaurants
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String, // 'Veg', 'Non-Veg', 'Vegan'
  dietary: [String], // ['Gluten-Free', 'Dairy-Free']
  spiceLevel: String, // 'Mild', 'Medium', 'Spicy'
  preparationTime: Number, // in minutes
  isAvailable: Boolean,
  rating: Number,
  totalOrders: Number,
  discount: {
    isActive: Boolean,
    percentage: Number,
    validUntil: Date
  },
  customizations: [{
    name: String, // 'Size', 'Add-ons'
    options: [{
      name: String,
      price: Number
    }],
    required: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.fooditems.createIndex({ restaurantID: 1, isAvailable: 1 });
db.fooditems.createIndex({ category: 1 });
db.fooditems.createIndex({ name: 'text', description: 'text' });
```

#### 5. Orders Collection
```javascript
{
  _id: ObjectId,
  orderID: String, // unique order number (e.g., 'ORD-20240311-001')
  customerID: ObjectId, // ref: Users
  restaurantID: ObjectId, // ref: Restaurants
  orderDate: Date,
  deliveryAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    instructions: String // 'Ring bell twice'
  },
  orderStatus: String, 
  // 'pending' → 'confirmed' → 'preparing' → 'ready' → 'out_for_delivery' → 'delivered' / 'cancelled'
  
  deliveryPersonID: ObjectId, // ref: Users (delivery person)
  
  totalAmount: Number,
  subtotal: Number,
  deliveryCharges: Number,
  tax: Number,
  discount: Number,
  
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  
  specialInstructions: String,
  
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: ObjectId
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.orders.createIndex({ orderID: 1 }, { unique: true });
db.orders.createIndex({ customerID: 1, orderDate: -1 });
db.orders.createIndex({ restaurantID: 1, orderStatus: 1 });
db.orders.createIndex({ orderStatus: 1, orderDate: -1 });
```

#### 6. OrderDetails Collection
```javascript
{
  _id: ObjectId,
  orderDetailID: String,
  orderID: ObjectId, // ref: Orders
  foodItemID: ObjectId, // ref: FoodItems
  itemName: String, // snapshot at order time
  itemPrice: Number, // snapshot at order time
  quantity: Number,
  customizations: [{
    name: String,
    selectedOption: String,
    additionalPrice: Number
  }],
  subtotal: Number, // quantity * (itemPrice + customization prices)
  specialInstructions: String,
  createdAt: Date
}
```

**Indexes:**
```javascript
db.orderdetails.createIndex({ orderID: 1 });
db.orderdetails.createIndex({ foodItemID: 1 });
```

#### 7. Payments Collection
```javascript
{
  _id: ObjectId,
  paymentID: String, // unique payment reference
  orderID: ObjectId, // ref: Orders
  customerID: ObjectId, // ref: Users
  amount: Number,
  paymentMethod: String, // 'card', 'upi', 'wallet', 'cod'
  paymentStatus: String, // 'pending', 'completed', 'failed', 'refunded'
  paymentGateway: String, // 'razorpay', 'stripe'
  transactionID: String, // from payment gateway
  paymentDate: Date,
  refundDetails: {
    refundID: String,
    refundAmount: Number,
    refundDate: Date,
    reason: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.payments.createIndex({ paymentID: 1 }, { unique: true });
db.payments.createIndex({ orderID: 1 });
db.payments.createIndex({ paymentStatus: 1 });
```

#### 8. Reviews Collection
```javascript
{
  _id: ObjectId,
  customerID: ObjectId, // ref: Users
  restaurantID: ObjectId, // ref: Restaurants
  orderID: ObjectId, // ref: Orders
  foodItemID: ObjectId, // ref: FoodItems (optional)
  rating: Number, // 1-5
  comment: String,
  images: [String],
  response: {
    text: String,
    respondedBy: ObjectId,
    respondedAt: Date
  },
  isVerified: Boolean, // verified purchase
  helpful: Number, // helpful count
  createdAt: Date,
  updatedAt: Date
}
```

#### 9. Notifications Collection
```javascript
{
  _id: ObjectId,
  userID: ObjectId, // ref: Users
  type: String, // 'order_update', 'promotion', 'system'
  title: String,
  message: String,
  data: Object, // additional data (e.g., orderID)
  isRead: Boolean,
  priority: String, // 'low', 'medium', 'high'
  createdAt: Date
}
```

**Indexes:**
```javascript
db.notifications.createIndex({ userID: 1, isRead: 1, createdAt: -1 });
```

---

## 🎨 Feature Modules

### Module 1: User Authentication Module

**Features:**
- User registration with email verification
- Secure login with JWT tokens
- Password encryption using bcrypt (10 rounds)
- Password reset via email
- Social login (Google/Facebook) optional
- Role-based access control
- Session management
- Remember me functionality

**Implementation:**

```javascript
// Backend: /api/auth/register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+91-9876543210",
  "role": "customer"
}

// Response
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Security Measures:**
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens with 24h expiration
- Refresh tokens for extended sessions
- Rate limiting on auth endpoints (5 attempts per 15 min)
- CSRF protection
- XSS prevention
- SQL injection prevention (NoSQL in our case)

---

### Module 2: Menu Management Module

**Features:**
- Add/Edit/Delete menu items (Admin only)
- Menu categorization (Breakfast, Lunch, Dinner, Beverages, Desserts)
- Item availability toggle
- Image upload with optimization
- Price management
- Dietary information tags
- Customization options (size, add-ons)
- Search and filter functionality
- Bulk import/export

**Customer View:**
- Browse menus by category
- Search items
- Filter by dietary preferences
- View item details
- Add to cart with customizations

**Admin View:**
- Full CRUD operations
- Analytics on popular items
- Inventory management
- Pricing strategies

---

### Module 3: Order Management Module

**Features:**
- Shopping cart functionality
- Order placement
- Real-time order tracking
- Order history
- Reorder functionality
- Order cancellation (with time window)
- Order modification (before confirmation)
- Multi-item orders
- Special instructions

**Order Workflow:**
```
Customer Places Order
    ↓
Payment Processing
    ↓
Order Confirmation (SMS/Email/Push Notification)
    ↓
Restaurant Receives Order
    ↓
Restaurant Confirms (Estimated time)
    ↓
Order Preparation
    ↓
Ready for Pickup/Delivery
    ↓
Delivery Person Assigned
    ↓
Out for Delivery (Live tracking)
    ↓
Delivered (Confirmation + Rating prompt)
```

**Real-time Updates:**
- Socket.io for live status updates
- Push notifications at each stage
- SMS notifications for key events
- Email confirmations

---

### Module 4: Payment Integration Module

**Supported Payment Methods:**
- Credit/Debit Cards (Visa, Mastercard, RuPay)
- UPI (GPay, PhonePe, Paytm)
- Digital Wallets (Paytm, PhonePe, Amazon Pay)
- Net Banking
- Cash on Delivery

**Payment Gateway: Razorpay (India) or Stripe (Global)**

**Implementation:**

```javascript
// Frontend: Payment initiation
const initiatePayment = async (orderData) => {
  const options = {
    key: process.env.RAZORPAY_KEY_ID,
    amount: orderData.amount * 100, // amount in paise
    currency: "INR",
    name: "Big Bites",
    description: `Order #${orderData.orderID}`,
    order_id: orderData.razorpayOrderId,
    handler: async (response) => {
      // Verify payment on backend
      await verifyPayment(response);
    },
    prefill: {
      name: orderData.customerName,
      email: orderData.customerEmail,
      contact: orderData.customerPhone
    },
    theme: {
      color: "#FF6B35"
    }
  };
  
  const razorpay = new Razorpay(options);
  razorpay.open();
};
```

**Security:**
- PCI DSS compliance
- Payment verification on backend
- Encrypted payment data
- Secure webhooks
- Refund management

---

### Module 5: Delivery Management Module

**Features:**
- Delivery person assignment (auto/manual)
- Real-time location tracking
- Route optimization
- Delivery time estimation
- Contact delivery person
- Proof of delivery
- Delivery analytics

**For Delivery Personnel:**
- Separate app/interface
- Incoming order notifications
- Navigation assistance
- Order details
- Customer contact
- Earnings tracker

**Technology:**
- Google Maps API / Mapbox
- Geolocation API
- Socket.io for real-time updates

---

### Module 6: Reporting & Analytics Module

**Customer Analytics:**
- Order history
- Spending patterns
- Favorite items/restaurants
- Saved addresses

**Admin Analytics:**
- Sales reports (daily, weekly, monthly)
- Revenue trends
- Popular items
- Customer behavior
- Order completion rate
- Average order value
- Peak hours analysis
- Restaurant performance
- Delivery efficiency
- Payment method distribution

**Visualization:**
- Charts (Chart.js / Recharts)
- Heatmaps
- Trends graphs
- Export to PDF/Excel

---

### Module 7: Customer Support Module

**Features:**
- Help center / FAQ
- Ticket system
- Live chat support (optional)
- Contact forms
- Order issue reporting
- Refund requests
- Feedback system

**Admin Features:**
- Ticket management
- Customer communication
- Issue tracking
- Response templates
- Support analytics

---

### Module 8: Review & Rating System

**Features:**
- Rate restaurants (1-5 stars)
- Rate individual items
- Write reviews with photos
- Verified purchase badges
- Helpful/Not helpful voting
- Restaurant responses
- Review moderation

**Analytics:**
- Average ratings
- Review trends
- Sentiment analysis

---

## 🎨 User Interface Design

### Design System

**Color Palette:**

```css
/* Light Theme */
--primary: #FF6B35;        /* Vibrant Orange */
--primary-dark: #E65528;
--primary-light: #FF8B5F;

--secondary: #004E89;      /* Deep Blue */
--secondary-dark: #003A65;
--secondary-light: #006BB3;

--accent: #F7B801;         /* Golden Yellow */
--success: #2ECC71;
--warning: #F39C12;
--error: #E74C3C;

--background: #FFFFFF;
--surface: #F8F9FA;
--text-primary: #212529;
--text-secondary: #6C757D;

/* Dark Theme */
--dark-background: #121212;
--dark-surface: #1E1E1E;
--dark-text-primary: #FFFFFF;
--dark-text-secondary: #B0B0B0;
```

**Typography:**

```css
/* Font Family */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-heading: 'Poppins', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

**Spacing System:**

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Customer Portal Design

#### 1. Landing Page

**Structure:**

```
┌─────────────────────────────────────────────┐
│  HEADER (Sticky)                            │
│  [Logo] [Location] ... [Login] [Cart(0)]   │
├─────────────────────────────────────────────┤
│                                              │
│  HERO SECTION                                │
│  "Order food & groceries.                   │
│   Discover best restaurants."                │
│                                              │
│  [📍 Location Input] [🔍 Search Bar]        │
│                                              │
├─────────────────────────────────────────────┤
│  POPULAR CUISINES (Horizontal Scroll)       │
│  [🍕 Pizza] [🍜 Noodles] [🍔 Burger] ...   │
├─────────────────────────────────────────────┤
│  ORDER OUR BEST FOOD OPTIONS                │
│  [Dosa] [Paratha] [Vada] [Biryani] ...     │
│                                              │
├─────────────────────────────────────────────┤
│  FEATURED RESTAURANTS                        │
│  [Restaurant Card Grid]                     │
│                                              │
├─────────────────────────────────────────────┤
│  APP DOWNLOAD SECTION                        │
│  [QR Code] [App Store] [Play Store]        │
├─────────────────────────────────────────────┤
│  FOOTER                                      │
│  [About] [Contact] [Legal] [Social Links]  │
└─────────────────────────────────────────────┘
```

**Key Features:**
- Minimal, clean design
- Fast loading (< 2 seconds)
- Location-based restaurant suggestions
- Category-based browsing
- Search autocomplete
- Lazy-loaded images
- Smooth animations (Framer Motion)

#### 2. Restaurant Listing Page

```
┌─────────────────────────────────────────────┐
│  FILTERS (Sidebar/Drawer)                   │
│  □ Pure Veg                                 │
│  □ Rating 4.0+                              │
│  □ Fast Delivery                            │
│  ☐ Offers                                   │
│  ─────────────────                          │
│  Cuisines: [✓] North Indian                │
│            [✓] Chinese                      │
│            [ ] South Indian                 │
│                                              │
├─────────────────────────────────────────────┤
│  RESTAURANT GRID                             │
│  ┌────────────────┐  ┌────────────────┐   │
│  │ [Image]        │  │ [Image]        │   │
│  │ Restaurant Name│  │ Restaurant Name│   │
│  │ ⭐ 4.3 • 30min │  │ ⭐ 4.5 • 25min │   │
│  │ ₹300 for two   │  │ ₹400 for two   │   │
│  │ 🏷️ 50% OFF     │  │                │   │
│  └────────────────┘  └────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

#### 3. Restaurant Detail / Menu Page

```
┌─────────────────────────────────────────────┐
│  RESTAURANT HEADER                           │
│  [Cover Image]                               │
│  Restaurant Name        [❤️ Favorite] [Share]│
│  ⭐ 4.5 (2.3K reviews)                       │
│  🕐 30-40 min • ₹300 for two                │
│  📍 2.5 km away                             │
│                                              │
├─────────────────────────────────────────────┤
│  [🔍 Search in menu]                        │
│                                              │
│  TABS: Recommended | Bestsellers | All Items│
│                                              │
│  ─── Starters ───                           │
│  ┌─────────────────────────────────────┐   │
│  │ [📷] Item Name          ⭐ 4.2       │   │
│  │      Description...     ₹180        │   │
│  │      [Customizable]     [+ ADD]     │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ─── Main Course ───                        │
│  ... more items ...                         │
│                                              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  CART (Sticky Bottom/Sidebar)               │
│  3 items | ₹540                             │
│  [VIEW CART] →                              │
└─────────────────────────────────────────────┘
```

#### 4. Cart & Checkout Page

```
┌──────────────────┬──────────────────────────┐
│  CART ITEMS      │  ORDER SUMMARY           │
│  ┌────────────┐  │  Subtotal:      ₹540     │
│  │ Item 1     │  │  Delivery:      ₹40      │
│  │ Qty: 2     │  │  Tax (5%):      ₹27      │
│  │ ₹180       │  │  Discount:     -₹50      │
│  │ [- 2 +] ✕  │  │  ─────────────────       │
│  └────────────┘  │  Total:         ₹557     │
│                  │                           │
│  Delivery Address│  [PROCEED TO PAY]        │
│  [Select/Add]    │                           │
│                  │                           │
│  Payment Method  │                           │
│  ○ Card          │                           │
│  ● UPI           │                           │
│  ○ COD           │                           │
└──────────────────┴──────────────────────────┘
```

#### 5. Order Tracking Page

```
┌─────────────────────────────────────────────┐
│  Order #ORD-20240311-001                    │
│  Arriving in 25 mins                        │
│                                              │
│  ┌───────────────────────────────────────┐ │
│  │        [Live Map View]                 │ │
│  │     🏠 .... 🚴 .... 🏪               │ │
│  └───────────────────────────────────────┘ │
│                                              │
│  ORDER STATUS TIMELINE                       │
│  ✅ Order Confirmed        12:30 PM         │
│  ✅ Restaurant Preparing   12:32 PM         │
│  ✅ Food Ready             12:50 PM         │
│  🔵 Out for Delivery       1:00 PM          │
│  ⚪ Delivered              ~1:20 PM         │
│                                              │
│  DELIVERY PERSON                             │
│  👤 Rajesh Kumar           ⭐ 4.8           │
│  📞 Contact | 💬 Chat                       │
│                                              │
│  YOUR ORDER (2 items)                        │
│  • Veg Biryani x1          ₹200             │
│  • Raita x1                ₹40              │
│                                              │
│  [NEED HELP?]                               │
└─────────────────────────────────────────────┘
```

#### 6. User Profile Page

```
┌─────────────────────────────────────────────┐
│  PROFILE HEADER                              │
│  👤 John Doe                                │
│  john@example.com                           │
│  +91-9876543210                             │
│  [Edit Profile]                             │
│                                              │
├─────────────────────────────────────────────┤
│  MY ORDERS                                   │
│  ├─ Ongoing Orders (2)                      │
│  ├─ Past Orders (45)                        │
│  └─ Cancelled Orders (3)                    │
│                                              │
│  ADDRESSES                                   │
│  ├─ Home  [Default] [Edit] [Delete]        │
│  ├─ Office [Edit] [Delete]                 │
│  └─ [+ Add New Address]                     │
│                                              │
│  PAYMENTS                                    │
│  ├─ Saved Cards (1)                         │
│  ├─ UPI IDs (2)                             │
│  └─ [+ Add Payment Method]                  │
│                                              │
│  PREFERENCES                                 │
│  ├─ 🌙 Theme: Dark ▼                        │
│  ├─ 🔔 Notifications: ON                    │
│  ├─ 🌐 Language: English ▼                  │
│  └─ 🍽️ Dietary: Vegetarian                 │
│                                              │
│  ACCOUNT                                     │
│  ├─ Help & Support                          │
│  ├─ Terms & Conditions                      │
│  ├─ Privacy Policy                          │
│  └─ Logout                                  │
└─────────────────────────────────────────────┘
```

---

## 👨‍💼 Admin Panel

### Access Details

```javascript
// Admin Panel URL: https://admin.bigbites.com
// OR: https://bigbites.com/admin

// Fixed Credentials (for initial setup)
// MUST be changed after first login
{
  "email": "admin@bigbites.com",
  "password": "BigBites@Admin2024!"
}
```

**Security:**
- Separate domain/subdomain for admin panel
- Two-factor authentication (2FA) mandatory
- IP whitelisting option
- Activity logging
- Session timeout (15 min inactivity)
- RBAC (Role-Based Access Control)

### Admin Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  SIDEBAR          │  MAIN CONTENT                       │
│                   │                                      │
│  📊 Dashboard     │  ┌──────────────────────────────┐  │
│  📝 Orders        │  │  QUICK STATS                  │  │
│  🏪 Restaurants   │  │  Today's Orders: 156         │  │
│  🍕 Menu Items    │  │  Revenue: ₹24,580            │  │
│  👥 Customers     │  │  Active Users: 1,234         │  │
│  🚴 Delivery      │  │  Avg Rating: 4.5             │  │
│  💳 Payments      │  └──────────────────────────────┘  │
│  📈 Analytics     │                                      │
│  ⚙️ Settings      │  CHARTS & GRAPHS                    │
│  🎫 Support       │  [Revenue Trend Line Chart]         │
│  📢 Marketing     │  [Order Distribution Pie Chart]     │
│  🔔 Notifications │  [Popular Items Bar Chart]          │
│  👤 Profile       │                                      │
│  🚪 Logout        │  RECENT ORDERS TABLE                │
│                   │  OrderID | Customer | Amount | ...  │
└─────────────────────────────────────────────────────────┘
```

### Admin Modules

#### 1. Dashboard Module

**Components:**
- Real-time statistics cards
- Revenue charts (daily, weekly, monthly)
- Order status distribution
- Top performing restaurants
- Recent orders table
- Customer activity graph
- Delivery performance metrics
- System health indicators

#### 2. Order Management Module

**Features:**
- View all orders (with advanced filters)
- Order details view
- Status management
- Assign delivery personnel
- Handle cancellations
- Process refunds
- Export orders (CSV/Excel/PDF)
- Bulk actions

**Filters:**
```
┌────────────────────────────────────┐
│  Filters:                          │
│  Status: [All ▼]                   │
│  Date Range: [Last 7 days ▼]      │
│  Restaurant: [All ▼]               │
│  Payment: [All ▼]                  │
│  Delivery: [All ▼]                 │
│  Amount: Min[___] Max[___]         │
│  [Apply] [Reset]                   │
└────────────────────────────────────┘
```

**Order Table:**
```
┌──────┬───────────┬──────────┬────────┬────────┬──────────┬─────────┐
│Order │ Customer  │Restaurant│ Amount │ Status │ Payment  │ Actions │
├──────┼───────────┼──────────┼────────┼────────┼──────────┼─────────┤
│ORD-1 │ John Doe  │ Spice Hut│ ₹540   │Cooking │Paid(UPI) │[View]   │
│ORD-2 │ Jane Smith│ Pizza Hub│ ₹890   │Delivery│Paid(Card)│[View]   │
│ORD-3 │ Bob Wilson│ Cafe Mocha₹320   │Pending │COD       │[View]   │
└──────┴───────────┴──────────┴────────┴────────┴──────────┴─────────┘
```

#### 3. Restaurant Management Module

**Features:**
- Add/Edit/Delete restaurants
- Restaurant profile management
- Opening hours configuration
- Location management (with map)
- Cuisine tags
- Feature/Unfeature restaurants
- Activate/Deactivate restaurants
- Bulk import
- Performance analytics per restaurant

**Form Fields:**
```
┌─────────────────────────────────────┐
│  ADD NEW RESTAURANT                 │
│                                      │
│  Basic Information:                 │
│  Name: [_________________________]  │
│  Email: [________________________]  │
│  Phone: [________________________]  │
│  Description: [__________________]  │
│                [__________________]  │
│                                      │
│  Location:                          │
│  Address: [______________________]  │
│  City: [________] State: [_______]  │
│  Pincode: [______]                  │
│  [📍 Pick on Map]                   │
│                                      │
│  Cuisine Types:                     │
│  ☑ North Indian  ☐ Chinese          │
│  ☐ South Indian  ☑ Continental      │
│  ☐ Fast Food     ☐ Desserts         │
│                                      │
│  Operational Details:               │
│  Min Order: ₹[____]                 │
│  Delivery Radius: [__] km           │
│  Avg Delivery Time: [__] min        │
│                                      │
│  Images:                            │
│  Logo: [Upload]                     │
│  Cover: [Upload]                    │
│                                      │
│  [Save Restaurant] [Cancel]         │
└─────────────────────────────────────┘
```

#### 4. Menu Management Module

**Features:**
- Add/Edit/Delete menu items
- Category management
- Bulk upload (CSV/Excel)
- Image management
- Pricing updates
- Availability toggle
- Item customization options
- Dietary information
- Search and filter

**Bulk Upload Template:**
```csv
ItemName,Category,Price,Description,Image,IsVeg,SpiceLevel,PreparationTime
"Paneer Tikka","Starters",200,"Cottage cheese marinated in spices","paneer-tikka.jpg","Yes","Medium",20
"Butter Chicken","Main Course",350,"Creamy tomato curry with chicken","butter-chicken.jpg","No","Mild",30
```

#### 5. Customer Management Module

**Features:**
- View all customers
- Customer details
- Order history per customer
- Spending analytics
- Account status management
- Communication tools
- Customer segmentation
- Export customer data

**Customer Details View:**
```
┌─────────────────────────────────────┐
│  CUSTOMER PROFILE                   │
│  ─────────────────────────          │
│  Name: John Doe                     │
│  Email: john@example.com            │
│  Phone: +91-9876543210              │
│  Joined: Jan 15, 2024               │
│  Status: Active ✓                   │
│                                      │
│  STATISTICS                          │
│  Total Orders: 45                   │
│  Total Spent: ₹12,450               │
│  Avg Order Value: ₹277              │
│  Favorite Restaurant: Spice Hut     │
│  Last Order: 2 days ago             │
│                                      │
│  ADDRESSES (3)                       │
│  • Home - Default                   │
│  • Office                           │
│  • Other                            │
│                                      │
│  RECENT ORDERS                       │
│  [Order History Table]              │
│                                      │
│  ACTIONS                             │
│  [Send Email] [Disable Account]    │
└─────────────────────────────────────┘
```

#### 6. Delivery Personnel Management

**Features:**
- Add/Edit delivery persons
- Document verification
- Assign orders (manual/auto)
- Track performance
- Earnings calculation
- Availability management
- Live location tracking
- Ratings & reviews

#### 7. Payment Management Module

**Features:**
- Transaction history
- Payment status tracking
- Refund processing
- Settlement reports (restaurant wise)
- Payment method analytics
- Failed transaction analysis
- Export reports

#### 8. Analytics & Reports Module

**Available Reports:**
1. **Sales Reports**
   - Daily sales
   - Weekly sales
   - Monthly sales
   - Yearly sales
   - Custom date range

2. **Order Reports**
   - Order completion rate
   - Average delivery time
   - Peak hours analysis
   - Cancellation reasons

3. **Customer Reports**
   - New vs returning customers
   - Customer lifetime value
   - Churn rate
   - Geographic distribution

4. **Restaurant Reports**
   - Restaurant-wise revenue
   - Item-wise performance
   - Rating trends
   - Fulfillment time

5. **Financial Reports**
   - Revenue breakdown
   - Commission earned
   - Payment method distribution
   - Refunds & chargebacks

**Export Options:**
- PDF (formatted reports)
- Excel (raw data)
- CSV (data export)
- Schedule automated reports (email)

#### 9. Marketing Module

**Features:**
- Create promotional offers
- Coupon code management
- Push notification campaigns
- Email marketing
- Banner management
- Referral program setup
- Loyalty points configuration

**Create Offer:**
```
┌─────────────────────────────────────┐
│  CREATE NEW OFFER                   │
│                                      │
│  Offer Title: [__________________]  │
│  Description: [__________________]  │
│                                      │
│  Discount Type:                     │
│  ○ Percentage  ● Flat Amount        │
│  Value: ₹[___] or [__]%             │
│                                      │
│  Applicable On:                     │
│  ☑ All Restaurants                  │
│  ☐ Specific Restaurants: [Select]  │
│                                      │
│  Min Order Value: ₹[___]            │
│  Max Discount: ₹[___]               │
│  Usage Limit: [___] per customer    │
│                                      │
│  Validity:                          │
│  From: [Date Picker]                │
│  To: [Date Picker]                  │
│                                      │
│  Coupon Code: [AUTO-GENERATE]       │
│  or Custom: [_________]             │
│                                      │
│  [Create Offer] [Cancel]            │
└─────────────────────────────────────┘
```

#### 10. Support Ticket System

**Features:**
- View all support tickets
- Ticket categories (Order Issue, Payment, Technical, Other)
- Priority levels (Low, Medium, High, Urgent)
- Assign to support agents
- Internal notes
- Canned responses
- Ticket status workflow
- Customer communication history
- SLA tracking

#### 11. Settings Module

**Configuration Options:**
- General settings (App name, logo, favicon)
- Payment gateway configuration
- Email/SMS settings
- Notification preferences
- Delivery charges configuration
- Tax settings
- Commission rates
- App maintenance mode
- Backup & restore
- API keys management
- Theme customization

#### 12. Admin User Management

**Features:**
- Add/Edit/Delete admin users
- Role assignment (Super Admin, Restaurant Manager, Support Agent, Analyst)
- Permission management
- Activity logs
- Login history
- Two-factor authentication setup

**Roles & Permissions:**

```
Super Admin:
✓ Full access to all modules
✓ User management
✓ System settings
✓ Financial data

Restaurant Manager:
✓ Manage restaurants
✓ Menu management
✓ View orders
✓ Customer support
✗ Financial reports
✗ Admin user management

Support Agent:
✓ Customer support
✓ View orders
✓ Process refunds
✗ Restaurant management
✗ Analytics
✗ Settings

Analyst:
✓ View analytics
✓ Generate reports
✓ View all data (read-only)
✗ Create/Edit/Delete
✗ Settings
```

---

## 🔐 Authentication & Security

### Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                    LOGIN PROCESS                          │
└──────────────────────────────────────────────────────────┘

User enters email & password
        ↓
Backend validates credentials
        ↓
bcrypt.compare(enteredPassword, hashedPasswordInDB)
        ↓
    Valid?
    ├─ Yes → Generate JWT Token
    │         {
    │           userId: "...",
    │           email: "...",
    │           role: "customer",
    │           iat: timestamp,
    │           exp: timestamp + 24h
    │         }
    │         Signed with SECRET_KEY
    │         ↓
    │         Return token to client
    │         ↓
    │         Client stores in:
    │         - localStorage (for persistence)
    │         - HTTP-only cookie (more secure)
    │         ↓
    │         Subsequent requests include token
    │         in Authorization header:
    │         "Bearer <token>"
    │
    └─ No → Return error
            "Invalid credentials"
```

### Security Best Practices

#### 1. Password Security
```javascript
// Backend: Password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Registration
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
// Store hashedPassword in database

// Login
const isMatch = await bcrypt.compare(enteredPassword, storedHash);
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

#### 2. JWT Implementation
```javascript
// Backend: Generate JWT
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Middleware: Verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### 3. Role-Based Access Control
```javascript
// Middleware: Check user role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

// Usage in routes
router.post('/admin/restaurants', 
  verifyToken, 
  requireRole(['admin', 'restaurant_manager']), 
  createRestaurant
);
```

#### 4. Input Validation
```javascript
const { z } = require('zod');

// Registration schema
const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/)
});

// Validate request
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ errors: error.errors });
    }
  };
};
```

#### 5. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts. Please try again later.'
});

// API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests. Please try again later.'
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/', apiLimiter);
```

#### 6. CORS Configuration
```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://bigbites.com', 'https://admin.bigbites.com']
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

#### 7. Environment Variables
```bash
# .env file (NEVER commit to version control)
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bigbites

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Email Service
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@bigbites.com

# SMS Service
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Google Maps
GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxx

# Admin Credentials (Initial Setup)
ADMIN_EMAIL=admin@bigbites.com
ADMIN_PASSWORD=BigBites@Admin2024!
```

#### 8. Data Sanitization
```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Set security headers
app.use(helmet());
```

---

## 🔌 API Endpoints

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.bigbites.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+91-9876543210",
  "role": "customer"
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

#### Reset Password
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "NewSecurePass123!"
}
```

### Restaurant Endpoints

#### Get All Restaurants
```http
GET /api/restaurants?page=1&limit=10&cuisine=North Indian&sort=-rating
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "restaurants": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRestaurants": 47,
      "limit": 10
    }
  }
}
```

#### Get Restaurant by ID
```http
GET /api/restaurants/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "restaurant": {...},
    "menus": [...]
  }
}
```

#### Create Restaurant (Admin Only)
```http
POST /api/restaurants
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Spice Garden",
  "description": "Authentic Indian cuisine",
  "contactNumber": "+91-9876543210",
  "email": "info@spicegarden.com",
  "location": {
    "address": "123 MG Road",
    "city": "Bangalore",
    "coordinates": {
      "lat": 12.9716,
      "lng": 77.5946
    }
  },
  "cuisine": ["North Indian", "Chinese"],
  "minimumOrder": 200,
  "deliveryRadius": 5
}
```

#### Update Restaurant (Admin Only)
```http
PUT /api/restaurants/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Restaurant Name",
  "isOpen": true
}
```

#### Delete Restaurant (Admin Only)
```http
DELETE /api/restaurants/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

### Menu Endpoints

#### Get Menu Items by Restaurant
```http
GET /api/menus/restaurant/:restaurantId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "menus": [
      {
        "menuId": "...",
        "name": "Breakfast Menu",
        "items": [...]
      },
      {
        "menuId": "...",
        "name": "Main Course",
        "items": [...]
      }
    ]
  }
}
```

#### Get Food Item Details
```http
GET /api/food-items/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "item": {
      "name": "Butter Chicken",
      "price": 350,
      "description": "...",
      "customizations": [...]
    }
  }
}
```

#### Create Food Item (Admin Only)
```http
POST /api/food-items
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- name: "Paneer Tikka"
- description: "Cottage cheese marinated in spices"
- price: 250
- category: "Vegetarian"
- menuId: "..."
- restaurantId: "..."
- image: [file]
```

#### Update Food Item (Admin Only)
```http
PUT /api/food-items/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 280,
  "isAvailable": false
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "restaurantId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "items": [
    {
      "foodItemId": "65f1a2b3c4d5e6f7g8h9i0j2",
      "quantity": 2,
      "customizations": [
        {
          "name": "Spice Level",
          "selectedOption": "Medium"
        }
      ],
      "specialInstructions": "Less oil"
    }
  ],
  "deliveryAddress": {
    "name": "John Doe",
    "phone": "+91-9876543210",
    "street": "123 Main St, Apt 4B",
    "city": "Bangalore",
    "pincode": "560001",
    "coordinates": {
      "lat": 12.9716,
      "lng": 77.5946
    }
  },
  "paymentMethod": "upi",
  "specialInstructions": "Ring doorbell twice"
}

Response (201):
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "ORD-20240311-001",
    "totalAmount": 557,
    "estimatedDeliveryTime": "2024-03-11T14:30:00Z",
    "paymentDetails": {
      "razorpayOrderId": "order_xxxxxxxxxxxxx"
    }
  }
}
```

#### Get Order Details
```http
GET /api/orders/:orderId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "order": {
      "orderID": "ORD-20240311-001",
      "customer": {...},
      "restaurant": {...},
      "items": [...],
      "status": "out_for_delivery",
      "totalAmount": 557,
      "deliveryPerson": {...},
      "trackingUrl": "https://bigbites.com/track/ORD-20240311-001"
    }
  }
}
```

#### Get User Orders
```http
GET /api/orders/user/me?status=ongoing&page=1&limit=10
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {...}
  }
}
```

#### Update Order Status (Admin/Restaurant Only)
```http
PATCH /api/orders/:orderId/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "preparing",
  "estimatedTime": 30
}

Response (200):
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "order": {...}
  }
}
```

#### Cancel Order
```http
POST /api/orders/:orderId/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Changed mind"
}

Response (200):
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "refundAmount": 557,
    "refundStatus": "processing"
  }
}
```

### Payment Endpoints

#### Create Payment Order
```http
POST /api/payments/create-order
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "amount": 557
}

Response (200):
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_xxxxxxxxxxxxx",
    "amount": 55700,
    "currency": "INR",
    "key": "rzp_live_xxxxxxxxxxxxx"
  }
}
```

#### Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_signature": "xxxxxxxxxxxxxxxxxxxxx",
  "orderId": "65f1a2b3c4d5e6f7g8h9i0j1"
}

Response (200):
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "65f1a2b3c4d5e6f7g8h9i0j5",
    "status": "completed"
  }
}
```

#### Process Refund (Admin Only)
```http
POST /api/payments/refund
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentId": "65f1a2b3c4d5e6f7g8h9i0j5",
  "amount": 557,
  "reason": "Order cancelled by customer"
}
```

### Review Endpoints

#### Create Review
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- restaurantId: "65f1a2b3c4d5e6f7g8h9i0j1"
- orderId: "ORD-20240311-001"
- rating: 5
- comment: "Excellent food and service!"
- images: [file1, file2]
```

#### Get Restaurant Reviews
```http
GET /api/reviews/restaurant/:restaurantId?page=1&limit=10&sort=-rating
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "reviews": [...],
    "averageRating": 4.5,
    "totalReviews": 234,
    "ratingDistribution": {
      "5": 150,
      "4": 50,
      "3": 20,
      "2": 10,
      "1": 4
    }
  }
}
```

### User Profile Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91-9876543210",
      "addresses": [...],
      "preferences": {...}
    }
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated Doe",
  "phone": "+91-9999999999",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

#### Add Address
```http
POST /api/users/addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "home",
  "street": "123 New Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "coordinates": {
    "lat": 19.0760,
    "lng": 72.8777
  },
  "isDefault": true
}
```

### Admin Analytics Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/analytics/dashboard?period=today
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "todayOrders": 156,
    "todayRevenue": 24580,
    "activeUsers": 1234,
    "avgRating": 4.5,
    "ordersByStatus": {...},
    "topRestaurants": [...],
    "recentOrders": [...]
  }
}
```

#### Get Sales Report
```http
GET /api/admin/analytics/sales?startDate=2024-03-01&endDate=2024-03-11
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "totalSales": 245600,
    "totalOrders": 1234,
    "avgOrderValue": 199,
    "dailyBreakdown": [...],
    "paymentMethodBreakdown": {...},
    "topSellingItems": [...]
  }
}
```

### Real-time Endpoints (Socket.io)

#### Connection
```javascript
// Frontend
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  auth: {
    token: localStorage.getItem('token')
  }
});

// Listen for order updates
socket.on('orderUpdate', (data) => {
  console.log('Order status changed:', data);
  // Update UI
});

// Listen for new order (Admin/Restaurant)
socket.on('newOrder', (order) => {
  console.log('New order received:', order);
  // Show notification
});

// Track delivery location
socket.on('deliveryLocationUpdate', (location) => {
  console.log('Delivery person location:', location);
  // Update map
});
```

---

## 🚀 Deployment Guide

### MongoDB Atlas Setup

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Choose FREE tier (M0)
   - Select region (closest to users, e.g., Mumbai for India)
   - Cluster name: `bigbites-cluster`

3. **Database Access**
   - Create database user
   - Username: `bigbites_admin`
   - Password: Generate strong password
   - Database User Privileges: Read and write to any database

4. **Network Access**
   - Add IP Address: `0.0.0.0/0` (allow from anywhere - for development)
   - For production: Add specific IPs

5. **Get Connection String**
   ```
   mongodb+srv://bigbites_admin:<password>@bigbites-cluster.xxxxx.mongodb.net/bigbites?retryWrites=true&w=majority
   ```

6. **Create Database & Collections**
   ```javascript
   // Run this script after connecting
   use bigbites;
   
   db.createCollection('users');
   db.createCollection('restaurants');
   db.createCollection('menus');
   db.createCollection('fooditems');
   db.createCollection('orders');
   db.createCollection('orderdetails');
   db.createCollection('payments');
   db.createCollection('reviews');
   db.createCollection('notifications');
   
   // Create indexes (refer to schema section)
   ```

### Backend Deployment (Render.com / Railway.app)

#### Option 1: Render.com (Recommended - Free Tier)

1. **Create Account** at [render.com](https://render.com)

2. **New Web Service**
   - Connect GitHub repository
   - Name: `bigbites-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-strong-secret>
   RAZORPAY_KEY_ID=<your-key>
   RAZORPAY_KEY_SECRET=<your-secret>
   SENDGRID_API_KEY=<your-api-key>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   GOOGLE_MAPS_API_KEY=<your-api-key>
   FRONTEND_URL=https://bigbites.vercel.app
   ADMIN_URL=https://admin-bigbites.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Get URL: `https://bigbites-backend.onrender.com`

#### Option 2: Railway.app

1. **Create Account** at [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub
3. **Add Environment Variables** (same as above)
4. **Deploy**

### Frontend Deployment (Vercel)

#### Customer Portal

1. **Create Account** at [vercel.com](https://vercel.com)

2. **Import Project**
   - Connect GitHub repository
   - Select customer frontend folder
   - Framework: Next.js (auto-detected)

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://bigbites-backend.onrender.com/api
   NEXT_PUBLIC_SOCKET_URL=https://bigbites-backend.onrender.com
   NEXT_PUBLIC_RAZORPAY_KEY_ID=<your-key>
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-key>
   ```

4. **Deploy**
   - Click "Deploy"
   - Get URL: `https://bigbites.vercel.app`

5. **Custom Domain** (Optional)
   - Purchase domain (e.g., bigbites.com)
   - Add to Vercel: Settings → Domains
   - Update DNS records

#### Admin Panel

1. **Import Project**
   - Connect GitHub repository
   - Select admin frontend folder

2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://bigbites-backend.onrender.com/api
   NEXT_PUBLIC_SOCKET_URL=https://bigbites-backend.onrender.com
   ```

3. **Deploy**
   - Get URL: `https://admin-bigbites.vercel.app`
   - Or custom subdomain: `admin.bigbites.com`

### Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify database connections
- [ ] Test payment gateway (sandbox mode first)
- [ ] Test real-time features (Socket.io)
- [ ] Test file uploads (images)
- [ ] Verify email notifications
- [ ] Test SMS notifications
- [ ] Check CORS settings
- [ ] Test on mobile devices
- [ ] Set up monitoring (Sentry for errors)
- [ ] Set up analytics (Google Analytics)
- [ ] Configure CDN for static assets
- [ ] Set up SSL certificates (auto on Vercel)
- [ ] Test authentication flows
- [ ] Verify admin panel access
- [ ] Test order flow end-to-end
- [ ] Set up automated backups (MongoDB Atlas)

---

## ⚙️ Environment Setup

### Prerequisites

```bash
# Required software
- Node.js 20+ (LTS)
- npm or yarn
- Git
- Code editor (VS Code recommended)
- MongoDB Compass (for database GUI)
- Postman (for API testing)
```

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/bigbites.git
cd bigbites
```

#### 2. Project Structure

```
bigbites/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   └── razorpay.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Restaurant.js
│   │   │   ├── Menu.js
│   │   │   ├── FoodItem.js
│   │   │   ├── Order.js
│   │   │   ├── OrderDetail.js
│   │   │   ├── Payment.js
│   │   │   └── Review.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── restaurants.js
│   │   │   ├── menus.js
│   │   │   ├── orders.js
│   │   │   ├── payments.js
│   │   │   ├── reviews.js
│   │   │   ├── users.js
│   │   │   └── admin.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── restaurantController.js
│   │   │   ├── orderController.js
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── upload.js
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── email.js
│   │   │   ├── sms.js
│   │   │   └── helpers.js
│   │   ├── socket/
│   │   │   └── index.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend-customer/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js (Landing)
│   │   │   ├── restaurants/
│   │   │   │   └── page.js
│   │   │   ├── restaurant/
│   │   │   │   └── [id]/
│   │   │   │       └── page.js
│   │   │   ├── cart/
│   │   │   │   └── page.js
│   │   │   ├── checkout/
│   │   │   │   └── page.js
│   │   │   ├── orders/
│   │   │   │   ├── page.js
│   │   │   │   └── [id]/
│   │   │   │       └── page.js
│   │   │   ├── profile/
│   │   │   │   └── page.js
│   │   │   └── layout.js
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── RestaurantCard.jsx
│   │   │   ├── FoodItemCard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── utils.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── cartStore.js
│   │   │   └── orderStore.js
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   │   └── images/
│   ├── package.json
│   └── .env.local.example
│
├── frontend-admin/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js (Login)
│   │   │   ├── dashboard/
│   │   │   │   └── page.js
│   │   │   ├── orders/
│   │   │   │   └── page.js
│   │   │   ├── restaurants/
│   │   │   │   └── page.js
│   │   │   ├── menus/
│   │   │   │   └── page.js
│   │   │   ├── customers/
│   │   │   │   └── page.js
│   │   │   ├── analytics/
│   │   │   │   └── page.js
│   │   │   └── layout.js
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── OrderTable.jsx
│   │   │   ├── Charts/
│   │   │   │   ├── RevenueChart.jsx
│   │   │   │   └── OrderChart.jsx
│   │   │   └── ...
│   │   └── ...
│   ├── package.json
│   └── .env.local.example
│
└── README.md
```

#### 3. Backend Setup

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev

# The server will start on http://localhost:5000
```

**backend/package.json:**
```json
{
  "name": "bigbites-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.0",
    "express-mongo-sanitize": "^2.2.0",
    "xss-clean": "^0.1.4",
    "joi": "^17.11.0",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "razorpay": "^2.9.2",
    "nodemailer": "^6.9.7",
    "socket.io": "^4.6.0",
    "crypto": "^1.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

#### 4. Frontend Customer Setup

```bash
cd frontend-customer
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local

# Start development server
npm run dev

# Open http://localhost:3000
```

**frontend-customer/package.json:**
```json
{
  "name": "bigbites-customer",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "zustand": "^4.4.6",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "socket.io-client": "^4.6.0",
    "axios": "^1.6.2",
    "react-hot-toast": "^2.4.1"
  }
}
```

#### 5. Frontend Admin Setup

```bash
cd frontend-admin
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local

# Start development server
npm run dev

# Open http://localhost:3001
```

#### 6. Run All Services Concurrently

**Root package.json:**
```json
{
  "name": "bigbites",
  "version": "1.0.0",
  "scripts": {
    "install-all": "npm install && cd backend && npm install && cd ../frontend-customer && npm install && cd ../frontend-admin && npm install",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:customer\" \"npm run dev:admin\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:customer": "cd frontend-customer && npm run dev",
    "dev:admin": "cd frontend-admin && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

```bash
# Install all dependencies
npm run install-all

# Run all services
npm run dev
```

---

## 📝 Additional Considerations

### Performance Optimization

1. **Database Optimization**
   - Proper indexing (as defined in schema)
   - Connection pooling
   - Query optimization
   - Caching with Redis (optional)

2. **Frontend Optimization**
   - Image optimization (Next.js Image component)
   - Code splitting
   - Lazy loading
   - Service workers for PWA

3. **API Optimization**
   - Response compression (gzip)
   - Pagination
   - Field selection
   - Query result caching

### Testing Strategy

1. **Unit Tests**
   - Jest for backend
   - React Testing Library for frontend

2. **Integration Tests**
   - API endpoint tests
   - Database operations

3. **E2E Tests**
   - Cypress or Playwright
   - Critical user flows (order placement, payment)

### Monitoring & Logging

1. **Error Tracking**
   - Sentry for error monitoring
   - Custom error logging

2. **Analytics**
   - Google Analytics
   - Custom event tracking
   - User behavior analysis

3. **Performance Monitoring**
   - New Relic / Datadog
   - API response time tracking
   - Database query performance

### Scalability Considerations

1. **Horizontal Scaling**
   - Load balancing
   - Stateless backend design
   - Session management (Redis)

2. **Database Scaling**
   - MongoDB sharding (when needed)
   - Read replicas
   - Archive old data

3. **CDN Integration**
   - Cloudflare for static assets
   - Image optimization
   - Edge caching

### Compliance & Legal

1. **Data Privacy**
   - GDPR compliance (for EU users)
   - Data retention policies
   - User data export/deletion

2. **Payment Security**
   - PCI DSS compliance
   - Secure payment data handling
   - Regular security audits

3. **Terms & Conditions**
   - User agreement
   - Privacy policy
   - Refund policy
   - Cancellation policy

---

## 🎉 Conclusion

This instruction manual provides a complete blueprint for building the **Big Bites** food delivery application. The system is designed with:

- **Scalability** in mind (MongoDB, microservices-ready architecture)
- **Security** as a priority (JWT, bcrypt, rate limiting, input validation)
- **User Experience** at the forefront (dual themes, real-time updates, intuitive UI)
- **Performance** optimization (indexing, caching, lazy loading)
- **Flexibility** for future enhancements (modular structure)

### Next Steps

1. Set up development environment
2. Initialize Git repository
3. Set up MongoDB Atlas
4. Implement authentication module
5. Build core features (restaurants, menu, orders)
6. Integrate payment gateway
7. Implement real-time features
8. Design and build frontend
9. Test thoroughly
10. Deploy to production
11. Monitor and iterate

### Resources

- **MongoDB Documentation**: https://docs.mongodb.com
- **Next.js Documentation**: https://nextjs.org/docs
- **Express.js Guide**: https://expressjs.com
- **Razorpay Integration**: https://razorpay.com/docs
- **Socket.io Documentation**: https://socket.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Support

For any questions or clarifications, refer to the official documentation of respective technologies or consult with your development team.

---

**Built with ❤️ for Big Bites**
**Version 1.0 | March 2024**
