import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function CampaignExplorer({ onDonate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCampaigns().then(data => {
      setCampaigns(data);
      setLoading(false);
    });
  }, []);

  const filtered = campaigns.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Active Campaigns</h2>
          <p style={{ color: 'var(--text-muted)' }}>Find a cause and help save a life today.</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-main)'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Finding causes...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {filtered.map(campaign => (
            <div key={campaign.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Campaign Image</span>
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>{campaign.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', flex: 1 }}>{campaign.description}</p>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span>₦{campaign.current_amount.toLocaleString()} raised</span>
                  <span>{Math.round((campaign.current_amount / campaign.goal_amount) * 100)}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(campaign.current_amount / campaign.goal_amount) * 100}%`, 
                    background: 'var(--primary)',
                    transition: 'width 1s ease-out'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{campaign.donor_count} donors</span>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => onDonate(campaign.id)}>Donate</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
