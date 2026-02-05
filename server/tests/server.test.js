const app = require('../app');
const { connectDB } = require('../config/db');
const { startServer } = require('../server');

jest.mock('../app', () => ({ listen: jest.fn() }));
jest.mock('../config/db', () => ({ connectDB: jest.fn() }));

describe('server', () => {
  it('connects to db and starts listening', async () => {
    process.env.PORT = '5055';
    process.env.MONGO_URI = 'mongodb://localhost:27017/test';

    connectDB.mockClear();
    app.listen.mockClear();

    await startServer();

    expect(connectDB).toHaveBeenCalledWith('mongodb://localhost:27017/test');
    expect(app.listen).toHaveBeenCalledWith('5055', expect.any(Function));
  });
});
