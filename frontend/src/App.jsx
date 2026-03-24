import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Landing from './components/Landing';
import CampaignDetail from './components/CampaignDetail';
import BeneficiaryDashboard from './components/BeneficiaryDashboard';
import DonationModal from './components/DonationModal';
import SuccessScreen from './components/SuccessScreen';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [showDonationFlow, setShowDonationFlow] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [lastDonationAmount, setLastDonationAmount] = useState(0);
  const [successData, setSuccessData] = useState({ title: '', percent: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleDonationSuccess = async (amount) => {
    setLastDonationAmount(amount);
    
    // Optional: Fetch updated progress for the campaign to show on success screen
    try {
      if (activeCampaignId) {
        const progress = await api.getCampaignProgress(activeCampaignId);
        setSuccessData({ 
          title: progress.title || 'the', 
          percent: progress.percentComplete 
        });
      }
    } catch (e) {
      console.error("Success data fetch failed:", e);
    }

    setShowDonationFlow(false);
    navigate('/success');
  };

  const openDonation = (campaignId) => {
    setActiveCampaignId(campaignId);
    setShowDonationFlow(true);
  };

  return (
    <div className="app-container" style={{ paddingTop: '80px' }}>
      <Navbar onNavigate={(path) => navigate(path)} user={user} />
      
      <Routes>
        <Route path="/" element={<Landing onDonate={openDonation} onStartCampaign={() => navigate('/auth')} />} />
        <Route path="/campaign/:id" element={<CampaignDetail onDonate={(id) => openDonation(id)} onBack={() => navigate('/')} />} />
        <Route path="/dashboard" element={user ? <BeneficiaryDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth onAuth={handleAuth} onCancel={() => navigate('/')} />} />
        <Route path="/success" element={<SuccessScreen amount={lastDonationAmount} campaignTitle={successData.title} newPercent={successData.percent} onFinish={() => navigate('/')} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {showDonationFlow && (
        <DonationModal 
          campaignId={activeCampaignId} 
          onClose={() => setShowDonationFlow(false)}
          onSuccess={handleDonationSuccess}
        />
      )}
    </div>
  );
}
