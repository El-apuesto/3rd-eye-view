const EvidenceModel = require('../models/EvidenceModel');
const evidenceTracker = require('../services/evidenceTracker');

const evidenceController = {
  // Get all evidence for a theory
  getEvidence: async (req, res) => {
    try {
      const { theoryId } = req.params;
      const { type, sortBy = 'quality', page = 1, limit = 50 } = req.query;
      
      const offset = (page - 1) * limit;
      
      const evidence = await EvidenceModel.getByTheory(theoryId, {
        type,
        sortBy,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      res.json(evidence);
    } catch (error) {
      console.error('Error fetching evidence:', error);
      res.status(500).json({ error: 'Failed to fetch evidence' });
    }
  },

  // Submit new evidence
  submitEvidence: async (req, res) => {
    try {
      const {
        theoryId,
        sourceUrl,
        description,
        evidenceType,
        supportsClaim,
        submittedBy
      } = req.body;
      
      if (!theoryId || !sourceUrl || !description) {
        return res.status(400).json({ 
          error: 'Theory ID, source URL, and description are required' 
        });
      }
      
      // Analyze the evidence
      const analysis = await evidenceTracker.analyzeEvidence({
        sourceUrl,
        description,
        evidenceType
      });
      
      const evidenceData = {
        theoryId,
        sourceUrl,
        description,
        evidenceType,
        supportsClaim,
        submittedBy,
        qualityScore: analysis.qualityScore,
        sourceCredibility: analysis.sourceCredibility,
        verificationStatus: analysis.verificationStatus
      };
      
      const newEvidence = await EvidenceModel.create(evidenceData);
      
      res.status(201).json({
        ...newEvidence,
        analysis
      });
    } catch (error) {
      console.error('Error submitting evidence:', error);
      res.status(500).json({ error: 'Failed to submit evidence' });
    }
  },

  // Vote on evidence quality
  voteOnEvidence: async (req, res) => {
    try {
      const { id } = req.params;
      const { vote, userId } = req.body; // vote: 'up', 'down', or 'report'
      
      if (!['up', 'down', 'report'].includes(vote)) {
        return res.status(400).json({ error: 'Invalid vote type' });
      }
      
      const updated = await EvidenceModel.addVote(id, vote, userId);
      
      if (!updated) {
        return res.status(404).json({ error: 'Evidence not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error voting on evidence:', error);
      res.status(500).json({ error: 'Failed to vote on evidence' });
    }
  },

  // Get source track record
  getSourceTrackRecord: async (req, res) => {
    try {
      const { sourceName } = req.params;
      
      const trackRecord = await evidenceTracker.getSourceTrackRecord(sourceName);
      
      res.json({
        source: sourceName,
        ...trackRecord
      });
    } catch (error) {
      console.error('Error fetching source track record:', error);
      res.status(500).json({ error: 'Failed to fetch source track record' });
    }
  }
};

module.exports = evidenceController;
