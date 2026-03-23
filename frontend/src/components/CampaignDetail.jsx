import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function CampaignDetail({ campaignId, onDonate }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data.
    api.getCampaigns().then(data => {
      setCampaign(data.find(c => c.id === campaignId) || data[0]);
      setLoading(false);
    });
  }, [campaignId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading story...</div>;

  return (
    <div className="fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
        {/* Story Section */}
        <div>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Large Campaign Image</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>{campaign.title}</h2>
          <div style={{ fontSize: '1.125rem', lineHeight: '1.7', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>
              This campaign was started to address a critical healthcare need. Every donation goes directly to the hospital 
              to ensure that {campaign.title.split('for')[1] || 'the patient'} receives the best possible care.
            </p>
            <p>
              Healthcare in our region often faces funding gaps that can be life-threatening. Through ImpactBridge, 
              we bridge that gap by connecting generous donors like you with verified medical cases.
            </p>
            <p style={{ fontStyle: 'italic', borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem', margin: '1rem 0' }}>
              "Your contribution isn't just a payment; it's a lifeline. We thank you for being the bridge to a healthier future."
            </p>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Recent Donors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                      {['A', 'C', 'O'][i-1]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{['Anonymous', 'Chidi', 'Omotola'][i-1]}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{i} hour ago</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>₦{(i * 5000).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ marginBottom: '2rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--primary)' }}>₦{campaign.current_amount.toLocaleString()}</span>
                  <span style={{ color: 'var(--text-muted)' }}>of ₦{campaign.goal_amount.toLocaleString()}</span>
                </div>
                <div style={{ height: '14px', background: 'var(--surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(campaign.current_amount / campaign.goal_amount) * 100}%`, 
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    transition: 'width 1s ease-out'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                   <span style={{ fontWeight: 600 }}>{campaign.donor_count} Donors</span>
                   <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{Math.round((campaign.current_amount / campaign.goal_amount) * 100)}% Reached</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button className="btn btn-outline" onClick={() => onDonate(5000)}>₦5,000</button>
                <button className="btn btn-outline" onClick={() => onDonate(10000)}>₦10,000</button>
                <button className="btn btn-outline" onClick={() => onDonate(20000)}>₦20,000</button>
                <button className="btn btn-outline" onClick={() => onDonate(50000)}>₦50,000</button>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600 }}>₦</span>
                <input 
                  type="number" 
                  placeholder="Custom Amount" 
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)' }}
                />
              </div>
              <button className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.125rem' }} onClick={() => onDonate()}>
                Save a Life Now
              </button>
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Direct transfers verified via Interswitch Safetoken.
            </p>
          </div>

          <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ fontSize: '1.5rem' }}>🏥</div>
             <div>
               <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Verified Beneficiary</div>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>St. Nicholas Hospital, Lagos</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
