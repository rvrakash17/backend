const Order = require('../models/Order');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

// Create an order from the cart
exports.createOrderFromCart = async (req, res) => {
    try {
      // Find the user's cart and populate items
      const cart = await Cart.findOne({ user: req.user._id }).populate('items');
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      // Check if the cart has any items
      if (cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty. Cannot create an order with no items.' });
      }
  
      // Calculate total amount from cart items
      const items = cart.items;
      const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
      // Create a new order
      const newOrder = new Order({
        user: req.user._id,
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount
      });
  
      const savedOrder = await newOrder.save();
  
      // Clear the cart after creating the order
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  
      res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
// Get all orders for an admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (for admin)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status || order.status;
    order.updatedAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel an order (for users)
exports.cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });

    // Optionally, you could also update the order status to "Cancelled"
    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
