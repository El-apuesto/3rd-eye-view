import React from 'react';
import { useBias } from '../contexts/BiasContext';
import './BiasControls.css';

function BiasControls() {
  const { biasWeights, updateWeight, resetWeights } = useBias();

  return (
    <div className="bias-controls">
      <h3>Source Weighting Controls</h3>
      <p className="description">
        Adjust how much weight you want to give to different types of sources.
        Changes affect how analysis scores are calculated.
      </p>

      {Object.entries(biasWeights).map(([source, weight]) => (
        <div key={source} className="weight-control">
          <label>{source.charAt(0).toUpperCase() + source.slice(1)} Sources</label>
          <input
            type="range"
            min="0"
            max="100"
            value={weight}
            onChange={(e) => updateWeight(source, parseInt(e.target.value))}
          />
          <span className="weight-value">{weight}%</span>
        </div>
      ))}

      <button onClick={resetWeights} className="reset-btn">
        Reset to Defaults
      </button>

      <div className="explanation">
        <h4>How This Works</h4>
        <ul>
          <li><strong>Government:</strong> Official government reports and statements</li>
          <li><strong>Mainstream:</strong> Major news outlets and established media</li>
          <li><strong>Alternative:</strong> Independent journalists and alternative media</li>
          <li><strong>Academic:</strong> Peer-reviewed studies and academic research</li>
          <li><strong>Whistleblower:</strong> Inside sources and whistleblower testimony</li>
        </ul>
      </div>
    </div>
  );
}

export default BiasControls;