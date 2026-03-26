import { useState } from 'react';

export default function Navbar({ onNavigate, user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>
          ImpactBridge
        </a>

        <div className="nav-links">
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>Campaigns</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('/transparency'); }}>Transparency</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('/about'); }}>About</a>

          <div className="nav-actions">
            {!user ? (
              <>
                <button
                  className="btn btn-outline"
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
                  onClick={() => onNavigate('/auth')}
                >
                  Sign In
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
                  onClick={() => onNavigate('/')}
                >
                  Donate
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
                onClick={() => onNavigate('/dashboard')}
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
          padding: '2rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          zIndex: 800,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <a href="#" className="nav-link" onClick={() => { onNavigate('/'); setIsMenuOpen(false); }}>Campaigns</a>
          <a href="#" className="nav-link" onClick={() => { onNavigate('/transparency'); setIsMenuOpen(false); }}>Transparency</a>
          <a href="#" className="nav-link" onClick={() => { onNavigate('/about'); setIsMenuOpen(false); }}>About</a>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => { onNavigate('/auth'); setIsMenuOpen(false); }}>Sign In</button>
              <button className="btn btn-primary" onClick={() => { onNavigate('/'); setIsMenuOpen(false); }}>Donate Now</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => { onNavigate('/dashboard'); setIsMenuOpen(false); }}>Dashboard</button>
          )}
        </div>
      )}
    </nav>
  );
}
