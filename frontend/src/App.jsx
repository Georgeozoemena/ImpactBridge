import { useState } from 'react'
import Landing from './components/Landing'
import CampaignExplorer from './components/CampaignExplorer'
import CampaignDetail from './components/CampaignDetail'
import DonationModal from './components/DonationModal'
import SuccessScreen from './components/SuccessScreen'
import BeneficiaryDashboard from './components/BeneficiaryDashboard'
import DonorDashboard from './components/DonorDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [activeCampaignId, setActiveCampaignId] = useState(null)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [lastDonationAmount, setLastDonationAmount] = useState(0)
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState(null)

  const navigateTo = (page, params = {}) => {
    if (params.id) setActiveCampaignId(params.id)
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleAuth = (role = 'donor') => {
    setUser({ name: role === 'beneficiary' ? 'St. Nicholas Hospital' : 'John Donor', role })
    navigateTo('landing')
  }

  const handleDonationSuccess = (amount) => {
    setLastDonationAmount(amount)
    setShowDonationModal(false)
    navigateTo('success')
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'landing':
        return <Landing 
          onDonate={(id) => navigateTo(id ? 'campaign-detail' : 'explorer', { id })} 
          onStartCampaign={() => handleAuth('beneficiary')} 
        />
      case 'explorer':
        return <CampaignExplorer onDonate={(id) => navigateTo('campaign-detail', { id })} />
      case 'campaign-detail':
        return <CampaignDetail 
          campaignId={activeCampaignId} 
          onDonate={(amount) => {
            setLastDonationAmount(amount || 0)
            setShowDonationModal(true)
          }} 
        />
      case 'success':
        return <SuccessScreen amount={lastDonationAmount} onFinish={() => navigateTo('landing')} />
      case 'dashboard':
        return user?.role === 'beneficiary' ? <BeneficiaryDashboard /> : <DonorDashboard />
      case 'auth':
        return (
          <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass fade-in" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
              <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                  <input type="email" placeholder="john@example.com" className="form-input" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                  <input type="password" placeholder="••••••••" className="form-input" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
              </form>
              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                <button onClick={() => setIsLogin(!isLogin)} style={{ marginLeft: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </div>
            </div>
          </main>
        )
      default:
        return <Landing 
          onDonate={() => navigateTo('explorer')} 
          onStartCampaign={() => navigateTo('auth')} 
        />
    }
  }

  return (
    <div className="container">
      <nav style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 
          style={{ color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }} 
          onClick={() => navigateTo('landing')}
        >
          ImpactBridge
        </h1>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button style={{ fontWeight: 500 }} onClick={() => navigateTo('explorer')}>Explore</button>
          {!user ? (
            <button className="btn btn-outline" onClick={() => navigateTo('auth')}>Login</button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Hi, {user.name}</span>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.4rem 1rem' }}
                onClick={() => navigateTo('dashboard')}
              >
                Dashboard
              </button>
              <button 
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                onClick={() => { setUser(null); navigateTo('landing'); }}
              >
                Logout
              </button>
            </div>
          )}
          <button className="btn btn-ghost" onClick={() => document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')}>
            🌙
          </button>
        </div>
      </nav>

      {renderPage()}
      
      {showDonationModal && (
        <DonationModal 
          campaignId={activeCampaignId} 
          amount={lastDonationAmount}
          onClose={() => setShowDonationModal(false)}
          onSuccess={handleDonationSuccess}
        />
      )}
      
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        © 2026 ImpactBridge • Helping Hospitals, One Payment at a Time.
      </footer>
    </div>
  )
}

export default App
