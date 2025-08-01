const Product = require('./models/Product');
const mongoose = require('mongoose');
require('dotenv').config();

const mockRealEstateProducts = [
  // Land Plots
  {
    name: "Premium Corner Plot in Green Valley",
    description: "Prime location corner plot with excellent connectivity. Perfect for building your dream home. All utilities available. Ready for immediate construction.",
    price: 2500000,
    category: "Landscapes",
    subcategory: "Plots",
    features: [
      "Corner Plot",
      "East Facing",
      "All Utilities Available",
      "Gated Community",
      "24/7 Security"
    ],
    location: "Green Valley, Phase 2",
    area: 2400, // sq ft
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1575517111478-7f6afd0973db"
    ],
    stock: 1
  },
  {
    name: "Waterfront Development Plot",
    description: "Rare opportunity to own a waterfront plot. Perfect for luxury villa construction. Premium location with stunning views.",
    price: 3500000,
    category: "Landscapes",
    subcategory: "Plots",
    features: [
      "Waterfront View",
      "Premium Location",
      "Pre-approved Building Plans",
      "Underground Utilities",
      "Large Frontage"
    ],
    location: "Riverside Estate",
    area: 3600,
    images: [
      "https://images.unsplash.com/photo-1499678329028-101435549a4e",
      "https://images.unsplash.com/photo-1584288585274-41b47e207a16"
    ],
    stock: 1
  },

  // Individual Houses
  {
    name: "Modern Family Home with Garden",
    description: "Beautiful 3BHK independent house with modern amenities. Features spacious rooms, modular kitchen, and landscaped garden.",
    price: 8500000,
    category: "Landscapes",
    subcategory: "Houses",
    features: [
      "3 Bedrooms",
      "Modular Kitchen",
      "Landscaped Garden",
      "Car Parking",
      "Solar Panels"
    ],
    location: "Sunshine Colony",
    area: 2200,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    ],
    stock: 1
  },
  {
    name: "Smart Home with Contemporary Design",
    description: "Fully automated 4BHK smart home with contemporary architecture. Features home automation, premium finishes, and rooftop garden.",
    price: 12000000,
    category: "Landscapes",
    subcategory: "Houses",
    features: [
      "4 Bedrooms",
      "Home Automation",
      "Rooftop Garden",
      "Double Car Parking",
      "Premium Finishes"
    ],
    location: "Tech City",
    area: 3000,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83"
    ],
    stock: 1
  },

  // Luxury Villas
  {
    name: "Mediterranean Style Luxury Villa",
    description: "Exquisite 5BHK villa with Mediterranean architecture. Features private pool, home theater, and expansive landscaped gardens.",
    price: 25000000,
    category: "Landscapes",
    subcategory: "Villas",
    features: [
      "5 Bedrooms",
      "Private Pool",
      "Home Theater",
      "Wine Cellar",
      "Staff Quarters"
    ],
    location: "Palm Grove",
    area: 5500,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
    ],
    stock: 1
  },
  {
    name: "Ultra-Modern Smart Villa",
    description: "State-of-the-art 6BHK smart villa with cutting-edge technology. Features elevator, infinity pool, and automated systems throughout.",
    price: 35000000,
    category: "Landscapes",
    subcategory: "Villas",
    features: [
      "6 Bedrooms",
      "Infinity Pool",
      "Private Elevator",
      "Smart Home System",
      "Electric Car Charging"
    ],
    location: "Elite Enclave",
    area: 7000,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
    ],
    stock: 1
  }
];

const addMockRealEstate = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Delete existing real estate products
    await Product.deleteMany({ category: 'Landscapes' });
    console.log('Deleted existing real estate products');

    // Add new products
    const products = await Product.insertMany(mockRealEstateProducts);
    console.log('Added mock real estate products:', products.length);

    console.log('Mock data insertion complete!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
addMockRealEstate();