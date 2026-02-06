const express = require('express');
const controller = require('../controllers/pageController');

const router = express.Router();

router.get('/api/health', controller.health);
router.get('/', controller.getHome);
router.get('/login', controller.getLogin);
router.get('/register', controller.getRegister);
router.get('/contact', controller.getContact);

module.exports = router;
