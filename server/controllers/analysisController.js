const aiEngine = require('../services/aiAnalysisEngine');
const evidenceTracking = require('../services/evidenceTrackingService');
const misuseDetection = require('../services/misuseDetectionService');
const watermarkService = require('../services/watermarkService');
const Theory = require('../models/Theory');
const Evidence = require('../models/Evidence');

class AnalysisController {
  async analyzeTheory(req, res) {
    try {
      const { theoryId, method } = req.body;
      const userId = req.user.id;

      const accessCheck = misuseDetection.checkAccess(userId, 'analyze_theory');
      if (!accessCheck.allowed) {
        return res.status(403).json({ error: accessCheck.reason });
      }

      misuseDetection.logUsage(userId, 'analyze_theory', { theoryId, method });

      const theory = await Theory.findById(theoryId);
      const evidence = await Evidence.findByTheoryId(theoryId);

      let result;
      switch (method) {
        case '1A':
          result = await aiEngine.analyzeWithConfidenceSystem(theory, evidence);
          break;
        case '1B':
          result = await aiEngine.analyzeEvidenceQuality(evidence);
          break;
        case '1C':
          result = await aiEngine.compareNarratives(theory, theory.officialNarrative, evidence);
          break;
        case 'complete':
          result = await aiEngine.analyzeComplete(theory, evidence, theory.officialNarrative);
          break;
        default:
          return res.status(400).json({ error: 'Invalid method' });
      }

      const destroyedEvidence = await evidenceTracking.trackDestroyedEvidence(theoryId, evidence);
      const watermarked = watermarkService.generateWatermark(result, userId, theoryId);

      res.json({
        analysis: watermarked,
        destroyedEvidence,
        method
      });
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: 'Analysis failed' });
    }
  }

  async analyzeMotivation(req, res) {
    try {
      const { theoryId } = req.params;
      const theory = await Theory.findById(theoryId);
      const result = await aiEngine.analyzeMotivation(theory);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Motivation analysis failed' });
    }
  }

  async matchPatterns(req, res) {
    try {
      const { theoryId } = req.params;
      const theory = await Theory.findById(theoryId);
      const result = await aiEngine.matchHistoricalPatterns(theory);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Pattern matching failed' });
    }
  }

  async assessInvestigation(req, res) {
    try {
      const { theoryId } = req.params;
      const theory = await Theory.findById(theoryId);
      const result = await evidenceTracking.assessInvestigationQuality(theory.investigation || {});

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Investigation assessment failed' });
    }
  }
}

module.exports = new AnalysisController();