import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Landing from './components/Landing';
import CampaignDetail from './components/CampaignDetail';
import BeneficiaryDashboard from './components/BeneficiaryDashboard';
import DonorDashboard from './components/DonorDashboard';
import About from './components/About';
import Transparency from './components/Transparency';
import DonationModal from './components/DonationModal';
import SuccessScreen from './components/SuccessScreen';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import PaymentCallback from './components/PaymentCallback';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [showDonationFlow, setShowDonationFlow] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [lastDonationAmount, setLastDonationAmount] = useState(0);
  const [successData, setSuccessData] = useState({ title: '', percent: 0 });
  const [beneficiaryName, setBeneficiaryName] = useState('');
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

  const openDonation = async (campaignId) => {
    setActiveCampaignId(campaignId);
    setBeneficiaryName(''); // Reset
    
    // Fetch beneficiary name
    try {
      const localName = localStorage.getItem(`campaign_beneficiary_${campaignId}`);
      if (localName) {
        setBeneficiaryName(localName);
      } else {
        const detail = await api.getCampaignById(campaignId);
        setBeneficiaryName(detail.beneficiaryName || detail.campaign?.beneficiaryName || '');
      }
    } catch (e) {
      console.warn("Could not fetch beneficiary name for modal", e);
    }
    
    setShowDonationFlow(true);
  };

  return (
    <div className="app-container" style={{ paddingTop: '80px' }}>
      <Navbar onNavigate={(path) => navigate(path)} user={user} />
      
      <Routes>
        <Route path="/" element={<Landing onDonate={openDonation} onStartCampaign={() => navigate('/auth')} />} />
        <Route path="/campaign/:id" element={<CampaignDetail onDonate={(id) => openDonation(id)} onBack={() => navigate('/')} />} />
        <Route path="/dashboard" element={
          user ? (
            user.role === 'beneficiary' ? (
              <BeneficiaryDashboard user={user} onLogout={handleLogout} />
            ) : (
              <DonorDashboard user={user} onLogout={handleLogout} />
            )
          ) : (
            <Navigate to="/auth" />
          )
        } />
        <Route path="/about" element={<About />} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/auth" element={<Auth onAuth={handleAuth} onCancel={() => navigate('/')} />} />
        <Route path="/success" element={<SuccessScreen amount={lastDonationAmount} campaignTitle={successData.title} newPercent={successData.percent} onFinish={() => navigate('/')} />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {showDonationFlow && (
        <DonationModal 
          campaignId={activeCampaignId} 
          beneficiaryName={beneficiaryName}
          onClose={() => setShowDonationFlow(false)}
          onSuccess={handleDonationSuccess}
        />
      )}
    </div>
  );
}
