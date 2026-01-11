import React from 'react';
import ScoreDisplay from './ScoreDisplay';
import EvidenceList from './EvidenceList';
import PatternMatches from './PatternMatches';

export default function AnalysisResults({ result }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
        <ScoreDisplay 
          label="Overall Confidence"
          score={result.overallConfidenceScore}
          size="large"
        />
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Summary</h3>
        <p className="text-gray-700">{result.summary}</p>
      </div>

      {/* Component Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <ScoreDisplay 
            label="Evidence Quality"
            score={result.evidenceQualityScore}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <ScoreDisplay 
            label="Source Credibility"
            score={result.sourceCredibilityScore}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <ScoreDisplay 
            label="Logical Consistency"
            score={result.logicalConsistencyScore}
          />
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-green-700">Strengths</h3>
          <ul className="list-disc list-inside space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="text-gray-700">{s}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-amber-700">Weaknesses</h3>
          <ul className="list-disc list-inside space-y-2">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="text-gray-700">{w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Red Flags */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-red-700">Red Flags</h3>
          <ul className="list-disc list-inside space-y-2">
            {result.redFlags.map((flag, i) => (
              <li key={i} className="text-red-700">{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Investigation Needed */}
      {result.investigationNeeded && result.investigationNeeded.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">Further Investigation Needed</h3>
          <ul className="list-disc list-inside space-y-2">
            {result.investigationNeeded.map((item, i) => (
              <li key={i} className="text-blue-700">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Evidence */}
      {result.evidenceItems && result.evidenceItems.length > 0 && (
        <EvidenceList items={result.evidenceItems} />
      )}

      {/* Historical Patterns */}
      {result.historicalPatterns && result.historicalPatterns.length > 0 && (
        <PatternMatches patterns={result.historicalPatterns} />
      )}

      {/* Reasoning */}
      {result.reasoning && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Detailed Analysis</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{result.reasoning}</p>
        </div>
      )}

      {/* Watermark */}
      <div className="bg-gray-50 rounded p-4 text-sm text-gray-600 text-center">
        Analysis ID: {result.watermark} | 3rd Eye View | This analysis evaluates evidence quality, not truth
      </div>
    </div>
  );
}