import { useEffect, useState } from 'react';

export default function Notification({ message, type = 'error', onClose }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const bg = type === 'error' ? '#fee2e2' : '#f0fdf4';
  const border = type === 'error' ? '#ef4444' : '#22c55e';
  const color = type === 'error' ? '#b91c1c' : '#15803d';
  const title = type === 'error' ? 'Action Required' : 'Success';

  return (
    <div className="fade-in" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'white',
        borderRadius: '12px',
        padding: '3rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
        borderTop: `8px solid ${border}`
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: color, marginBottom: '1.5rem' }}>
          {title}
        </div>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.03em', color: '#111' }}>
          {message}
        </h3>
        <button 
          onClick={() => { setVisible(false); onClose(); }} 
          className="btn btn-primary"
          style={{ width: '100%', padding: '1.25rem' }}
        >
          {type === 'error' ? 'Understood' : 'Great'}
        </button>
      </div>
    </div>
  );
}
