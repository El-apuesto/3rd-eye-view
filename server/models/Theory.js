const db = require('../config/database');

class Theory {
  static async findById(id) {
    const result = await db.query('SELECT * FROM theories WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM theories WHERE 1=1';
    const params = [];

    if (filters.category) {
      params.push(filters.category);
      query += ` AND category = $${params.length}`;
    }

    if (filters.status) {
      params.push(filters.status);
      query += ` AND status = $${params.length}`;
    }

    query += ' ORDER BY popularity DESC LIMIT 100';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async create(data) {
    const query = `
      INSERT INTO theories (title, description, category, official_narrative, event_date, popularity)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [
      data.title,
      data.description,
      data.category,
      data.officialNarrative,
      data.eventDate,
      data.popularity || 0
    ]);
    return result.rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE theories
      SET title = $1, description = $2, category = $3, official_narrative = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(query, [
      data.title,
      data.description,
      data.category,
      data.officialNarrative,
      id
    ]);
    return result.rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM theories WHERE id = $1', [id]);
  }

  static async search(query) {
    const result = await db.query(
      `SELECT * FROM theories 
       WHERE title ILIKE $1 OR description ILIKE $1 
       ORDER BY popularity DESC LIMIT 50`,
      [`%${query}%`]
    );
    return result.rows;
  }
}

module.exports = Theory;