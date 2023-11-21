const mongoose = require('mongoose');
require('dotenv').config();

MONGODB_URI = process.env.MONGODB_URI

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connection Successful');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = { connectToDatabase };
