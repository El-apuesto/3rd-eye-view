const TheoryModel = require('../models/TheoryModel');
const searchEngine = require('../services/searchEngine');

const theoryController = {
  // Get all theories with filtering and pagination
  getAllTheories: async (req, res) => {
    try {
      const { page = 1, limit = 20, category, status, sortBy = 'popularity' } = req.query;
      const offset = (page - 1) * limit;
      
      const theories = await TheoryModel.getAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        category,
        status,
        sortBy
      });
      
      res.json(theories);
    } catch (error) {
      console.error('Error fetching theories:', error);
      res.status(500).json({ error: 'Failed to fetch theories' });
    }
  },

  // Get trending theories
  getTrendingTheories: async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const trending = await TheoryModel.getTrending(parseInt(limit));
      res.json(trending);
    } catch (error) {
      console.error('Error fetching trending theories:', error);
      res.status(500).json({ error: 'Failed to fetch trending theories' });
    }
  },

  // Get theory by ID with full details
  getTheoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const theory = await TheoryModel.getById(id);
      
      if (!theory) {
        return res.status(404).json({ error: 'Theory not found' });
      }
      
      res.json(theory);
    } catch (error) {
      console.error('Error fetching theory:', error);
      res.status(500).json({ error: 'Failed to fetch theory' });
    }
  },

  // Create new theory (user submission)
  createTheory: async (req, res) => {
    try {
      const { title, description, category, tags, submittedBy } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }
      
      // Search for initial data
      const searchResults = await searchEngine.search(title, { maxResults: 10 });
      
      const theoryData = {
        title,
        description,
        category,
        tags: tags || [],
        submittedBy,
        initialSearchResults: searchResults
      };
      
      const newTheory = await TheoryModel.create(theoryData);
      res.status(201).json(newTheory);
    } catch (error) {
      console.error('Error creating theory:', error);
      res.status(500).json({ error: 'Failed to create theory' });
    }
  },

  // Update theory
  updateTheory: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updated = await TheoryModel.update(id, updates);
      
      if (!updated) {
        return res.status(404).json({ error: 'Theory not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating theory:', error);
      res.status(500).json({ error: 'Failed to update theory' });
    }
  }
};

module.exports = theoryController;
