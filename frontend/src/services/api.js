import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://impactbridge-rvzp.onrender.com/api';

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

let socket = null;

export const api = {
  getBaseUrl: () => API_BASE_URL,

  connectSocket: (campaignId) => {
    if (!socket) {
      // Use the base URL but without /api
      const socketUrl = API_BASE_URL.replace('/api', '');
      socket = io(socketUrl, {
        auth: { token: localStorage.getItem('token') }
      });
    }
    if (campaignId) {
      socket.emit('joinCampaign', campaignId);
    }
    return socket;
  },

  disconnectSocket: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => socket,
  // Auth
  login: async (email, password) => {
    const response = await apiInstance.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const endpoint = userData.role === 'beneficiary' ? '/beneficiary/register' : '/donor/register';
    const response = await apiInstance.post(endpoint, userData);
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

  createCampaign: async (campaignData) => {
    const response = await apiInstance.post('/campaign/create', campaignData);
    return response.data;
  },

  updateCampaignStatus: async (id, status) => {
    const response = await apiInstance.patch(`/campaign/${id}/status`, { status });
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
  },

  processDonation: async (donationData) => {
    const response = await apiInstance.post('/donation/process', donationData);
    return response.data;
  },

  getDonorHistory: async () => {
    const response = await apiInstance.get('/donation/history');
    return response.data;
  }
};
