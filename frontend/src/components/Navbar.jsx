import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <NavLink to="/" className="nav-logo">
          ImpactBridge
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Campaigns</NavLink>
          <NavLink to="/transparency" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Transparency</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>

          <div className="nav-actions" style={{ marginLeft: '2rem' }}>
            {!user ? (
              <>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  Donate Now
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </button>
            )}
          </div>
        </div>

        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          background: 'white',
          padding: '2.5rem',
          borderBottom: '1.5px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          zIndex: 1100,
          boxShadow: '0 15px 30px rgba(0,0,0,0.05)'
        }}>
          <NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Campaigns</NavLink>
          <NavLink to="/transparency" className="nav-link" onClick={() => setIsMenuOpen(false)}>Transparency</NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</NavLink>
          <hr style={{ border: 'none', borderTop: '1.5px solid var(--border)', margin: '1rem 0' }} />
          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}>Sign In</button>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { navigate('/'); setIsMenuOpen(false); }}>Donate Now</button>
            </div>
          ) : (
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}>Dashboard</button>
          )}
        </div>
      )}
    </nav>
  );
}
