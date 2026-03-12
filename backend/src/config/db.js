const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("FATAL ERROR: MONGODB_URI environment variable is not defined!");
      process.exit(1);
    }
    const maskedURI = process.env.MONGODB_URI.replace(/\/\/.*@/, "//****:****@");
    console.log(`Attempting to connect to MongoDB: ${maskedURI}`);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const maskedError = error.message.replace(/\/\/.*@/, "//****:****@");
    console.error(`Error connecting to MongoDB: ${maskedError}`);
    process.exit(1);
  }
};

module.exports = connectDB;
