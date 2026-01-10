const db = require('../config/database');

class Source {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM source_track_records WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.source_type) {
      query += ` AND source_type = $${paramIndex++}`;
      params.push(filters.source_type);
    }

    if (filters.min_credibility) {
      query += ` AND credibility_score >= $${paramIndex++}`;
      params.push(filters.min_credibility);
    }

    query += ' ORDER BY credibility_score DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM source_track_records WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByName(name) {
    const query = 'SELECT * FROM source_track_records WHERE source_name = $1';
    const result = await db.query(query, [name]);
    return result.rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO source_track_records (
        source_name, source_url, source_type, credibility_score, political_lean
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      data.source_name,
      data.source_url,
      data.source_type,
      data.credibility_score || 0.5,
      data.political_lean || 'unknown'
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'source_name', 'source_url', 'source_type', 'credibility_score',
      'political_lean', 'verified_accurate_count', 'verified_inaccurate_count',
      'unverified_count'
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

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE source_track_records
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateTrackRecord(id, wasAccurate) {
    const field = wasAccurate ? 'verified_accurate_count' : 'verified_inaccurate_count';
    const query = `
      UPDATE source_track_records
      SET ${field} = ${field} + 1,
          credibility_score = CASE 
            WHEN (verified_accurate_count + verified_inaccurate_count + 1) > 0
            THEN (verified_accurate_count + ${wasAccurate ? 1 : 0})::DECIMAL / 
                 (verified_accurate_count + verified_inaccurate_count + 1)
            ELSE credibility_score
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async addTheorySource(data) {
    const query = `
      INSERT INTO theory_sources (
        theory_id, source_id, url, title, content_snippet,
        supports_conspiracy, evidence_type, evidence_quality, added_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      data.theory_id,
      data.source_id,
      data.url,
      data.title,
      data.content_snippet,
      data.supports_conspiracy,
      data.evidence_type,
      data.evidence_quality,
      data.added_by
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = Source;
