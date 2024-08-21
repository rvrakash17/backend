const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    profilePicture: {
        type: String,
        default: '/images/profiles/default.png',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    otp: String,
    otpExpiry: Date,
    verified: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('User', UserSchema);
