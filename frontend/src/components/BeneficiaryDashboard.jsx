import { useEffect, useState } from 'react';

export default function BeneficiaryDashboard() {
  const [stats, setStats] = useState({ totalReceived: 0, donorCount: 0, goalProgress: 0 });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({ totalReceived: 950000, donorCount: 68, goalProgress: 76 });
      setDonations([
        { id: 1, donor: 'Ayo O.', amount: 5000, date: '2 mins ago' },
        { id: 2, donor: 'Chioma A.', amount: 12000, date: '15 mins ago' },
        { id: 3, donor: 'Anonymous donor', amount: 2000, date: '1 hour ago' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
       <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading dashboard...</div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="container" style={{ padding: '4rem 0' }}>
        <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Hospital Administration</span>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '1rem', letterSpacing: '-0.02em' }}>Impact Overview</h2>
          </div>
          <button className="btn btn-secondary">+ Request Funding</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
          <div className="card" style={{ padding: '3rem', border: 'none', background: 'var(--surface)', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Total Funds Raised</div>
            <div style={{ fontSize: '3rem', fontWeight: 800 }}>₦{stats.totalReceived.toLocaleString()}</div>
          </div>
          <div className="card" style={{ padding: '3rem', border: 'none', background: 'var(--surface)', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Verified Supporters</div>
            <div style={{ fontSize: '3rem', fontWeight: 800 }}>{stats.donorCount}</div>
          </div>
          <div className="card" style={{ padding: '3rem', border: 'none', background: 'var(--surface)', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Goal Achievement</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{stats.goalProgress}%</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '4rem' }}>
          <section>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {donations.map(d => (
                <div key={d.id} style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{d.donor}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Transaction verified • {d.date}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>₦{d.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline" style={{ marginTop: '3rem', width: '100%' }}>View All Transactions</button>
          </section>

          <section>
            <div className="card" style={{ padding: '3rem', background: 'var(--secondary)', color: 'white', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Campaign Velocity</h3>
              <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '2.5rem', lineHeight: 1.6 }}>
                At your current donation rate, you are expected to reach your goal in <strong>4 days</strong>. Consistent updates to your story improve visibility.
              </p>
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>
                  <span>Daily Target</span>
                  <span>85% Achieved</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)' }}>
                  <div style={{ height: '100%', width: '85%', background: 'var(--primary)', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', border: 'none' }}>Share Campaign</button>
            </div>

            <div className="card" style={{ padding: '3rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Program Milestones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { label: 'The Spark (First 10%)', progress: 100, icon: '⚡' },
                  { label: 'Critical Mass (50%)', progress: 100, icon: '🔥' },
                  { label: 'Final Stretch (75%)', progress: 80, icon: '🚀' },
                  { label: 'Mission Met (100%)', progress: 0, icon: '🏆' },
                ].map((m, i) => (
                  <div key={i} style={{ opacity: m.progress > 0 ? 1 : 0.4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700 }}>{m.icon} {m.label}</span>
                      <span style={{ fontWeight: 800 }}>{m.progress}%</span>
                    </div>
                    <div style={{ height: '4px', background: '#EEE', borderRadius: 'var(--radius-full)' }}>
                      <div style={{ height: '100%', width: `${m.progress}%`, background: 'var(--primary-dark)', borderRadius: 'var(--radius-full)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
