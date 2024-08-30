const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeAdmin = require('../middlewares/authorizationMiddleware');

// Route to create an order from the cart
router.post('/', authenticateToken, orderController.createOrderFromCart);

// Route to get all orders (Admin only)
router.get('/', authenticateToken, authorizeAdmin, orderController.getAllOrders);

// Route to get orders for the authenticated user
router.get('/user', authenticateToken, orderController.getUserOrders);

// Route to update order status (Admin only)
router.put('/:id', authenticateToken, authorizeAdmin, orderController.updateOrderStatus);

// Route to cancel an order (User only)
router.delete('/:id', authenticateToken, orderController.cancelOrder);

module.exports = router;
