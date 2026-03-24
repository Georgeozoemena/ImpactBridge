import { useState } from 'react';
import { api } from '../services/api';

export default function DonationModal({ campaignId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);

  const quickAmounts = [1000, 5000, 10000];

  const handleDonate = async () => {
    if (!amount || amount <= 0) return;
    
    setLoading(true);
    try {
      // We'll use processDonation directly for this demo sync 
      // as it handles the verification (stubbed or real) in the backend
      const response = await api.processDonation({
        campaignId,
        amount,
        donorName: isAnonymous ? 'Anonymous' : name,
        donorEmail: email || 'donor@example.com', // Fallback for demo
        paymentMethod: 'interswitch',
        transactionReference: `IB-UI-${Date.now()}` // Mock ref for stub
      });

      if (response) {
        onSuccess(amount);
      }
    } catch (error) {
      console.error("Donation failed:", error);
      alert(error.response?.data?.message || "Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content container fade-in" style={{ textAlign: 'center', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
          <button onClick={onClose} style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>✕</button>
        </div>
        
        <div className="toggle-reveal" style={{ marginBottom: '4rem', marginTop: '2rem' }}>
          <div 
            className={`toggle-option ${!isMonthly ? 'active' : ''}`} 
            onClick={() => setIsMonthly(false)}
          >
            One-Time
          </div>
          <div 
            className={`toggle-option ${isMonthly ? 'active' : ''}`} 
            onClick={() => setIsMonthly(true)}
          >
            Monthly
          </div>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1 }}>Choose your amount</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '5rem', fontSize: '1.25rem' }}>Every naira moves the patient closer to surgery</p>

        <div className="amount-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '500px', margin: '0 auto 5rem' }}>
          {quickAmounts.map(val => (
            <button 
              key={val}
              onClick={() => setAmount(val)}
              style={{ 
                padding: '1.5rem', 
                borderRadius: '100px', 
                border: amount === val ? 'none' : '1.5px solid var(--border)',
                background: amount === val ? 'var(--primary)' : 'white',
                color: amount === val ? 'white' : 'var(--text-main)',
                fontWeight: 800,
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ₦{val.toLocaleString()}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '5rem', maxWidth: '500px', margin: '0 auto 5rem' }}>
          <span className="label-muted" style={{ textAlign: 'center' }}>Custom Amount (₦)</span>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="0"
            style={{ width: '100%', padding: '1.5rem 0', border: 'none', borderBottom: '2px solid var(--border)', fontSize: '4rem', fontWeight: 900, fontFamily: 'var(--font-display)', outline: 'none', textAlign: 'center', background: 'transparent' }}
          />
        </div>

        <div style={{ marginBottom: '6rem', maxWidth: '500px', margin: '0 auto 6rem', textAlign: 'left' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="label-muted">Your Name</span>
            <input 
              type="text" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isAnonymous}
              style={{ width: '100%', padding: '1.5rem 0', border: 'none', borderBottom: '1px solid var(--border)', fontSize: '1.25rem', outline: 'none', opacity: isAnonymous ? 0.3 : 1, fontWeight: 700, background: 'transparent' }}
            />
          </div>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="label-muted">Email Address</span>
            <input 
              type="email" 
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '1.5rem 0', border: 'none', borderBottom: '1px solid var(--border)', fontSize: '1.25rem', outline: 'none', fontWeight: 700, background: 'transparent' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              type="checkbox" 
              id="anon" 
              checked={isAnonymous} 
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{ width: '24px', height: '24px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="anon" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Donate anonymously</label>
          </div>
        </div>

        <button 
          className="btn btn-primary btn-lg" 
          disabled={loading || !amount}
          onClick={handleDonate}
          style={{ width: '100%', maxWidth: '500px' }}
        >
          {loading ? 'Verifying with Interswitch...' : 'Save a Life Now'}
        </button>
        
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '3rem', fontWeight: 600, paddingBottom: '2rem' }}>
          🔒 Secured & verified · Interswitch
        </p>
      </div>
    </div>
  );
}
