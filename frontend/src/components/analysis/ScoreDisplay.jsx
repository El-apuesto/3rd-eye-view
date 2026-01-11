import React from 'react';

export default function ScoreDisplay({ label, score, size = 'medium' }) {
  const getColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <div className="text-center">
      <div className={`${sizeClasses[size]} font-bold ${getColor(score)}`}>
        {score}
      </div>
      <div className="text-gray-600 mt-2">{label}</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className={`h-2 rounded-full ${getColor(score).replace('text', 'bg')}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}