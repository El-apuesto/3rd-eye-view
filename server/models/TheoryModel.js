const { query } = require('../config/database');

const TheoryModel = {
  // Get all theories with filters
  getAll: async (options = {}) => {
    const { limit = 20, offset = 0, category, status, sortBy = 'popularity' } = options;
    
    let sql = `
      SELECT t.*, 
        COUNT(DISTINCT e.id) as evidence_count,
        AVG(a.confidence_score) as avg_confidence,
        t.view_count as popularity
      FROM theories t
      LEFT JOIN evidence e ON t.id = e.theory_id
      LEFT JOIN analyses a ON t.id = a.theory_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (category) {
      sql += ` AND t.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (status) {
      sql += ` AND t.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    sql += ` GROUP BY t.id`;
    
    // Sorting
    switch (sortBy) {
      case 'popularity':
        sql += ` ORDER BY t.view_count DESC`;
        break;
      case 'recent':
        sql += ` ORDER BY t.created_at DESC`;
        break;
      case 'confidence':
        sql += ` ORDER BY avg_confidence DESC`;
        break;
      default:
        sql += ` ORDER BY t.updated_at DESC`;
    }
    
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await query(sql, params);
    return result.rows;
  },

  // Get trending theories
  getTrending: async (limit = 10) => {
    const sql = `
      SELECT t.*, 
        COUNT(DISTINCT e.id) as evidence_count,
        t.view_count,
        (t.view_count * 0.6 + COUNT(DISTINCT e.id) * 0.4) as trend_score
      FROM theories t
      LEFT JOIN evidence e ON t.id = e.theory_id
      WHERE t.created_at > NOW() - INTERVAL '30 days'
      GROUP BY t.id
      ORDER BY trend_score DESC
      LIMIT $1
    `;
    
    const result = await query(sql, [limit]);
    return result.rows;
  },

  // Get theory by ID
  getById: async (id) => {
    const sql = `
      SELECT t.*,
        COUNT(DISTINCT e.id) as evidence_count,
        COUNT(DISTINCT a.id) as analysis_count
      FROM theories t
      LEFT JOIN evidence e ON t.id = e.theory_id
      LEFT JOIN analyses a ON t.id = a.theory_id
      WHERE t.id = $1
      GROUP BY t.id
    `;
    
    const result = await query(sql, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Increment view count
    await query('UPDATE theories SET view_count = view_count + 1 WHERE id = $1', [id]);
    
    return result.rows[0];
  },

  // Create new theory
  create: async (data) => {
    const sql = `
      INSERT INTO theories (
        title, description, category, tags, submitted_by, 
        initial_search_data, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `;
    
    const values = [
      data.title,
      data.description,
      data.category || 'uncategorized',
      JSON.stringify(data.tags || []),
      data.submittedBy || 'anonymous',
      JSON.stringify(data.initialSearchResults || {})
    ];
    
    const result = await query(sql, values);
    return result.rows[0];
  },

  // Update theory
  update: async (id, data) => {
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    const allowedFields = ['title', 'description', 'category', 'tags', 'status'];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(field === 'tags' ? JSON.stringify(data[field]) : data[field]);
        paramIndex++;
      }
    }
    
    if (updates.length === 0) {
      return null;
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    const sql = `
      UPDATE theories
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0] || null;
  }
};

module.exports = TheoryModel;
