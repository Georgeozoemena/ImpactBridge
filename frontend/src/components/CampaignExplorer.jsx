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
    <div className="fade-in">
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Help Where it Matters</span>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '1rem', letterSpacing: '-0.02em' }}>Active Programs</h2>
          </div>
          <div style={{ position: 'relative', width: '340px' }}>
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', fontSize: '1.25rem', color: 'var(--text-muted)' }}>Finding causes...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
            {filtered.map(campaign => (
              <div key={campaign.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', border: 'none', background: 'var(--surface)', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
                <div style={{ background: '#F5F5F5', aspectRatio: '16/10', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAA', fontWeight: 700 }}>Program Visual</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.01em' }}>{campaign.title}</h3>
                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem', flex: 1, lineHeight: 1.6 }}>{campaign.description}</p>

                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span>₦{campaign.current_amount.toLocaleString()} raised</span>
                      <span style={{ color: 'var(--primary-dark)' }}>{Math.round((campaign.current_amount / campaign.goal_amount) * 100)}%</span>
                    </div>
                    <div style={{ height: '3px', background: '#E5E5E5', borderRadius: 'var(--radius-full)' }}>
                      <div style={{
                        height: '100%',
                        width: `${(campaign.current_amount / campaign.goal_amount) * 100}%`,
                        background: 'var(--secondary)',
                        borderRadius: 'var(--radius-full)'
                      }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{campaign.donor_count} Supporters</span>
                    <button className="btn btn-outline" style={{ padding: '0.6rem 1.5rem' }} onClick={() => onDonate(campaign.id)}>Support</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
