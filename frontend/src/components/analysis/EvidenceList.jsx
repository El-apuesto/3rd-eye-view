import React from 'react';

export default function EvidenceList({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Evidence Items</h3>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              {item.title}
            </a>
            <p className="text-sm text-gray-600 mt-1">{item.snippet}</p>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span>Source: {item.sourceType}</span>
              <span>Quality: {item.qualityScore}/100</span>
              {item.isPrimary && <span className="text-green-600 font-semibold">Primary Source</span>}
              {item.provenanceType !== 'standard' && (
                <span className="text-purple-600">Provenance: {item.provenanceType}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}