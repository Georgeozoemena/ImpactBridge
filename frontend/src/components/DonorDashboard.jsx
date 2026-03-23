import { useEffect, useState } from 'react';

export default function DonorDashboard() {
  const [impact, setImpact] = useState({ totalDonated: 0, livesTouched: 0, campaignsSupported: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Mock donor data
    setImpact({ totalDonated: 45000, livesTouched: 3, campaignsSupported: 2 });
    setHistory([
      { id: 1, campaign: 'Emergency Surgery for Aisha', amount: 10000, date: '2026-03-20', status: 'verified' },
      { id: 2, campaign: 'Hospital Oxygen Supply', amount: 35000, date: '2026-03-15', status: 'verified' },
    ]);
  }, []);

  return (
    <div className="fade-in" style={{ padding: '2rem 0' }}>
       <header style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Impact</h2>
          <p style={{ color: 'var(--text-muted)' }}>Your contribution to a healthier world.</p>
      </header>

      {/* Impact Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary), #3b82f6)', color: 'white', border: 'none' }}>
          <div style={{ opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Donated</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>₦{impact.totalDonated.toLocaleString()}</div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Lives Touched</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{impact.livesTouched}</div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Campaigns Supported</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{impact.campaignsSupported}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* History */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Donation History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map(h => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{h.campaign}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.date} • <span style={{ color: 'var(--secondary)' }}>{h.status}</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>₦{h.amount.toLocaleString()}</div>
                  <button style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Download PDF</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Badges & Gamification */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Milestone Badges</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { icon: '🎖️', name: 'Life Saver', unlocked: true },
              { icon: '🚑', name: 'First Resp.', unlocked: true },
              { icon: '🏥', name: 'Philanthr.', unlocked: false },
              { icon: '🌟', name: 'Beacon', unlocked: false },
              { icon: '💎', name: 'Guardian', unlocked: false },
              { icon: '🤝', name: 'Unity', unlocked: false },
            ].map((badge, i) => (
              <div key={i} style={{ textAlign: 'center', opacity: badge.unlocked ? 1 : 0.3, filter: badge.unlocked ? 'none' : 'grayscale(1)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{badge.icon}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>{badge.name}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Next badge: <strong>Philanthropist</strong> <br /> (Support 5 campaigns)
          </p>
        </section>
      </div>
    </div>
  );
}
