const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getProducts);

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