const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get current user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items.product');
    res.json(wishlist || { user: req.user.id, items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { product } = req.body;
    if (!product) return res.status(400).json({ message: 'Product required' });
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    if (!wishlist.items.find(i => i.product.toString() === product)) {
      wishlist.items.push({ product });
    }
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter(i => i._id.toString() !== itemId);
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items = [];
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 