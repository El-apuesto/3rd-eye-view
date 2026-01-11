import React, { useState } from 'react';
import AnalysisForm from '../components/analysis/AnalysisForm';
import AnalysisResults from '../components/analysis/AnalysisResults';

export default function Analysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Analysis Dashboard</h1>
      
      <AnalysisForm 
        onResult={setResult} 
        onLoading={setLoading}
      />
      
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Analyzing evidence and patterns...</p>
        </div>
      )}
      
      {result && !loading && <AnalysisResults result={result} />}
    </div>
  );
}