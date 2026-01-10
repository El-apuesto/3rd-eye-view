const aiAnalysis = require('../services/aiAnalysis');
const patternMatcher = require('../services/patternMatcher');
const AnalysisModel = require('../models/AnalysisModel');
const TheoryModel = require('../models/TheoryModel');

const analysisController = {
  // Run complete analysis on a theory
  analyzeTheory: async (req, res) => {
    try {
      const { theoryId, methods = ['all'], userWeights = null } = req.body;
      
      if (!theoryId) {
        return res.status(400).json({ error: 'Theory ID is required' });
      }
      
      const theory = await TheoryModel.getById(theoryId);
      if (!theory) {
        return res.status(404).json({ error: 'Theory not found' });
      }
      
      console.log(`Starting analysis for theory: ${theory.title}`);
      
      // Determine which methods to run
      const methodsToRun = methods.includes('all') 
        ? ['confidence', 'evidence', 'comparative'] 
        : methods;
      
      const results = {};
      
      // Run each analysis method
      for (const method of methodsToRun) {
        console.log(`Running ${method} analysis...`);
        results[method] = await aiAnalysis.runAnalysis(theory, method, userWeights);
      }
      
      // Get historical patterns
      results.patterns = await patternMatcher.findPatterns(theory);
      
      // Save analysis results
      const analysis = await AnalysisModel.create({
        theoryId,
        methods: methodsToRun,
        results,
        userWeights
      });
      
      res.json({
        analysisId: analysis.id,
        theoryId,
        results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error analyzing theory:', error);
      res.status(500).json({ 
        error: 'Failed to analyze theory',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get existing analysis for a theory
  getAnalysis: async (req, res) => {
    try {
      const { theoryId } = req.params;
      const { latest = true } = req.query;
      
      const analysis = latest 
        ? await AnalysisModel.getLatest(theoryId)
        : await AnalysisModel.getAll(theoryId);
      
      if (!analysis) {
        return res.status(404).json({ error: 'No analysis found for this theory' });
      }
      
      res.json(analysis);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      res.status(500).json({ error: 'Failed to fetch analysis' });
    }
  },

  // Run specific analysis method
  runAnalysisMethod: async (req, res) => {
    try {
      const { theoryId } = req.params;
      const { method, userWeights = null } = req.body;
      
      if (!['confidence', 'evidence', 'comparative'].includes(method)) {
        return res.status(400).json({ error: 'Invalid analysis method' });
      }
      
      const theory = await TheoryModel.getById(theoryId);
      if (!theory) {
        return res.status(404).json({ error: 'Theory not found' });
      }
      
      const result = await aiAnalysis.runAnalysis(theory, method, userWeights);
      
      res.json({
        theoryId,
        method,
        result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error running analysis method:', error);
      res.status(500).json({ error: 'Failed to run analysis' });
    }
  },

  // Get historical patterns for a theory
  getHistoricalPatterns: async (req, res) => {
    try {
      const { theoryId } = req.params;
      
      const theory = await TheoryModel.getById(theoryId);
      if (!theory) {
        return res.status(404).json({ error: 'Theory not found' });
      }
      
      const patterns = await patternMatcher.findPatterns(theory);
      
      res.json({
        theoryId,
        patterns,
        matchCount: patterns.length
      });
    } catch (error) {
      console.error('Error finding patterns:', error);
      res.status(500).json({ error: 'Failed to find patterns' });
    }
  }
};

module.exports = analysisController;
