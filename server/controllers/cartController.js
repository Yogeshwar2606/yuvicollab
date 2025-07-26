const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get current user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart || { user: req.user.id, items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update item in cart
exports.addOrUpdateCartItem = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product || !quantity) return res.status(400).json({ message: 'Product and quantity required' });
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    let item = cart.items.find(i => i.product.toString() === product);
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, prod.stock));
    } else {
      cart.items.push({ product, quantity: Math.max(1, Math.min(quantity, prod.stock)) });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i._id.toString() !== itemId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 