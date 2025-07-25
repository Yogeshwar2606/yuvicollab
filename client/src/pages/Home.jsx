import React, { useEffect, useState } from 'react';
import { Search, Sofa, Smartphone, TreePine, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';

const categories = [
  { label: 'All', value: '' },
  { label: 'Furniture', value: 'Furniture', icon: <Sofa size={20} /> },
  { label: 'Electronics', value: 'Electronics', icon: <Smartphone size={20} /> },
  { label: 'Landscapes', value: 'Landscapes', icon: <TreePine size={20} /> },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    p =>
      (!category || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product: product._id, quantity: 1 }));
  };

  return (
    <div style={styles.bg}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Discover Premium Furniture, Electronics & Landscapes</h1>
          <p style={styles.heroSubtitle}>Shop the best products for your home and lifestyle, only at UV's Store.</p>
        </div>
      </section>

      {/* Search & Categories */}
      <div style={styles.searchBarWrap}>
        <div style={styles.searchBar}>
          <Search size={20} style={{ color: '#a78bfa', marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat.label}
              style={{
                ...styles.categoryBtn,
                background: category === cat.value ? '#a78bfa' : '#f4f4f6',
                color: category === cat.value ? '#fff' : '#a78bfa',
                border: category === cat.value ? 'none' : '1.5px solid #e5e7eb',
              }}
              onClick={() => setCategory(cat.value)}
            >
              {cat.icon && <span style={{ marginRight: 6 }}>{cat.icon}</span>}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={styles.productsWrap}>
        {loading ? (
          <div style={styles.loading}>Loading products...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.noProducts}>No products found.</div>
        ) : (
          <div style={styles.grid}>
            {filteredProducts.map(product => (
              <div key={product._id} style={styles.productCard}>
                <img src={product.images[0]} alt={product.name} style={styles.productImg} />
                <h2 style={styles.productName}>{product.name}</h2>
                <p style={styles.productCategory}>{product.category}</p>
                <p style={styles.productPrice}>₹{product.price}</p>
                <button
                  style={styles.cartBtn}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={18} style={{ marginRight: 6 }} />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed Placeholder */}
      <div style={styles.recentlyViewedWrap}>
        <h3 style={styles.recentlyViewedTitle}>Recently Viewed</h3>
        <div style={styles.recentlyViewedPlaceholder}>Sign in to see your recently viewed products.</div>
      </div>
    </div>
  );
};

const styles = {
  bg: {
    minHeight: '100vh',
    background: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    padding: 0,
    margin: 0,
  },
  heroSection: {
    width: '100vw',
    background: '#f4f4f6',
    padding: '2.5rem 0 1.5rem 0',
    textAlign: 'center',
    color: '#18181b',
    marginBottom: 24,
    boxShadow: '0 2px 12px #e5e7eb',
  },
  heroContent: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 2vw',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: 12,
    letterSpacing: 1,
    color: '#a78bfa',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    fontWeight: 500,
    color: '#888',
  },
  searchBarWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem 0 1rem 0',
    gap: 16,
    width: '100vw',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 8px #e5e7eb',
    padding: '0.5rem 1.5rem',
    minWidth: 320,
    maxWidth: 600,
    width: '100%',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '1.1rem',
    background: 'transparent',
    flex: 1,
    color: '#a78bfa',
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  categories: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100vw',
  },
  categoryBtn: {
    border: 'none',
    borderRadius: 12,
    padding: '0.5rem 1.2rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    boxShadow: '0 2px 8px #e5e7eb',
    marginBottom: 4,
  },
  productsWrap: {
    width: '100vw',
    maxWidth: '100vw',
    margin: '2rem 0',
    padding: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '2rem',
    marginTop: '1rem',
    width: '100vw',
    padding: '0 2vw',
  },
  productCard: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    border: '1.5px solid #f3e8ff',
    minHeight: 340,
  },
  productImg: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0 2px 8px #e5e7eb',
    background: '#f4f4f6',
  },
  productName: {
    fontWeight: 700,
    fontSize: '1.1rem',
    margin: '0.5rem 0 0.2rem 0',
    color: '#a78bfa',
  },
  productCategory: {
    color: '#f472b6',
    fontWeight: 600,
    fontSize: '0.95rem',
    marginBottom: 4,
  },
  productPrice: {
    fontWeight: 800,
    fontSize: '1.2rem',
    color: '#18181b',
    marginTop: 4,
  },
  loading: {
    textAlign: 'center',
    color: '#a78bfa',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
  },
  noProducts: {
    textAlign: 'center',
    color: '#a78bfa',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
  },
  recentlyViewedWrap: {
    width: '100vw',
    maxWidth: '100vw',
    margin: '2rem 0',
    padding: '0 2vw',
    background: '#f4f4f6',
    borderRadius: 16,
    boxShadow: '0 2px 8px #e5e7eb',
    marginTop: 32,
  },
  recentlyViewedTitle: {
    fontWeight: 700,
    fontSize: '1.2rem',
    color: '#a78bfa',
    margin: '1rem 0 0.5rem 0',
  },
  recentlyViewedPlaceholder: {
    color: '#888',
    fontWeight: 500,
    fontSize: '1rem',
    marginBottom: 16,
  },
  cartBtn: {
    background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '0.5rem 1.2rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #a78bfa33',
    transition: 'background 0.2s, transform 0.2s',
    outline: 'none',
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
};

export default Home; 