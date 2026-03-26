import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function DonorDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    livesTouched: 0
  });

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        setLoading(true);

        const history = await api.getDonorHistory();
        const donationList = history.history || [];
        setDonations(donationList);
        setStats({
          totalDonated: history.totalDonated || 0,
          campaignsSupported: history.campaignsSupported || 0,
          livesTouched: history.livesTouched || 0
        });
      } catch (error) {
        console.error('Failed to fetch donor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>
          Loading your impact...
        </div>
      </div>
    );
  }

  const badges = [
    { icon: '🎖️', name: 'Life Saver', unlocked: stats.totalDonated > 0 },
    { icon: '🚑', name: 'First Responder', unlocked: stats.campaignsSupported >= 1 },
    { icon: '🏥', name: 'Healthcare Hero', unlocked: stats.campaignsSupported >= 3 },
    { icon: '🌟', name: 'Beacon', unlocked: stats.totalDonated > 500000 },
    { icon: '💎', name: 'Guardian', unlocked: stats.campaignsSupported >= 5 },
    { icon: '🤝', name: 'Unity', unlocked: stats.campaignsSupported >= 10 }
  ];

  return (
    <div className="fade-in">
      <div className="db-container">
        <header className="db-header">
          <div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>
              Hello, {user?.name || 'Donor'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Your Personal Impact Dashboard</p>
          </div>
          <button
            onClick={onLogout}
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              opacity: 0.6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginBottom: '1rem'
            }}
          >
            Logout
          </button>
        </header>

        <section className="db-stats-grid">
          <div className="db-card">
            <span className="label-muted">Total Contributed</span>
            <div className="stat-value" style={{ color: 'var(--primary-vibrant)', fontSize: '3rem', marginBottom: '0.5rem' }}>
              ₦{stats.totalDonated.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>Financial Impact</div>
          </div>

          <div className="db-card">
            <span className="label-muted">Campaigns Supported</span>
            <div className="stat-value" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
              {stats.campaignsSupported}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>Health Initiatives</div>
          </div>

          <div className="db-card">
            <span className="label-muted">Lives Touched</span>
            <div className="stat-value" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
              {stats.livesTouched}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>Estimated Beneficiaries</div>
          </div>
        </section>

        <div className="db-main-grid">
          <section>
            <h3 className="underline-accent" style={{ fontSize: '1.5rem', marginBottom: '3.5rem' }}>
              Donation History
            </h3>

            {donations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {donations.map((donation) => (
                  <div key={donation._id} className="db-list-item">
                    <div style={{ flex: 1, paddingRight: '2rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                        {donation.campaign || donation.campaignTitle}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        {new Date(donation.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} •{' '}
                        <span style={{ color: 'var(--primary-vibrant)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>{donation.status}</span>
                      </div>

                      <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        <div
                          style={{
                            width: `${donation.campaignProgress || 0}%`,
                            height: '100%',
                            background: 'var(--primary-vibrant)',
                            transition: 'width 1s ease'
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                        Campaign Progress: {donation.campaignProgress || 0}%
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>
                        ₦{donation.amount.toLocaleString()}
                      </div>
                      <a
                          href={api.getReceiptUrl(donation._id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-link"
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--primary-vibrant)',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            textDecoration: 'none',
                            borderBottom: '1.5px solid var(--primary-vibrant)'
                          }}
                        >
                          Get Receipt
                        </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="db-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                No donations found. Start making an impact today!
              </div>
            )}
          </section>

          <section className="db-card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem', textAlign: 'center' }}>Impact Badges</h3>
            <div className="db-badge-grid">
              {badges.map((badge, idx) => (
                <div key={idx} className="db-badge" style={{ opacity: badge.unlocked ? 1 : 0.15 }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '3.5rem', padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)' }}>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6, fontWeight: 600 }}>
                Support more campaigns to unlock exclusive badges and personal impact reports.
              </p>
            </div>
          </section>
        </div>

        <div style={{ marginTop: '10rem', textAlign: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            style={{ minWidth: '340px', padding: '1.5rem' }}
            onClick={() => navigate('/')}
          >
            Browse Active Campaigns
          </button>
        </div>
      </div>
    </div>
  );
}
