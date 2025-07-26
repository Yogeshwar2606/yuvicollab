const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get similar products
router.get('/similar/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { category, limit = 4 } = req.query;
    
    // Find products in the same category, excluding the current product
    const similarProducts = await Product.find({
      category: category,
      _id: { $ne: productId }
    })
    .limit(parseInt(limit))
    .select('name price category images stock');
    
    res.json(similarProducts);
  } catch (error) {
    console.error('Error fetching similar products:', error);
    res.status(500).json({ message: 'Error fetching similar products' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().select('name price category images stock');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

module.exports = router; 