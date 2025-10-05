// API service for Curry2Cakes frontend
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Request an invite code via email
 */
export const requestInviteCode = async (email, userName = '') => {
  try {
    const response = await api.post('/api/invite/request', {
      email,
      userName
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to request invite code');
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Validate an invite code
 */
export const validateInviteCode = async (code) => {
  try {
    const response = await api.post('/api/invite/validate', {
      code
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to validate invite code');
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Get invite statistics (admin only)
 */
export const getInviteStats = async () => {
  try {
    const response = await api.get('/api/admin/stats');
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to get statistics');
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    throw new Error('API server is not responding');
  }
};

export default api;
