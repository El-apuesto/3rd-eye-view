import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TheoryAnalysis.css';

function TheoryAnalysis({ theoryId }) {
  const [method, setMethod] = useState('complete');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/analysis/analyze', {
        theoryId,
        method
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theory-analysis">
      <h2>AI Analysis</h2>
      
      <div className="method-selector">
        <label>Analysis Method:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="1A">Confidence System (Verified/Plausible/Contradicted)</option>
          <option value="1B">Evidence Quality Only</option>
          <option value="1C">Compare Theory vs Official Narrative</option>
          <option value="complete">Complete Analysis (All Methods)</option>
        </select>
        <button onClick={runAnalysis} disabled={loading}>
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {analysis && (
        <div className="analysis-results">
          {method === 'complete' || method === '1A' ? (
            <div className="confidence-analysis">
              <h3>Confidence Assessment</h3>
              <div className="confidence-badge" data-level={analysis.analysis.confidence?.category}>
                {analysis.analysis.confidence?.category}
              </div>
              <div className="confidence-score">
                Score: {analysis.analysis.confidence?.score}%
              </div>
              <p>{analysis.analysis.confidence?.reasoning}</p>
            </div>
          ) : null}

          {method === 'complete' || method === '1B' ? (
            <div className="evidence-quality">
              <h3>Evidence Quality</h3>
              <ul>
                <li>Credible Sources: {analysis.analysis.evidenceQuality?.credibleSourcesCount}</li>
                <li>Documentation: {analysis.analysis.evidenceQuality?.documentationQuality}</li>
              </ul>
            </div>
          ) : null}

          {method === 'complete' || method === '1C' ? (
            <div className="comparison">
              <h3>Theory vs Official Narrative</h3>
              <div className="scores">
                <div>Theory Score: {analysis.analysis.comparison?.theoryScore}%</div>
                <div>Official Score: {analysis.analysis.comparison?.officialScore}%</div>
              </div>
            </div>
          ) : null}

          {analysis.destroyedEvidence?.destroyedCount > 0 && (
            <div className="destroyed-evidence-alert">
              <h3>⚠️ Evidence Issues Detected</h3>
              <p>{analysis.destroyedEvidence.destroyedCount} pieces of evidence flagged as destroyed, missing, or withheld.</p>
            </div>
          )}

          <div className="watermark">
            <small>{analysis.analysis._attribution}</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default TheoryAnalysis;