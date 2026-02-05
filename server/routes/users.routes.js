const express = require('express');
const { updateProfile } = require('../controllers/users.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
