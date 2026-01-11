const pool = require('../config/database');

function generateWatermark() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 14).toUpperCase();
  return `3EV-${date}-${random}`;
}

async function createWatermark(resultId) {
  const watermark = generateWatermark();
  
  await pool.query(
    'INSERT INTO watermarks (watermark_code, result_id) VALUES ($1, $2)',
    [watermark, resultId]
  );
  
  return watermark;
}

async function verifyWatermark(watermarkCode) {
  const result = await pool.query(
    'SELECT * FROM watermarks WHERE watermark_code = $1',
    [watermarkCode]
  );
  
  return result.rows.length > 0 ? result.rows[0] : null;
}

module.exports = { generateWatermark, createWatermark, verifyWatermark };