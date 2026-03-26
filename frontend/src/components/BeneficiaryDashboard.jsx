import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import CreateCampaign from './CreateCampaign';
import Notification from './Notification';
import { parseBeneficiaryName } from '../utils/visuals';

export default function BeneficiaryDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all campaigns
        const response = await api.getCampaigns();
        const campaignList = response.campaigns || response.data?.campaigns || (Array.isArray(response) ? response : []);

        // Filter campaigns created by this user
        const myCampaigns = campaignList.filter((c) => c.createdBy === user._id || c.createdBy === user.id);

        if (myCampaigns.length === 0) {
          setCampaigns([]);
          setActiveCampaign(null);
          setLoading(false);
          return;
        }

        setCampaigns(myCampaigns);

        // Fetch full details of the first campaign
        const firstCampaign = myCampaigns[0];
        const campaignDetailsResponse = await api.getCampaignById(firstCampaign._id || firstCampaign.id);
        const fullData = campaignDetailsResponse.campaign || campaignDetailsResponse;
        setActiveCampaign(fullData);

        // Fetch recent donations for this campaign
        try {
          const donationsResponse = await api.getRecentDonations(firstCampaign._id || firstCampaign.id, 10);
          const donations = donationsResponse.recentDonations || donationsResponse.data?.recentDonations || [];
          setRecentDonations(donations);
        } catch (donationErr) {
          console.warn('Failed to fetch recent donations:', donationErr);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setNotification({
          message: 'Failed to load your campaign',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user._id, user.id]);

  useEffect(() => {
    if (!activeCampaign) return;

    const socket = api.connectSocket(activeCampaign._id || activeCampaign.id);
    setIsLive(true);

    // Campaign progress update
    socket.on('campaignProgress', (data) => {
      if (data.campaignId === (activeCampaign._id || activeCampaign.id)) {
        setActiveCampaign((prev) =>
          prev
            ? {
                ...prev,
                raisedAmount: data.raisedAmount,
                targetAmount: data.targetAmount,
                donorCount: data.donorCount,
                percentComplete: data.percentComplete
              }
            : null
        );
      }
    });

    // New donation received
    socket.on('donationReceived', (donation) => {
      setRecentDonations((prev) => {
        const updated = [donation, ...prev].slice(0, 10);
        return updated;
      });

      // Show notification
      setNotification({
        message: `${donation.donorName || 'Someone'} just donated ₦${(donation.amount || 0).toLocaleString()}!`,
        type: 'success'
      });

      // Update campaign stats
      setActiveCampaign((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          raisedAmount: (prev.raisedAmount || 0) + (donation.amount || 0),
          donorCount: (prev.donorCount || 0) + 1
        };
      });
    });

    return () => {
      socket.off('campaignProgress');
      socket.off('donationReceived');
    };
  }, [activeCampaign?._id, activeCampaign?.id]);

  const handleCampaignCreated = (newCampaign) => {
    setCampaigns([...campaigns, newCampaign]);
    setActiveCampaign(newCampaign);
    setShowCreate(false);
    setNotification({
      message: 'Campaign created successfully!',
      type: 'success'
    });
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!activeCampaign) return;

    try {
      const response = await api.updateCampaignStatus(activeCampaign._id || activeCampaign.id, newStatus);
      const updatedCampaign = response.campaign || { ...activeCampaign, status: newStatus };
      setActiveCampaign(updatedCampaign);
      setShowSettings(false);
      setNotification({
        message: `Campaign status updated to ${newStatus}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Status update error:', error);
      setNotification({
        message: error.response?.data?.message || 'Failed to update status',
        type: 'error'
      });
    }
  };

  const handleWithdrawal = () => {
    if (!activeCampaign || activeCampaign.raisedAmount <= 0) {
      setNotification({
        message: 'No funds available for withdrawal yet.',
        type: 'error'
      });
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

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>Loading your campaigns...</div>
      </div>
    );
  }

  if (!activeCampaign) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          No campaigns found. Create one to get started!
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button onClick={() => setShowCreate(true)} className="btn btn-primary">
            Create First Campaign
          </button>
          <button onClick={onLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </div>
    );
  }

  const percent = Math.round((activeCampaign.raisedAmount / activeCampaign.targetAmount) * 100);
  const needed = Math.max(0, activeCampaign.targetAmount - activeCampaign.raisedAmount);

  return (
    <div className="fade-in">
      <div className="db-container">
        <header className="db-header">
          <div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>
              Hello, {user?.name || 'Beneficiary'}
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Campaign: {activeCampaign.title}</p>
              {(activeCampaign.beneficiaryName || parseBeneficiaryName(activeCampaign.description)) && (
                <span className="pill-urgency" style={{ background: 'rgba(38, 166, 154, 0.1)', color: 'var(--primary)', fontWeight: 800 }}>
                  For: {activeCampaign.beneficiaryName || parseBeneficiaryName(activeCampaign.description)}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <button onClick={() => setShowCreate(true)} className="btn btn-primary">
              + Create New
            </button>
            <button onClick={() => setShowSettings(true)} className="btn btn-outline">
              Settings
            </button>
            <button
              onClick={onLogout}
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '1rem',
                textDecoration: 'underline'
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {notification && (
          <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
        )}

        {showSettings && (
          <div
            className="fade-in"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              padding: '2rem'
            }}
          >
            <div className="db-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>Campaign Settings</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Update the status of your campaign.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleUpdateStatus('active')}
                  className="btn btn-outline"
                  style={{
                    border: activeCampaign.status === 'active' ? '2.2px solid var(--primary-vibrant)' : '1px solid var(--border)'
                  }}
                >
                  ✓ Set Active
                </button>
                <button
                  onClick={() => handleUpdateStatus('inactive')}
                  className="btn btn-outline"
                  style={{
                    border: activeCampaign.status === 'inactive' ? '2.2px solid var(--primary-vibrant)' : '1px solid var(--border)'
                  }}
                >
                  — Set Inactive
                </button>
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  className="btn btn-outline"
                  style={{
                    border: activeCampaign.status === 'completed' ? '2.2px solid var(--primary-vibrant)' : '1px solid var(--border)'
                  }}
                >
                  ✓✓ Mark Completed
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn btn-link"
                  style={{ marginTop: '1.5rem', fontWeight: 800, color: 'var(--text-main)', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="db-stats-grid">
          <div className="db-card">
            <span className="label-muted">Total Raised</span>
            <div className="stat-value" style={{ color: 'var(--primary-vibrant)', marginBottom: '0.5rem', fontSize: '3rem' }}>
              ₦{activeCampaign.raisedAmount.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              from {activeCampaign.donorCount || 0} supporters
            </div>
          </div>

          <div className="db-card">
            <span className="label-muted">Campaign Status</span>
            <div className="stat-value" style={{ marginBottom: '0.5rem', fontSize: '3rem' }}>
              {activeCampaign.status === 'active' ? '✓ Active' : activeCampaign.status === 'completed' ? '✓✓ Done' : '—'}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Current state: <span style={{ textTransform: 'capitalize' }}>{activeCampaign.status}</span>
            </div>
          </div>

          <div className="db-card">
            <span className="label-muted">Still Needed</span>
            <div
              className="stat-value"
              style={{
                color: needed <= 0 ? 'var(--primary-vibrant)' : '#DC2626',
                marginBottom: '0.5rem',
                fontSize: '3rem'
              }}
            >
              ₦{needed.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Goal: ₦{activeCampaign.targetAmount.toLocaleString()}
            </div>
          </div>
        </section>

        <div className="db-main-grid">
          <section className="db-card" style={{ textAlign: 'center', padding: '5rem 3rem' }}>
            <h3 className="underline-accent" style={{ fontSize: '1.25rem', marginBottom: '4rem', display: 'inline-block' }}>
              Impact Momentum
            </h3>
            <div style={{ position: 'relative', marginBottom: '3rem' }}>
              <div className="stat-value" style={{ fontSize: '8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)', lineHeight: 1 }}>
                {Math.min(percent, 100)}%
              </div>
            </div>
            <div className="progress-bar-thin" style={{ height: '12px', background: '#F2F5F8', borderRadius: 'var(--radius-pill)', marginBottom: '2.5rem', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${Math.min(percent, 100)}%`, 
                  height: '100%', 
                  background: 'var(--primary-vibrant)',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} 
              />
            </div>
            <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              ₦{needed.toLocaleString()} remaining to hit target
            </p>
            {percent >= 100 && (
              <div className="fade-in" style={{ color: 'var(--primary-vibrant)', fontWeight: 900, marginTop: '1.5rem', fontSize: '1.2rem' }}>
                🎉 GOAL ACHIEVED
              </div>
            )}
          </section>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h3 className="underline-accent" style={{ fontSize: '1.5rem' }}>
                Recent Donations
              </h3>
              {isLive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-vibrant)' }}>
                  <span className="pulse-dot" style={{ margin: 0 }}></span> LIVE
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentDonations && recentDonations.length > 0 ? (
                recentDonations.map((donation, idx) => (
                  <div key={idx} className="db-list-item">
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div className="avatar-md">
                        {(donation.donorName || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          {donation.donorName || 'Anonymous Donor'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(donation.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-vibrant)' }}>
                      ₦{(donation.amount || 0).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="db-card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>
                  No donations yet. Share your campaign to start receiving support!
                </div>
              )}
            </div>
          </section>
        </div>

        <div style={{ marginTop: '10rem', textAlign: 'center' }}>
          <button onClick={handleWithdrawal} className="btn btn-primary btn-lg" style={{ minWidth: '340px', padding: '1.5rem' }}>
            Request Funds Withdrawal
          </button>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Withdrawals are processed every Tuesday and Thursday.
          </p>
        </div>
      </div>
    </div>
  );
}