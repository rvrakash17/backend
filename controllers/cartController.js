const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
// Get the cart for the logged-in user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items',
      populate: { path: 'product' } // Populate product details
    });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add an item to the cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Fetch the product to get the current price
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const currentPrice = product.discountPrice || product.price;

    // Check if the item already exists in the cart
    let cart = await Cart.findOne({ user: req.user._id }).populate('items');
    let existingItem = cart ? cart.items.find(item => item.product.toString() === productId) : null;

    if (existingItem) {
      // Update quantity if the item exists in the cart
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      // Create a new cart item if it doesn't exist
      const newItem = new CartItem({ product: productId, quantity, price: currentPrice });
      const savedItem = await newItem.save();

      // Add the new item to the cart
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [savedItem._id] });
      } else {
        cart.items.push(savedItem._id);
      }
      await cart.save();
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an item in the cart
exports.updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  
  try {
    const item = await CartItem.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity || item.quantity;
    await item.save();

    res.status(200).json({ message: 'Item updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    // Remove item from cart
    await CartItem.findByIdAndDelete(itemId);

    // Find user's cart and remove item reference
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(item => item.toString() !== itemId);
      await cart.save();
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear all items from the cart
exports.clearCart = async (req, res) => {
  try {
  
    // Find user's cart and clear items
    const cart = await Cart.findOne({ user: req.user._id });
    // Remove all items from cart
    await CartItem.deleteMany({ _id: { $in: cart.items } });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
