import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

export default function PaymentCallback() {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const verificationStarted = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txnRef = params.get('txn_ref') || params.get('transaction_ref') || params.get('reference');
    
    if (!txnRef) {
      setStatus('error');
      setError('Missing transaction reference.');
      return;
    }

    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const verify = async () => {
      try {
        // Here we attempt to verify the donation. 
        // We might need the campaignId and amount if the backend process requires them.
        // For a seamless flow, the backend should ideally handle verification by txnRef alone.
        
        // Since the current backend expects campaignId, amount etc for processDonation,
        // we'll try to find them in localStorage if they were saved during initiation.
        const pendingDonation = JSON.parse(localStorage.getItem('pendingDonation') || '{}');
        
        if (!pendingDonation.amount) {
          throw new Error('Donation context lost. Please try donating again.');
        }

        const response = await api.processDonation(
          pendingDonation.campaignId,
          pendingDonation.amount,
          pendingDonation.donorName || 'Anonymous',
          txnRef
        );

        if (response && (response.success || response.donation)) {
          setStatus('success');
          // Clear pending donation
          localStorage.removeItem('pendingDonation');
          // Navigate to success screen with data from response or localStorage
          const amount = response.donation?.amount || pendingDonation.amount || 0;
          const title = response.campaignTitle || pendingDonation.campaignTitle || 'the';
          const newPercent = response.newPercent || response.donation?.newPercent || 0;
          
          // Small delay for UX
          setTimeout(() => {
            navigate('/success', { state: { amount, title, newPercent } });
          }, 1500);
        } else {
          throw new Error(response?.message || 'Verification failed');
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus('error');
        setError(err.response?.data?.message || err.message || 'Payment verification failed.');
      }
    };

    verify();
  }, [location, navigate]);

  return (
    <div className="container" style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      {status === 'verifying' && (
        <div className="fade-in">
          <div className="spinner" style={{ 
            width: '60px', 
            height: '60px', 
            border: '5px solid var(--border)', 
            borderTopColor: 'var(--primary)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem'
          }}></div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Verifying Payment...</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Please do not refresh this page.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="fade-in">
          <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>✅</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Payment Verified!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Redirecting to your receipt...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="fade-in">
          <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>❌</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Oops! Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary"
            style={{ padding: '1rem 3rem' }}
          >
            Back to Home
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
