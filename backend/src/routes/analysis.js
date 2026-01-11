const express = require('express');
const { runFullAnalysis } = require('../services/analysisOrchestrator');
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const abuseDetection = require('../middleware/abuseDetection');
const pool = require('../config/database');

const router = express.Router();

router.post('/', auth, rateLimiter, abuseDetection, async (req, res) => {
  try {
    const { query, queryType } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const result = await runFullAnalysis(query, req.user.id, req.ip);
    
    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed', message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT ar.*, aq.query_text, w.watermark_code
       FROM analysis_results ar
       JOIN analysis_queries aq ON ar.query_id = aq.id
       LEFT JOIN watermarks w ON w.result_id = ar.id
       WHERE ar.id = $1 AND aq.user_id = $2`,
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;
    const offset = (page - 1) * perPage;
    
    const result = await pool.query(
      `SELECT ar.id, aq.query_text, ar.overall_confidence_score, ar.created_at, w.watermark_code
       FROM analysis_results ar
       JOIN analysis_queries aq ON ar.query_id = aq.id
       LEFT JOIN watermarks w ON w.result_id = ar.id
       WHERE aq.user_id = $1
       ORDER BY ar.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, perPage, offset]
    );
    
    res.json({
      analyses: result.rows,
      page,
      perPage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;