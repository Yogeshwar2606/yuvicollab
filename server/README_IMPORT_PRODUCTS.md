# 📦 Import Products to MongoDB

## Method 1: Using Node.js Script (Recommended)

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Update MongoDB connection string** in `scripts/insertProducts.js`:
   ```javascript
   const MONGODB_URI = 'mongodb://localhost:27017/uvs-store';
   ```

3. **Run the script:**
   ```bash
   node scripts/insertProducts.js
   ```

## Method 2: Using MongoDB Compass

1. **Open MongoDB Compass**

2. **Connect to your database:**
   - Connection string: `mongodb://localhost:27017/uvs-store`

3. **Navigate to the `products` collection**

4. **Click "Add Data" → "Insert Document"**

5. **Copy and paste individual product JSON:**

```json
{
  "name": "Modern Leather Sofa",
  "description": "Premium leather sofa with ergonomic design, perfect for living rooms. Features high-quality leather upholstery and sturdy wooden frame.",
  "price": 45000,
  "category": "Furniture",
  "stock": 15,
  "images": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500"
  ]
}
```

6. **Repeat for all products** from `mockData/products.json`

## Method 3: Bulk Import with Compass

1. **Open MongoDB Compass**

2. **Navigate to your database and `products` collection**

3. **Click "Add Data" → "Insert Document"**

4. **Switch to "JSON" view**

5. **Copy the entire array** from `mockData/products.json` and paste it

6. **Click "Insert"**

## 📊 Product Categories

- **🪑 Furniture (6 products):** Sofas, chairs, tables, beds, bookshelves
- **📱 Electronics (6 products):** TVs, laptops, phones, headphones, speakers
- **🌿 Landscapes (8 products):** Plants, garden tools, outdoor furniture, decorations

## 🎯 Features of Mock Data

- **Realistic prices** in Indian Rupees (₹)
- **High-quality images** from Unsplash
- **Detailed descriptions** for each product
- **Varied stock levels** for testing
- **Proper categorization** for filtering

## 🔧 Troubleshooting

**If script fails:**
1. Check MongoDB connection string
2. Ensure MongoDB is running
3. Verify database name is correct
4. Check if Product model exists

**If images don't load:**
- Images are from Unsplash and should load automatically
- Check internet connection
- Verify image URLs are accessible

## ✅ Verification

After importing, you should see:
- 20 total products
- Products visible on `/home` page
- Category filtering working
- Search functionality working
- Product details pages accessible 