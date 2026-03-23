// API Services
// Axios/Fetch from backend

const MOCK_DELAY = 800;

export const api = {
  // Auth
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    return { 
      user: { id: 1, name: 'John Donor', email, role: 'donor' },
      token: 'jwt_access_token_8a2f'
    };
  },
  
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    return { 
      user: { id: 2, name: userData.name, email: userData.email, role: 'donor' },
      token: 'jwt_access_token_9b3e'
    };
  },

  // Campaigns
  getCampaigns: async () => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    return [
      {
        id: '1',
        title: 'Emergency Surgery for Aisha',
        description: 'Urgent funding needed for a critical heart surgery.',
        goal_amount: 500000,
        current_amount: 350000,
        donor_count: 23,
        status: 'active'
      },
      {
        id: '2',
        title: 'Hospital Oxygen Supply',
        description: 'Help us purchase 10 new oxygen cylinders for St. Mary Hospital.',
        goal_amount: 1000000,
        current_amount: 600000,
        donor_count: 45,
        status: 'active'
      }
    ];
  },

  // Donations
  createDonation: async (donationData) => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    return {
      status: 'pending',
      checkout_url: 'https://sandbox.interswitchng.com/payment-gateway',
      donation_id: 'don_123'
    };
  }
};
