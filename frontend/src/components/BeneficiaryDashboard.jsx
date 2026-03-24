import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function BeneficiaryDashboard({ user, onLogout }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const campaigns = await api.getCampaigns();
        // In a real app, we'd filter by user.id
        // For this demo, we'll take the first campaign available
        const myCampaign = campaigns[0];
        
        if (myCampaign) {
          const fullData = await api.getCampaignById(myCampaign._id || myCampaign.id);
          setCampaign(fullData);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>Loading impact...</div>
    </div>
  );

  if (!campaign) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>No campaigns found for this account.</div>
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button className="btn btn-primary">Create Campaign</button>
        <button onClick={onLogout} className="btn btn-outline">Logout</button>
      </div>
    </div>
  );

  const percent = Math.round((campaign.raisedAmount / campaign.targetAmount) * 100);
  const needed = campaign.targetAmount - campaign.raisedAmount;

  return (
    <div className="fade-in">
      <div className="container" style={{ padding: '6rem 1.5rem 8rem' }}>
        <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', marginBottom: '5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.5rem' }}>Hello, {user?.name || 'Beneficiary'}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Campaign: {campaign.title}</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button className="btn btn-primary">Campaign Settings</button>
            <button onClick={onLogout} style={{ fontSize: '1rem', fontWeight: 800, opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Logout</button>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '8rem' }}>
          <div style={{ padding: '3.5rem 2.5rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white' }}>
            <span className="label-muted">Total Raised</span>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>₦{campaign.raisedAmount.toLocaleString()}</div>
            <div className="label-massive">from {campaign.donorCount} donors</div>
          </div>
          <div style={{ padding: '3.5rem 2.5rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white' }}>
            <span className="label-muted">Status</span>
            <div className="stat-value">{campaign.status === 'active' ? '02' : '--'}</div>
            <div className="label-massive">{campaign.status === 'active' ? 'Days Left' : 'Campaign Inactive'}</div>
          </div>
          <div style={{ padding: '3.5rem 2.5rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white' }}>
            <span className="label-muted">Still Needed</span>
            <div className="stat-value" style={{ color: needed <= 0 ? 'var(--primary)' : '#DC2626' }}>₦{Math.max(0, needed).toLocaleString()}</div>
            <div className="label-massive">to reach ₦{campaign.targetAmount.toLocaleString()} goal</div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6rem' }} className="dashboard-grid">
          <style>{`
            @media (min-width: 1024px) {
              .dashboard-grid { grid-template-columns: 1fr 1fr !important; }
            }
          `}</style>

          <section>
            <h3 className="underline-accent" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>Progress to Goal</h3>
            <div style={{ background: 'white', padding: '4rem', border: '1px solid var(--border)', borderRadius: '4px', textAlign: 'center' }}>
              <div className="stat-value" style={{ fontSize: '5rem', marginBottom: '2rem' }}>{percent}%</div>
              <div className="progress-bar-thin" style={{ height: '6px', marginBottom: '2rem' }}>
                <div className="progress-fill-thin" style={{ width: `${Math.min(percent, 100)}%`, height: '100%' }} />
              </div>
              <p style={{ fontWeight: 700, color: 'var(--text-muted)' }}>₦{needed.toLocaleString()} to completion</p>
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h3 className="underline-accent" style={{ fontSize: '1.5rem' }}>Recent Activity</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>
                <span className="pulse-dot" style={{ margin: 0 }}></span> LIVE
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {campaign.recentDonations?.length > 0 ? campaign.recentDonations.map((d, i) => (
                <div key={i} className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: '#EEE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {(d.donorName || 'A')[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{d.donorName || 'Anonymous'}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(d.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>₦{d.amount.toLocaleString()}</div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No recent donations yet.</div>
              )}
            </div>
          </section>
        </div>

        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
          <button className="btn btn-primary btn-lg" style={{ minWidth: '320px' }}>
            Request Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}
