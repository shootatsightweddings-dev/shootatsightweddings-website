import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import useSEO from '../hooks/useSEO';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useSEO({
    title: 'Admin Secure Login',
    noindex: true
  });


  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token & email to localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminEmail', data.admin.email);

      // Redirect to dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Connection to server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-matte-frame">
        <div className="login-header">
          <span className="subtitle-accent">00 // PRIVATE AREA</span>
          <h2 className="login-title">Control <i>Center</i></h2>
          <p className="login-subtitle">Authenticate to manage shoot archives.</p>
        </div>

        {error && <div className="login-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group-chic">
            <label htmlFor="email">E-mail Address</label>
            <input
              type="email"
              id="email"
              required
              placeholder="e.g., admin@shootsight.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group-chic">
            <label htmlFor="password">Passphrase</label>
            <input
              type="password"
              id="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-premium-submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
