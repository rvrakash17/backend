const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register User
router.post('/register', authController.register);

// Resend OTP
router.post('/resend-otp', authController.resendOTP);

// Verify OTP
router.post('/verify-otp', authController.verifyOTP);

// Forget Password
router.post('/forget-password', authController.forgetPassword);

// Reset Password
router.post('/reset-password', authController.resetPassword);

// Login User
router.post('/login', authController.login);

module.exports = router;
