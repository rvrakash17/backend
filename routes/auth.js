const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/forget-password', authController.forgetPassword);
router.post('/resend-otp', authController.resendOTP);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
