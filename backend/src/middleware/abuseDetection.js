const pool = require('../config/database');

const queryCache = new Map();

async function detectAbuse(req, res, next) {
  const userId = req.user?.id;
  const query = req.body.query;
  const ip = req.ip;
  
  const cacheKey = `${userId || ip}`;
  const now = Date.now();
  
  if (queryCache.has(cacheKey)) {
    const requests = queryCache.get(cacheKey);
    const recentRequests = requests.filter(time => now - time < 10000);
    
    if (recentRequests.length > 5) {
      await createAbuseReport(userId, null, 'rapid_fire', 'medium', 'More than 5 requests in 10 seconds', true);
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    recentRequests.push(now);
    queryCache.set(cacheKey, recentRequests);
  } else {
    queryCache.set(cacheKey, [now]);
  }
  
  if (query) {
    const identicalKey = `${cacheKey}:${query}`;
    if (queryCache.has(identicalKey)) {
      await createAbuseReport(userId, null, 'repetitive_query', 'low', 'Identical query repeated', true);
    }
    queryCache.set(identicalKey, now);
  }
  
  const abuseKeywords = ['hack', 'exploit', 'ddos', 'spam'];
  if (query && abuseKeywords.some(kw => query.toLowerCase().includes(kw))) {
    await createAbuseReport(userId, null, 'suspicious_keywords', 'low', 'Query contains suspicious keywords', true);
  }
  
  next();
}

async function createAbuseReport(userId, queryId, abuseType, severity, description, automated) {
  try {
    await pool.query(
      `INSERT INTO abuse_reports (user_id, query_id, abuse_type, severity, description, automated_detection)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, queryId, abuseType, severity, description, automated]
    );
  } catch (error) {
    console.error('Error creating abuse report:', error);
  }
}

module.exports = detectAbuse;