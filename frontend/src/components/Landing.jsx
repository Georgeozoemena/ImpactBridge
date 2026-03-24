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
      <section className="hero-bg" style={{ backgroundImage: 'url("/hero-impact.png")' }}>
        <div className="hero-overlay">
          <h1 className="hero-title">
            Turn Payments Into <span style={{ color: 'var(--primary-dark)' }}>Impact</span> For Health Causes
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            When families gain access to quality healthcare, they recover the time to learn, work, and thrive. We build bridges to impactful medical causes.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => onDonate()}>Donate Now</button>
        </div>
      </section>

      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <section style={{ padding: '8rem 0', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '6rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>About ImpactBridge</span>
              <h2 style={{ fontSize: '2.75rem', fontWeight: 800, marginTop: '1.5rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Together, We Restore Access to Care.
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '3.5rem', fontWeight: 500 }}>
                Every community deserves reliable, safe healthcare. At ImpactBridge, we transform medical funding through transparency and local partnerships.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem' }}>
                 <button className="btn btn-secondary" onClick={onStartCampaign}>Start a Campaign</button>
                 <button className="btn btn-outline" onClick={() => onDonate()}>Explore Causes</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
                <div>
                  <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>50+</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hospitals</div>
                </div>
                <div>
                  <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>1.2M+</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lives Impacted</div>
                </div>
                <div>
                  <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>150+</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Units Built</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="container">
        <section style={{ padding: '8rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Make a Difference Today</span>
              <h2 style={{ fontSize: '2.75rem', fontWeight: 800, marginTop: '1.5rem' }}>Urgent Campaigns</h2>
            </div>
            <button className="btn btn-outline" onClick={() => onDonate()}>View All Programs</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading impact...</div>
          ) : featured && (
            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', border: 'none', background: 'transparent' }}>
              <div style={{ height: '500px', background: '#F5F5F5', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                 <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '1.25rem', fontWeight: 600 }}>Campaign Visual</div>
              </div>
              <div style={{ padding: '0 4rem' }}>
                <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{featured.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.125rem', lineHeight: 1.8 }}>{featured.description}</p>
                
                <div style={{ marginBottom: '3.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontWeight: 800 }}>
                    <span style={{ fontSize: '1.5rem' }}>₦{featured.current_amount.toLocaleString()} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.9rem' }}>raised of ₦{featured.goal_amount.toLocaleString()}</span></span>
                    <span style={{ color: 'var(--primary-dark)', fontSize: '1.25rem' }}>{Math.round((featured.current_amount / featured.goal_amount) * 100)}%</span>
                  </div>
                  <div style={{ height: '4px', background: '#E5E5E5', borderRadius: 'var(--radius-full)' }}>
                    <div style={{ height: '100%', width: `${(featured.current_amount / featured.goal_amount) * 100}%`, background: 'var(--secondary)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
                
                <button className="btn btn-secondary btn-lg" style={{ width: '100%' }} onClick={() => onDonate(featured.id)}>Support This Cause</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
