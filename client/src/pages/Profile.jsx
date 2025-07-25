import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { Pencil } from 'lucide-react';

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
            <input style={styles.input} value={name} onChange={e => setName(e.target.value)} disabled={loading} />
          ) : (
            <div style={styles.value}>{user.name}</div>
          )}
          <label style={styles.label}>Email:</label>
          {editing ? (
            <input style={styles.input} value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
          ) : (
            <div style={styles.value}>{user.email}</div>
          )}
          <label style={styles.label}>Phone:</label>
          {editing ? (
            <input style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} />
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
    width: '98vw',
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
};

export default Profile; 