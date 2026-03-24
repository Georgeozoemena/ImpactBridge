import { useEffect, useState } from 'react';

export default function DonorDashboard() {
  const [impact, setImpact] = useState({ totalDonated: 0, livesTouched: 0, campaignsSupported: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setImpact({ totalDonated: 45000, livesTouched: 3, campaignsSupported: 2 });
    setHistory([
      { id: 1, campaign: 'Emergency Surgery for Aisha', amount: 10000, date: 'Mar 20, 2026', status: 'verified' },
      { id: 2, campaign: 'Hospital Oxygen Supply', amount: 35000, date: 'Mar 15, 2026', status: 'verified' },
    ]);
  }, []);

  return (
    <div className="fade-in">
      <div className="container" style={{ padding: '4rem 0' }}>
        <header style={{ marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Donor Profile</span>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '1rem', letterSpacing: '-0.02em' }}>My Personal Impact</h2>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
          <div className="card" style={{ padding: '3rem', border: 'none', background: 'var(--primary)', borderBottom: '1px solid var(--primary-dark)', borderRadius: 0 }}>
            <div style={{ color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Total Contribution</div>
            <div style={{ fontSize: '3rem', fontWeight: 800 }}>₦{impact.totalDonated.toLocaleString()}</div>
          </div>
          <div className="card" style={{ padding: '3rem', border: 'none', background: 'var(--surface)', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Lives Touched</div>
            <div style={{ fontSize: '3rem', fontWeight: 800 }}>{impact.livesTouched}</div>
          </div>
          <div className="card" style={{ padding: '3rem', border: 'none', background: 'var(--surface)', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Supported Programs</div>
            <div style={{ fontSize: '3rem', fontWeight: 800 }}>{impact.campaignsSupported}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '4rem' }}>
          <section>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>Donation History</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {history.map(h => (
                <div key={h.id} style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{h.campaign}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{h.date} • <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{h.status}</span></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.25rem' }}>₦{h.amount.toLocaleString()}</div>
                    <button style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Receipt</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="card" style={{ padding: '3rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>Impact Badges</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {[
                  { icon: '🎖️', name: 'Life Saver', unlocked: true },
                  { icon: '🚑', name: 'First Resp.', unlocked: true },
                  { icon: '🏥', name: 'Member', unlocked: false },
                  { icon: '🌟', name: 'Beacon', unlocked: false },
                  { icon: '💎', name: 'Guardian', unlocked: false },
                  { icon: '🤝', name: 'Unity', unlocked: false },
                ].map((badge, i) => (
                  <div key={i} style={{ textAlign: 'center', opacity: badge.unlocked ? 1 : 0.2 }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{badge.name}</div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Support 3 more programs to unlock the <strong>Philanthropist</strong> badge and exclusive reports.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
