const searchEngine = require('../services/searchEngine');

const searchController = {
  // Search the web for conspiracy theories
  searchWeb: async (req, res) => {
    try {
      const { query, maxResults = 20, sources = ['google', 'bing'] } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      console.log(`Searching for: ${query}`);
      
      const results = await searchEngine.search(query, {
        maxResults: parseInt(maxResults),
        sources
      });
      
      res.json({
        query,
        resultCount: results.length,
        results
      });
    } catch (error) {
      console.error('Error searching web:', error);
      res.status(500).json({ error: 'Failed to search web' });
    }
  },

  // Get popularity metrics for a query
  getPopularity: async (req, res) => {
    try {
      const { query } = req.params;
      const { timeframe = '30d' } = req.query;
      
      const popularity = await searchEngine.getPopularityMetrics(query, timeframe);
      
      res.json({
        query,
        timeframe,
        ...popularity
      });
    } catch (error) {
      console.error('Error fetching popularity:', error);
      res.status(500).json({ error: 'Failed to fetch popularity metrics' });
    }
  }
};

module.exports = searchController;
