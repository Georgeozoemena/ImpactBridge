import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function CampaignExplorer({ onDonate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await api.getCampaigns({ status: 'active' });
        // Backend returns { success: true, campaigns: [...] }
        const campaignList = response.campaigns || response.data?.campaigns || (Array.isArray(response) ? response : []);
        setCampaigns(campaignList);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        setError('Failed to load campaigns');
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--text-muted)'
              }}
            >
              Help Where it Matters
            </span>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Active Campaigns
            </h2>
          </div>
          <div style={{ position: 'relative', width: '340px' }}>
            <input
              type="text"
              placeholder="Search campaigns..."
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
          <div style={{ textAlign: 'center', padding: '6rem 0', fontSize: '1.25rem', color: 'var(--text-muted)' }}>
            Finding campaigns...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', fontSize: '1.25rem', color: '#DC2626' }}>
            {error}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
            {filtered.length > 0 ? (
              filtered.map((campaign) => {
                const campId = campaign._id || campaign.id;
                const localImages = JSON.parse(localStorage.getItem(`campaign_images_${campId}`) || '[]');
                const localBeneficiary = localStorage.getItem(`campaign_beneficiary_${campId}`);
                const beneficiaryDisplay = campaign.beneficiaryName || localBeneficiary;
                const displayImage = localImages.length > 0 ? localImages[0] : (campaign.imageUrl || `https://picsum.photos/seed/${campId}/800/600`);

                // Use backend field names: raisedAmount, targetAmount, donorCount
                const raised = campaign.raisedAmount || 0;
                const target = campaign.targetAmount || 1;
                const percent = Math.round((raised / target) * 100);
                const donorCount = campaign.donorCount || 0;

                return (
                  <div
                    key={campId}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      overflow: 'hidden',
                      border: 'none',
                      background: 'var(--surface)',
                      borderBottom: '1px solid var(--border)',
                      borderRadius: 0
                    }}
                  >
                    {/* Campaign Image */}
                    <div
                      style={{
                        background: '#F5F5F5',
                        aspectRatio: '16/10',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden'
                      }}
                    >
                      <img src={displayImage} alt={campaign.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '2rem' }}>
                      {/* Beneficiary Name */}
                      {beneficiaryDisplay && (
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                          For: {beneficiaryDisplay}
                        </div>
                      )}
                      
                      {/* Campaign Title */}
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.01em' }}>
                        {campaign.title}
                      </h3>

                      {/* Campaign Description */}
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem', flex: 1, lineHeight: 1.6 }}>
                        {campaign.description}
                      </p>

                      {/* Progress Bar & Amount */}
                      <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <span>₦{raised.toLocaleString()} raised</span>
                          <span style={{ color: 'var(--primary-dark)' }}>{percent}%</span>
                        </div>
                        <div style={{ height: '3px', background: '#E5E5E5', borderRadius: 'var(--radius-full)' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${Math.min(percent, 100)}%`,
                              background: 'var(--primary)',
                              borderRadius: 'var(--radius-full)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Donor Count & CTA */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {donorCount} Supporters
                        </span>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.6rem 1.5rem', cursor: 'pointer' }}
                          onClick={() => onDonate(campaign._id || campaign.id)}
                        >
                          Donate
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No campaigns match your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}