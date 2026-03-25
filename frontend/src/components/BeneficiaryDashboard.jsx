import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import CreateCampaign from './CreateCampaign';
import Notification from './Notification';

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

  // Socket.IO for real-time updates
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
      <div className="container" style={{ padding: '6rem 1.5rem 8rem' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.5rem' }}>
              Hello, {user?.name || 'Beneficiary'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Campaign: {activeCampaign.title}</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button onClick={() => setShowSettings(true)} className="btn btn-primary">
              Campaign Settings
            </button>
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
          </div>
        </header>

        {/* Notifications */}
        {notification && (
          <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
        )}

        {/* Settings Modal */}
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
              backdropFilter: 'blur(4px)',
              padding: '2rem'
            }}
          >
            <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>Campaign Settings</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Update the status of your campaign.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleUpdateStatus('active')}
                  className="btn btn-outline"
                  style={{
                    border: activeCampaign.status === 'active' ? '2px solid var(--primary)' : '1px solid var(--border)'
                  }}
                >
                  ✓ Set Active
                </button>
                <button
                  onClick={() => handleUpdateStatus('inactive')}
                  className="btn btn-outline"
                  style={{
                    border: activeCampaign.status === 'inactive' ? '2px solid var(--primary)' : '1px solid var(--border)'
                  }}
                >
                  — Set Inactive
                </button>
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  className="btn btn-outline"
                  style={{
                    border: activeCampaign.status === 'completed' ? '2px solid var(--primary)' : '1px solid var(--border)'
                  }}
                >
                  ✓✓ Mark Completed
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn btn-link"
                  style={{ marginTop: '1.5rem', fontWeight: 800 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '8rem' }}>
          <div style={{ padding: '2.5rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white' }}>
            <span className="label-muted">Total Raised</span>
            <div className="stat-value" style={{ color: 'var(--primary)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
              ₦{activeCampaign.raisedAmount.toLocaleString()}
            </div>
            <div className="label-massive" style={{ fontSize: '0.75rem' }}>
              from {activeCampaign.donorCount || 0} donors
            </div>
          </div>

          <div style={{ padding: '2.5rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white' }}>
            <span className="label-muted">Campaign Status</span>
            <div className="stat-value" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
              {activeCampaign.status === 'active' ? '✓ Active' : activeCampaign.status === 'completed' ? '✓✓ Done' : '—'}
            </div>
            <div className="label-massive" style={{ fontSize: '0.75rem' }}>
              {activeCampaign.status}
            </div>
          </div>

          <div style={{ padding: '2.5rem 2rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'white' }}>
            <span className="label-muted">Still Needed</span>
            <div
              className="stat-value"
              style={{
                color: needed <= 0 ? 'var(--primary)' : '#DC2626',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                marginBottom: '1rem'
              }}
            >
              ₦{needed.toLocaleString()}
            </div>
            <div className="label-massive" style={{ fontSize: '0.75rem' }}>
              to reach ₦{activeCampaign.targetAmount.toLocaleString()} goal
            </div>
          </div>
        </section>

        {/* Main Grid: Progress + Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6rem' }} className="dashboard-grid">
          <style>{`
            @media (min-width: 1024px) {
              .dashboard-grid { grid-template-columns: 1fr 1fr !important; }
            }
          `}</style>

          {/* Progress Section */}
          <section>
            <h3 className="underline-accent" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>
              Progress to Goal
            </h3>
            <div style={{ background: 'white', padding: '4rem', border: '1px solid var(--border)', borderRadius: '4px', textAlign: 'center' }}>
              <div className="stat-value" style={{ fontSize: '5rem', marginBottom: '2rem' }}>
                {Math.min(percent, 100)}%
              </div>
              <div className="progress-bar-thin" style={{ height: '6px', marginBottom: '2rem' }}>
                <div className="progress-fill-thin" style={{ width: `${Math.min(percent, 100)}%`, height: '100%' }} />
              </div>
              <p style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem' }}>
                ₦{needed.toLocaleString()} to completion
              </p>
              {percent >= 100 && <p style={{ color: 'var(--primary)', fontWeight: 800 }}>🎉 Goal Reached!</p>}
            </div>
          </section>

          {/* Recent Activity Section */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h3 className="underline-accent" style={{ fontSize: '1.5rem' }}>
                Recent Donations
              </h3>
              {isLive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>
                  <span className="pulse-dot" style={{ margin: 0 }}></span> LIVE
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {recentDonations && recentDonations.length > 0 ? (
                recentDonations.map((donation, idx) => (
                  <div
                    key={idx}
                    className="fade-in"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '1.5rem',
                      borderBottom: '1px solid var(--border)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background: '#EEE',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800
                        }}
                      >
                        {(donation.donorName || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          {donation.donorName || 'Anonymous Donor'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(donation.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                      ₦{(donation.amount || 0).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No donations yet. Share your campaign!
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Withdrawal CTA */}
        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
          <button onClick={handleWithdrawal} className="btn btn-primary btn-lg" style={{ minWidth: '320px' }}>
            Request Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}