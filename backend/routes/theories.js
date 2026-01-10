const express = require('express');
const router = express.Router();
const Theory = require('../models/Theory');
const { validateTheory } = require('../middleware/validation');

// GET all theories with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      sortBy = 'popularity',
      order = 'desc',
      search
    } = req.query;

    const offset = (page - 1) * limit;

    const theories = await Theory.findAll({
      category,
      status,
      search,
      sortBy,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Theory.count({ category, status, search });

    res.json({
      theories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET single theory by ID
router.get('/:id', async (req, res, next) => {
  try {
    const theory = await Theory.findById(req.params.id);
    
    if (!theory) {
      return res.status(404).json({ error: 'Theory not found' });
    }

    res.json(theory);
  } catch (error) {
    next(error);
  }
});

// GET theory analysis history
router.get('/:id/history', async (req, res, next) => {
  try {
    const history = await Theory.getAnalysisHistory(req.params.id);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

// GET theory evidence
router.get('/:id/evidence', async (req, res, next) => {
  try {
    const evidence = await Theory.getEvidence(req.params.id);
    res.json(evidence);
  } catch (error) {
    next(error);
  }
});

// GET related theories
router.get('/:id/related', async (req, res, next) => {
  try {
    const related = await Theory.findRelated(req.params.id);
    res.json(related);
  } catch (error) {
    next(error);
  }
});

// POST create new theory
router.post('/', validateTheory, async (req, res, next) => {
  try {
    const theoryData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      tags: req.body.tags || [],
      submittedBy: req.user?.id || null,
      status: 'pending'
    };

    const theory = await Theory.create(theoryData);
    
    res.status(201).json({
      message: 'Theory submitted successfully',
      theory
    });
  } catch (error) {
    next(error);
  }
});

// PUT update theory
router.put('/:id', validateTheory, async (req, res, next) => {
  try {
    const theory = await Theory.update(req.params.id, req.body);
    
    if (!theory) {
      return res.status(404).json({ error: 'Theory not found' });
    }

    res.json({
      message: 'Theory updated successfully',
      theory
    });
  } catch (error) {
    next(error);
  }
});

// POST save theory for user
router.post('/:id/save', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    await Theory.saveForUser(req.params.id, req.user.id);
    
    res.json({ message: 'Theory saved successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE unsave theory for user
router.delete('/:id/save', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    await Theory.unsaveForUser(req.params.id, req.user.id);
    
    res.json({ message: 'Theory unsaved successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
