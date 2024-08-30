const Address = require('../models/Address');
const User = require('../models/User');

// Create or update address for a user
exports.upsertAddress = async (req, res) => {
  const { doorNo, street, city, district, state, postalCode, country, phoneNumber } = req.body;

  try {
    const userId = req.user._id;
    let address = await Address.findOne({ user: userId });

    if (address) {
      // Update the existing address
      address.doorNo = doorNo || address.doorNo;
      address.street = street || address.street;
      address.city = city || address.city;
      address.district = district || address.district;
      address.state = state || address.state;
      address.postalCode = postalCode || address.postalCode;
      address.country = country || address.country;
      address.phoneNumber = phoneNumber || address.phoneNumber;

      await address.save();
      res.status(200).json({ message: 'Address updated successfully', address });
    } else {
      // Create a new address
      address = new Address({
        user: userId,
        doorNo,
        street,
        city,
        district,
        state,
        postalCode,
        country,
        phoneNumber
      });

      const savedAddress = await address.save();
      // Optionally update the user with the address ID
      await User.findByIdAndUpdate(userId, { address: savedAddress._id });

      res.status(201).json({ message: 'Address created successfully', address: savedAddress });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get the address for the logged-in user
exports.getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ user: req.user._id });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
