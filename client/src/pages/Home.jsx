import React, { useEffect, useState } from 'react';
import { Search, Sofa, Smartphone, TreePine, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
    dispatch(addToCart({ product: product._id, quantity: 1, name: product.name, price: Number(product.price), image: product.images[0], stock: product.stock }));
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
                <div style={styles.imgWrap}>
                  <img src={product.images[0]} alt={product.name} style={styles.productImg} />
                </div>
                <h2
                  style={styles.productName}
                  onClick={() => navigate(`/product/${product._id}`)}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') navigate(`/product/${product._id}`); }}
                  role="button"
                >
                  {product.name}
                </h2>
                <p style={styles.productCategory}>{product.category}</p>
                <p style={styles.productPrice}>₹{Number(product.price).toLocaleString('en-IN')}</p>
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
    boxSizing: 'border-box',
    overflowX: 'hidden',
    width: '99vw',
    position: 'relative' // ✅ optional, good for safely positioning elements inside
  },

  heroSection: {
    width: '100%',
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
    width: '100%',
    boxSizing: 'border-box',
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
    width: '100%',
    boxSizing: 'border-box',
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
    boxSizing: 'border-box',
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
    width: '100%',
    boxSizing: 'border-box',
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
    width: '98vw',
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: 0,
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.2rem',
    marginTop: '1rem',
    width: '100%',
    padding: '0 1vw',
    boxSizing: 'border-box',
  },
  productCard: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 6px #e5e7eb',
    padding: '0.8rem 0.6rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: 'pointer',
    border: '1px solid #f3e8ff',
    minHeight: 220,
    boxSizing: 'border-box',
    overflow: 'hidden',
    maxWidth: 210,
    margin: '0 auto',
  },
  imgWrap: {
    width: '100%',
    aspectRatio: '1/1',
    background: '#f4f4f6',
    borderRadius: 8,
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    maxWidth: 170,
    minHeight: 170,
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 8,
    background: '#f4f4f6',
  },
  productName: {
    fontWeight: 700,
    fontSize: '1rem',
    margin: '0.3rem 0 0.1rem 0',
    color: '#a78bfa',
    cursor: 'pointer',
    textDecoration: 'underline',
    outline: 'none',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  productCategory: {
    color: '#f472b6',
    fontWeight: 600,
    fontSize: '0.85rem',
    marginBottom: 2,
    textAlign: 'center',
  },
  productPrice: {
    fontWeight: 800,
    fontSize: '1.05rem',
    color: '#18181b',
    marginTop: 2,
    marginBottom: 4,
    textAlign: 'center',
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
    width: '100%',
    margin: '2rem 0',
    padding: '0 2vw',
    background: '#f4f4f6',
    borderRadius: 16,
    boxShadow: '0 2px 8px #e5e7eb',
    marginTop: 32,
    boxSizing: 'border-box',
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
    borderRadius: 10,
    padding: '0.4rem 1rem',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 1px 4px #a78bfa22',
    transition: 'background 0.2s, transform 0.2s',
    outline: 'none',
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
};

export default Home; 