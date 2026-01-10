const express = require('express');
const router = express.Router();
const Evidence = require('../models/Evidence');
const EvidenceTracker = require('../services/evidenceTracker');

// GET evidence for a theory
router.get('/theory/:theoryId', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, quality } = req.query;
    const offset = (page - 1) * limit;

    const evidence = await Evidence.findByTheory(req.params.theoryId, {
      type,
      quality,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Evidence.countByTheory(req.params.theoryId, { type, quality });

    res.json({
      evidence,
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

// GET single evidence item
router.get('/:id', async (req, res, next) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    res.json(evidence);
  } catch (error) {
    next(error);
  }
});

// POST submit new evidence
router.post('/', async (req, res, next) => {
  try {
    const evidenceData = {
      theoryId: req.body.theoryId,
      type: req.body.type,
      source: req.body.source,
      sourceUrl: req.body.sourceUrl,
      content: req.body.content,
      datePublished: req.body.datePublished,
      submittedBy: req.user?.id || null
    };

    // Validate evidence
    const validation = await EvidenceTracker.validateEvidence(evidenceData);
    
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Evidence validation failed',
        issues: validation.issues 
      });
    }

    // Assess evidence quality
    const quality = await EvidenceTracker.assessQuality(evidenceData);
    evidenceData.qualityScore = quality.score;
    evidenceData.qualityFactors = quality.factors;

    const evidence = await Evidence.create(evidenceData);

    res.status(201).json({
      message: 'Evidence submitted successfully',
      evidence,
      quality
    });
  } catch (error) {
    next(error);
  }
});

// POST check for destroyed evidence
router.post('/check-destroyed/:theoryId', async (req, res, next) => {
  try {
    const destroyed = await EvidenceTracker.checkDestroyedEvidence(req.params.theoryId);

    res.json({
      hasDestroyedEvidence: destroyed.found,
      details: destroyed.details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// POST assess investigation quality
router.post('/assess-investigation/:theoryId', async (req, res, next) => {
  try {
    const assessment = await EvidenceTracker.assessInvestigationQuality(req.params.theoryId);

    res.json({
      assessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// GET declassification timeline
router.get('/declassification/:theoryId', async (req, res, next) => {
  try {
    const timeline = await EvidenceTracker.getDeclassificationTimeline(req.params.theoryId);

    res.json({
      timeline,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// POST vote on evidence
router.post('/:id/vote', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { vote } = req.body; // 'helpful' or 'not-helpful'
    
    if (!['helpful', 'not-helpful'].includes(vote)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    await Evidence.addVote(req.params.id, req.user.id, vote);

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    next(error);
  }
});

// POST challenge evidence
router.post('/:id/challenge', async (req, res, next) => {
  try {
    const { reason, counterEvidence } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Challenge reason required' });
    }

    const challenge = await Evidence.addChallenge(req.params.id, {
      reason,
      counterEvidence,
      submittedBy: req.user?.id || null
    });

    res.status(201).json({
      message: 'Challenge submitted successfully',
      challenge
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
