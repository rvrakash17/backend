const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

const verifyOTP = async (email, otp) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    
    const storedOTP = user.otp.toString();
    const inputOTP = otp.toString();
    const now = new Date();
    
    if (storedOTP !== inputOTP) {
        throw new Error('Invalid OTP');
    }

    if (now > user.otpExpiry) {
        throw new Error('Expired OTP');
    }
    return user;
};

module.exports = { generateOTP, sendOTPEmail, verifyOTP };
