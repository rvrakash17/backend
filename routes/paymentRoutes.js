const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeAdmin = require('../middlewares/authorizationMiddleware');

// Route to create a payment record
router.post('/', authenticateToken, paymentController.createPayment);

// Route to update payment status (Admin only)
router.put('/:id', authenticateToken, authorizeAdmin, paymentController.updatePaymentStatus);

// Route to get payment details by order ID
router.get('/order/:orderId', authenticateToken, paymentController.getPaymentByOrder);

// Route to get all payments (Admin only)
router.get('/', authenticateToken, authorizeAdmin, paymentController.getAllPayments);


module.exports = router;
