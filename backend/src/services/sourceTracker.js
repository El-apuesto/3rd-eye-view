const pool = require('../config/database');

async function trackSources(evidenceItems) {
  let totalCredScore = 0;
  let highCredCount = 0;
  let lowCredCount = 0;
  const biasDistribution = { left: 0, right: 0, center: 0, unknown: 0 };
  
  for (const item of evidenceItems) {
    const domain = new URL(item.url).hostname;
    
    let source = await pool.query(
      'SELECT * FROM sources WHERE domain = $1',
      [domain]
    );
    
    if (source.rows.length === 0) {
      const insertResult = await pool.query(
        `INSERT INTO sources (domain, source_type, credibility_score, bias_rating) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [domain, item.sourceType, 50, 'unknown']
      );
      source = insertResult;
    }
    
    const credScore = source.rows[0].credibility_score;
    totalCredScore += credScore;
    
    if (credScore >= 70) highCredCount++;
    if (credScore < 40) lowCredCount++;
    
    const bias = source.rows[0].bias_rating || 'unknown';
    biasDistribution[bias] = (biasDistribution[bias] || 0) + 1;
  }
  
  const sourceCredibilityScore = evidenceItems.length > 0
    ? Math.round(totalCredScore / evidenceItems.length)
    : 0;
  
  return {
    sourceCredibilityScore,
    highCredSources: highCredCount,
    lowCredSources: lowCredCount,
    biasDistribution
  };
}

module.exports = { trackSources };