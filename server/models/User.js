const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async findAll(filters = {}) {
    let query = 'SELECT id, username, email, created_at, role, is_active FROM users WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.role) {
      query += ` AND role = $${paramIndex++}`;
      params.push(filters.role);
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramIndex++}`;
      params.push(filters.is_active);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, created_at, updated_at, role, is_active FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(query, [username]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, created_at, role
    `;
    const values = [data.username, data.email, hashedPassword, data.role || 'user'];
    const result = await db.query(query, values);
    
    // Create default preferences
    await this.createDefaultPreferences(result.rows[0].id);
    
    return result.rows[0];
  }

  static async createDefaultPreferences(userId) {
    const query = `
      INSERT INTO user_preferences (user_id)
      VALUES ($1)
      RETURNING *
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async getPreferences(userId) {
    const query = 'SELECT * FROM user_preferences WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async updatePreferences(userId, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'government_source_weight', 'mainstream_media_weight', 'alternative_media_weight',
      'academic_source_weight', 'whistleblower_weight', 'preferred_analysis_method',
      'show_government_filter', 'track_reading_history'
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
    values.push(userId);

    const query = `
      UPDATE user_preferences
      SET ${fields.join(', ')}
      WHERE user_id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async verifyPassword(username, password) {
    const user = await this.findByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;
    
    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getSavedTheories(userId) {
    const query = `
      SELECT st.*, t.title, t.description, t.category, t.status
      FROM saved_theories st
      JOIN theories t ON st.theory_id = t.id
      WHERE st.user_id = $1
      ORDER BY st.saved_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async saveTheory(userId, theoryId, notes = null) {
    const query = `
      INSERT INTO saved_theories (user_id, theory_id, notes)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, theory_id) 
      DO UPDATE SET notes = $3, saved_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await db.query(query, [userId, theoryId, notes]);
    return result.rows[0];
  }

  static async unsaveTheory(userId, theoryId) {
    const query = 'DELETE FROM saved_theories WHERE user_id = $1 AND theory_id = $2 RETURNING *';
    const result = await db.query(query, [userId, theoryId]);
    return result.rows[0];
  }
}

module.exports = User;
