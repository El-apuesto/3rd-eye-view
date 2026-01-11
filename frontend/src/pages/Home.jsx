import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            3rd Eye View
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Evidence-Based Conspiracy Theory Analysis Platform
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
            Analyze claims using evidence quality assessment, source credibility tracking, 
            and historical pattern matching. This tool evaluates how well-supported theories are, 
            not whether they are absolutely true or false.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              to="/analysis"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Start Analysis
            </Link>
            <Link
              to="/login"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-3">Evidence Quality</h3>
            <p className="text-gray-400">
              Evaluates source types, verifiability, recency, and chain of custody indicators
            </p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-3">Source Credibility</h3>
            <p className="text-gray-400">
              Tracks publication history, bias ratings, and correction records
            </p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-3">Pattern Matching</h3>
            <p className="text-gray-400">
              Compares against verified historical events like MK-ULTRA, COINTELPRO, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}