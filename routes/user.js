const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, restrictTo } = require('../middlewares/authuser');
const upload = require('../middlewares/upload');

// Admin routes
router.get('/all', isAuthenticated, restrictTo('admin'), userController.getAllUsers);
router.get('/:id', isAuthenticated, restrictTo('admin'), userController.getUserById);

// User routes
router.get('/profile', isAuthenticated, userController.getProfile);
router.put('/profile', isAuthenticated, userController.updateProfile);
router.post('/upload-profile-picture', isAuthenticated, upload.single('profilePicture'), userController.uploadProfilePicture);

module.exports = router;
