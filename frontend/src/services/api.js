const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = {
  async register(email, password, username) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username })
    });
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  async runAnalysis(query, token) {
    const response = await fetch(`${API_URL}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query })
    });
    return response.json();
  },

  async getAnalysis(id, token) {
    const response = await fetch(`${API_URL}/analysis/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  async getHistory(token, page = 1) {
    const response = await fetch(`${API_URL}/analysis/user/history?page=${page}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};