export default function SuccessScreen({ amount, campaignTitle, newPercent, onFinish }) {
  return (
    <div className="fade-in">
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center', maxWidth: '800px' }}>
        <div style={{ fontSize: '5rem', marginBottom: '3rem' }}>🎉</div>
        
        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1 }}>
          You just helped <br /><span style={{ color: 'var(--primary)' }}>save a life.</span>
        </h2>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '5rem', lineHeight: 1.8 }}>
          Your contribution of ₦{amount.toLocaleString()} moved {campaignTitle || 'the'} campaign to <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{newPercent || 'a new'}% funded.</span>
        </p>

        <div style={{ background: 'white', padding: '4rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '5rem' }}>
          <span className="label-muted">Campaign Impact</span>
          <div className="stat-value" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', marginBottom: '1.5rem' }}>{newPercent || 'Success'}%</div>
          <div className="progress-bar-thin" style={{ height: '4px' }}>
            <div className="progress-fill-thin" style={{ width: `${newPercent || 100}%`, height: '100%' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
          <button className="btn btn-primary btn-lg">Share with friends</button>
          <button className="btn btn-outline btn-lg" style={{ borderColor: '#25D366', color: '#128C7E' }}>Invite on WhatsApp</button>
        </div>

        <button 
          onClick={onFinish}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', fontSize: '1.1rem' }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
