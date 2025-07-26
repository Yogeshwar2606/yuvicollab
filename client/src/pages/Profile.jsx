import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { handleLogout } from '../../utils/auth';
import { Pencil, Star, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [allAddresses, setAllAddresses] = useState([]);
  const recentlyViewed = useSelector(state => state.user.recentlyViewedProducts);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setAddressLoading(true);
    fetch('http://localhost:5000/api/address', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => {
        const def = data.find(a => a.isDefault);
        setDefaultAddress(def || null);
        setAllAddresses(data);
        setAddressLoading(false);
      })
      .catch(() => setAddressLoading(false));
  }, [user]);

  if (!user) return <div style={styles.loading}>Loading profile...</div>;

  const handleEdit = () => {
    setEditing(true);
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      dispatch(setUser({ ...user, name, email, phone, avatar }));
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Profile</h2>
          <button style={styles.editBtn} onClick={handleEdit} disabled={editing}>
            <Pencil size={20} />
          </button>
        </div>
        <div style={styles.form}>
          <label style={styles.label}>Name:</label>
          {editing ? (
            <input style={styles.input} value={name} onChange={e => setName(e.target.value)} disabled={loading} required />
          ) : (
            <div style={styles.value}>{user.name}</div>
          )}
          <label style={styles.label}>Email:</label>
          {editing ? (
            <input style={styles.input} value={email} onChange={e => setEmail(e.target.value)} disabled={loading} required />
          ) : (
            <div style={styles.value}>{user.email}</div>
          )}
          <label style={styles.label}>Phone:</label>
          {editing ? (
            <input style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} required />
          ) : (
            <div style={styles.value}>{user.phone}</div>
          )}
          <label style={styles.label}>Avatar URL:</label>
          {editing ? (
            <input style={styles.input} value={avatar} onChange={e => setAvatar(e.target.value)} disabled={loading} />
          ) : (
            <div style={styles.value}>{user.avatar}</div>
          )}
          {editing && (
            <button style={styles.saveBtn} onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          )}
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>Profile updated!</div>}
        </div>
        <div style={styles.sectionDivider} />
        <div style={styles.logoutSection}>
          <button 
            style={styles.logoutBtn} 
            onClick={() => {
              dispatch(logout());
              dispatch(clearCart());
              dispatch(clearWishlist());
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
        <div style={styles.sectionDivider} />
        <div style={styles.addressSection}>
          <div style={styles.addressHeader}>
            <h3 style={styles.addressTitle}>Addresses</h3>
            <button style={styles.addressBtn} onClick={() => navigate('/address')}>Manage Addresses</button>
          </div>
          <div style={styles.addressHint}>Add, edit, or delete your delivery addresses.</div>
          {addressLoading ? (
            <div style={styles.addressLoading}>Loading addresses...</div>
          ) : allAddresses.length === 0 ? (
            <div style={styles.addressHint}>No addresses found.</div>
          ) : (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {allAddresses.map(addr => (
                <div key={addr._id} style={styles.otherAddressCard}>
                  <div style={styles.defaultName}>{addr.fullName}</div>
                  <div style={styles.defaultLine}><MapPin size={16} style={{ marginRight: 6, color: '#a78bfa' }} />{addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</div>
                  <div style={styles.defaultLine}><Phone size={16} style={{ marginRight: 6, color: '#a78bfa' }} />{addr.phone}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.sectionDivider} />
        <div>
          <h3 style={{...styles.addressTitle, marginBottom: 10}}>Recently Viewed Products</h3>
          {recentlyViewed.length === 0 ? (
            <div style={styles.addressHint}>No products viewed yet.</div>
          ) : (
            <div style={recentlyViewedGrid}>
              {recentlyViewed.map(product => (
                <div
                  key={product._id}
                  style={recentlyViewedCard}
                  onClick={() => navigate(`/product/${product._id}`)}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') navigate(`/product/${product._id}`); }}
                  role="button"
                >
                  <div style={recentlyViewedImgWrap}>
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                  </div>
                  <div style={{ fontWeight: 700, color: '#a78bfa', fontSize: '1.05rem', margin: '6px 0 2px 0', textAlign: 'center' }}>{product.name}</div>
                  <div style={{ color: '#f472b6', fontWeight: 600, fontSize: '0.98rem', textAlign: 'center' }}>{product.category}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.08rem', color: '#18181b', textAlign: 'center', marginTop: 2 }}>₹{Number(product.price).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          )}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '99vw',
    overflowX: 'hidden',
  },
  card: {
    background: '#f9f9fb',
    borderRadius: 24,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: '2.5rem 2rem',
    minWidth: 340,
    maxWidth: 400,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#a78bfa',
    margin: 0,
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: '#a78bfa',
    cursor: 'pointer',
    padding: 4,
    borderRadius: 8,
    transition: 'background 0.2s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  label: {
    fontWeight: 600,
    color: '#888',
    fontSize: '1rem',
    marginBottom: 2,
  },
  value: {
    fontWeight: 600,
    color: '#18181b',
    fontSize: '1.1rem',
    marginBottom: 8,
  },
  input: {
    border: '1.5px solid #e5e7eb',
    borderRadius: 10,
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#a78bfa',
    marginBottom: 8,
    outline: 'none',
  },
  saveBtn: {
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
    marginTop: 12,
  },
  error: {
    color: '#ff6b6b',
    fontWeight: 600,
    marginTop: 8,
  },
  success: {
    color: '#10b981',
    fontWeight: 600,
    marginTop: 8,
  },
  loading: {
    textAlign: 'center',
    color: '#a78bfa',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
  },
  sectionDivider: {
    height: 1,
    background: '#e5e7eb',
    margin: '24px 0',
    width: '100%',
  },
  addressSection: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  addressHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  addressTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#a78bfa',
    margin: 0,
  },
  addressBtn: {
    background: 'linear-gradient(90deg, #2563eb, #fbbf24)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '0.5rem 1.2rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #fbbf2433',
    marginLeft: 10,
    letterSpacing: 0.5,
    transition: 'background 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  addressHint: {
    color: '#888',
    fontSize: '0.98rem',
    marginTop: 2,
    marginLeft: 2,
  },
  defaultAddressCard: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 2px 8px #fbbf2433',
    border: '2px solid #fbbf24',
    padding: '1.2rem 1.5rem',
    marginTop: 8,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    alignItems: 'flex-start',
    fontSize: '1rem',
    fontWeight: 500,
  },
  defaultBadge: {
    background: '#fbbf24',
    color: '#fff',
    borderRadius: 8,
    padding: '2px 12px',
    fontWeight: 800,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
    boxShadow: '0 2px 8px #fbbf2433',
  },
  defaultName: {
    fontWeight: 700,
    color: '#a78bfa',
    fontSize: '1.1rem',
    marginBottom: 2,
  },
  defaultLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#18181b',
    fontWeight: 500,
    fontSize: '1rem',
  },
  addressLoading: {
    color: '#a78bfa',
    fontWeight: 600,
    fontSize: '1rem',
    margin: '8px 0',
  },
  otherAddressesSection: {
    marginTop: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  otherAddressesTitle: {
    fontWeight: 700,
    color: '#a78bfa',
    fontSize: '1.08rem',
    marginBottom: 4,
  },
  otherAddressCard: {
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 2px 8px #e5e7eb',
    border: '1.5px solid #e5e7eb',
    padding: '1rem 1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-start',
    fontSize: '1rem',
    fontWeight: 500,
  },
  setDefaultBtn: {
    background: 'linear-gradient(90deg, #2563eb, #fbbf24)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.4rem 1.1rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #fbbf2433',
    marginTop: 8,
    letterSpacing: 0.5,
    transition: 'background 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  logoutSection: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutBtn: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '0.8rem 2rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    transition: 'all 0.2s',
    outline: 'none',
    width: '100%',
  },
};

const recentlyViewedGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '1.1rem',
  marginTop: 8,
  marginBottom: 8,
  width: '100%',
};
const recentlyViewedCard = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 1px 6px #e5e7eb',
  padding: '1rem 0.7rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  border: '1px solid #f3e8ff',
  minHeight: 180,
  boxSizing: 'border-box',
  overflow: 'hidden',
  maxWidth: 220,
  margin: '0 auto',
  transition: 'transform 0.15s, box-shadow 0.15s',
};
const recentlyViewedImgWrap = {
  width: '100%',
  aspectRatio: '1/1',
  background: '#f4f4f6',
  borderRadius: 8,
  marginBottom: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  maxWidth: 160,
  minHeight: 120,
};

export default Profile; 