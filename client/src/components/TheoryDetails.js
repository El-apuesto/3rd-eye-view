import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TheoryAnalysis from './TheoryAnalysis';
import { theoriesAPI, evidenceAPI } from '../services/apiService';
import './TheoryDetails.css';

function TheoryDetails() {
  const { id } = useParams();
  const [theory, setTheory] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheoryData();
  }, [id]);

  const loadTheoryData = async () => {
    try {
      const [theoryRes, evidenceRes] = await Promise.all([
        theoriesAPI.getById(id),
        evidenceAPI.getByTheory(id)
      ]);
      setTheory(theoryRes.data);
      setEvidence(evidenceRes.data);
    } catch (error) {
      console.error('Failed to load theory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!theory) return <div className="error">Theory not found</div>;

  return (
    <div className="theory-details">
      <div className="theory-header">
        <h1>{theory.title}</h1>
        <div className="meta">
          <span className="category">{theory.category}</span>
          <span className="date">{new Date(theory.event_date).toLocaleDateString()}</span>
          <span className="popularity">👁️ {theory.popularity} views</span>
        </div>
      </div>

      <div className="theory-content">
        <section className="description">
          <h2>Description</h2>
          <p>{theory.description}</p>
        </section>

        <section className="official-narrative">
          <h2>Official Narrative</h2>
          <p>{theory.official_narrative}</p>
        </section>

        <section className="evidence-section">
          <h2>Evidence ({evidence.length})</h2>
          <div className="evidence-list">
            {evidence.map(e => (
              <div key={e.id} className="evidence-item">
                <div className="evidence-header">
                  <span className="source">{e.source}</span>
                  <span className="credibility">Credibility: {e.credibility_score}%</span>
                </div>
                <p>{e.description}</p>
                {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer">View Source</a>}
                {e.is_destroyed && <span className="destroyed-flag">⚠️ Destroyed/Missing</span>}
              </div>
            ))}
          </div>
        </section>
      </div>

      <TheoryAnalysis theoryId={id} />
    </div>
  );
}

export default TheoryDetails;