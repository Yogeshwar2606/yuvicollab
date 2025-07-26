const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Update Profile (protected route)
router.put('/profile', requireAuth, updateProfile);

module.exports = router; 