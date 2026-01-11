import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-3">3rd Eye View</h3>
            <p className="text-sm">
              An evidence-based platform for analyzing conspiracy theories using
              transparent methodologies and historical pattern matching.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Disclaimer</h3>
            <p className="text-sm">
              This tool evaluates evidence quality and patterns, not truth or
              falsehood. All analyses should be considered starting points for
              further investigation, not definitive conclusions.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Ethics</h3>
            <p className="text-sm">
              This platform prohibits use for mass surveillance, disinformation
              campaigns, or harassment. All analyses are watermarked and logged.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} 3rd Eye View. Licensed under Business Source License.
          </p>
        </div>
      </div>
    </footer>
  );
}