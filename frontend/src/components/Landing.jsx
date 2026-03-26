import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Landing({ onDonate, onStartCampaign }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickerIndex, setTickerIndex] = useState(0);
  const navigate = useNavigate();

  const activities = [
    { name: 'Ayo', amount: '2,000', context: "Chioma's Surgery" },
    { name: 'Grace', amount: '15,000', context: "The General Fund" },
    { name: 'Anonymous', amount: '5,000', context: "Baby Tunde" }
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.getCampaigns();
        // Handle both: local mock returning {campaigns: []} 
        // and potential deployed backend structures
        const campaignList = response.campaigns || response.data?.campaigns || (Array.isArray(response) ? response : []);
        setCampaigns(campaignList);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();

    // Socket integration for real-time updates on all campaigns
    const socket = api.connectSocket();
    
    socket.on('campaignProgress', (data) => {
      setCampaigns(prev => prev.map(c => 
        (c._id === data.campaignId || c.id === data.campaignId) 
        ? { ...c, ...data } 
        : c
      ));
    });

    return () => {
      socket.off('campaignProgress');
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in">
      {/* Editorial Hero Section */}
      <section style={{ background: 'var(--background)', padding: '6rem 0 4rem' }}>
        <div className="container">
          <h1 className="editorial-heading" style={{ fontSize: 'clamp(3.5rem, 12vw, 8.5rem)', fontWeight: 900, lineHeight: 0.85, textAlign: 'center', color: 'var(--text-main)', letterSpacing: '-0.05em' }}>
            Turn Payments Into Impact
            <div className="oval-mask">
              <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400" alt="Hope" />
            </div>
            for Health Cause
          </h1>
          <p style={{ textAlign: 'center', width: '100%', maxWidth: '600px', margin: '3rem auto 4rem', fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Every naira you contribute saves a real life. We bridge the gap between verified medical needs and your compassion.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginBottom: '6rem' }}>
            <button className="btn btn-primary btn-lg" onClick={() => onDonate()}>Donate Now</button>
            <button className="btn btn-outline btn-lg" onClick={onStartCampaign}>Start a Campaign</button>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Live Activity Ticker */}
        <div style={{ marginBottom: '8rem', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '100px', width: 'fit-content', margin: '0 auto 8rem' }}>
          <span className="pulse-dot"></span>
          <span>{activities[tickerIndex].name} just donated ₦{activities[tickerIndex].amount} to <span style={{ color: 'var(--primary)' }}>{activities[tickerIndex].context}</span></span>
        </div>

        {/* Horizontal Campaign Slider */}
        <section style={{ marginBottom: '10rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <span className="label-muted">Immediate Needs</span>
              <h2 className="underline-accent" style={{ fontSize: '2.5rem' }}>Active Campaigns</h2>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="nav-btn-circle">←</button>
              <button className="nav-btn-circle">→</button>
            </div>
          </div>
          
          <div className="scroll-slider">
            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', width: '100%' }}>Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', width: '100%' }}>No active campaigns found.</div>
            ) : campaigns.map((camp) => {
              const campId = camp._id || camp.id;
              const localImages = JSON.parse(localStorage.getItem(`campaign_images_${campId}`) || '[]');
              const localBeneficiary = localStorage.getItem(`campaign_beneficiary_${campId}`);
              const beneficiaryDisplay = camp.beneficiaryName || localBeneficiary;
              const displayImage = localImages.length > 0 ? localImages[0] : (camp.imageUrl || `https://picsum.photos/seed/${campId}/800/600`);

              return (
                <div key={campId} className="card-editorial" onClick={() => navigate(`/campaign/${campId}`)} style={{ cursor: 'pointer' }}>
                  <div style={{ height: '300px', background: '#EEE', marginBottom: '2rem', borderRadius: '4px', overflow: 'hidden' }}>
                    <img 
                      src={displayImage} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      alt={camp.title} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="pill-urgency">{camp.urgency || 'Urgent'}</div>
                    {beneficiaryDisplay && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>For: {beneficiaryDisplay}</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', lineHeight: 1.2 }}>{camp.title}</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>The Narrative</span>
                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '0', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {camp.description}
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
                    <span>Goal: ₦{(camp.targetAmount || camp.goal_amount || 0).toLocaleString()}</span>
                    {camp.deadline && (
                      <span style={{ color: 'var(--text-muted)' }}>Ends: {new Date(camp.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="progress-bar-thin" style={{ height: '4px', marginBottom: '1rem' }}>
                    <div className="progress-fill-thin" style={{ width: `${Math.min(((camp.raisedAmount || camp.current_amount || 0) / (camp.targetAmount || camp.goal_amount || 1)) * 100, 100)}%`, height: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                    <span>₦{(camp.raisedAmount || camp.current_amount || 0).toLocaleString()} raised</span>
                    <span style={{ color: 'var(--primary)' }}>{Math.round(((camp.raisedAmount || camp.current_amount || 0) / (camp.targetAmount || camp.goal_amount || 1)) * 100)}%</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 2, padding: '1rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDonate(camp._id || camp.id);
                    }}
                  >
                    Donate
                  </button>
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 1, padding: '1rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = `${window.location.origin}/campaign/${camp._id || camp.id}`;
                      if (navigator.share) {
                        navigator.share({
                          title: camp.title,
                          text: `Help support this campaign: ${camp.title}`,
                          url: url
                        });
                      } else {
                        navigator.clipboard.writeText(url);
                        alert('Link copied to clipboard!');
                      }
                    }}
                  >
                    Share
                  </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Massive Global Stats */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', borderTop: '1px solid var(--border)', paddingTop: '8rem', paddingBottom: '10rem' }}>
          <div className="reveal-up">
            <div className="stat-value">12.4k</div>
            <div className="label-massive">Empowered Donors</div>
          </div>
          <div className="reveal-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-value">850</div>
            <div className="label-massive">Medical Campaigns</div>
          </div>
          <div className="reveal-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-value">2.1k</div>
            <div className="label-massive">Lives Saved Today</div>
          </div>
        </section>
      </div>
    </div>
  );
}
