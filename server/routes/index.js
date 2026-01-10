const express = require('express');
const router = express.Router();

const theoryController = require('../controllers/theoryController');
const analysisController = require('../controllers/analysisController');
const evidenceController = require('../controllers/evidenceController');
const searchController = require('../controllers/searchController');

// Theory routes
router.get('/theories', theoryController.getAllTheories);
router.get('/theories/trending', theoryController.getTrendingTheories);
router.get('/theories/:id', theoryController.getTheoryById);
router.post('/theories', theoryController.createTheory);
router.put('/theories/:id', theoryController.updateTheory);

// Analysis routes
router.post('/analyze', analysisController.analyzeTheory);
router.get('/analysis/:theoryId', analysisController.getAnalysis);
router.post('/analysis/:theoryId/methods', analysisController.runAnalysisMethod);

// Evidence routes
router.get('/evidence/:theoryId', evidenceController.getEvidence);
router.post('/evidence', evidenceController.submitEvidence);
router.put('/evidence/:id/vote', evidenceController.voteOnEvidence);

// Search routes
router.post('/search', searchController.searchWeb);
router.get('/search/popularity/:query', searchController.getPopularity);

// Pattern matching
router.get('/patterns/:theoryId', analysisController.getHistoricalPatterns);

// Source track record
router.get('/sources/:sourceName/track-record', evidenceController.getSourceTrackRecord);

module.exports = router;
