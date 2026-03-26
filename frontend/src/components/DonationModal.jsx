import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Notification from './Notification';

export default function DonationModal({ campaignId, onClose, onSuccess, beneficiaryName }) {
  const [stage, setStage] = useState('form'); // 'form', 'payment', 'redirecting'
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [notification, setNotification] = useState(null);
  const [interswitchData, setInterswitchData] = useState(null);

  const quickAmounts = [1000, 5000, 10000, 50000];

  /**
   * Step 1: Initiate donation - Get Interswitch form fields from backend
   */
  const handleInitiateDonation = async () => {
    if (!amount || amount <= 0) {
      setNotification({ message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    if (!email || !email.includes('@')) {
      setNotification({ message: 'Please enter a valid email', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const backendBase = api.getBaseUrl().replace(/\/api\/?$/, '');
      const callbackUrl = `${backendBase}/payment/callback`;
      const response = await api.initiateDonation(
        campaignId,
        amount,
        callbackUrl,
        email
      );

      if (response.success && response.fields) {
        // Fetch campaign details to get the title for the success screen
        let campaignTitle = 'the';
        try {
          const detail = await api.getCampaignById(campaignId);
          campaignTitle = detail.title || detail.campaign?.title || 'the';
        } catch (e) {
          console.warn("Failed to fetch campaign title for success flow", e);
        }

        // Store Interswitch data for later
        setInterswitchData({
          paymentUrl: response.paymentUrl,
          fields: response.fields,
          transactionReference: response.transactionReference,
          donationId: response.donationId,
          campaignTitle: campaignTitle
        });
        setStage('payment');
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (err) {
      console.error('Donation initiation failed:', err);
      setNotification({
        message: err.response?.data?.message || 'Payment initiation failed. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Redirect to Interswitch for payment
   * Saves donation context to localStorage before redirect
   */
  const handleSubmitPayment = async () => {
    if (!interswitchData) return;

    setLoading(true);
    setStage('redirecting');

    try {
      // Save donation context to localStorage
      // This will be retrieved by PaymentCallback component after redirect
      localStorage.setItem('pendingDonation', JSON.stringify({
        campaignId,
        amount,
        email,
        donorName: isAnonymous ? 'Anonymous' : name,
        transactionReference: interswitchData.transactionReference,
        donationId: interswitchData.donationId,
        campaignTitle: interswitchData.campaignTitle // Assuming this is available or we should fetch it
      }));

      // In production: Create a hidden form and submit to Interswitch
      // For sandbox/demo: Redirect directly to paymentUrl with form data
      
      // Create a form element to submit Interswitch data
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = interswitchData.paymentUrl;
      form.target = '_self';

      // Add all Interswitch fields as hidden inputs
      Object.keys(interswitchData.fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = interswitchData.fields[key];
        form.appendChild(input);
      });

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
      
      // Clean up
      document.body.removeChild(form);
    } catch (err) {
      console.error('Payment redirect failed:', err);
      setNotification({
        message: 'Failed to redirect to payment gateway. Please try again.',
        type: 'error'
      });
      setStage('payment');
      setLoading(false);
    }
  };

  // ============= Form Stage =============
  if (stage === 'form') {
    return (
      <div className="modal-overlay">
        {notification && (
          <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
        )}
        <div className="modal-content container fade-in" style={{ textAlign: 'center', maxHeight: '90vh', overflowY: 'auto' }}>
          {/* Close Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
            <button
              onClick={onClose}
              style={{
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.5
              }}
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              marginBottom: '1rem',
              lineHeight: 1,
              marginTop: '2rem'
            }}
          >
            Choose your impact
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '5rem', fontSize: '1.25rem' }}>
            Every naira moves {beneficiaryName || 'this patient'} closer to recovery
          </p>

          {/* Quick Amount Buttons */}
          <div
            className="amount-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1.5rem',
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto 5rem'
            }}
          >
            {quickAmounts.map((val) => (
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

          {/* Custom Amount */}
          <div style={{ marginBottom: '5rem', maxWidth: '500px', margin: '0 auto 5rem' }}>
            <span className="label-muted" style={{ textAlign: 'center', display: 'block', marginBottom: '1rem' }}>
              Custom Amount (₦)
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              style={{
                width: '100%',
                padding: '1.5rem 0',
                border: 'none',
                borderBottom: '2px solid var(--border)',
                fontSize: '4rem',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                outline: 'none',
                textAlign: 'center',
                background: 'transparent'
              }}
            />
          </div>

          {/* Donor Details */}
          <div style={{ marginBottom: '6rem', maxWidth: '500px', margin: '0 auto 6rem', textAlign: 'left' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="label-muted">Your Name</span>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnonymous}
                style={{
                  width: '100%',
                  padding: '1.5rem 0',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '1.25rem',
                  outline: 'none',
                  opacity: isAnonymous ? 0.3 : 1,
                  fontWeight: 700,
                  background: 'transparent'
                }}
              />
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <span className="label-muted">Email Address</span>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.5rem 0',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '1.25rem',
                  outline: 'none',
                  fontWeight: 700,
                  background: 'transparent'
                }}
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
              <label htmlFor="anon" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Donate anonymously
              </label>
            </div>
          </div>

          {/* Continue to Payment Button */}
          <button
            className="btn btn-primary btn-lg"
            disabled={loading || !amount || !email}
            onClick={handleInitiateDonation}
            style={{ width: '100%', maxWidth: '500px' }}
          >
            {loading ? 'Connecting to Interswitch...' : 'Continue to Payment'}
          </button>

          <p
            style={{
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              marginTop: '3rem',
              fontWeight: 600,
              paddingBottom: '2rem'
            }}
          >
            🔒 Secured & verified · Interswitch
          </p>
        </div>
      </div>
    );
  }

  // ============= Payment Stage =============
  if (stage === 'payment') {
    return (
      <div className="modal-overlay">
        <div className="modal-content container fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Ready to save a life?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>
            Amount: <strong>₦{amount.toLocaleString()}</strong>
          </p>

          <button
            className="btn btn-primary btn-lg"
            disabled={loading}
            onClick={handleSubmitPayment}
            style={{ width: '100%', maxWidth: '500px', marginBottom: '1rem' }}
          >
            {loading ? 'Redirecting to Interswitch...' : 'Complete Payment'}
          </button>

          <button
            className="btn btn-outline"
            disabled={loading}
            onClick={() => setStage('form')}
            style={{ width: '100%', maxWidth: '500px' }}
          >
            Back to Details
          </button>

          <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            You will be redirected to Interswitch Quickteller for secure payment.
          </p>
        </div>
      </div>
    );
  }

  // ============= Redirecting Stage =============
  if (stage === 'redirecting') {
    return (
      <div className="modal-overlay">
        <div className="modal-content container fade-in" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '2rem', animation: 'spin 1s linear infinite' }}>🔄</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Redirecting to Interswitch...</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Please do not close this page. You will be redirected to complete your payment securely.
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return null;
}
