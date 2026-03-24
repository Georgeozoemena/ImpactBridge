import { useState } from 'react';

export default function Auth({ onAuth, onCancel }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('donor');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth({ 
      id: Math.random().toString(36).substr(2, 9), 
      name: name || email.split('@')[0], 
      type: userType 
    });
  };

  return (
    <div className="fade-in" style={{ padding: '8rem 0', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '4rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          {isLogin ? 'Welcome Back.' : 'Join the Bridge.'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1rem' }}>
          {isLogin ? 'Login to manage your impact.' : 'Create an account to start contributing.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Hospital Name or Personal Name"
                  className="btn-outline" 
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>I am a...</label>
                <select 
                   style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)' }}
                   value={userType}
                   onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="donor">Donor (Contributing funds)</option>
                  <option value="beneficiary">Beneficiary (Hospitals/Patients)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
            <input 
              type="email" 
              className="btn-outline" 
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Password</label>
            <input 
              type="password" 
              className="btn-outline" 
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-secondary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
             {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            style={{ marginLeft: '0.5rem', fontWeight: 800, color: 'var(--secondary)' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
