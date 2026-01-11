import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        3rd Eye View
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Evidence-based conspiracy theory analysis using AI, historical pattern matching, and transparent methodologies
      </p>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="font-semibold mb-2">Evidence Quality</h3>
            <p className="text-gray-600 text-sm">
              Analyzes sources, verifiability, recency, and provenance of evidence
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">📊</div>
            <h3 className="font-semibold mb-2">Source Credibility</h3>
            <p className="text-gray-600 text-sm">
              Tracks source reliability, bias, and historical accuracy
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">🔄</div>
            <h3 className="font-semibold mb-2">Pattern Matching</h3>
            <p className="text-gray-600 text-sm">
              Compares claims against verified historical events
            </p>
          </div>
        </div>
      </div>

      <div className="space-x-4">
        <Link 
          to="/analysis" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Analysis
        </Link>
        <Link 
          to="/login" 
          className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Login
        </Link>
      </div>

      <div className="mt-12 text-left bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
        <h3 className="font-semibold text-yellow-900 mb-2">Important Notice</h3>
        <p className="text-yellow-800 text-sm">
          This tool evaluates <strong>evidence quality and patterns</strong>, not absolute truth. 
          Results should be used as a starting point for further investigation, not as definitive proof.
        </p>
      </div>
    </div>
  );
}