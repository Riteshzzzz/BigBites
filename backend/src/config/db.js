// Only load .env in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("FATAL ERROR: MONGODB_URI environment variable is not defined!");
      process.exit(1);
    }
    const dbURI = process.env.MONGODB_URI;
    const maskedURI = dbURI.replace(/\/\/.*@/, "//****:****@");
    
    if (dbURI.includes('localhost') || dbURI.includes('127.0.0.1')) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error("Illegal attempt to connect to localhost in PRODUCTION mode. Please check MONGODB_URI in Render.");
      }
      console.warn("Connecting to local MongoDB instance (Development Mode)");
    }

    console.log(`Attempting to connect to MongoDB: ${maskedURI}`);
    const conn = await mongoose.connect(dbURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
