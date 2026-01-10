const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const query = `
      INSERT INTO users (email, password_hash, username)
      VALUES ($1, $2, $3)
      RETURNING id, email, username, created_at
    `;
    const result = await db.query(query, [data.email, hashedPassword, data.username]);
    return result.rows[0];
  }

  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return null;

    return { id: user.id, email: user.email, username: user.username };
  }

  static async updatePreferences(userId, preferences) {
    const result = await db.query(
      'UPDATE users SET preferences = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(preferences), userId]
    );
    return result.rows[0];
  }
}

module.exports = User;