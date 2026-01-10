const db = require('../config/database');

class Evidence {
  static async findByTheoryId(theoryId) {
    const result = await db.query(
      'SELECT * FROM evidence WHERE theory_id = $1 ORDER BY credibility_score DESC',
      [theoryId]
    );
    return result.rows;
  }

  static async create(data) {
    const query = `
      INSERT INTO evidence (theory_id, source, description, url, credibility_score, evidence_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [
      data.theoryId,
      data.source,
      data.description,
      data.url,
      data.credibilityScore || 50,
      data.evidenceType
    ]);
    return result.rows[0];
  }

  static async updateCredibilityScore(id, score) {
    const result = await db.query(
      'UPDATE evidence SET credibility_score = $1 WHERE id = $2 RETURNING *',
      [score, id]
    );
    return result.rows[0];
  }

  static async flagAsDestroyed(id) {
    const result = await db.query(
      'UPDATE evidence SET is_destroyed = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Evidence;