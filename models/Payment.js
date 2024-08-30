const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Link to the order
  amount: { type: Number, required: true }, // Payment amount
  paymentMethod: { type: String, enum: ['Credit Card', 'PayPal', 'Bank Transfer'], required: true }, // Payment method
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }, // Status of the payment
  transactionId: { type: String, unique: true }, // Transaction ID from payment gateway
  createdAt: { type: Date, default: Date.now }, // Timestamp for payment creation
  updatedAt: { type: Date, default: Date.now } // Timestamp for last update
});

module.exports = mongoose.model('Payment', paymentSchema);
