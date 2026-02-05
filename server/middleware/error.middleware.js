const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: { message: 'Not Found' } });
  next();
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server Error';
  res.status(status).json({ error: { message } });
  next();
};

module.exports = { notFoundHandler, errorHandler };
