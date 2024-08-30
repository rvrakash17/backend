const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const {uploadProfileImage} = require('../middlewares/upload');
const userController = require('../controllers/userController');
const authorizeAdmin = require('../middlewares/authorizationMiddleware');

// Get all users (admin only)
router.get('/', authenticateToken, authorizeAdmin, userController.getAllUsers);

// Get user by ID (admin only)
router.get('/user/:id', authenticateToken, authorizeAdmin, userController.getUserById);

// Get User Profile
router.get('/profile', authenticateToken, userController.getProfile);

// Update User Profile with Profile Picture
router.put('/profile', authenticateToken, uploadProfileImage.single('profilePic'), userController.updateProfile);

module.exports = router;
