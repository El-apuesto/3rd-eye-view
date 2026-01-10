import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const theoryAPI = {
  // Get all theories
  getAll: (params = {}) => 
    api.get('/theories', { params }),

  // Get trending theories
  getTrending: (limit = 10) => 
    api.get('/theories/trending', { params: { limit } }),

  // Get theory by ID
  getById: (id) => 
    api.get(`/theories/${id}`),

  // Create new theory
  create: (data) => 
    api.post('/theories', data),

  // Update theory
  update: (id, data) => 
    api.put(`/theories/${id}`, data),
};

export const analysisAPI = {
  // Run analysis on a theory
  analyze: (theoryId, methods = ['all'], userWeights = null) => 
    api.post('/analyze', { theoryId, methods, userWeights }),

  // Get existing analysis
  getAnalysis: (theoryId, latest = true) => 
    api.get(`/analysis/${theoryId}`, { params: { latest } }),

  // Run specific analysis method
  runMethod: (theoryId, method, userWeights = null) => 
    api.post(`/analysis/${theoryId}/methods`, { method, userWeights }),

  // Get historical patterns
  getPatterns: (theoryId) => 
    api.get(`/patterns/${theoryId}`),
};

export const evidenceAPI = {
  // Get evidence for theory
  getByTheory: (theoryId, params = {}) => 
    api.get(`/evidence/${theoryId}`, { params }),

  // Submit new evidence
  submit: (data) => 
    api.post('/evidence', data),

  // Vote on evidence
  vote: (evidenceId, vote, userId = 'anonymous') => 
    api.put(`/evidence/${evidenceId}/vote`, { vote, userId }),

  // Get source track record
  getSourceTrackRecord: (sourceName) => 
    api.get(`/sources/${encodeURIComponent(sourceName)}/track-record`),
};

export const searchAPI = {
  // Search web for theories
  search: (query, maxResults = 20, sources = ['google', 'bing']) => 
    api.post('/search', { query, maxResults, sources }),

  // Get popularity metrics
  getPopularity: (query, timeframe = '30d') => 
    api.get(`/search/popularity/${encodeURIComponent(query)}`, { 
      params: { timeframe } 
    }),
};

export default api;
