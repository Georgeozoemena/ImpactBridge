import { useState } from 'react';
import { api } from '../services/api';
import Notification from './Notification';

export default function CreateCampaign({ onPublish, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [images, setImages] = useState([]);
  const [notification, setNotification] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setNotification({ message: 'Maximum 5 images allowed', type: 'error' });
      return;
    }

    const readers = files.map(file => {
      return new Promise((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error(`File ${file.name} is too large (max 5MB)`));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then(base64Images => {
        setImages(base64Images);
      })
      .catch(err => {
        setNotification({ message: err.message, type: 'error' });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!beneficiaryName) {
        setNotification({ message: 'Please enter a beneficiary name', type: 'error' });
        return;
      }

      const campaignData = {
        title,
        description: `Beneficiary: ${beneficiaryName}\n\n${description}`,
        targetAmount: Number(goal),
        deadline,
        beneficiaryName
      };
      
      const response = await api.createCampaign(campaignData);
      const newCampaign = response.campaign || response;
      const campaignId = newCampaign._id || newCampaign.id;

      // Store images in localStorage keyed by campaignId
      if (images.length > 0) {
        localStorage.setItem(`campaign_images_${campaignId}`, JSON.stringify(images));
      }
      
      // Also store beneficiary name just in case backend doesn't persist it yet
      localStorage.setItem(`campaign_beneficiary_${campaignId}`, beneficiaryName);

      setNotification({ message: 'Campaign published successfully!', type: 'success' });
      setTimeout(() => onPublish(newCampaign), 1500);
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
                <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Beneficiary's Full Name</label>
                <input 
                  type="text" 
                  placeholder="The person receiving the treatment"
                  style={{ width: '100%', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '1.25rem', fontWeight: 600 }}
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  required
                />
              </div>

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
                <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Medical Documentation / Visuals (Max 5)</label>
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '1rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', background: 'white' }}
                />
                {images.length > 0 && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    {images.map((img, idx) => (
                      <div key={idx} style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
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

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Campaign Deadline (Optional)</label>
                <input 
                  type="date" 
                  style={{ width: '100%', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '1.25rem', fontWeight: 600 }}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
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
