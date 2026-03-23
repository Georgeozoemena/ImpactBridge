import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function BeneficiaryDashboard() {
  const [stats, setStats] = useState({ totalReceived: 0, donorCount: 0, goalProgress: 0 });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock dashboard data
    setTimeout(() => {
      setStats({ totalReceived: 950000, donorCount: 68, goalProgress: 76 });
      setDonations([
        { id: 1, donor: 'Ayo', amount: 5000, date: '2 mins ago' },
        { id: 2, donor: 'Chioma', amount: 12000, date: '15 mins ago' },
        { id: 3, donor: 'Anonymous', amount: 2000, date: '1 hour ago' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading dashboard...</div>;

  return (
    <div className="fade-in" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Beneficiary Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time overview of your active campaigns.</p>
        </div>
        <button className="btn btn-primary">+ Create New Campaign</button>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Received</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>₦{stats.totalReceived.toLocaleString()}</div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Contributor Count</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.donorCount}</div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Goal Progress</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>{stats.goalProgress}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Recent Activity */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Donations</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>Donor</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 500 }}>{d.donor}</td>
                  <td style={{ padding: '1rem 0', fontWeight: 700, color: 'var(--secondary)' }}>₦{d.amount.toLocaleString()}</td>
                  <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Campaign Health */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Campaign Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span>Daily Velocity</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>High</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface)', borderRadius: 'var(--radius-full)' }}>
                <div style={{ height: '100%', width: '85%', background: 'var(--secondary)', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              At your current donation rate, you are expected to reach your goal of ₦1.2M in <strong>4 days</strong>.
            </p>
            <button className="btn btn-outline" style={{ width: '100%' }}>Download Full Report</button>
          </div>
        </section>
      </div>
    </div>
  );
}
