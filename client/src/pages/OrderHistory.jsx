import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const user = useSelector(state => state.user.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => { setError('Failed to fetch orders'); setLoading(false); });
  }, [user]);

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Order History</h2>
        {loading ? <div style={styles.loading}>Loading orders...</div> : error ? <div style={styles.error}>{error}</div> : orders.length === 0 ? (
          <div style={styles.empty}>No orders found.</div>
        ) : (
          <div style={styles.orderList}>
            {orders.map(order => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderRow}><span>Order Date:</span> <span>{new Date(order.createdAt).toLocaleString()}</span></div>
                <div style={styles.orderRow}><span>Total:</span> <span>₹{Number(order.total).toLocaleString('en-IN')}</span></div>
                <div style={styles.orderRow}><span>Status:</span> <span style={{ color: order.status === 'delivered' ? '#10b981' : '#a78bfa', fontWeight: 700 }}>{order.status}</span></div>
                <button style={styles.detailsBtn} onClick={() => navigate(`/orders/${order._id}`)}>View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  bg: { minHeight: '100vh', background: '#f4f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '99vw', overflowX: 'hidden' },
  card: { background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #e5e7eb', padding: '2.5rem 2rem', minWidth: 340, maxWidth: 600, width: '100%', display: 'flex', flexDirection: 'column', gap: 18 },
  title: { fontSize: '2rem', fontWeight: 700, color: '#a78bfa', margin: 0, textAlign: 'center' },
  loading: { color: '#a78bfa', fontWeight: 700, textAlign: 'center', margin: '1rem 0' },
  error: { color: '#ff6b6b', fontWeight: 700, textAlign: 'center', margin: '1rem 0' },
  empty: { color: '#888', fontWeight: 600, textAlign: 'center', margin: '1rem 0' },
  orderList: { display: 'flex', flexDirection: 'column', gap: 16 },
  orderCard: { background: '#f9f9fb', borderRadius: 14, boxShadow: '0 2px 8px #e5e7eb', border: '1.5px solid #e5e7eb', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 8 },
  orderRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 600 },
  detailsBtn: { background: 'linear-gradient(90deg, #a78bfa, #f472b6)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #a78bfa33', marginTop: 10, alignSelf: 'flex-end' },
};

export default OrderHistory; 