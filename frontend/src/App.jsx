import { useState } from 'react';
import Landing from './components/Landing';
import CampaignExplorer from './components/CampaignExplorer';
import CampaignDetail from './components/CampaignDetail';
import BeneficiaryDashboard from './components/BeneficiaryDashboard';
import DonorDashboard from './components/DonorDashboard';
import DonationModal from './components/DonationModal';
import SuccessScreen from './components/SuccessScreen';
import Auth from './components/Auth';
import CreateCampaign from './components/CreateCampaign';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [lastDonationAmount, setLastDonationAmount] = useState(0);

  const navigateTo = (page, campaignId = null) => {
    if (page === 'auth' && user) {
      setCurrentPage('dashboard');
      return;
    }
    setCurrentPage(page);
    setActiveCampaignId(campaignId);
    window.scrollTo(0, 0);
  };

  const handleAuth = (userData) => {
    setUser(userData);
    if (userData.type === 'beneficiary') {
      navigateTo('dashboard');
    } else {
      navigateTo('explorer');
    }
  };

  const handleStartCampaign = () => {
    if (!user) {
      navigateTo('auth');
    } else if (user.type === 'beneficiary') {
      navigateTo('create-campaign');
    } else {
      alert('Your current account is a Donor account. Please logout and login as a Beneficiary to start a campaign.');
    }
  };

  const handleDonationSuccess = (amount) => {
    setLastDonationAmount(amount);
    setShowDonationModal(false);
    setCurrentPage('success');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'landing': return <Landing onDonate={() => navigateTo('explorer')} onStartCampaign={handleStartCampaign} />;
      case 'explorer': return <CampaignExplorer onDonate={(id) => navigateTo('detail', id)} />;
      case 'detail': return <CampaignDetail campaignId={activeCampaignId} onDonate={(amount) => {
        if (amount) setLastDonationAmount(amount);
        setShowDonationModal(true);
      }} />;
      case 'dashboard': return user?.type === 'beneficiary' ? <BeneficiaryDashboard /> : <DonorDashboard />;
      case 'auth': return <Auth onAuth={handleAuth} onCancel={() => navigateTo('landing')} />;
      case 'create-campaign': return <CreateCampaign onPublish={(campaign) => {
        console.log('Campaign published:', campaign);
        navigateTo('dashboard');
      }} onCancel={() => navigateTo('dashboard')} />;
      case 'success': return <SuccessScreen amount={lastDonationAmount} onFinish={() => navigateTo('landing')} />;
      default: return <Landing onDonate={() => navigateTo('explorer')} onStartCampaign={handleStartCampaign} />;
    }
  };

  return (
    <div style={{ background: '#F5F5F3', minHeight: '100vh', padding: '1.5rem' }}>
      <div className="canvas" style={{ minHeight: 'calc(100vh - 3rem)', display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="container">
            <nav style={{ height: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 
                style={{ fontSize: '1.75rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.04em' }} 
                onClick={() => navigateTo('landing')}
              >
                Pure<span style={{ color: 'var(--primary-dark)' }}>Flow</span>
              </h1>
              
              <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <button onClick={() => navigateTo('landing')}>About</button>
                <button onClick={() => navigateTo('explorer')}>Programs</button>
                <button onClick={() => navigateTo('explorer')}>Contact</button>
                
                {!user ? (
                  <button onClick={() => navigateTo('auth')}>Login</button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div 
                      style={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem', borderBottom: '2px solid var(--primary)' }}
                      onClick={() => navigateTo('dashboard')}
                    >
                      {user.name.toUpperCase()}
                    </div>
                    <button 
                      style={{ opacity: 0.6 }}
                      onClick={() => { setUser(null); navigateTo('landing'); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
                
                <button className="btn btn-primary" onClick={() => navigateTo('explorer')}>Donate Now</button>
              </div>
            </nav>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          {renderPage()}
        </main>
        
        {showDonationModal && (
          <DonationModal 
            campaignId={activeCampaignId} 
            amount={lastDonationAmount}
            onClose={() => setShowDonationModal(false)}
            onSuccess={handleDonationSuccess}
          />
        )}
        
        <footer style={{ padding: '6rem 0', borderTop: '1px solid var(--border)', background: 'white' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>PureFlow</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>
                  Connecting compassion with critical healthcare needs. Every contribution moves the world closer to health equity.
                </p>
              </div>
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Organization</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <button style={{ textAlign: 'left' }} onClick={() => navigateTo('landing')}>About Us</button>
                  <button style={{ textAlign: 'left' }} onClick={() => navigateTo('landing')}>Our Impact</button>
                  <button style={{ textAlign: 'left' }} onClick={() => navigateTo('landing')}>Annual Reports</button>
                </div>
              </div>
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Programs</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <button style={{ textAlign: 'left' }} onClick={() => navigateTo('explorer')}>Health Clinics</button>
                  <button style={{ textAlign: 'left' }} onClick={() => navigateTo('explorer')}>Emergency Surgery</button>
                  <button style={{ textAlign: 'left' }} onClick={() => navigateTo('explorer')}>Oxygen Supply</button>
                </div>
              </div>
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Legal</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <button style={{ textAlign: 'left' }}>Privacy Policy</button>
                  <button style={{ textAlign: 'left' }}>Terms of Service</button>
                  <button style={{ textAlign: 'left' }}>Tax Receipts</button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <div style={{ textAlign: 'center', padding: '2rem', color: '#888', fontSize: '0.875rem' }}>
        © {new Date().getFullYear()} PureFlow Impact. Compassion codified.
      </div>
    </div>
  );
}
