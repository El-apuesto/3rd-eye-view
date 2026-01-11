import React from 'react';

export default function PatternMatches({ patterns }) {
  if (!patterns || patterns.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Historical Pattern Matches</h3>
      <div className="space-y-4">
        {patterns.map((pattern, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-lg">{pattern.eventName}</h4>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {pattern.similarityScore}% match
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${pattern.similarityScore}%` }}
              />
            </div>
            {pattern.matchingCharacteristics.length > 0 && (
              <div className="mb-2">
                <span className="text-sm font-medium text-green-700">Matching: </span>
                <span className="text-sm text-gray-700">
                  {pattern.matchingCharacteristics.join(', ')}
                </span>
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              {pattern.temporalMetrics.governmentAdmission && (
                <span className="mr-3">✓ Government admitted</span>
              )}
              {pattern.temporalMetrics.evidenceDestruction && (
                <span className="text-red-600">⚠ Evidence destroyed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}