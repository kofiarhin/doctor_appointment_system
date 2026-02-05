const User = require('../models/User');

const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: { message: 'Name is required' } });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    );
    return res.status(200).json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { updateProfile };
