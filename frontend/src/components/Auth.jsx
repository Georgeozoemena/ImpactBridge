import { useState } from 'react';
import { api } from '../services/api';

export default function Auth({ onAuth, onCancel }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await api.login(email, password);
      } else {
        response = await api.register({ name, email, password });
      }
      
      onAuth(response.user);
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="container" style={{ paddingTop: '10rem', maxWidth: '650px', margin: '0 auto' }}>
        <button onClick={onCancel} style={{ fontSize: '1.125rem', fontWeight: 800, opacity: 0.6, marginBottom: '3.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>

        <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900, marginBottom: '2rem', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
          {isLogin ? 'Welcome Back.' : 'Join the ImpactBridge.'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '5rem', fontSize: '1.25rem', lineHeight: 1.6 }}>
          {isLogin ? 'Login to continue saving lives.' : 'Create an account to start your own campaign.'}
        </p>

        {error && (
          <div style={{ color: '#dc2626', background: '#fef2f2', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {!isLogin && (
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span className="label-muted">Full Name</span>
              <input 
                type="text" 
                placeholder="Hospital or Patient Name"
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '1.25rem', fontWeight: 700, outline: 'none' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}

          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span className="label-muted">Email Address</span>
            <input 
              type="email" 
              placeholder="name@email.com"
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '1.25rem', fontWeight: 700, outline: 'none' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <span className="label-muted">Password</span>
            <input 
              type="password" 
              placeholder="••••••••"
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '1.25rem', fontWeight: 700, outline: 'none' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
             {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div style={{ marginTop: '5rem', textAlign: 'center', fontSize: '1.125rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            style={{ marginLeft: '0.5rem', fontWeight: 800, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.125rem', textDecoration: 'underline' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
