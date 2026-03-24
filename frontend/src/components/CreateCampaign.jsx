import { useState } from 'react';
import { api } from '../services/api';
import Notification from './Notification';

export default function CreateCampaign({ onPublish, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const campaignData = {
        title,
        description,
        targetAmount: Number(goal),
        imageUrl: imageUrl || `https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800`
      };
      const response = await api.createCampaign(campaignData);
      setNotification({ message: 'Campaign published successfully!', type: 'success' });
      setTimeout(() => onPublish(response.campaign || response), 1500);
    } catch (error) {
      console.error("Failed to create campaign:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to create campaign. Please try again.";
      setNotification({ message: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="fade-in">
       {notification && (
         <Notification 
           message={notification.message} 
           type={notification.type} 
           onClose={() => setNotification(null)} 
         />
       )}
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
                 <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Campaign Image URL</label>
                 <input 
                   type="url" 
                   placeholder="https://images.unsplash.com/..."
                   style={{ width: '100%', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '1.125rem' }}
                   value={imageUrl}
                   onChange={(e) => setImageUrl(e.target.value)}
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
