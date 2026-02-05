const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: { message: 'Unauthorized' } });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: { message: 'Unauthorized' } });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }
};

module.exports = { authMiddleware };
