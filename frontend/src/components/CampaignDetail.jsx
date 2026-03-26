import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CampaignDetail({ onDonate, onBack }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch campaign details
        const campaignResponse = await api.getCampaignById(id);
        const campaignData = campaignResponse.campaign || campaignResponse;
        setCampaign(campaignData);

        // Fetch recent donations for this campaign
        try {
          const donationsResponse = await api.getRecentDonations(id, 10);
          const donations = donationsResponse.recentDonations || donationsResponse.data?.recentDonations || [];
          setRecentDonations(donations);
        } catch (donationErr) {
          console.warn('Failed to fetch recent donations:', donationErr);
          // Don't fail the whole page if donations fail
        }
      } catch (err) {
        console.error('Failed to fetch campaign:', err);
        setError('Campaign not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaignData();
    }

    // Socket.IO integration for real-time updates
    const socket = api.connectSocket(id);

    socket.on('campaignProgress', (data) => {
      if (data.campaignId === id) {
        setCampaign((prev) =>
          prev
            ? {
                ...prev,
                raisedAmount: data.raisedAmount,
                donorCount: data.donorCount,
                percentComplete: data.percentComplete
              }
            : null
        );
      }
    });

    socket.on('donationReceived', (donation) => {
      setRecentDonations((prev) => {
        const updated = [donation, ...prev].slice(0, 10);
        return updated;
      });
    });

    return () => {
      socket.off('campaignProgress');
      socket.off('donationReceived');
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
          Loading campaign...
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {error || 'Campaign not found'}
        </div>
        <button
          className="btn btn-outline"
          style={{ marginTop: '2rem' }}
          onClick={() => (onBack ? onBack() : navigate('/'))}
        >
          Return Home
        </button>
      </div>
    );
  }

  const campId = campaign._id || campaign.id;
  const localImages = JSON.parse(localStorage.getItem(`campaign_images_${campId}`) || '[]');
  const localBeneficiary = localStorage.getItem(`campaign_beneficiary_${campId}`);
  const beneficiaryDisplay = campaign.beneficiaryName || localBeneficiary;
  const displayImage = localImages.length > 0 ? localImages[0] : (campaign.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200');

  const raised = campaign.raisedAmount || 0;
  const target = campaign.targetAmount || 1;
  const percent = Math.round((raised / target) * 100);
  const donorCount = campaign.donorCount || 0;

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div
        className="hero-full"
        style={{
          backgroundImage: `url(${displayImage})`,
          height: 'clamp(300px, 40vh, 500px)',
          alignItems: 'flex-end'
        }}
      >
        <div className="container" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
          <button
            onClick={() => (onBack ? onBack() : navigate('/'))}
            style={{
              position: 'absolute',
              top: '-180px',
              left: '0',
              background: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            ←
          </button>
          <div style={{ paddingBottom: '2rem', maxWidth: '800px' }}>
            {beneficiaryDisplay && (
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', background: 'white', padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '1rem', display: 'inline-block' }}>
                For: {beneficiaryDisplay}
              </span>
            )}
            <h2 className="hero-text">
              {campaign.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '4rem 1.5rem 8rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'start' }} className="campaign-grid">
          <style>{`
            @media (min-width: 1024px) {
              .campaign-grid { grid-template-columns: 1.5fr 1fr !important; }
            }
          `}</style>

          {/* Campaign Story */}
          <div className="campaign-story">
            <div className="pill-urgency" style={{ marginBottom: '2rem' }}>
              {campaign.status === 'active' ? '🔴 Active' : '⚫ ' + campaign.status}
            </div>
            <p style={{ fontSize: '1.25rem', lineHeight: 2, color: 'var(--text-main)', marginBottom: '3rem' }}>
              {campaign.description}
            </p>

            <section>
              <h3 className="underline-accent" style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}>
                Transparency & Impact
              </h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
                At ImpactBridge, we ensure that every donation is tied directly to a verified health need. Our platform provides
                the transparency and goal-oriented tracking that traditional bank transfers cannot offer. See real-time updates
                as funds arrive and progress toward the goal.
              </p>
            </section>

            {/* Recent Donations */}
            {recentDonations.length > 0 && (
              <section style={{ marginTop: '4rem' }}>
                <h3 className="underline-accent" style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}>
                  Recent Supporters
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {recentDonations.map((donation, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                          {donation.donorName || 'Anonymous Donor'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(donation.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--primary)' }}>
                        ₦{(donation.amount || 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Donation Card */}
          <aside className="campaign-actions" style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ background: 'white', padding: '4rem 3rem', border: '1px solid var(--border)', borderRadius: '4px' }}>
              {/* Amount Raised */}
              <div style={{ marginBottom: '4rem' }}>
                <span className="label-muted">Raised so far</span>
                <div className="stat-value" style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                  ₦{raised.toLocaleString()}
                </div>
                <div style={{ fontSize: '1.125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Goal: ₦{target.toLocaleString()}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-thin" style={{ marginBottom: '2rem', height: '6px' }}>
                <div
                  className="progress-fill-thin"
                  style={{
                    width: `${Math.min(percent, 100)}%`,
                    height: '100%'
                  }}
                />
              </div>

              {/* Donor Count */}
              <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4rem', color: 'var(--text-main)' }}>
                {donorCount} supporters have joined
              </div>

              {/* Donate Button */}
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '1rem' }}
                onClick={() => onDonate(campaign._id || campaign.id)}
              >
                Donate — Save a Life
              </button>

              <button
                className="btn btn-outline btn-lg"
                style={{ width: '100%' }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: campaign.title,
                      text: `Help support this campaign: ${campaign.title}`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
              >
                Support — Share Cause
              </button>

              {/* Goal Completion Message */}
              {percent >= 100 && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '4px', textAlign: 'center', color: '#22c55e', fontWeight: 800 }}>
                  ✓ Goal Reached!
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}