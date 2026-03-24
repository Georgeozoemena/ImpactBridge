export default function SuccessScreen({ amount, onFinish }) {
  const handleDownloadReceipt = () => {
    const receiptContent = `
      ImpactBridge Receipt
      -------------------
      Donation ID: IB-592-XK9
      Amount: ₦${amount.toLocaleString()}
      Date: ${new Date().toLocaleDateString()}
      Status: Verified
      Thank you for your impact.
    `;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-IB-592-XK9.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in">
      <div className="container" style={{ padding: '8rem 0', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100px', height: '100px', background: 'var(--primary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '3rem', boxShadow: 'var(--shadow-lg)' }}>
          ✓
        </div>
        
        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Impact Confirmed</span>
        <h2 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>Thank You for Your <br />Compassion.</h2>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
          Your gift of <strong>₦{amount.toLocaleString()}</strong> has been successfully processed and delivered to the beneficiary. You've just built a bridge to a healthier future.
        </p>
        
        <div className="card" style={{ padding: '3rem', width: '100%', maxWidth: '500px', marginBottom: '4rem', background: 'var(--surface)', border: 'none', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 600 }}>Donation ID</span>
            <span style={{ fontFamily: 'monospace' }}>IB-592-XK9</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600 }}>Amount</span>
            <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>₦{amount.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>Date</span>
            <span style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button className="btn btn-secondary btn-lg" onClick={onFinish}>Return Home</button>
          <button className="btn btn-outline btn-lg" onClick={handleDownloadReceipt}>Download Receipt</button>
        </div>
      </div>
    </div>
  );
}
