const express = require('express');
const router = express.Router();
const AIAnalysisService = require('../services/aiAnalysisService');
const Theory = require('../models/Theory');
const Analysis = require('../models/Analysis');

// POST analyze theory with selected method
router.post('/theory/:id', async (req, res, next) => {
  try {
    const { method = 'all', userWeights = {} } = req.body;
    const theoryId = req.params.id;

    // Get theory data
    const theory = await Theory.findById(theoryId);
    if (!theory) {
      return res.status(404).json({ error: 'Theory not found' });
    }

    // Validate method
    const validMethods = ['multi-tier', 'evidence-based', 'comparative', 'all'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ 
        error: 'Invalid analysis method',
        validMethods 
      });
    }

    // Perform analysis
    let analysisResults;
    
    if (method === 'all') {
      analysisResults = await Promise.all([
        AIAnalysisService.multiTierAnalysis(theory, userWeights),
        AIAnalysisService.evidenceBasedAnalysis(theory, userWeights),
        AIAnalysisService.comparativeAnalysis(theory, userWeights)
      ]);
      
      analysisResults = {
        multiTier: analysisResults[0],
        evidenceBased: analysisResults[1],
        comparative: analysisResults[2]
      };
    } else if (method === 'multi-tier') {
      analysisResults = await AIAnalysisService.multiTierAnalysis(theory, userWeights);
    } else if (method === 'evidence-based') {
      analysisResults = await AIAnalysisService.evidenceBasedAnalysis(theory, userWeights);
    } else if (method === 'comparative') {
      analysisResults = await AIAnalysisService.comparativeAnalysis(theory, userWeights);
    }

    // Save analysis to database
    const analysis = await Analysis.create({
      theoryId,
      method,
      results: analysisResults,
      userWeights,
      performedBy: req.user?.id || null
    });

    res.json({
      message: 'Analysis completed successfully',
      analysis: analysisResults,
      analysisId: analysis.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// POST analyze custom theory (not in database yet)
router.post('/custom', async (req, res, next) => {
  try {
    const { theory, method = 'multi-tier', userWeights = {} } = req.body;

    if (!theory || !theory.title || !theory.description) {
      return res.status(400).json({ 
        error: 'Theory title and description required' 
      });
    }

    let analysisResults;
    
    if (method === 'multi-tier') {
      analysisResults = await AIAnalysisService.multiTierAnalysis(theory, userWeights);
    } else if (method === 'evidence-based') {
      analysisResults = await AIAnalysisService.evidenceBasedAnalysis(theory, userWeights);
    } else if (method === 'comparative') {
      analysisResults = await AIAnalysisService.comparativeAnalysis(theory, userWeights);
    } else {
      return res.status(400).json({ error: 'Invalid analysis method' });
    }

    res.json({
      message: 'Analysis completed successfully',
      analysis: analysisResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// GET analysis by ID
router.get('/:id', async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error) {
    next(error);
  }
});

// POST compare multiple theories
router.post('/compare', async (req, res, next) => {
  try {
    const { theoryIds, userWeights = {} } = req.body;

    if (!theoryIds || !Array.isArray(theoryIds) || theoryIds.length < 2) {
      return res.status(400).json({ 
        error: 'At least 2 theory IDs required for comparison' 
      });
    }

    if (theoryIds.length > 5) {
      return res.status(400).json({ 
        error: 'Maximum 5 theories can be compared at once' 
      });
    }

    const theories = await Promise.all(
      theoryIds.map(id => Theory.findById(id))
    );

    const comparison = await AIAnalysisService.compareMultipleTheories(theories, userWeights);

    res.json({
      message: 'Comparison completed successfully',
      comparison,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// POST pattern recognition check
router.post('/pattern-check/:id', async (req, res, next) => {
  try {
    const theory = await Theory.findById(req.params.id);
    
    if (!theory) {
      return res.status(404).json({ error: 'Theory not found' });
    }

    const patterns = await AIAnalysisService.checkHistoricalPatterns(theory);

    res.json({
      message: 'Pattern recognition completed',
      patterns,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// POST motivational analysis
router.post('/motivation/:id', async (req, res, next) => {
  try {
    const theory = await Theory.findById(req.params.id);
    
    if (!theory) {
      return res.status(404).json({ error: 'Theory not found' });
    }

    const motivation = await AIAnalysisService.analyzeMotivation(theory);

    res.json({
      message: 'Motivational analysis completed',
      motivation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
