const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: { message: 'All fields are required' } });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: { message: 'Email already in use' } });
    }
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role });
    const token = createToken(user._id);
    res.cookie('token', token, { httpOnly: true });
    return res.status(201).json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Email and password are required' } });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }
    const token = createToken(user._id);
    res.cookie('token', token, { httpOnly: true });
    return res.status(200).json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
  });
};

const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
};

module.exports = { register, login, me, logout, createToken };
