import { useState } from 'react';
import { api } from '../services/api';
import Notification from './Notification';

export default function Auth({ onAuth, onCancel }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [role, setRole] = useState('donor');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      let response;
      
      if (isLogin) {
        // Login flow - same for both roles
        response = await api.login(email, password);
      } else {
        // Registration flow - different endpoints per role
        if (role === 'beneficiary') {
          if (!phone) {
            throw new Error('Phone number required for beneficiary registration');
          }
          response = await api.registerBeneficiary(name, email, password, phone);
        } else {
          response = await api.registerDonor(name, email, password);
        }
      }

      if (response.success && response.user && response.token) {
        onAuth(response.user);
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      console.error("Auth error:", err);
      setNotification({
        message: err.message || err.response?.data?.message || 'Authentication failed. Please check your credentials.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="container" style={{ paddingTop: '10rem', maxWidth: '650px', margin: '0 auto' }}>
        <button
          onClick={onCancel}
          style={{
            fontSize: '1.125rem',
            fontWeight: 800,
            opacity: 0.6,
            marginBottom: '3.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 900,
            marginBottom: '2rem',
            lineHeight: 0.9,
            letterSpacing: '-0.04em'
          }}
        >
          {isLogin ? 'Welcome Back.' : 'Join ImpactBridge.'}
        </h2>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Role Selection - Only on Register */}
          {!isLogin && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setRole('donor')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '4px',
                  border: role === 'donor' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: 'white',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                I'm a Donor
              </button>
              <button
                type="button"
                onClick={() => setRole('beneficiary')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '4px',
                  border: role === 'beneficiary' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: 'white',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                I'm a Health Facility
              </button>
            </div>
          )}

          {/* Name Field */}
          {!isLogin && (
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <span className="label-muted">Full Name</span>
              <input
                type="text"
                placeholder={role === 'beneficiary' ? 'Hospital or Clinic Name' : 'Your Full Name'}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  outline: 'none'
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Phone Field - Only for Beneficiary Registration */}
          {!isLogin && role === 'beneficiary' && (
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <span className="label-muted">Phone Number</span>
              <input
                type="tel"
                placeholder="+234 801 234 5678"
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  outline: 'none'
                }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span className="label-muted">Email Address</span>
            <input
              type="email"
              placeholder="name@email.com"
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '1.25rem',
                fontWeight: 700,
                outline: 'none'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <span className="label-muted">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '1.25rem',
                fontWeight: 700,
                outline: 'none'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div style={{ marginTop: '5rem', textAlign: 'center', fontSize: '1.125rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            type="button"
            style={{
              marginLeft: '0.5rem',
              fontWeight: 800,
              color: 'var(--primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem',
              textDecoration: 'underline'
            }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}