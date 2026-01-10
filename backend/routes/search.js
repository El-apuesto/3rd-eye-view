const express = require('express');
const router = express.Router();
const SearchService = require('../services/searchService');
const Theory = require('../models/Theory');

// POST search web for theories
router.post('/web', async (req, res, next) => {
  try {
    const { query, sources = ['google', 'bing'], maxResults = 50 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = await SearchService.searchWeb(query, sources, maxResults);

    res.json({
      query,
      results,
      count: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// POST search theories in database
router.post('/theories', async (req, res, next) => {
  try {
    const { 
      query, 
      filters = {}, 
      page = 1, 
      limit = 20 
    } = req.body;

    const offset = (page - 1) * limit;

    const theories = await Theory.search(query, {
      ...filters,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Theory.searchCount(query, filters);

    res.json({
      query,
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

// POST track popularity
router.post('/popularity/:theoryId', async (req, res, next) => {
  try {
    const popularity = await SearchService.trackPopularity(req.params.theoryId);

    res.json({
      theoryId: req.params.theoryId,
      popularity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// GET trending theories
router.get('/trending', async (req, res, next) => {
  try {
    const { timeframe = '7d', limit = 10 } = req.query;

    const trending = await SearchService.getTrending(timeframe, parseInt(limit));

    res.json({
      trending,
      timeframe,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// POST search for related evidence
router.post('/evidence', async (req, res, next) => {
  try {
    const { query, theoryId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const evidence = await SearchService.searchEvidence(query, theoryId);

    res.json({
      query,
      evidence,
      count: evidence.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
