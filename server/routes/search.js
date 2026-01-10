const express = require('express');
const router = express.Router();
const SearchService = require('../services/searchService');
const { validateSearchQuery } = require('../middleware/validation');

// Search web for theories
router.get('/web', validateSearchQuery, async (req, res, next) => {
  try {
    const { query, maxResults = 20, searchEngine = 'google' } = req.query;
    
    const results = await SearchService.searchWeb(query, {
      maxResults: parseInt(maxResults),
      searchEngine
    });

    res.json({
      query,
      results,
      count: results.length
    });
  } catch (error) {
    next(error);
  }
});

// Search government documents
router.get('/government', validateSearchQuery, async (req, res, next) => {
  try {
    const { query } = req.query;
    
    const results = await SearchService.searchGovernmentDocs(query);

    res.json({
      query,
      results,
      count: results.length
    });
  } catch (error) {
    next(error);
  }
});

// Fetch page content
router.get('/fetch', async (req, res, next) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    const content = await SearchService.fetchPageContent(url);
    
    if (!content) {
      return res.status(404).json({ error: 'Could not fetch content' });
    }

    res.json({ content });
  } catch (error) {
    next(error);
  }
});

// Track popularity
router.get('/popularity', validateSearchQuery, async (req, res, next) => {
  try {
    const { query } = req.query;
    
    const metrics = await SearchService.trackPopularity(query);

    res.json({
      query,
      metrics
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
