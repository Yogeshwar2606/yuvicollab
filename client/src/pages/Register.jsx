import { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSuccess(true);
      // Store user info in Redux and localStorage
      dispatch(setUser(data));
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.animatedBg} />
      <div style={styles.card} className="register-card-animate">
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join UV's Store</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <User size={20} style={styles.icon} />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.inputGroup}>
            <Mail size={20} style={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.inputGroup}>
            <Lock size={20} style={styles.icon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <button type="submit" style={styles.button} className="register-btn-animate" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {error && <div style={{ color: '#ff6b6b', marginTop: 16, fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ color: '#10b981', marginTop: 16, fontWeight: 600 }}>Registration successful! Redirecting...</div>}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>Already have an account?</span>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#a78bfa',
              fontWeight: 700,
              fontSize: '1rem',
              marginLeft: 8,
              cursor: 'pointer',
              textDecoration: 'underline',
              transition: 'color 0.2s',
            }}
            onMouseOver={e => (e.target.style.color = '#f472b6')}
            onMouseOut={e => (e.target.style.color = '#a78bfa')}
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
      <style>{`
        html, body { margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap');
        .register-card-animate {
          animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .register-btn-animate {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .register-btn-animate:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 8px 32px #a78bfa44;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  bg: {
    height: '100vh',
    width: '99vw',
    background: 'linear-gradient(120deg, #a78bfa 0%, #f472b6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: 'Montserrat, sans-serif',
    overflow: 'hidden',
  },
  animatedBg: {
    position: 'absolute',
    top: '-20%',
    left: '-20%',
    width: '140%',
    height: '140%',
    background: 'radial-gradient(circle at 20% 30%, #fff3 0%, #fff0 70%), radial-gradient(circle at 80% 70%, #fff2 0%, #fff0 80%)',
    zIndex: 0,
    pointerEvents: 'none',
    animation: 'moveBg 8s linear infinite alternate',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(255,255,255,0.15)',
    boxShadow: '0 8px 32px 0 #1f26875e',
    borderRadius: '24px',
    padding: '2.5rem 2rem',
    minWidth: 320,
    maxWidth: 380,
    width: '100%',
    backdropFilter: 'blur(12px)',
    border: '1.5px solid #fff3',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    color: '#f3e8ff',
    fontWeight: 600,
    marginBottom: 32,
    fontSize: '1.1rem',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: '0.5rem 1rem',
    marginBottom: 12,
    boxShadow: '0 2px 8px #fff1',
    border: '1.5px solid #fff2',
    transition: 'box-shadow 0.2s',
  },
  icon: {
    color: '#a78bfa',
    marginRight: 10,
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '1rem',
    color: '#fff',
    fontWeight: 600,
    padding: '0.5rem 0',
    letterSpacing: 0.5,
  },
  button: {
    marginTop: 12,
    background: 'linear-gradient(90deg, #a78bfa, #f472b6, #f87171)',
    color: '#fff',
    border: 'none',
    borderRadius: 16,
    padding: '0.75rem 2rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #a78bfa33',
    transition: 'background 0.2s, transform 0.2s',
  },
};

export default Register; 