const axios = require('axios');
const cheerio = require('cheerio');

class SearchService {
  /**
   * Search for conspiracy theories using multiple search engines
   */
  static async searchWeb(query, options = {}) {
    const { maxResults = 20, searchEngine = 'google' } = options;
    
    try {
      if (searchEngine === 'google' && process.env.GOOGLE_SEARCH_API_KEY) {
        return await this.searchGoogle(query, maxResults);
      } else if (searchEngine === 'bing' && process.env.BING_SEARCH_API_KEY) {
        return await this.searchBing(query, maxResults);
      } else {
        // Fallback to scraping (less reliable, use with caution)
        return await this.scrapeSearchResults(query, maxResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  /**
   * Search using Google Custom Search API
   */
  static async searchGoogle(query, maxResults = 20) {
    const results = [];
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      throw new Error('Google Search API credentials not configured');
    }

    try {
      // Google Custom Search returns max 10 results per request
      const numRequests = Math.ceil(Math.min(maxResults, 100) / 10);
      
      for (let i = 0; i < numRequests; i++) {
        const startIndex = (i * 10) + 1;
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&start=${startIndex}`;
        
        const response = await axios.get(url, {
          timeout: parseInt(process.env.SEARCH_TIMEOUT_MS) || 30000
        });

        if (response.data.items) {
          results.push(...response.data.items.map(item => ({
            title: item.title,
            url: item.link,
            snippet: item.snippet,
            source: this.extractDomain(item.link)
          })));
        }
      }

      return results.slice(0, maxResults);
    } catch (error) {
      console.error('Google Search Error:', error.message);
      throw error;
    }
  }

  /**
   * Search using Bing Web Search API
   */
  static async searchBing(query, maxResults = 20) {
    const apiKey = process.env.BING_SEARCH_API_KEY;
    
    if (!apiKey) {
      throw new Error('Bing Search API key not configured');
    }

    try {
      const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=${Math.min(maxResults, 50)}`;
      
      const response = await axios.get(url, {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        },
        timeout: parseInt(process.env.SEARCH_TIMEOUT_MS) || 30000
      });

      if (response.data.webPages?.value) {
        return response.data.webPages.value.map(item => ({
          title: item.name,
          url: item.url,
          snippet: item.snippet,
          source: this.extractDomain(item.url)
        }));
      }

      return [];
    } catch (error) {
      console.error('Bing Search Error:', error.message);
      throw error;
    }
  }

  /**
   * Scrape search results (fallback method)
   * Note: This is less reliable and may violate ToS
   */
  static async scrapeSearchResults(query, maxResults = 20) {
    console.warn('Using web scraping fallback - configure API keys for better results');
    
    try {
      // This is a simplified example - actual implementation would need
      // to handle Google's anti-scraping measures
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=${maxResults}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);
      const results = [];

      $('.g').each((i, elem) => {
        if (i >= maxResults) return false;
        
        const title = $(elem).find('h3').text();
        const url = $(elem).find('a').attr('href');
        const snippet = $(elem).find('.VwiC3b').text();

        if (title && url) {
          results.push({
            title,
            url,
            snippet,
            source: this.extractDomain(url)
          });
        }
      });

      return results;
    } catch (error) {
      console.error('Scraping Error:', error.message);
      return [];
    }
  }

  /**
   * Fetch full content from a URL
   */
  static async fetchPageContent(url) {
    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      // Remove scripts, styles, and nav elements
      $('script, style, nav, header, footer, aside').remove();
      
      // Get main content
      const content = $('article, main, .content, #content, .post, .entry-content')
        .text()
        .trim() || $('body').text().trim();

      // Get title
      const title = $('h1').first().text() || $('title').text() || '';

      return {
        url,
        title: title.trim(),
        content: content.substring(0, 5000), // Limit content length
        source: this.extractDomain(url)
      };
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Track popularity metrics for a theory
   */
  static async trackPopularity(query) {
    try {
      // This would integrate with Google Trends, social media APIs, etc.
      // Simplified version:
      const searchResults = await this.searchWeb(query, { maxResults: 10 });
      
      return {
        search_volume: searchResults.length * 100, // Placeholder calculation
        social_mentions: 0, // Would integrate with Twitter, Reddit APIs
        trending_score: Math.random() * 100 // Placeholder
      };
    } catch (error) {
      console.error('Popularity tracking error:', error);
      return {
        search_volume: 0,
        social_mentions: 0,
        trending_score: 0
      };
    }
  }

  /**
   * Search for government documents related to a theory
   */
  static async searchGovernmentDocs(query) {
    // Search specific government document repositories
    const governmentSites = [
      'site:archives.gov',
      'site:fbi.gov',
      'site:cia.gov',
      'site:nsarchive.gwu.edu'
    ];

    const results = [];

    for (const site of governmentSites) {
      try {
        const siteResults = await this.searchWeb(`${query} ${site}`, { maxResults: 5 });
        results.push(...siteResults);
      } catch (error) {
        console.error(`Error searching ${site}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Extract domain from URL
   */
  static extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (e) {
      return 'unknown';
    }
  }

  /**
   * Categorize source type based on domain
   */
  static categorizeSource(domain) {
    const categories = {
      government: ['.gov', 'archives.', 'nsarchive'],
      mainstream_media: ['nytimes.com', 'washingtonpost.com', 'bbc.com', 'cnn.com', 'reuters.com', 'ap.org'],
      alternative_media: ['theintercept.com', 'propublica.org', 'democracynow.org'],
      academic: ['.edu', 'scholar.', 'jstor.', 'academia.'],
      whistleblower: ['wikileaks.org', 'cryptome.org']
    };

    for (const [type, domains] of Object.entries(categories)) {
      if (domains.some(d => domain.includes(d))) {
        return type;
      }
    }

    return 'other';
  }
}

module.exports = SearchService;
