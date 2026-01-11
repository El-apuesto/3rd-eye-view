const webSearch = require('./webSearch');
const pool = require('../config/database');

async function scoreEvidence(query, searchResults) {
  const evidenceItems = [];
  let totalQualityScore = 0;
  let destructionKeywords = 0;
  const sources = new Set();

  const destructionTerms = ['shredded', 'redacted', 'classified', 'destroyed', 'withheld', 'censored', 'suppressed'];
  
  for (const result of searchResults) {
    const sourceType = await determineSourceType(result.url);
    const verifiability = scoreVerifiability(result.snippet);
    const recency = scoreRecency(result.publishDate);
    const provenance = detectProvenance(result.snippet);
    const isPrimary = detectPrimarySource(result.snippet, sourceType);
    
    const qualityScore = (sourceType.score * 0.4) + (verifiability * 0.3) + (recency * 0.2) + (provenance.score * 0.1);
    
    evidenceItems.push({
      title: result.title,
      url: result.url,
      snippet: result.snippet,
      publishDate: result.publishDate,
      sourceType: sourceType.type,
      qualityScore: Math.round(qualityScore),
      isPrimary,
      provenanceType: provenance.type
    });

    totalQualityScore += qualityScore;
    sources.add(new URL(result.url).hostname);

    const lowerSnippet = result.snippet.toLowerCase();
    if (destructionTerms.some(term => lowerSnippet.includes(term))) {
      destructionKeywords++;
    }
  }

  const evidenceQualityScore = searchResults.length > 0 
    ? Math.round(totalQualityScore / searchResults.length) 
    : 0;

  const corroborationScore = Math.min(100, sources.size * 15);

  return {
    evidenceQualityScore,
    corroborationScore,
    destructionIndicators: destructionKeywords,
    evidenceItems
  };
}

async function determineSourceType(url) {
  const domain = new URL(url).hostname;
  
  if (domain.endsWith('.gov')) return { type: 'government', score: 85 };
  if (domain.endsWith('.edu')) return { type: 'academic', score: 80 };
  if (domain.includes('arxiv') || domain.includes('pubmed')) return { type: 'academic', score: 85 };
  if (['nytimes.com', 'washingtonpost.com', 'reuters.com', 'apnews.com', 'bbc.com'].some(d => domain.includes(d))) {
    return { type: 'journalism', score: 75 };
  }
  if (['twitter.com', 'facebook.com', 'reddit.com', 'tiktok.com'].some(d => domain.includes(d))) {
    return { type: 'social_media', score: 30 };
  }
  
  return { type: 'blog', score: 40 };
}

function scoreVerifiability(snippet) {
  let score = 50;
  
  if (/[A-Z][a-z]+ [A-Z][a-z]+/.test(snippet)) score += 15;
  if (/\d{4}/.test(snippet) || /January|February|March|April|May|June|July|August|September|October|November|December/.test(snippet)) score += 10;
  if (/\d+%/.test(snippet) || /\$\d+/.test(snippet)) score += 10;
  if (/according to|study|research|report|document/.test(snippet.toLowerCase())) score += 15;
  
  return Math.min(100, score);
}

function scoreRecency(publishDate) {
  if (!publishDate) return 50;
  
  const date = new Date(publishDate);
  const now = new Date();
  const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
  
  if (daysDiff < 30) return 100;
  if (daysDiff < 180) return 85;
  if (daysDiff < 365) return 70;
  if (daysDiff < 730) return 55;
  return 40;
}

function detectProvenance(snippet) {
  const lower = snippet.toLowerCase();
  
  if (lower.includes('foia') || lower.includes('freedom of information')) {
    return { type: 'foia', score: 90 };
  }
  if (lower.includes('leaked') || lower.includes('whistleblower')) {
    return { type: 'leaked', score: 60 };
  }
  if (lower.includes('declassified')) {
    return { type: 'declassified', score: 95 };
  }
  if (lower.includes('testimony') || lower.includes('court document')) {
    return { type: 'testimony', score: 85 };
  }
  
  return { type: 'standard', score: 50 };
}

function detectPrimarySource(snippet, sourceType) {
  const lower = snippet.toLowerCase();
  const primaryIndicators = ['official', 'statement', 'press release', 'document', 'testimony'];
  
  if (sourceType === 'government' || sourceType === 'academic') {
    return primaryIndicators.some(ind => lower.includes(ind));
  }
  
  return false;
}

module.exports = { scoreEvidence };