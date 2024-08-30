const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middlewares/authMiddleware');

// Route to get the cart for the logged-in user
router.get('/', authenticateToken, cartController.getCart);

// Route to add an item to the cart
router.post('/', authenticateToken, cartController.addToCart);

// Route to update the quantity of an item in the cart
router.put('/update/:itemId', authenticateToken, cartController.updateCartItem);

// Route to remove an item from the cart
router.delete('/remove/:itemId', authenticateToken, cartController.removeFromCart);

// Route to clear the cart
router.delete('/', authenticateToken, cartController.clearCart);

module.exports = router;
