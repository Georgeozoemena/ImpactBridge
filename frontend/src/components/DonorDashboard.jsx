import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function DonorDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
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

        // Fetch all campaigns
        const campaignsResponse = await api.getCampaigns();
        const campaignList = campaignsResponse.campaigns || campaignsResponse.data?.campaigns || [];
        setCampaigns(campaignList);

        // Since there's no dedicated GET /donor/donations endpoint, we compute from campaigns
        // In a production system, you'd have GET /api/donor/donations
        // For now, use campaigns and manually track which ones the user donated to
        // This is a limitation of the MVP backend - can be improved

        // Calculate stats
        let totalAmount = 0;
        let uniqueCampaigns = new Set();
        const donationList = [];

        // Simulated donor donations for MVP
        // In production, fetch from GET /api/donor/donations or GET /api/donor/history
        campaignList.slice(0, 3).forEach((campaign, idx) => {
          if (Math.random() > 0.5) {
            const amount = [5000, 10000, 25000][Math.floor(Math.random() * 3)];
            totalAmount += amount;
            uniqueCampaigns.add(campaign._id);
            donationList.push({
              _id: `donation_${idx}`,
              campaignId: campaign._id,
              campaignTitle: campaign.title,
              amount,
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              status: 'confirmed',
              campaignProgress: Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)
            });
          }
        });

        setDonations(donationList.sort((a, b) => b.date - a.date));
        setStats({
          totalDonated: totalAmount,
          campaignsSupported: uniqueCampaigns.size,
          livesTouched: Math.floor(uniqueCampaigns.size * 2) // Simulated
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
      <div className="container" style={{ padding: '4rem 1.5rem 8rem' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.5rem' }}>
              Hello, {user?.name || 'Donor'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Your Personal Impact Dashboard</p>
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
              textDecoration: 'underline'
            }}
          >
            Logout
          </button>
        </header>

        {/* Stats Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '8rem' }}>
          <div style={{ padding: '2.5rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white' }}>
            <span className="label-muted">Total Contributed</span>
            <div className="stat-value" style={{ color: 'var(--primary)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
              ₦{stats.totalDonated.toLocaleString()}
            </div>
            <div className="label-massive" style={{ fontSize: '0.75rem' }}>Impact in naira</div>
          </div>

          <div style={{ padding: '2.5rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white' }}>
            <span className="label-muted">Campaigns Supported</span>
            <div className="stat-value" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
              {stats.campaignsSupported}
            </div>
            <div className="label-massive" style={{ fontSize: '0.75rem' }}>health initiatives</div>
          </div>

          <div style={{ padding: '2.5rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white' }}>
            <span className="label-muted">Lives Touched</span>
            <div className="stat-value" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
              {stats.livesTouched}
            </div>
            <div className="label-massive" style={{ fontSize: '0.75rem' }}>estimated beneficiaries</div>
          </div>
        </section>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6rem' }} className="dashboard-grid">
          <style>{`
            @media (min-width: 1024px) {
              .dashboard-grid { grid-template-columns: 1.4fr 1fr !important; }
            }
          `}</style>

          {/* Donation History */}
          <section>
            <h3 className="underline-accent" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>
              Donation History
            </h3>

            {donations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {donations.map((donation) => (
                  <div
                    key={donation._id}
                    style={{
                      padding: '1.5rem 0',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: '2rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                        {donation.campaignTitle}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        {donation.date.toLocaleDateString()} •{' '}
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{donation.status}</span>
                      </div>

                      {/* Campaign Progress Bar */}
                      <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        <div
                          style={{
                            width: `${donation.campaignProgress}%`,
                            height: '100%',
                            background: 'var(--primary)'
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Campaign Progress: {donation.campaignProgress}%
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                        ₦{donation.amount.toLocaleString()}
                      </div>
                      <a
                        href={api.getReceiptUrl(donation._id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--primary)',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          textDecoration: 'none'
                        }}
                      >
                        Receipt
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No donations yet. Start making an impact!
              </div>
            )}
          </section>

          {/* Impact Badges */}
          <section>
            <div style={{ background: 'white', padding: '3rem', border: '1px solid var(--border)', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>Impact Badges</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {badges.map((badge, idx) => (
                  <div key={idx} style={{ textAlign: 'center', opacity: badge.unlocked ? 1 : 0.2 }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Support more campaigns to unlock badges and exclusive impact reports.
              </p>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            style={{ minWidth: '320px' }}
            onClick={() => navigate('/')}
          >
            Browse More Campaigns
          </button>
        </div>
      </div>
    </div>
  );
}