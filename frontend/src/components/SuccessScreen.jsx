export default function SuccessScreen({ amount, onFinish }) {
  return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '6rem 0' }}>
      <div style={{ width: '100px', height: '100px', background: 'var(--secondary)', color: 'white', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '3rem', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
        ❤️
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>You Just Saved a Life!</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem' }}>
        Thank you for your generous gift of <strong>₦{Number(amount).toLocaleString()}</strong>. Your contribution has moved this campaign significantly closer to its goal.
      </p>

      <div className="glass" style={{ maxWidth: '500px', margin: '0 auto 3rem', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Your Impact Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Campaign Progress</span>
            <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>+2.5%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Milestone Rank</span>
            <span style={{ fontWeight: 700 }}>Life Saver 🎖️</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Receipt Issued</span>
            <span style={{ fontWeight: 700 }}>#IB-2026-0042</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          className="btn btn-primary" 
          style={{ padding: '1rem 2rem' }}
          onClick={() => window.print()}
        >
          Download PDF Receipt
        </button>
        <button className="btn btn-outline" style={{ padding: '1rem 2rem' }} onClick={onFinish}>Return to Home</button>
      </div>

      <div style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Share your impact: 
        <span style={{ marginLeft: '1rem', cursor: 'pointer', color: 'var(--primary)' }}>Twitter</span> • 
        <span style={{ marginLeft: '1rem', cursor: 'pointer', color: 'var(--primary)' }}>WhatsApp</span> • 
        <span style={{ marginLeft: '1rem', cursor: 'pointer', color: 'var(--primary)' }}>Facebook</span>
      </div>
    </div>
  );
}
