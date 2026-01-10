const express = require('express');
const router = express.Router();
const Theory = require('../models/Theory');
const { authenticateOptional, authenticateToken, requireRole } = require('../middleware/auth');
const { validateTheoryInput } = require('../middleware/validation');

// Get all theories with filtering
router.get('/', authenticateOptional, async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status,
      government_related: req.query.government_related === 'true',
      search: req.query.search,
      orderBy: req.query.orderBy || 'popularity_score',
      order: req.query.order || 'DESC',
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0
    };

    const theories = await Theory.findAll(filters);
    res.json({
      theories,
      count: theories.length,
      filters
    });
  } catch (error) {
    next(error);
  }
});

// Get single theory by ID
router.get('/:id', authenticateOptional, async (req, res, next) => {
  try {
    const theory = await Theory.findById(parseInt(req.params.id));
    
    if (!theory) {
      return res.status(404).json({ error: 'Theory not found' });
    }

    // Get sources and analysis history
    const sources = await Theory.getSources(theory.id);
    const analysisHistory = await Theory.getAnalysisHistory(theory.id);

    res.json({
      theory,
      sources,
      analysisHistory
    });
  } catch (error) {
    next(error);
  }
});

// Create new theory
router.post('/', authenticateToken, validateTheoryInput, async (req, res, next) => {
  try {
    const theoryData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      official_narrative: req.body.official_narrative,
      conspiracy_narrative: req.body.conspiracy_narrative,
      timeline_date: req.body.timeline_date,
      government_related: req.body.government_related
    };

    const theory = await Theory.create(theoryData);
    res.status(201).json({ theory });
  } catch (error) {
    next(error);
  }
});

// Update theory
router.put('/:id', authenticateToken, requireRole('moderator', 'admin'), async (req, res, next) => {
  try {
    const theory = await Theory.update(parseInt(req.params.id), req.body);
    
    if (!theory) {
      return res.status(404).json({ error: 'Theory not found' });
    }

    res.json({ theory });
  } catch (error) {
    next(error);
  }
});

// Delete theory
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res, next) => {
  try {
    const theory = await Theory.delete(parseInt(req.params.id));
    
    if (!theory) {
      return res.status(404).json({ error: 'Theory not found' });
    }

    res.json({ message: 'Theory deleted', theory });
  } catch (error) {
    next(error);
  }
});

// Get theory sources
router.get('/:id/sources', async (req, res, next) => {
  try {
    const filters = {
      supports_conspiracy: req.query.supports_conspiracy === 'true' ? true : 
                          req.query.supports_conspiracy === 'false' ? false : undefined,
      verified: req.query.verified === 'true'
    };

    const sources = await Theory.getSources(parseInt(req.params.id), filters);
    res.json({ sources });
  } catch (error) {
    next(error);
  }
});

// Get theory analysis history
router.get('/:id/analysis', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await Theory.getAnalysisHistory(parseInt(req.params.id), limit);
    res.json({ history });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
