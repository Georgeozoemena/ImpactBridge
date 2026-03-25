import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://impactbridge-rvzp.onrender.com/api';
const SOCKET_URL = 'https://impactbridge-rvzp.onrender.com';

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

  // ============= Socket.IO Connection =============
  connectSocket: (campaignId) => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: { token: localStorage.getItem('token') },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
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

  // ============= Authentication =============
  // POST /api/beneficiary/register
  registerBeneficiary: async (name, email, password, phone) => {
    const response = await apiInstance.post('/beneficiary/register', {
      name,
      email,
      password,
      phone
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // POST /api/donor/register
  registerDonor: async (name, email, password) => {
    const response = await apiInstance.post('/donor/register', {
      name,
      email,
      password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // POST /api/auth/login
  login: async (email, password) => {
    const response = await apiInstance.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // ============= Campaigns =============
  // GET /api/campaign (with optional query params: status, sort)
  getCampaigns: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.sort) params.append('sort', filters.sort);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await apiInstance.get(`/campaign${queryString}`);
    return response.data;
  },

  // GET /api/campaign/:id
  getCampaignById: async (id) => {
    const response = await apiInstance.get(`/campaign/${id}`);
    return response.data;
  },

  // GET /api/campaign/:id/progress
  getCampaignProgress: async (id) => {
    const response = await apiInstance.get(`/campaign/${id}/progress`);
    return response.data;
  },

  // GET /api/campaign/:id/recent-donations
  getRecentDonations: async (campaignId, limit = 10) => {
    const response = await apiInstance.get(`/campaign/${campaignId}/recent-donations`, {
      params: { limit }
    });
    return response.data;
  },

  // POST /api/campaign/create (beneficiary only)
  createCampaign: async (campaignData) => {
    const response = await apiInstance.post('/campaign/create', campaignData);
    return response.data;
  },

  // PATCH /api/campaign/:id/status (beneficiary only)
  updateCampaignStatus: async (id, status) => {
    const response = await apiInstance.patch(`/campaign/${id}/status`, { status });
    return response.data;
  },

  // ============= Donations =============
  // POST /api/donation/initiate - Get Interswitch form fields
  initiateDonation: async (campaignId, amount, redirectUrl, donorEmail) => {
    const response = await apiInstance.post('/donation/initiate', {
      campaignId,
      amount,
      redirectUrl,
      donorEmail
    });
    return response.data;
  },

  // POST /api/donation/process - Process donation after payment verification
  processDonation: async (campaignId, amount, donorName, transactionReference) => {
    const response = await apiInstance.post('/donation/process', {
      campaignId,
      amount,
      donorName,
      transactionReference
    });
    return response.data;
  },

  // GET /api/donation/receipt/:donationId - Get receipt PDF URL
  getReceiptUrl: (donationId) => {
    return `${API_BASE_URL}/donation/receipt/${donationId}`;
  },

  // ============= Admin Endpoints =============
  // POST /api/admin/create
  createAdmin: async (adminSecret, name, email, password) => {
    const response = await apiInstance.post('/admin/create', 
      { name, email, password },
      { headers: { 'x-admin-secret': adminSecret } }
    );
    return response.data;
  },

  // GET /api/users (requires auth)
  getAllUsers: async () => {
    const response = await apiInstance.get('/users');
    return response.data;
  },

  // GET /api/campaigns/all (requires auth)
  getAllCampaigns: async () => {
    const response = await apiInstance.get('/campaigns/all');
    return response.data;
  }
};