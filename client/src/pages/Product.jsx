import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product: product._id, quantity }));
  };

  if (loading) return <div style={styles.loading}>Loading product...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!product) return null;

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <img src={product.images[0]} alt={product.name} style={styles.image} />
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.category}>{product.category}</p>
          <p style={styles.price}>₹{product.price}</p>
          <p style={styles.desc}>{product.description}</p>
          <div style={styles.cartRow}>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
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
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    gap: 48,
    alignItems: 'flex-start',
    background: '#f9f9fb',
    borderRadius: 24,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: 32,
  },
  image: {
    width: 400,
    height: 400,
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
    fontSize: '2.2rem',
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
    fontSize: '1.5rem',
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
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
  },
};

export default Product; 