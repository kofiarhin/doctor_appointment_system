const { notFoundHandler, errorHandler } = require('../middleware/error.middleware');

describe('error middleware', () => {
  it('handles not found', () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    notFoundHandler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Not Found' } });
    expect(next).toHaveBeenCalled();
  });

  it('handles errors', () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler({ status: 400, message: 'Bad Request' }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Bad Request' } });
    expect(next).toHaveBeenCalled();
  });

  it('handles default errors', () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler({}, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Server Error' } });
    expect(next).toHaveBeenCalled();
  });
});
