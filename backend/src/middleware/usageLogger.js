const pool = require('../config/database');

function usageLogger(req, res, next) {
  const start = Date.now();
  const requestSize = req.headers['content-length'] || 0;
  
  res.on('finish', async () => {
    const responseTime = Date.now() - start;
    const responseSize = res.get('content-length') || 0;
    
    try {
      await pool.query(
        `INSERT INTO usage_logs 
         (user_id, endpoint, method, status_code, request_size_bytes, response_size_bytes, response_time_ms, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          req.user?.id || null,
          req.path,
          req.method,
          res.statusCode,
          parseInt(requestSize),
          parseInt(responseSize),
          responseTime,
          req.ip
        ]
      );
    } catch (error) {
      console.error('Usage logging error:', error);
    }
  });
  
  next();
}

module.exports = usageLogger;