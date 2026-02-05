const mongoose = require('mongoose');

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MONGO_URI is required');
  }
  await mongoose.connect(uri);
  return mongoose.connection;
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB };
