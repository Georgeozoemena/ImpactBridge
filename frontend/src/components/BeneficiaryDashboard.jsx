import { useEffect, useState } from 'react';
import { api } from '../services/api';
import CreateCampaign from './CreateCampaign';
import Notification from './Notification';

export default function BeneficiaryDashboard({ user, onLogout }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.getCampaigns();
        const campaignList = response.campaigns || response.data?.campaigns || (Array.isArray(response) ? response : []);
        
        // Filter by user.id if available
        const myCampaign = campaignList.find(c => c.createdBy === user._id || c.createdBy === user.id) || campaignList[0];
        
        if (myCampaign) {
          const responseData = await api.getCampaignById(myCampaign._id || myCampaign.id);
          const fullData = responseData.campaign || responseData;
          setCampaign(fullData);
          
          // Socket integration
          const socket = api.connectSocket(fullData._id || fullData.id);
          socket.on('campaignProgress', (data) => {
            setCampaign(prev => prev ? { ...prev, ...data } : null);
          });
          socket.on('donationReceived', (donation) => {
            setCampaign(prev => {
              if (!prev) return null;
              const recentDonations = prev.recentDonations || [];
              return {
                ...prev,
                recentDonations: [donation, ...recentDonations].slice(0, 10)
              };
            });
          });
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const handleCampaignCreated = (newCampaign) => {
    setCampaign(newCampaign);
    setShowCreate(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await api.updateCampaignStatus(campaign._id || campaign.id, newStatus);
      setCampaign(response.campaign || { ...campaign, status: newStatus });
      setShowSettings(false);
      setNotification({ message: `Campaign status updated to ${newStatus}`, type: 'success' });
    } catch (error) {
      console.error("Status update error:", error);
      setNotification({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleWithdrawal = () => {
    if (campaign.raisedAmount <= 0) {
      setNotification({ message: 'No funds available for withdrawal yet.', type: 'error' });
      return;
    }
    setNotification({ 
      message: 'Withdrawal request submitted! Our team will verify and process it within 24-48 hours.', 
      type: 'success' 
    });
  };

  if (showCreate) {
    return <CreateCampaign onPublish={handleCampaignCreated} onCancel={() => setShowCreate(false)} />;
  }

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>Loading impact...</div>
    </div>
  );

  if (!campaign) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>No campaigns found for this account.</div>
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary">Create Campaign</button>
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
            <button onClick={() => setShowSettings(true)} className="btn btn-primary">Campaign Settings</button>
            <button onClick={onLogout} style={{ fontSize: '1rem', fontWeight: 800, opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Logout</button>
          </div>
        </header>

        {notification && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}

        {showSettings && (
          <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: '2rem' }}>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>Campaign Settings</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Update the status of your active campaign.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => handleUpdateStatus('active')} className="btn btn-outline" style={{ border: campaign.status === 'active' ? '2px solid var(--primary)' : '1px solid var(--border)' }}>Set Active</button>
                <button onClick={() => handleUpdateStatus('inactive')} className="btn btn-outline" style={{ border: campaign.status === 'inactive' ? '2px solid var(--primary)' : '1px solid var(--border)' }}>Set Inactive</button>
                <button onClick={() => handleUpdateStatus('completed')} className="btn btn-outline" style={{ border: campaign.status === 'completed' ? '2px solid var(--primary)' : '1px solid var(--border)' }}>Mark Completed</button>
                <button onClick={() => setShowSettings(false)} className="btn btn-link" style={{ marginTop: '1.5rem', fontWeight: 800 }}>Close</button>
              </div>
            </div>
          </div>
        )}

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '8rem' }}>
          <div style={{ padding: '2.5rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white', minWidth: 0, overflow: 'hidden' }}>
            <span className="label-muted">Total Raised</span>
            <div className="stat-value" style={{ color: 'var(--primary)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>₦{campaign.raisedAmount.toLocaleString()}</div>
            <div className="label-massive" style={{ fontSize: '0.75rem' }}>from {campaign.donorCount} donors</div>
          </div>
          <div style={{ padding: '2.5rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white', minWidth: 0, overflow: 'hidden' }}>
            <span className="label-muted">Status</span>
            <div className="stat-value" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>{campaign.status === 'active' ? '02' : '--'}</div>
            <div className="label-massive" style={{ fontSize: '0.75rem' }}>{campaign.status === 'active' ? 'Days Left' : 'Campaign Inactive'}</div>
          </div>
          <div style={{ padding: '2.5rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white', minWidth: 0, overflow: 'hidden' }}>
            <span className="label-muted">Still Needed</span>
            <div className="stat-value" style={{ color: needed <= 0 ? 'var(--primary)' : '#DC2626', fontSize: 'clamp(2rem, 5vw, 3.5rem)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>₦{Math.max(0, needed).toLocaleString()}</div>
            <div className="label-massive" style={{ fontSize: '0.75rem' }}>to reach ₦{campaign.targetAmount.toLocaleString()} goal</div>
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

        {/* <section style={{ backgroundColor: '#f8fafc', padding: '4rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {campaign.recentDonations && campaign.recentDonations.length > 0 ? (
              campaign.recentDonations.map((d, i) => (
                <div key={i} className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{d.donorName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(d.date).toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>₦{d.amount.toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No donations received yet.</div>
            )}
          </div>
        </section> */}

        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
          <button onClick={handleWithdrawal} className="btn btn-primary btn-lg" style={{ minWidth: '320px' }}>
            Request Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}
