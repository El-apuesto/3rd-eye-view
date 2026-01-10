const express = require('express');
const router = express.Router();
const Source = require('../models/Source');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all sources
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      source_type: req.query.source_type,
      min_credibility: req.query.min_credibility ? parseFloat(req.query.min_credibility) : undefined
    };

    const sources = await Source.findAll(filters);
    res.json({ sources });
  } catch (error) {
    next(error);
  }
});

// Get source by ID
router.get('/:id', async (req, res, next) => {
  try {
    const source = await Source.findById(parseInt(req.params.id));
    
    if (!source) {
      return res.status(404).json({ error: 'Source not found' });
    }

    res.json({ source });
  } catch (error) {
    next(error);
  }
});

// Create new source
router.post('/', authenticateToken, requireRole('moderator', 'admin'), async (req, res, next) => {
  try {
    const sourceData = {
      source_name: req.body.source_name,
      source_url: req.body.source_url,
      source_type: req.body.source_type,
      credibility_score: req.body.credibility_score,
      political_lean: req.body.political_lean
    };

    // Check if source already exists
    const existing = await Source.findByName(sourceData.source_name);
    if (existing) {
      return res.status(400).json({ error: 'Source already exists' });
    }

    const source = await Source.create(sourceData);
    res.status(201).json({ source });
  } catch (error) {
    next(error);
  }
});

// Update source
router.put('/:id', authenticateToken, requireRole('moderator', 'admin'), async (req, res, next) => {
  try {
    const source = await Source.update(parseInt(req.params.id), req.body);
    
    if (!source) {
      return res.status(404).json({ error: 'Source not found' });
    }

    res.json({ source });
  } catch (error) {
    next(error);
  }
});

// Update source track record
router.post('/:id/track-record', authenticateToken, requireRole('moderator', 'admin'), async (req, res, next) => {
  try {
    const { wasAccurate } = req.body;
    
    if (typeof wasAccurate !== 'boolean') {
      return res.status(400).json({ error: 'wasAccurate must be boolean' });
    }

    const source = await Source.updateTrackRecord(parseInt(req.params.id), wasAccurate);
    res.json({ source });
  } catch (error) {
    next(error);
  }
});

// Add source to theory
router.post('/theory/:theoryId', authenticateToken, async (req, res, next) => {
  try {
    const sourceData = {
      theory_id: parseInt(req.params.theoryId),
      source_id: req.body.source_id,
      url: req.body.url,
      title: req.body.title,
      content_snippet: req.body.content_snippet,
      supports_conspiracy: req.body.supports_conspiracy,
      evidence_type: req.body.evidence_type,
      evidence_quality: req.body.evidence_quality,
      added_by: req.user.id
    };

    const theorySource = await Source.addTheorySource(sourceData);
    res.status(201).json({ theorySource });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
