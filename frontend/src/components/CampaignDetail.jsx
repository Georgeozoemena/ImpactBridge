import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function CampaignDetail({ campaignId, onDonate }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCampaigns().then(data => {
      setCampaign(data.find(c => c.id === campaignId) || data[0]);
      setLoading(false);
    });
  }, [campaignId]);

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
       <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading story...</div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '6rem' }}>
          <div>
            <div style={{ background: '#F5F5F5', borderRadius: 'var(--radius-lg)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAA', fontWeight: 700, fontSize: '1.5rem' }}>Primary Visual</div>
            </div>
            
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Medical Campaign</span>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '1rem 0 2rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>{campaign.title}</h2>
            
            <div style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p>
                This campaign was established to address an immediate and critical healthcare necessity. Our mission is to ensure that medical resources are directed precisely where they are needed most. 
              </p>
              <p>
                Every contribution through ImpactBridge is tracked in real-time and delivered directly to verified healthcare providers. We believe in transparency as the foundation of trust in philanthropy.
              </p>
              <div style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '2.5rem', margin: '2.5rem 0', fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.4 }}>
                "Your contribution is a direct investment in a human life. We are honor-bound to ensure it reaches its goal."
              </div>
              <p>
                Join us in building a future where quality care is not a privilege, but a promise kept to every member of our community. 
              </p>
            </div>

            <div style={{ marginTop: '5rem', paddingTop: '4rem', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>Recent Supporters</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ width: '48px', height: '48px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                        {['A', 'C', 'O'][i-1]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{['Anonymous donor', 'Chidi O.', 'Omotola A.'][i-1]}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{i} hour{i > 1 ? 's' : ''} ago</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>₦{(i * 5000).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
            <div className="card" style={{ padding: '3.5rem', boxShadow: 'var(--shadow-lg)', border: 'none', background: 'var(--surface)' }}>
              <div style={{ marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.25rem', fontWeight: 800 }}>
                    <span>₦{campaign.current_amount.toLocaleString()} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.85rem' }}>raised</span></span>
                  </div>
                  <div style={{ height: '6px', background: '#F0F0F0', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(campaign.current_amount / campaign.goal_amount) * 100}%`, 
                      background: 'var(--secondary)',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                     <span>{campaign.donor_count} Supporters</span>
                     <span style={{ color: 'var(--primary-dark)' }}>{Math.round((campaign.current_amount / campaign.goal_amount) * 100)}% Reached</span>
                  </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => onDonate(5000)}>₦5,000</button>
                  <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => onDonate(10000)}>₦10,000</button>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800 }}>₦</span>
                  <input 
                    type="number" 
                    placeholder="Custom Amount" 
                    style={{ width: '100%', padding: '1.25rem 1.5rem 1.25rem 2.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--background)', fontWeight: 600 }}
                  />
                </div>
                <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} onClick={() => onDonate()}>
                  Support This Cause
                </button>
              </div>

              <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                Direct transfers verified via Interswitch Safetoken. <br /> 100% of funds go to the beneficiary.
              </p>
            </div>

            <div className="card" style={{ marginTop: '2.5rem', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
               <div style={{ fontSize: '2rem' }}>🏥</div>
               <div>
                 <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Verified Beneficiary</div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>St. Nicholas Hospital, Lagos</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
