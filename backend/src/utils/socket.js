const socketIo = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    io = socketIo(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? ['https://bigbites.com', 'https://admin.bigbites.com']
          : ['http://localhost:3000', 'http://localhost:3001'],
        methods: ["GET", "POST"],
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
