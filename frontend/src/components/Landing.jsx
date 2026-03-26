import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { api } from '../services/api';
import { getHealthFallback, parseBeneficiaryName } from '../utils/visuals';

export default function Landing({ onDonate, onStartCampaign }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickerIndex, setTickerIndex] = useState(0);
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const visualsRef = useRef(null);

  const activities = [
    { name: 'Ayo', amount: '2,000', context: "Chioma's Surgery" },
    { name: 'Grace', amount: '15,000', context: "The General Fund" },
    { name: 'Anonymous', amount: '5,000', context: "Baby Tunde" }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5
      });

      gsap.from('.visual-reveal', {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.75)',
        delay: 0.8
      });

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to('.hero-main-img', { x: xPos * 0.5, y: yPos * 0.5, duration: 1 });
        gsap.to('.float-top-right', { x: xPos * 1.5, y: yPos * 1.5, duration: 1.2 });
        gsap.to('.float-bottom-left', { x: -xPos * 2, y: -yPos * 2, duration: 1.4 });
        gsap.to('.float-mid-left', { x: xPos, y: -yPos, duration: 1.1 });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.getCampaigns();
        const campaignList = response.campaigns || response.data?.campaigns || (Array.isArray(response) ? response : []);
        setCampaigns(campaignList);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();

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
      <section ref={heroRef} style={{ position: 'relative', overflow: 'hidden', padding: 'var(--section-spacing) 0 4rem' }}>
        <div className="mesh-gradient"></div>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="hero-reveal status-chip" style={{ width: 'fit-content', marginBottom: '1.5rem', display: 'block' }}>
                Verified Medical Crowdfunding
              </span>
              <h1 className="hero-reveal hero-heading">
                Turn Payments Into <span style={{ color: 'var(--primary-vibrant)' }}>Impact</span> for Health Cause
              </h1>
              <p className="hero-reveal hero-subtext">
                ImpactBridge removes the middleman between compassion and care. Directly fund surgeries and treatments for Nigerians in need with 100% transparency.
              </p>
            <div className="hero-actions hero-reveal">
              <button className="btn btn-primary btn-lg" onClick={() => onDonate()}>Donate Now</button>
              <button className="btn btn-outline btn-lg" onClick={onStartCampaign}>Start a Campaign</button>
            </div>
              <div className="hero-reveal" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', marginLeft: '-10px', background: '#EEE', overflow: 'hidden' }}>
                      <img src={`https://i.pravatar.cc/100?u=${3}`} alt="user" />
                    </div>
                  ))}
                </div>
                <span>Joined by 12,000+ donors this month</span>
              </div>
            </div>

            <div className="visual-reveal floating-container">
              <img
                src="/sick.jpg"
                className="hero-main-img"
                alt="ImpactBridge Beneficiary"
              />

              <div className="floating-element glass-card float-top-right">
                <div className="status-chip" style={{ background: '#E0F2F1', color: '#00695C' }}>Secure</div>
                <span>Verified Case</span>
              </div>

              <div className="floating-element glass-card float-bottom-left" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recent Donation</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>₦150,000</div>
                  <div style={{ height: '4px', width: '100%', background: '#EEE', borderRadius: '2px' }}>
                    <div style={{ width: '70%', height: '100%', background: 'var(--primary-vibrant)', borderRadius: '2px' }}></div>
                  </div>
                </div>
              </div>

              <div className="floating-element glass-card float-mid-left" style={{ borderRadius: '100px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50' }}></div>
                <span>Live Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div style={{ marginBottom: '8rem', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '100px', width: 'fit-content', margin: '0 auto 8rem' }}>
          <span className="pulse-dot"></span>
          <span>{activities[tickerIndex].name} just donated ₦{activities[tickerIndex].amount} to <span style={{ color: 'var(--primary)' }}>{activities[tickerIndex].context}</span></span>
        </div>

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
              const beneficiaryDisplay = camp.beneficiaryName || parseBeneficiaryName(camp.description) || localBeneficiary;
              const displayImage = localImages.length > 0 ? localImages[0] : (camp.imageUrl || getHealthFallback(campId));
              const raisedAmount = camp.raisedAmount || camp.current_amount || 0;
              const targetAmount = camp.targetAmount || camp.goal_amount || 1;
              const percent = Math.round((raisedAmount / targetAmount) * 100);
              const percentCapped = Math.min(percent, 100);

              return (
                <div key={campId} className="card-editorial" onClick={() => navigate(`/campaign/${campId}`)} style={{ cursor: 'pointer', background: 'var(--surface)' }}>
                  <div style={{ height: '280px', background: '#F2F5F8', marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden' }}>
                    <img
                      src={displayImage}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      alt={camp.title}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div className="pill-urgency">{camp.urgency || 'Urgent'}</div>
                    {camp.isVerified && (
                      <div className="pill-urgency" style={{ background: '#eef5f1', color: '#0f5132' }}>Verified</div>
                    )}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800 }}>
                      <span>NGN {raisedAmount.toLocaleString()} raised</span>
                      <span style={{ color: 'var(--primary)' }}>{percentCapped}%</span>
                    </div>
                    <div className="progress-bar-thin" style={{ height: '6px', background: '#E0E4E8', borderRadius: 'var(--radius-pill)', marginBottom: '0.5rem' }}>
                      <div
                        className="progress-fill-thin"
                        style={{
                          width: `${percentCapped}%`,
                          height: '100%',
                          background: 'var(--primary)',
                          borderRadius: 'var(--radius-pill)'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Goal: NGN {targetAmount.toLocaleString()}
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

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', borderTop: '1px solid var(--border)', paddingTop: '8rem', paddingBottom: '10rem' }}>
          <div className="reveal-up">
            <div className="stat-value">
              {campaigns.reduce((acc, c) => acc + (c.donorCount || 0), 0) > 1000 
                ? (campaigns.reduce((acc, c) => acc + (c.donorCount || 0), 0) / 1000).toFixed(1) + 'k' 
                : campaigns.reduce((acc, c) => acc + (c.donorCount || 0), 0)}
            </div>
            <div className="label-massive">Empowered Donors</div>
          </div>
          <div className="reveal-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-value">{campaigns.length}</div>
            <div className="label-massive">Medical Campaigns</div>
          </div>
          <div className="reveal-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-value">
              {campaigns.filter(c => (c.raisedAmount / c.targetAmount) >= 0.5).length}
            </div>
            <div className="label-massive">Lives Impacted</div>
          </div>
        </section>

      </div>

      <section className="bg-dark edge-to-edge" style={{ textAlign: 'center', padding: '8rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '3rem' }}>
            Trusted Transaction Partner
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <img 
              src="/interswitch-white.png" 
              alt="Interswitch" 
              style={{ height: '80px', width: 'auto' }} 
            />
            <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontWeight: 500 }}>
              All donations are securely processed and verified via the <span style={{ color: 'var(--accent-lime)', fontWeight: 800 }}>Interswitch Payment Gateway</span>, ensuring 100% security and real-time fund tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
