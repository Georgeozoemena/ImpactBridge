import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CampaignDetail({ onDonate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const [campaignData, donationsData] = await Promise.all([
          api.getCampaignById(id),
          // We'll use a direct call for donations if not in api service yet
          // Actually, let's assume api instance can be used or add it to api service
          api.getCampaigns().then(all => all.find(c => (c._id || c.id) === id)) // Fallback if direct get fails
        ]);
        
        // Correcting the fetch logic to use the real backend response
        const responseData = await api.getCampaignById(id);
        const data = responseData.campaign || responseData;
        setCampaign(data);
        
        // Fetch recent donations if endpoint exists
        try {
          // This should be in api.js but for now:
          // const res = await api.getRecentDonations(id);
          // setRecentDonations(res);
        } catch (e) {
          console.error("Donations fetch error:", e);
        }

      } catch (error) {
        console.error("Failed to fetch campaign details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();

    // Socket integration for real-time updates
    const socket = api.connectSocket(id);
    
    socket.on('campaignProgress', (data) => {
      if (data.campaignId === id) {
        setCampaign(prev => prev ? { ...prev, ...data } : null);
      }
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

    return () => {
      socket.off('campaignProgress');
      socket.off('donationReceived');
    };
  }, [id]);

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>Loading...</div>
    </div>
  );

  if (!campaign) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Campaign not found.</div>
      <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => navigate('/')}>Return Home</button>
    </div>
  );

  const raised = campaign.raisedAmount || campaign.current_amount || 0;
  const target = campaign.targetAmount || campaign.goal_amount || 1;
  const percent = Math.round((raised / target) * 100);

  return (
    <div className="fade-in">
      <div 
        className="hero-full" 
        style={{ backgroundImage: `url(${campaign.imageUrl || campaign.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'})`, height: 'clamp(300px, 40vh, 500px)', alignItems: 'flex-end' }}
      >
        <div className="container" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
          <button 
            onClick={() => navigate('/')}
            style={{ position: 'absolute', top: '-180px', left: '0', background: 'white', width: '40px', height: '40px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, cursor: 'pointer' }}
          >
            ←
          </button>
          <h2 className="hero-text" style={{ paddingBottom: '2rem', maxWidth: '800px' }}>{campaign.title}</h2>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 1.5rem 8rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'start' }} className="campaign-grid">
          <style>{`
            @media (min-width: 1024px) {
              .campaign-grid { grid-template-columns: 1.5fr 1fr !important; }
            }
          `}</style>
          
          <div className="campaign-story">
            <div className="pill-urgency" style={{ marginBottom: '2rem' }}>{campaign.urgency || 'Active Needs'}</div>
            <p style={{ fontSize: '1.25rem', lineHeight: 2, color: 'var(--text-main)', marginBottom: '3rem' }}>
              {campaign.description}
            </p>

            <section>
              <h3 className="underline-accent" style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}>Transparency & Impact</h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
                At ImpactBridge, we ensure that every donation is tied directly to a verified medical need. Our platform provides the transparency and goal-oriented tracking that traditional bank transfers cannot offer.
              </p>
              
              {/* Optional: Add recent donations list here if we have data */}
            </section>
          </div>

          <aside className="campaign-actions" style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ background: 'white', padding: '4rem 3rem', border: '1px solid var(--border)', borderRadius: '4px' }}>
              <div style={{ marginBottom: '4rem' }}>
                <span className="label-muted">Raised so far</span>
                <div className="stat-value" style={{ color: 'var(--primary)', marginBottom: '1rem' }}>₦{raised.toLocaleString()}</div>
                <div style={{ fontSize: '1.125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target: ₦{target.toLocaleString()}</div>
              </div>

              <div className="progress-bar-thin" style={{ marginBottom: '2rem', height: '6px' }}>
                <div className="progress-fill-thin" style={{ width: `${Math.min(percent, 100)}%`, height: '100%' }} />
              </div>
              
              <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4rem', color: 'var(--text-main)' }}>
                 {campaign.donorCount || campaign.donor_count || 0} supporters have joined
              </div>

              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => onDonate(campaign._id || campaign.id)}>
                Donate — Save a Life
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
