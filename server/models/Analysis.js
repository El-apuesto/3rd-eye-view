const db = require('../config/database');

class Analysis {
  static async create(data) {
    const query = `
      INSERT INTO analysis_history (
        theory_id, analysis_method, confidence_category, confidence_score,
        knowability_rating, evidence_count, credible_sources_count,
        contradictions_found, pattern_matches, motivational_analysis,
        counter_narrative_analysis, ai_reasoning, full_analysis_json,
        analyzed_by, ai_model, processing_time_ms
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;
    const values = [
      data.theory_id,
      data.analysis_method,
      data.confidence_category,
      data.confidence_score,
      data.knowability_rating,
      data.evidence_count,
      data.credible_sources_count,
      data.contradictions_found,
      data.pattern_matches,
      data.motivational_analysis,
      data.counter_narrative_analysis,
      data.ai_reasoning,
      JSON.stringify(data.full_analysis_json),
      data.analyzed_by,
      data.ai_model,
      data.processing_time_ms
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM analysis_history WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByTheory(theoryId, filters = {}) {
    let query = `
      SELECT ah.*, u.username as analyzed_by_username
      FROM analysis_history ah
      LEFT JOIN users u ON ah.analyzed_by = u.id
      WHERE ah.theory_id = $1
    `;
    const params = [theoryId];
    let paramIndex = 2;

    if (filters.analysis_method) {
      query += ` AND ah.analysis_method = $${paramIndex++}`;
      params.push(filters.analysis_method);
    }

    query += ' ORDER BY ah.analyzed_at DESC';

    const limit = filters.limit || 10;
    query += ` LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await db.query(query, params);
    return result.rows;
  }

  static async getLatestByTheory(theoryId, method) {
    const query = `
      SELECT ah.*, u.username as analyzed_by_username
      FROM analysis_history ah
      LEFT JOIN users u ON ah.analyzed_by = u.id
      WHERE ah.theory_id = $1 AND ah.analysis_method = $2
      ORDER BY ah.analyzed_at DESC
      LIMIT 1
    `;
    const result = await db.query(query, [theoryId, method]);
    return result.rows[0];
  }

  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_analyses,
        COUNT(DISTINCT theory_id) as theories_analyzed,
        AVG(confidence_score) as avg_confidence,
        AVG(processing_time_ms) as avg_processing_time,
        confidence_category,
        COUNT(*) as category_count
      FROM analysis_history
      GROUP BY confidence_category
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = Analysis;
