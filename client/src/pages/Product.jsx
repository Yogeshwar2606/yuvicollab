import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { addWishlistItem, removeWishlistItem } from '../../redux/wishlistSlice';
import { addRecentlyViewed } from '../../redux/userSlice';
import { Heart } from 'lucide-react';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const wishlist = useSelector(state => state.wishlist.items);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        // Add to recently viewed
        dispatch(addRecentlyViewed(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, dispatch]);

  useEffect(() => {
    console.log('Product:', product);
    console.log('Error:', error);
    console.log('Loading:', loading);
  }, [product, error, loading]);

  const isInWishlist = (productId) => wishlist.some(item => item.product && (item.product._id === productId || item.product === productId));
  const handleWishlist = (productId) => {
    if (!user) return;
    if (isInWishlist(productId)) {
      const item = wishlist.find(i => i.product && (i.product._id === productId || i.product === productId));
      dispatch(removeWishlistItem({ itemId: item._id, token: user.token }));
    } else {
      dispatch(addWishlistItem({ productId, token: user.token }));
    }
  };

  const handleAddToCart = () => {
    if (quantity < 1 || quantity > product.stock) return;
    dispatch(addToCart({ product: product._id, quantity, name: product.name, price: Number(product.price), image: product.images[0], stock: product.stock }));
  };

  if (loading) return <div style={styles.loading}>Loading product...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!product) return <div style={styles.error}>Product not found.</div>;

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <img src={product.images[0]} alt={product.name} style={styles.image} />
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}
            <button
              style={{ ...styles.heartBtn, color: isInWishlist(product._id) ? '#f472b6' : '#a78bfa', marginLeft: 12, verticalAlign: 'middle' }}
              onClick={() => handleWishlist(product._id)}
              aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
              tabIndex={0}
            >
              <Heart fill={isInWishlist(product._id) ? '#f472b6' : 'none'} size={22} />
            </button>
          </h1>
          <p style={styles.category}>{product.category}</p>
          <p style={styles.price}>₹{Number(product.price).toLocaleString('en-IN')}</p>
          <p style={styles.desc}>{product.description}</p>
          <div style={styles.cartRow}>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={e => {
                let val = Number(e.target.value);
                if (val < 1) val = 1;
                if (val > product.stock) val = product.stock;
                setQuantity(val);
              }}
              style={styles.qtyInput}
            />
            <button style={styles.cartBtn} onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
          <p style={styles.stock}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  bg: {
    minHeight: '100vh',
    background: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    padding: '2rem 0',
    width: '98vw',
    overflowX: 'hidden',
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    display: 'flex',
    gap: 32,
    alignItems: 'flex-start',
    background: '#f9f9fb',
    borderRadius: 24,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: 32,
    width: '100%',
    boxSizing: 'border-box',
  },
  image: {
    width: 320,
    height: 320,
    objectFit: 'cover',
    borderRadius: 16,
    boxShadow: '0 2px 8px #e5e7eb',
    background: '#f4f4f6',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  name: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#a78bfa',
    margin: 0,
  },
  category: {
    color: '#f472b6',
    fontWeight: 600,
    fontSize: '1.1rem',
    margin: 0,
  },
  price: {
    fontWeight: 800,
    fontSize: '1.3rem',
    color: '#18181b',
    margin: '0.5rem 0',
  },
  desc: {
    color: '#444',
    fontSize: '1.1rem',
    margin: '1rem 0',
  },
  cartRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '1rem 0',
  },
  qtyInput: {
    width: 60,
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: 8,
    border: '1.5px solid #e5e7eb',
    textAlign: 'center',
  },
  cartBtn: {
    background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '0.75rem 2rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #a78bfa33',
    transition: 'background 0.2s, transform 0.2s',
    outline: 'none',
  },
  stock: {
    color: '#888',
    fontWeight: 500,
    fontSize: '1rem',
    marginTop: 8,
  },
  loading: {
    textAlign: 'center',
    color: '#a78bfa',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
    background: '#fff',
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
    background: '#fff',
  },
  heartBtn: {
    background: 'rgba(255,255,255,0.8)',
    border: 'none',
    borderRadius: '50%',
    padding: 6,
    cursor: 'pointer',
    zIndex: 2,
    boxShadow: '0 2px 8px #a78bfa22',
    transition: 'background 0.2s, color 0.2s',
    outline: 'none',
    marginLeft: 8,
  },
};

export default Product; 