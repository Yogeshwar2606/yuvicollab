const express = require('express');
const router = express.Router();
const { getCart, addOrUpdateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

// Get current user's cart
router.get('/', getCart);
// Add or update item in cart
router.post('/', addOrUpdateCartItem);
// Remove item from cart
router.delete('/:itemId', removeCartItem);
// Clear cart
router.delete('/', clearCart);

module.exports = router; 