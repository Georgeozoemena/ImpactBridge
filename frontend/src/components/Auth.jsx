import { useState } from 'react';
import { api } from '../services/api';
import Notification from './Notification';

export default function Auth({ onAuth, onCancel }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [role, setRole] = useState('donor'); // Default role
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [campaignTarget, setCampaignTarget] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      let response;
      if (isLogin) {
        response = await api.login(email, password);
      } else {
        const payload = { 
          name, email, password, role,
          ...(role === 'beneficiary' && { campaignTitle, campaignDescription, campaignTarget, imageUrl })
        };
        response = await api.register(payload);
      }
      
      onAuth(response.user);
    } catch (err) {
      console.error("Auth error:", err);
      setNotification({ 
        message: err.response?.data?.message || 'Authentication failed. Please check your credentials.', 
        type: 'error' 
      });
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
        {notification && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {!isLogin && (
            <>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setRole('donor')}
                  style={{ flex: 1, padding: '1rem', borderRadius: '4px', border: role === 'donor' ? '2px solid var(--primary)' : '1px solid var(--border)', background: 'white', fontWeight: 800 }}
                >
                  I'm a Donor
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole('beneficiary')}
                  style={{ flex: 1, padding: '1rem', borderRadius: '4px', border: role === 'beneficiary' ? '2px solid var(--primary)' : '1px solid var(--border)', background: 'white', fontWeight: 800 }}
                >
                  I'm a Beneficiary
                </button>
              </div>

              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <span className="label-muted">Full Name</span>
                <input 
                  type="text" 
                  placeholder={role === 'beneficiary' ? "Hospital or Patient Name" : "Your Full Name"}
                  style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '1.25rem', fontWeight: 700, outline: 'none' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              {role === 'beneficiary' && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>Campaign Launchpad</h4>
                  
                  <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                    <span className="label-muted">Campaign Title</span>
                    <input 
                      type="text" 
                      placeholder="e.g., Surgery for Baby Aisha"
                      style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                      value={campaignTitle}
                      onChange={(e) => setCampaignTitle(e.target.value)}
                      required 
                    />
                  </div>

                  <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                    <span className="label-muted">Funding Goal (₦)</span>
                    <input 
                      type="number" 
                      placeholder="How much do you need?"
                      style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                      value={campaignTarget}
                      onChange={(e) => setCampaignTarget(e.target.value)}
                      required 
                    />
                  </div>

                  <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                    <span className="label-muted">Patient Image URL (Optional)</span>
                    <input 
                      type="url" 
                      placeholder="https://..."
                      style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>

                  <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                    <span className="label-muted">The Narrative</span>
                    <textarea 
                      placeholder="Briefly describe the medical need..."
                      style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '1.1rem', fontWeight: 700, outline: 'none', minHeight: '80px', fontFamily: 'inherit' }}
                      value={campaignDescription}
                      onChange={(e) => setCampaignDescription(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              )}
            </>
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
