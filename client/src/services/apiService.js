import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const theoriesAPI = {
  search: (query) => api.get(`/theories/search?q=${query}`),
  getAll: (filters) => api.get('/theories', { params: filters }),
  getById: (id) => api.get(`/theories/${id}`),
  create: (data) => api.post('/theories', data),
  update: (id, data) => api.put(`/theories/${id}`, data)
};

export const analysisAPI = {
  analyze: (theoryId, method) => api.post('/analysis/analyze', { theoryId, method }),
  getMotivation: (theoryId) => api.get(`/analysis/motivation/${theoryId}`),
  matchPatterns: (theoryId) => api.get(`/analysis/patterns/${theoryId}`),
  assessInvestigation: (theoryId) => api.get(`/analysis/investigation/${theoryId}`)
};

export const evidenceAPI = {
  getByTheory: (theoryId) => api.get(`/evidence/theory/${theoryId}`),
  create: (data) => api.post('/evidence', data),
  flagDestroyed: (id) => api.patch(`/evidence/${id}/destroyed`)
};

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, username) => api.post('/auth/register', { email, password, username }),
  verify: () => api.get('/auth/verify')
};

export default api;