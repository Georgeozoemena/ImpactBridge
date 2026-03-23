import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Landing({ onStartCampaign, onDonate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCampaigns().then(data => {
      setCampaigns(data);
      setLoading(false);
    });
  }, []);

  const featured = campaigns[0];

  return (
    <div className="fade-in">
      <section style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
          Turn <span style={{ color: 'var(--primary)' }}>Payments</span> Into <br />
          <span style={{ color: 'var(--secondary)' }}>Real-World Impact</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          ImpactBridge connects donors directly to critical healthcare causes with 100% transparency and real-time tracking.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={onDonate}>Donate Now</button>
          <button className="btn btn-outline btn-lg" onClick={onStartCampaign}>Start a Campaign</button>
        </div>
      </section>

      <div className="glass" style={{ padding: '0.75rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem', overflow: 'hidden' }}>
        <span style={{ background: 'var(--secondary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>LIVE</span>
        <div className="ticker-text" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          Ayo just donated ₦2,000 to "Emergency Surgery for Aisha" • 2 minutes ago
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading impact...</div>
      ) : featured && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '2rem' }}>Featured Campaign</h2>
          <div className="glass" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ background: '#e2e8f0', borderRadius: 'var(--radius-md)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Campaign Image</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{featured.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{featured.description}</p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>₦{featured.current_amount.toLocaleString()} raised</span>
                  <span>{Math.round((featured.current_amount / featured.goal_amount) * 100)}%</span>
                </div>
                <div style={{ height: '12px', background: 'var(--surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(featured.current_amount / featured.goal_amount) * 100}%`, 
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    transition: 'width 1s ease-out'
                  }} />
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Target: ₦{featured.goal_amount.toLocaleString()} • {featured.donor_count} Donors
                </div>
              </div>

              <button className="btn btn-primary" onClick={() => onDonate(featured.id)}>Support This Cause</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
