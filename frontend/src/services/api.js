import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to requests if available
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  login: async (email, password) => {
    const response = await apiInstance.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    // Note: Backend has /api/beneficiary/register for beneficiaries
    // If we want a general donor register, we might need to check if that exists
    // For now, let's assume register is for beneficiaries as per our UI flow
    const response = await apiInstance.post('/beneficiary/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  // Campaigns
  getCampaigns: async () => {
    const response = await apiInstance.get('/campaign');
    return response.data;
  },

  getCampaignById: async (id) => {
    const response = await apiInstance.get(`/campaign/${id}`);
    return response.data;
  },

  getCampaignProgress: async (id) => {
    const response = await apiInstance.get(`/campaign/${id}/progress`);
    return response.data;
  },

  // Donations
  initiateDonation: async (donationData) => {
    // Use initiate-test for now if we don't have real Paystack keys
    const response = await apiInstance.post('/donation/initiate-test', donationData);
    return response.data;
  },

  verifyDonation: async (reference) => {
    const response = await apiInstance.post('/donation/verify-test', { reference });
    return response.data;
  }
};
