const db = require('../config/database');

class Theory {
  static async findAll(filters = {}) {
    let query = `
      SELECT t.*,
        (SELECT COUNT(*) FROM theory_sources WHERE theory_id = t.id) as source_count,
        (SELECT COUNT(*) FROM analysis_history WHERE theory_id = t.id) as analysis_count
      FROM theories t
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.category) {
      query += ` AND t.category = $${paramIndex++}`;
      params.push(filters.category);
    }

    if (filters.status) {
      query += ` AND t.status = $${paramIndex++}`;
      params.push(filters.status);
    }

    if (filters.government_related !== undefined) {
      query += ` AND t.government_related = $${paramIndex++}`;
      params.push(filters.government_related);
    }

    if (filters.search) {
      query += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    const orderBy = filters.orderBy || 'popularity_score';
    const order = filters.order || 'DESC';
    query += ` ORDER BY t.${orderBy} ${order}`;

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT t.*,
        (SELECT COUNT(*) FROM theory_sources WHERE theory_id = t.id) as source_count,
        (SELECT COUNT(*) FROM analysis_history WHERE theory_id = t.id) as analysis_count
      FROM theories t
      WHERE t.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO theories (
        title, description, category, official_narrative, 
        conspiracy_narrative, timeline_date, government_related
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.category,
      data.official_narrative,
      data.conspiracy_narrative,
      data.timeline_date,
      data.government_related || false
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'title', 'description', 'category', 'status', 'official_narrative',
      'conspiracy_narrative', 'popularity_score', 'search_volume', 
      'social_mentions', 'evidence_destroyed', 'investigation_quality_score'
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(data[field]);
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push(`last_updated = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE theories
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM theories WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getSources(theoryId, filters = {}) {
    let query = `
      SELECT ts.*, str.source_name, str.source_type, str.credibility_score
      FROM theory_sources ts
      JOIN source_track_records str ON ts.source_id = str.id
      WHERE ts.theory_id = $1
    `;
    const params = [theoryId];
    let paramIndex = 2;

    if (filters.supports_conspiracy !== undefined) {
      query += ` AND ts.supports_conspiracy = $${paramIndex++}`;
      params.push(filters.supports_conspiracy);
    }

    if (filters.verified !== undefined) {
      query += ` AND ts.verified = $${paramIndex++}`;
      params.push(filters.verified);
    }

    query += ' ORDER BY ts.evidence_quality DESC, ts.added_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async getAnalysisHistory(theoryId, limit = 10) {
    const query = `
      SELECT ah.*, u.username as analyzed_by_username
      FROM analysis_history ah
      LEFT JOIN users u ON ah.analyzed_by = u.id
      WHERE ah.theory_id = $1
      ORDER BY ah.analyzed_at DESC
      LIMIT $2
    `;
    const result = await db.query(query, [theoryId, limit]);
    return result.rows;
  }

  static async updatePopularityScore(theoryId, score) {
    const query = `
      UPDATE theories
      SET popularity_score = $1, last_updated = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [score, theoryId]);
    return result.rows[0];
  }
}

module.exports = Theory;
