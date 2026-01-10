const searchEngine = require('./searchEngine');
const { query } = require('../config/database');

const evidenceTracker = {
  // Analyze submitted evidence
  analyzeEvidence: async (evidence) => {
    try {
      const { sourceUrl, description, evidenceType } = evidence;

      // Scrape the source if it's a URL
      let scrapedContent = null;
      if (sourceUrl && sourceUrl.startsWith('http')) {
        scrapedContent = await searchEngine.scrapeWebpage(sourceUrl);
      }

      // Analyze source credibility
      const sourceCredibility = await evidenceTracker.assessSourceCredibility(sourceUrl);

      // Calculate quality score
      const qualityScore = evidenceTracker.calculateQualityScore({
        sourceCredibility,
        evidenceType,
        hasContent: !!scrapedContent && !scrapedContent.error,
        descriptionLength: description.length
      });

      return {
        qualityScore,
        sourceCredibility,
        verificationStatus: qualityScore > 70 ? 'verified' : qualityScore > 40 ? 'partially-verified' : 'unverified',
        scrapedContent: scrapedContent && !scrapedContent.error ? scrapedContent : null,
        analyzedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing evidence:', error);
      return {
        qualityScore: 0,
        sourceCredibility: 0,
        verificationStatus: 'error',
        error: error.message
      };
    }
  },

  // Assess source credibility
  assessSourceCredibility: async (sourceUrl) => {
    try {
      if (!sourceUrl) return 0;

      const domain = new URL(sourceUrl).hostname;

      // Check against known sources database
      const trackRecord = await evidenceTracker.getSourceTrackRecord(domain);

      if (trackRecord.totalClaims > 0) {
        // Calculate based on historical accuracy
        const accuracyRate = trackRecord.verifiedClaims / trackRecord.totalClaims;
        return Math.round(accuracyRate * 100);
      }

      // Default credibility based on domain type
      return evidenceTracker.getDefaultCredibility(domain);
    } catch (error) {
      console.error('Error assessing credibility:', error);
      return 50; // Neutral score
    }
  },

  // Get default credibility for domains
  getDefaultCredibility: (domain) => {
    // Government and official sources
    if (domain.endsWith('.gov') || domain.endsWith('.mil')) return 80;

    // Educational institutions
    if (domain.endsWith('.edu')) return 75;

    // Well-known news organizations (simplified)
    const majorNews = ['reuters.com', 'apnews.com', 'bbc.com', 'npr.org'];
    if (majorNews.some(news => domain.includes(news))) return 70;

    // Academic databases
    const academic = ['scholar.google', 'jstor.org', 'pubmed', 'arxiv.org'];
    if (academic.some(site => domain.includes(site))) return 85;

    // Default for unknown sources
    return 50;
  },

  // Calculate overall quality score
  calculateQualityScore: (factors) => {
    let score = 0;

    // Source credibility (40% weight)
    score += factors.sourceCredibility * 0.4;

    // Evidence type quality (30% weight)
    const typeScores = {
      'primary_document': 100,
      'official_record': 95,
      'investigative_journalism': 80,
      'expert_testimony': 75,
      'witness_testimony': 60,
      'secondary_analysis': 50,
      'blog_post': 30,
      'social_media': 20,
      'general': 40
    };
    score += (typeScores[factors.evidenceType] || 40) * 0.3;

    // Content availability (20% weight)
    score += (factors.hasContent ? 100 : 50) * 0.2;

    // Description quality (10% weight)
    const descScore = Math.min(factors.descriptionLength / 2, 100); // 200 chars = 100 score
    score += descScore * 0.1;

    return Math.round(Math.min(score, 100));
  },

  // Get source track record
  getSourceTrackRecord: async (sourceName) => {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total_claims,
          SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END) as verified_claims,
          SUM(CASE WHEN verification_status = 'false' THEN 1 ELSE 0 END) as false_claims,
          SUM(CASE WHEN verification_status = 'unverified' THEN 1 ELSE 0 END) as unverified_claims,
          AVG(quality_score) as avg_quality_score
        FROM evidence
        WHERE source_url LIKE $1
      `;

      const result = await query(sql, [`%${sourceName}%`]);

      if (result.rows.length === 0 || result.rows[0].total_claims === '0') {
        return {
          totalClaims: 0,
          verifiedClaims: 0,
          falseClaims: 0,
          unverifiedClaims: 0,
          avgQualityScore: 0,
          accuracyRate: 0
        };
      }

      const data = result.rows[0];
      const totalClaims = parseInt(data.total_claims);
      const verifiedClaims = parseInt(data.verified_claims);

      return {
        totalClaims,
        verifiedClaims,
        falseClaims: parseInt(data.false_claims),
        unverifiedClaims: parseInt(data.unverified_claims),
        avgQualityScore: parseFloat(data.avg_quality_score) || 0,
        accuracyRate: totalClaims > 0 ? (verifiedClaims / totalClaims) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting track record:', error);
      return {
        totalClaims: 0,
        verifiedClaims: 0,
        falseClaims: 0,
        unverifiedClaims: 0,
        avgQualityScore: 0,
        accuracyRate: 0
      };
    }
  },

  // Track destroyed or missing evidence
  trackMissingEvidence: async (theoryId, evidenceDescription, reason) => {
    try {
      const sql = `
        INSERT INTO missing_evidence (
          theory_id, description, reason, reported_at
        )
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;

      const result = await query(sql, [theoryId, evidenceDescription, reason]);
      return result.rows[0];
    } catch (error) {
      console.error('Error tracking missing evidence:', error);
      throw error;
    }
  },

  // Get missing evidence for a theory
  getMissingEvidence: async (theoryId) => {
    try {
      const sql = `
        SELECT *
        FROM missing_evidence
        WHERE theory_id = $1
        ORDER BY reported_at DESC
      `;

      const result = await query(sql, [theoryId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting missing evidence:', error);
      return [];
    }
  }
};

module.exports = evidenceTracker;
