const express = require('express');
const router = express.Router();
const AIService = require('../services/aiService');
const Analysis = require('../models/Analysis');
const Theory = require('../models/Theory');
const User = require('../models/User');
const { authenticateOptional, authenticateToken } = require('../middleware/auth');

// Analyze a theory
router.post('/theory/:id', authenticateOptional, async (req, res, next) => {
  try {
    const theoryId = parseInt(req.params.id);
    const { method = 'confidence_system', includeMotivation = false, includeCounterNarrative = false, includePatterns = false } = req.body;

    // Get theory and sources
    const theory = await Theory.findById(theoryId);
    if (!theory) {
      return res.status(404).json({ error: 'Theory not found' });
    }

    const sources = await Theory.getSources(theoryId);

    // Get user preferences if authenticated
    let userWeights = {};
    if (req.user) {
      const preferences = await User.getPreferences(req.user.id);
      userWeights = {
        government: preferences.government_source_weight,
        mainstream_media: preferences.mainstream_media_weight,
        alternative_media: preferences.alternative_media_weight,
        academic: preferences.academic_source_weight,
        whistleblower: preferences.whistleblower_weight
      };
    }

    // Perform analysis based on method
    let analysisResult;
    if (method === 'confidence_system') {
      analysisResult = await AIService.analyzeWithConfidenceSystem(theory, sources, userWeights);
    } else if (method === 'evidence_based') {
      analysisResult = await AIService.analyzeWithEvidenceScoring(theory, sources, userWeights);
    } else if (method === 'comparative') {
      analysisResult = await AIService.analyzeWithComparison(theory, sources, userWeights);
    } else {
      return res.status(400).json({ error: 'Invalid analysis method' });
    }

    // Optional additional analyses
    let motivationAnalysis, counterNarrativeAnalysis, patternMatching;
    
    if (includeMotivation) {
      motivationAnalysis = await AIService.analyzeMotivation(theory, sources);
    }
    
    if (includeCounterNarrative) {
      counterNarrativeAnalysis = await AIService.analyzeCounterNarrative(theory, sources);
    }
    
    if (includePatterns) {
      patternMatching = await AIService.findHistoricalPatterns(theory);
    }

    // Save analysis to database
    const analysisRecord = await Analysis.create({
      theory_id: theoryId,
      analysis_method: method,
      confidence_category: analysisResult.confidence_category,
      confidence_score: analysisResult.confidence_score,
      knowability_rating: analysisResult.knowability_rating,
      evidence_count: analysisResult.evidence_count,
      credible_sources_count: analysisResult.credible_sources_count,
      contradictions_found: analysisResult.contradictions_found,
      pattern_matches: patternMatching?.matching_patterns?.map(p => p.pattern) || [],
      motivational_analysis: typeof motivationAnalysis === 'string' ? motivationAnalysis : JSON.stringify(motivationAnalysis),
      counter_narrative_analysis: typeof counterNarrativeAnalysis === 'string' ? counterNarrativeAnalysis : JSON.stringify(counterNarrativeAnalysis),
      ai_reasoning: analysisResult.reasoning || analysisResult.analysis,
      full_analysis_json: {
        ...analysisResult,
        motivation: motivationAnalysis,
        counterNarrative: counterNarrativeAnalysis,
        patterns: patternMatching
      },
      analyzed_by: req.user?.id || null,
      ai_model: analysisResult.ai_model,
      processing_time_ms: analysisResult.processing_time_ms
    });

    res.json({
      analysis: analysisRecord,
      result: analysisResult,
      motivation: motivationAnalysis,
      counterNarrative: counterNarrativeAnalysis,
      patterns: patternMatching
    });
  } catch (error) {
    next(error);
  }
});

// Get analysis by ID
router.get('/:id', async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(parseInt(req.params.id));
    
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ analysis });
  } catch (error) {
    next(error);
  }
});

// Get statistics
router.get('/stats/overview', async (req, res, next) => {
  try {
    const stats = await Analysis.getStatistics();
    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
