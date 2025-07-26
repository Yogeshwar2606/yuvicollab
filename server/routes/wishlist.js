const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlistController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

// Get current user's wishlist
router.get('/', getWishlist);
// Add product to wishlist
router.post('/', addToWishlist);
// Remove product from wishlist
router.delete('/:itemId', removeFromWishlist);
// Clear wishlist
router.delete('/', clearWishlist);

module.exports = router; 