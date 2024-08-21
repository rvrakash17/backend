const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs'); 

exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { username, email, password } = req.body;
        const updates = {};

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username !== undefined) updates.username = username;
        if (email !== undefined) updates.email = email;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            updates.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        res.status(400).json({ message: 'Error updating profile', error: err.message });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        const { userId } = req.user;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = `/images/profiles/${file.filename}`;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.profilePicture) {
            const oldProfilePicturePath = path.join(__dirname, '..', user.profilePicture);
            if (fs.existsSync(oldProfilePicturePath)) {
                fs.unlinkSync(oldProfilePicturePath);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: filePath }, { new: true });

        res.status(200).json({ message: 'Profile picture updated successfully', user: updatedUser });
    } catch (err) {
        res.status(400).json({ message: 'Error uploading file', error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving profile', error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving users', error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving user', error: err.message });
    }
};
