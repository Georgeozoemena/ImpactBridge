import { useState } from 'react';
import { api } from '../services/api';

export default function DonationModal({ campaignId, amount: initialAmount, onClose, onSuccess }) {
  const [amount, setAmount] = useState(initialAmount || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.createDonation({ campaignId, amount });
      // Simulate Interswitch redirect Delay
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => onSuccess(amount), 1500);
      }, 2000);
    } catch (err) {
      setLoading(false);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
      <div className="glass fade-in" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', fontSize: '1.25rem', color: 'var(--text-muted)' }}>✕</button>
        
        {!success ? (
          <>
            <h2 style={{ marginBottom: '1.5rem' }}>Secure Donation</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Amount (NGN)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600 }}>₦</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="Enter amount" 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)' }}
                  />
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                 <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Payment Method</div>
                 <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span>💳 Interswitch Webpay</span>
                   <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>SECURE</span>
                 </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '1rem' }} disabled={loading}>
                {loading ? 'Processing...' : `Donate ₦${Number(amount || 0).toLocaleString()}`}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--secondary)', color: 'white', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>✓</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Redirecting to impact summary...</p>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          By donating, you agree to the terms of service.
        </div>
      </div>
    </div>
  );
}
