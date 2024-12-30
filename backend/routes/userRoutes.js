const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser); // Route for signup
router.post('/login', loginUser);       // Route for login
router.get('/profile', protect, getUserProfile); // Protected route for user profile

module.exports = router;
