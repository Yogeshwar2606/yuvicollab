import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const user = useSelector(state => state.user.user);
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/orders/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => { setOrder(data); setLoading(false); })
      .catch(() => { setError('Failed to fetch order'); setLoading(false); });
  }, [user, id]);

  if (loading) return <div style={styles.loading}>Loading order...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!order) return <div style={styles.error}>Order not found.</div>;

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Order Details</h2>
        <div style={styles.section}><span style={styles.label}>Order Date:</span> {new Date(order.createdAt).toLocaleString()}</div>
        <div style={styles.section}><span style={styles.label}>Status:</span> <span style={{ color: order.status === 'delivered' ? '#10b981' : '#a78bfa', fontWeight: 700 }}>{order.status}</span></div>
        <div style={styles.section}><span style={styles.label}>Total:</span> ₹{Number(order.total).toLocaleString('en-IN')}</div>
        <div style={styles.section}><span style={styles.label}>Payment Status:</span> {order.paymentStatus}</div>
        <div style={styles.section}><span style={styles.label}>Address:</span> {order.address.fullName}, {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country} - {order.address.phone}</div>
        <div style={styles.section}><span style={styles.label}>Items:</span>
          <div style={styles.itemsList}>
            {order.items.map(item => (
              <div key={item.product} style={styles.itemCard}>
                <img src={item.image || ''} alt={item.name} style={styles.itemImg} />
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemQty}>Qty: {item.quantity}</div>
                  <div style={styles.itemPrice}>₹{Number(item.price).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button style={styles.backBtn} onClick={() => navigate('/orders')}>Back to Orders</button>
      </div>
    </div>
  );
};

const styles = {
  bg: { minHeight: '100vh', background: '#f4f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '99vw', overflowX: 'hidden' },
  card: { background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #e5e7eb', padding: '2.5rem 2rem', minWidth: 340, maxWidth: 600, width: '100%', display: 'flex', flexDirection: 'column', gap: 18 },
  title: { fontSize: '2rem', fontWeight: 700, color: '#a78bfa', margin: 0, textAlign: 'center' },
  section: { marginTop: 10, fontSize: '1.08rem', fontWeight: 600, color: '#18181b' },
  label: { color: '#f472b6', fontWeight: 700, marginRight: 8 },
  itemsList: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 },
  itemCard: { display: 'flex', alignItems: 'center', gap: 12, background: '#f9f9fb', borderRadius: 10, padding: '0.7rem 1rem' },
  itemImg: { width: 60, height: 60, objectFit: 'cover', borderRadius: 8, background: '#f4f4f6' },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  itemName: { fontWeight: 700, color: '#a78bfa', fontSize: '1rem' },
  itemQty: { color: '#888', fontSize: '0.95rem' },
  itemPrice: { fontWeight: 700, color: '#18181b', fontSize: '1rem' },
  backBtn: { background: 'linear-gradient(90deg, #a78bfa, #f472b6)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #a78bfa33', marginTop: 18, alignSelf: 'flex-end' },
  loading: { color: '#a78bfa', fontWeight: 700, textAlign: 'center', margin: '1rem 0' },
  error: { color: '#ff6b6b', fontWeight: 700, textAlign: 'center', margin: '1rem 0' },
};

export default OrderDetails; 