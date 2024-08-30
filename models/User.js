const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  profilePic: { type: String, default: 'default-profile-pic.jpg' },
  otp: String,
  otpExpires: Date,
  address: { type: Schema.Types.ObjectId, ref: 'Address' },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  try {
    const otp = crypto.randomBytes(3).toString('hex'); // 6-digit OTP
    this.otp = bcrypt.hashSync(otp, 10);
    this.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    return otp;
  } catch (error) {
    throw new Error('Error generating OTP: ' + error.message);
  }
};

// Method to validate OTP
userSchema.methods.validateOTP = function(enteredOtp) {
  if (Date.now() > this.otpExpires) {
    return false; // OTP expired
  }
  return bcrypt.compareSync(enteredOtp, this.otp);
};

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
