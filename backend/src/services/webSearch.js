const axios = require('axios');

class WebSearchService {
  constructor() {
    this.provider = process.env.SEARCH_PROVIDER || 'brave';
    this.apiKey = process.env.SEARCH_API_KEY;
  }

  async searchWeb(query, numResults = 10) {
    if (this.provider === 'brave') {
      return this.searchBrave(query, numResults);
    } else if (this.provider === 'serpapi') {
      return this.searchSerpAPI(query, numResults);
    }
    throw new Error('Invalid search provider');
  }

  async searchBrave(query, count) {
    try {
      const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': this.apiKey
        },
        params: { q: query, count }
      });

      return response.data.web?.results?.map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.description,
        publishDate: r.age || null
      })) || [];
    } catch (error) {
      console.error('Brave search error:', error.message);
      return [];
    }
  }

  async searchSerpAPI(query, num) {
    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          q: query,
          api_key: this.apiKey,
          num
        }
      });

      return response.data.organic_results?.map(r => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet,
        publishDate: r.date || null
      })) || [];
    } catch (error) {
      console.error('SerpAPI search error:', error.message);
      return [];
    }
  }
}

module.exports = new WebSearchService();