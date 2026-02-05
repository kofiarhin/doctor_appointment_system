const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');
const User = require('../models/User');

jest.mock('../models/User');

describe('middleware', () => {
  beforeEach(() => {
    User.findById.mockReset();
  });

  it('auth middleware rejects invalid token', async () => {
    const req = { cookies: { token: 'bad' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('auth middleware rejects missing token', async () => {
    const req = { cookies: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('auth middleware rejects missing user', async () => {
    const token = jwt.sign({ id: 'missing' }, 'testsecret');
    User.findById.mockResolvedValueOnce(null);
    const req = { cookies: { token } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('auth middleware allows valid user', async () => {
    const token = jwt.sign({ id: 'valid' }, 'testsecret');
    User.findById.mockResolvedValueOnce({ id: 'valid' });
    const req = { cookies: { token } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('role middleware allows permitted roles', () => {
    const req = { user: { role: 'admin' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    roleMiddleware(['admin'])(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('role middleware rejects forbidden roles', () => {
    const req = { user: { role: 'patient' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    roleMiddleware(['doctor'])(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
