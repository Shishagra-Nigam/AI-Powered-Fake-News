import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('veritas_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const analyzeArticleApi = async (payload) => {
  const response = await API.post('/analyze', payload);
  return response.data;
};

export const getHistoryApi = async (params = {}) => {
  const response = await API.get('/history', { params });
  return response.data;
};

export const getAnalysisByIdApi = async (id) => {
  const response = await API.get(`/history/${id}`);
  return response.data;
};

export const deleteAnalysisApi = async (id) => {
  const response = await API.delete(`/history/${id}`);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const getMeApi = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export default API;
