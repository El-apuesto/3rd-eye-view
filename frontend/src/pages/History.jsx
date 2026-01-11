import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await api.getHistory(token, page);
      setAnalyses(data.analyses || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Analysis History</h1>

      {analyses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No analyses yet.</p>
          <Link 
            to="/analysis" 
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Your First Analysis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {analysis.query_text}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      Score: <span className="font-semibold">{analysis.overall_confidence_score}</span>/100
                    </span>
                    <span>•</span>
                    <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="font-mono text-xs">{analysis.watermark_code}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysis.overall_confidence_score}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={analyses.length < 20}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}