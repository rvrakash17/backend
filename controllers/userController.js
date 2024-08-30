// controllers/userController.js
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Address = require('../models/Address'); // Import Address model

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    // Find user and populate address field
    const user = await User.findById(req.user._id)
      .populate('address')  // Populate address field
      .select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Update User Profile with Profile Picture
exports.updateProfile = async (req, res) => {
  const { fullName } = req.body;
  const profilePic = req.file ? req.file.filename : undefined;

  try {
    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Handle updating the fullName
    user.fullName = fullName || user.fullName;

    // Handle profile picture update
    if (profilePic) {
      // Delete old profile picture if it exists and is not the default picture
      if (user.profilePic && user.profilePic !== 'default-profile-pic.jpg') {
        const oldPicPath = path.join(__dirname, '..', 'images', 'profile', user.profilePic);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      }
      // Update with the new profile picture
      user.profilePic = profilePic;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('address').select('-password'); // Exclude password and populate address
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('address').select('-password'); // Exclude password and populate address
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
