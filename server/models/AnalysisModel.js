const { query } = require('../config/database');

const AnalysisModel = {
  // Create new analysis
  create: async (data) => {
    const sql = `
      INSERT INTO analyses (
        theory_id, methods, results, user_weights, confidence_score
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    // Calculate average confidence score from results
    let avgConfidence = 0;
    if (data.results.confidence) {
      avgConfidence = data.results.confidence.confidenceScore || 0;
    }
    
    const values = [
      data.theoryId,
      JSON.stringify(data.methods),
      JSON.stringify(data.results),
      JSON.stringify(data.userWeights || {}),
      avgConfidence
    ];
    
    const result = await query(sql, values);
    return result.rows[0];
  },

  // Get latest analysis for a theory
  getLatest: async (theoryId) => {
    const sql = `
      SELECT *
      FROM analyses
      WHERE theory_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await query(sql, [theoryId]);
    return result.rows[0] || null;
  },

  // Get all analyses for a theory
  getAll: async (theoryId) => {
    const sql = `
      SELECT *
      FROM analyses
      WHERE theory_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await query(sql, [theoryId]);
    return result.rows;
  },

  // Get analysis by ID
  getById: async (id) => {
    const sql = `
      SELECT a.*, t.title as theory_title
      FROM analyses a
      JOIN theories t ON a.theory_id = t.id
      WHERE a.id = $1
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }
};

module.exports = AnalysisModel;
