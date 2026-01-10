import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TheoryList.css';

function TheoryList() {
  const [theories, setTheories] = useState([]);
  const [filter, setFilter] = useState({ category: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheories();
  }, [filter]);

  const loadTheories = async () => {
    try {
      const params = new URLSearchParams(filter).toString();
      const response = await axios.get(`/api/theories?${params}`);
      setTheories(response.data);
    } catch (error) {
      console.error('Failed to load theories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theory-list">
      <div className="filters">
        <select value={filter.category} onChange={(e) => setFilter({...filter, category: e.target.value})}>
          <option value="">All Categories</option>
          <option value="government">Government</option>
          <option value="corporate">Corporate</option>
          <option value="historical">Historical</option>
          <option value="current">Current Events</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading theories...</div>
      ) : (
        <div className="theory-grid">
          {theories.map(theory => (
            <div key={theory.id} className="theory-card">
              <h3>{theory.title}</h3>
              <p>{theory.description.substring(0, 150)}...</p>
              <div className="meta">
                <span className="category">{theory.category}</span>
                <span className="popularity">👁️ {theory.popularity}</span>
              </div>
              <a href={`/theory/${theory.id}`} className="btn">Analyze</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TheoryList;