const socketIo = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    io = socketIo(httpServer, {
      cors: {
        origin: function (origin, callback) {
          const allowedOrigins = [
            'http://localhost:3000', 
            'http://localhost:3001',
            'https://frontend-admin-gkebr1759-ritesh-bhardwajs-projects.vercel.app',
            'https://frontend-customer-m1ctotr77-ritesh-bhardwajs-projects.vercel.app'
          ];
          if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
      }
    });

    console.log('Socket.io initialized');

    io.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);

      // User joins their own personal room to receive personal updates
      socket.on('join_user_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });

      // Restaurant joins its room to receive new order alerts
      socket.on('join_restaurant_room', (restaurantId) => {
         socket.join(restaurantId);
         console.log(`Restaurant ${restaurantId} joined room`);
      });

      // Join a specific order room (for live tracking map)
      socket.on('join_order_room', (orderId) => {
        socket.join(orderId);
        console.log(`Joined order tracking room: ${orderId}`);
      });

      // Delivery partner sending location updates
      socket.on('update_location', (data) => {
        // data: { orderId, location: { lat, lng } }
        io.to(data.orderId).emit('location_updated', data.location);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    return io;
  },
  
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
