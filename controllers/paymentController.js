const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Create a payment record
exports.createPayment = async (req, res) => {
    const { orderId, paymentMethod, transactionId } = req.body;
  
    try {
      // Verify that the order exists
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      // Retrieve the total amount from the order
      const amount = order.totalAmount;
  
      // Create a new payment record
      const newPayment = new Payment({
        order: orderId,
        amount,
        paymentMethod,
        transactionId
      });
  
      const savedPayment = await newPayment.save();
      res.status(201).json({ message: 'Payment created successfully', payment: savedPayment });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  try {
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.paymentStatus = paymentStatus || payment.paymentStatus;
    payment.updatedAt = Date.now();

    const updatedPayment = await payment.save();
    res.status(200).json({ message: 'Payment status updated successfully', payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payment details by order ID
exports.getPaymentByOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const payment = await Payment.findOne({ order: orderId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all payments (Admin only)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('order');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
