const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, getAllOrders, createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/orderController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
// Admin route (add admin middleware in future)
router.get('/all', getAllOrders);
// Razorpay payment endpoints
router.post('/razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);

module.exports = router; 