const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');

jest.mock('mongoose');

describe('db config', () => {
  beforeEach(() => {
    mongoose.connect.mockResolvedValueOnce();
    mongoose.disconnect.mockResolvedValueOnce();
  });

  it('connects to mongo when uri provided', async () => {
    const connection = await connectDB('mongodb://localhost:27017/test');
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/test');
    expect(connection).toBe(mongoose.connection);
  });

  it('throws when uri missing', async () => {
    await expect(connectDB()).rejects.toThrow('MONGO_URI is required');
  });

  it('disconnects from mongo', async () => {
    await disconnectDB();
    expect(mongoose.disconnect).toHaveBeenCalledTimes(1);
  });
});
