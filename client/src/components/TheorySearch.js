import React, { useState } from 'react';
import axios from 'axios';
import './TheorySearch.css';

function TheorySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/theories/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theory-search">
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search conspiracy theories..."
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="results">
        {results.map((theory) => (
          <div key={theory.id} className="theory-card">
            <h3>{theory.title}</h3>
            <p>{theory.description}</p>
            <div className="meta">
              <span>Category: {theory.category}</span>
              <span>Popularity: {theory.popularity}</span>
            </div>
            <button onClick={() => window.location.href = `/theory/${theory.id}`}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TheorySearch;