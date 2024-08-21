const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateOTP, sendOTPEmail, verifyOTP } = require('../utils/email');
const { generateToken } = require('../utils/token');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; 

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user', 
            otp,
            otpExpiry,
        });

        await sendOTPEmail(email, otp);

        res.status(201).json({ message: 'Registration successful, please verify your OTP' });
    } catch (err) {
        res.status(400).json({ message: 'Error registering user', error: err.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await verifyOTP(email, otp);

        await User.findOneAndUpdate(
            { email },
            { verified: true, otp: undefined, otpExpiry: undefined },
            { new: true }
        );

        const token = generateToken(user._id, user.role);
        res.status(200).json({ token });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired OTP', error: err.message });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; 

        await User.findOneAndUpdate(
            { email },
            { otp, otpExpiry },
            { new: true }
        );

        await sendOTPEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await verifyOTP(email, otp);
        
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword, otp: undefined, otpExpiry: undefined },
            { new: true }
        );

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error resetting password', error: err.message });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; 

        await User.findOneAndUpdate(
            { email },
            { otp, otpExpiry },
            { new: true }
        );

        await sendOTPEmail(email, otp);

        res.status(200).json({ message: 'New OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ message: 'Error resending OTP', error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.verified) {
            return res.status(401).json({ message: 'User not verified' });
        }
        const token = generateToken(user._id, user.role);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};