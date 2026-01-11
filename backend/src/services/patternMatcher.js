const pool = require('../config/database');

async function matchHistoricalPatterns(query) {
  const result = await pool.query(
    'SELECT * FROM historical_events ORDER BY revealed_year DESC'
  );
  
  const events = result.rows;
  const matches = [];
  
  for (const event of events) {
    const similarity = await calculateSimilarity(query, event);
    
    if (similarity.score > 30) {
      matches.push({
        eventName: event.name,
        eventCode: event.code,
        similarityScore: similarity.score,
        matchingCharacteristics: similarity.matching,
        differences: similarity.differences,
        temporalMetrics: {
          denialToAdmissionYears: event.revealed_year - event.start_year,
          governmentAdmission: event.government_admission,
          evidenceDestruction: event.evidence_destruction
        }
      });
    }
  }
  
  matches.sort((a, b) => b.similarityScore - a.similarityScore);
  
  return { matches: matches.slice(0, 5) };
}

async function calculateSimilarity(query, event) {
  const eventChars = event.pattern_characteristics || {};
  const charKeys = Object.keys(eventChars);
  
  const lowerQuery = query.toLowerCase();
  const matching = [];
  const differences = [];
  
  let score = 0;
  
  if (lowerQuery.includes('surveillance') && eventChars.surveillance) {
    matching.push('surveillance');
    score += 20;
  }
  if (lowerQuery.includes('drug') && eventChars.drug_experiments) {
    matching.push('drug_experiments');
    score += 20;
  }
  if (lowerQuery.includes('media') && eventChars.media_infiltration) {
    matching.push('media_infiltration');
    score += 20;
  }
  if (lowerQuery.includes('mind control') && eventChars.psychological_manipulation) {
    matching.push('psychological_manipulation');
    score += 25;
  }
  
  if (lowerQuery.includes(event.name.toLowerCase().split('-')[0])) {
    score += 30;
  }
  
  return {
    score: Math.min(100, score),
    matching,
    differences: charKeys.filter(k => !matching.includes(k))
  };
}

module.exports = { matchHistoricalPatterns };