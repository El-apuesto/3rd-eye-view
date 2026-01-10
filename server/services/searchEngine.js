const axios = require('axios');
const cheerio = require('cheerio');

const searchEngine = {
  // Main search function
  search: async (query, options = {}) => {
    const { maxResults = 20, sources = ['google', 'bing'] } = options;
    const results = [];

    try {
      // Search multiple sources in parallel
      const searchPromises = [];

      if (sources.includes('google') && process.env.GOOGLE_SEARCH_API_KEY) {
        searchPromises.push(searchEngine.searchGoogle(query, maxResults));
      }

      if (sources.includes('bing') && process.env.BING_SEARCH_API_KEY) {
        searchPromises.push(searchEngine.searchBing(query, maxResults));
      }

      const searchResults = await Promise.allSettled(searchPromises);

      // Combine and deduplicate results
      searchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(...result.value);
        }
      });

      // Deduplicate by URL
      const uniqueResults = [];
      const seenUrls = new Set();

      for (const result of results) {
        if (!seenUrls.has(result.url)) {
          seenUrls.add(result.url);
          uniqueResults.push(result);
        }
      }

      return uniqueResults.slice(0, maxResults);
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Google Custom Search
  searchGoogle: async (query, maxResults = 20) => {
    try {
      const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
      const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

      if (!apiKey || !searchEngineId) {
        console.warn('Google Search API credentials not configured');
        return [];
      }

      const url = 'https://www.googleapis.com/customsearch/v1';
      const results = [];
      const maxPerRequest = 10;
      const requests = Math.ceil(Math.min(maxResults, 100) / maxPerRequest);

      for (let i = 0; i < requests; i++) {
        const start = i * maxPerRequest + 1;
        const response = await axios.get(url, {
          params: {
            key: apiKey,
            cx: searchEngineId,
            q: query,
            start,
            num: maxPerRequest
          }
        });

        if (response.data.items) {
          results.push(...response.data.items.map(item => ({
            title: item.title,
            url: item.link,
            snippet: item.snippet,
            source: 'google',
            displayUrl: item.displayLink
          })));
        }

        if (results.length >= maxResults) break;
      }

      return results;
    } catch (error) {
      console.error('Google search error:', error.message);
      return [];
    }
  },

  // Bing Search
  searchBing: async (query, maxResults = 20) => {
    try {
      const apiKey = process.env.BING_SEARCH_API_KEY;

      if (!apiKey) {
        console.warn('Bing Search API key not configured');
        return [];
      }

      const url = 'https://api.bing.microsoft.com/v7.0/search';
      const response = await axios.get(url, {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        },
        params: {
          q: query,
          count: Math.min(maxResults, 50),
          responseFilter: 'Webpages'
        }
      });

      if (response.data.webPages && response.data.webPages.value) {
        return response.data.webPages.value.map(item => ({
          title: item.name,
          url: item.url,
          snippet: item.snippet,
          source: 'bing',
          displayUrl: item.displayUrl
        }));
      }

      return [];
    } catch (error) {
      console.error('Bing search error:', error.message);
      return [];
    }
  },

  // Get popularity metrics (simplified - would need proper implementation)
  getPopularityMetrics: async (query, timeframe = '30d') => {
    try {
      // This is a simplified version. In production, you'd integrate with:
      // - Google Trends API
      // - Social media APIs (Twitter, Reddit)
      // - News aggregators
      
      const results = await searchEngine.search(query, { maxResults: 100 });
      
      // Calculate simple popularity score based on result count and recency
      const score = Math.min(results.length * 10, 1000);
      
      return {
        popularityScore: score,
        searchResultCount: results.length,
        timeframe,
        trending: score > 500,
        estimatedInterest: score > 800 ? 'high' : score > 400 ? 'medium' : 'low'
      };
    } catch (error) {
      console.error('Error calculating popularity:', error);
      return {
        popularityScore: 0,
        searchResultCount: 0,
        timeframe,
        trending: false,
        estimatedInterest: 'low'
      };
    }
  },

  // Scrape webpage content (for evidence analysis)
  scrapeWebpage: async (url) => {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; 3rdEyeViewBot/1.0)'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Remove script and style elements
      $('script, style, nav, footer, header').remove();
      
      // Extract main content
      const title = $('title').text();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      
      return {
        url,
        title,
        description: metaDescription,
        content: bodyText.substring(0, 5000), // Limit content length
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Scraping error:', error.message);
      return {
        url,
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }
};

module.exports = searchEngine;
