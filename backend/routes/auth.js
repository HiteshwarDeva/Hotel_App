const router = require('express').Router();
const { register, login } = require('../controllers/authController');

// Register (hotel admin or user)
router.post('/register', register);

// Login (all roles)
router.post('/login', login);

module.exports = router;
