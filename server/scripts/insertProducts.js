const mongoose = require('mongoose');
const Product = require('../models/Product');
const products = require('../mockData/products.json');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = 'mongodb://localhost:27017/uvs-store';

async function insertProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Clear existing products (optional - remove this if you want to keep existing data)
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    // Display summary
    const furnitureCount = insertedProducts.filter(p => p.category === 'Furniture').length;
    const electronicsCount = insertedProducts.filter(p => p.category === 'Electronics').length;
    const landscapesCount = insertedProducts.filter(p => p.category === 'Landscapes').length;

    console.log('\n📊 Product Summary:');
    console.log(`🪑 Furniture: ${furnitureCount} products`);
    console.log(`📱 Electronics: ${electronicsCount} products`);
    console.log(`🌿 Landscapes: ${landscapesCount} products`);
    console.log(`📦 Total: ${insertedProducts.length} products`);

    console.log('\n✅ Products inserted successfully!');
    
  } catch (error) {
    console.error('❌ Error inserting products:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
insertProducts(); 