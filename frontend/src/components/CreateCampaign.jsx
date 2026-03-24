import { useState } from 'react';

export default function CreateCampaign({ onPublish, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPublish({ 
       id: Date.now(),
       title, 
       description, 
       goal_amount: Number(goal), 
       current_amount: 0, 
       donor_count: 0 
    });
  };

  return (
    <div className="fade-in">
       <div className="container" style={{ padding: '8rem 0' }}>
         <div style={{ maxWidth: '800px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Launch a Cause</span>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '1rem 0 3rem', letterSpacing: '-0.04em' }}>Tell Your Story.</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Campaign Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Emergency Surgery for Baby Aisha"
                  style={{ width: '100%', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '1.25rem', fontWeight: 600 }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Naira Goal (₦)</label>
                <input 
                  type="number" 
                  placeholder="Amount needed to complete the treatment"
                  style={{ width: '100%', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '1.25rem', fontWeight: 600 }}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>The Narrative</label>
                <textarea 
                  placeholder="Describe the medical situation and why these funds are critical..."
                  rows="8"
                  style={{ width: '100%', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '1.125rem', lineHeight: 1.6 }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-secondary btn-lg" style={{ padding: '1.5rem 4rem' }}>Publish Campaign</button>
                <button type="button" className="btn btn-outline btn-lg" onClick={onCancel}>Cancel</button>
              </div>
            </form>
         </div>
       </div>
    </div>
  );
}
