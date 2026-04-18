import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Swaps
export const getEligiblePartners = (batch) => api.get('/swaps/eligible', { params: { batch } });
export const submitSwapRequest = (data) => api.post('/swaps/request', data);
export const getMySwaps = () => api.get('/swaps/me');
export const respondToPartnerRequest = (id, data) => api.put(`/swaps/${id}/partner`, data);

// Admin
export const getAllSwaps = (status) => api.get('/swaps/admin', { params: status ? { status } : {} });
export const getSwapStats = () => api.get('/swaps/stats');
export const reviewSwapAdmin = (id, data) => api.put(`/swaps/${id}/admin`, data);
export const getAllStudents = () => api.get('/swaps/students');
export const getAuditLog = () => api.get('/swaps/audit-log');

// General
export const getNotifications = () => api.get('/swaps/notifications');
