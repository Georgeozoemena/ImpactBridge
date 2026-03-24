import { useState } from 'react';

export default function DonationModal({ campaignId, amount: initialAmount, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState(initialAmount || 0);

  const handleDonate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(customAmount || 5000);
    }, 2000);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      background: 'rgba(26, 26, 26, 0.9)', 
      backdropFilter: 'blur(8px)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div className="card fade-in" style={{ 
        width: '100%', 
        maxWidth: '520px', 
        padding: '4rem', 
        position: 'relative',
        background: 'var(--background)',
        border: 'none',
        borderRadius: 'var(--radius-lg)'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '2rem', right: '2rem', fontSize: '1.5rem', fontWeight: 300 }}
        >
          ✕
        </button>

        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'block' }}>Complete Donation</span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>Finalize Impact.</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block' }}>Amount (NGN)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, fontSize: '1.25rem' }}>₦</span>
              <input 
                type="number" 
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1.5rem 1.5rem 1.5rem 3rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border)', 
                  background: 'var(--surface)',
                  fontSize: '1.25rem',
                  fontWeight: 700
                }}
              />
            </div>
          </div>

          <div style={{ padding: '2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>🔒</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Secure Transaction</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified by Interswitch Webpay</div>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-lg" 
            style={{ 
               width: '100%', 
               height: '70px', 
               fontSize: '1.125rem', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               gap: '1rem',
               background: loading ? 'var(--secondary)' : 'var(--secondary)'
            }} 
            onClick={handleDonate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                Verifying with Webpay...
              </>
            ) : (
              <>
                <img src="/interswitch-logo.png" alt="" style={{ height: '24px', filter: 'brightness(0) invert(1)' }} />
                Pay with Interswitch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
