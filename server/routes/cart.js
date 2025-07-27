const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const Cart = require('../models/Cart');

// Protect all cart routes
router.use(requireAuth);

// Get cart items
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log('Fetched cart:', cart); // Debug log
    res.json(cart || { items: [] });
  } catch (error) {
    console.error('Error fetching cart:', error); // Debug log
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, quantity } = req.body;
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.product.toString() === product);
    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.items.push({ product, quantity });
    }
    
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error); // Debug log
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/', async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { upsert: true }
    );
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error); // Debug log
    res.status(500).json({ error: error.message });
  }
});

// Bulk update cart
router.post('/bulk', async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }
    
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items } },
      { upsert: true, new: true }
    );
    
    const updatedCart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log('Updated cart after bulk update:', updatedCart); // Debug log
    res.json(updatedCart);
  } catch (error) {
    console.error('Error bulk updating cart:', error); // Debug log
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 