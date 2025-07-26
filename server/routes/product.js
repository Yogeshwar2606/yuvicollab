const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const requireAuth = require('../middleware/requireAuth');

// Get all products
router.get('/', productController.getProducts);

// Get similar products
router.get('/similar/:productId', productController.getSimilarProducts);

// Review routes (must come before /:id routes to avoid conflicts)
router.post('/:id/reviews', requireAuth, productController.addProductReview);
router.get('/:id/reviews', productController.getProductReviews);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create product (admin only)
// TODO: Add admin middleware
router.post('/', productController.createProduct);

// Update product (admin only)
// TODO: Add admin middleware
router.put('/:id', productController.updateProduct);

// Delete product (admin only)
// TODO: Add admin middleware
router.delete('/:id', productController.deleteProduct);

module.exports = router; 