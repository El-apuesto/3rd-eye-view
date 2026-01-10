const { query } = require('../config/database');

const EvidenceModel = {
  // Get evidence for a theory
  getByTheory: async (theoryId, options = {}) => {
    const { type, sortBy = 'quality', limit = 50, offset = 0 } = options;
    
    let sql = `
      SELECT e.*,
        (e.upvotes - e.downvotes) as net_votes
      FROM evidence e
      WHERE e.theory_id = $1
    `;
    
    const params = [theoryId];
    let paramIndex = 2;
    
    if (type) {
      sql += ` AND e.evidence_type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    
    // Sorting
    switch (sortBy) {
      case 'quality':
        sql += ` ORDER BY e.quality_score DESC, net_votes DESC`;
        break;
      case 'votes':
        sql += ` ORDER BY net_votes DESC`;
        break;
      case 'recent':
        sql += ` ORDER BY e.created_at DESC`;
        break;
      default:
        sql += ` ORDER BY e.created_at DESC`;
    }
    
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await query(sql, params);
    return result.rows;
  },

  // Create new evidence
  create: async (data) => {
    const sql = `
      INSERT INTO evidence (
        theory_id, source_url, description, evidence_type,
        supports_claim, submitted_by, quality_score,
        source_credibility, verification_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      data.theoryId,
      data.sourceUrl,
      data.description,
      data.evidenceType || 'general',
      data.supportsClaim !== undefined ? data.supportsClaim : null,
      data.submittedBy || 'anonymous',
      data.qualityScore || 0,
      data.sourceCredibility || 0,
      data.verificationStatus || 'unverified'
    ];
    
    const result = await query(sql, values);
    return result.rows[0];
  },

  // Add vote to evidence
  addVote: async (evidenceId, voteType, userId) => {
    let sql;
    
    if (voteType === 'up') {
      sql = 'UPDATE evidence SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *';
    } else if (voteType === 'down') {
      sql = 'UPDATE evidence SET downvotes = downvotes + 1 WHERE id = $1 RETURNING *';
    } else if (voteType === 'report') {
      sql = 'UPDATE evidence SET report_count = report_count + 1 WHERE id = $1 RETURNING *';
    }
    
    const result = await query(sql, [evidenceId]);
    return result.rows[0] || null;
  },

  // Get evidence by ID
  getById: async (id) => {
    const sql = 'SELECT * FROM evidence WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }
};

module.exports = EvidenceModel;
