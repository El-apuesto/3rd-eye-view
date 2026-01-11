const webSearch = require('./webSearch');
const { scoreEvidence } = require('./evidenceScorer');
const { trackSources } = require('./sourceTracker');
const { matchHistoricalPatterns } = require('./patternMatcher');
const { synthesizeAnalysis } = require('./claudeAI');
const { createWatermark } = require('./watermarking');
const pool = require('../config/database');

async function runFullAnalysis(query, userId, ipAddress) {
  const queryResult = await pool.query(
    'INSERT INTO analysis_queries (user_id, query_text, query_type, ip_address) VALUES ($1, $2, $3, $4) RETURNING id',
    [userId, query, 'full_analysis', ipAddress]
  );
  
  const queryId = queryResult.rows[0].id;
  
  try {
    const searchResults = await webSearch.searchWeb(query, 15);
    const evidenceData = await scoreEvidence(query, searchResults);
    const sourceData = await trackSources(evidenceData.evidenceItems);
    const patternData = await matchHistoricalPatterns(query);
    const aiAnalysis = await synthesizeAnalysis(query, evidenceData, sourceData, patternData);
    
    const overallConfidenceScore = Math.round(
      (evidenceData.evidenceQualityScore * 0.4) +
      (sourceData.sourceCredibilityScore * 0.3) +
      (aiAnalysis.logicalConsistencyScore * 0.3)
    );
    
    const resultInsert = await pool.query(
      `INSERT INTO analysis_results 
       (query_id, overall_confidence_score, evidence_quality_score, source_credibility_score, 
        logical_consistency_score, summary, strengths, weaknesses, red_flags, investigation_needed, reasoning)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        queryId, overallConfidenceScore, evidenceData.evidenceQualityScore,
        sourceData.sourceCredibilityScore, aiAnalysis.logicalConsistencyScore,
        aiAnalysis.summary, JSON.stringify(aiAnalysis.strengths),
        JSON.stringify(aiAnalysis.weaknesses), JSON.stringify(aiAnalysis.redFlags),
        JSON.stringify(aiAnalysis.investigationNeeded), aiAnalysis.reasoning
      ]
    );
    
    const resultId = resultInsert.rows[0].id;
    
    for (const item of evidenceData.evidenceItems) {
      const sourceResult = await pool.query(
        'SELECT id FROM sources WHERE domain = $1',
        [new URL(item.url).hostname]
      );
      
      const sourceId = sourceResult.rows[0]?.id;
      
      await pool.query(
        `INSERT INTO evidence_items 
         (result_id, title, url, snippet, publish_date, source_id, quality_score, is_primary_source, provenance_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [resultId, item.title, item.url, item.snippet, item.publishDate, sourceId, 
         item.qualityScore, item.isPrimary, item.provenanceType]
      );
    }
    
    for (const match of patternData.matches) {
      const eventResult = await pool.query(
        'SELECT id FROM historical_events WHERE code = $1',
        [match.eventCode]
      );
      
      if (eventResult.rows.length > 0) {
        await pool.query(
          `INSERT INTO pattern_matches 
           (result_id, event_id, similarity_score, matching_characteristics, differences, temporal_metrics)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            resultId, eventResult.rows[0].id, match.similarityScore,
            JSON.stringify(match.matchingCharacteristics),
            JSON.stringify(match.differences),
            JSON.stringify(match.temporalMetrics)
          ]
        );
      }
    }
    
    const watermark = await createWatermark(resultId);
    
    return {
      analysisId: resultId,
      queryId,
      overallConfidenceScore,
      evidenceQualityScore: evidenceData.evidenceQualityScore,
      sourceCredibilityScore: sourceData.sourceCredibilityScore,
      logicalConsistencyScore: aiAnalysis.logicalConsistencyScore,
      summary: aiAnalysis.summary,
      strengths: aiAnalysis.strengths,
      weaknesses: aiAnalysis.weaknesses,
      redFlags: aiAnalysis.redFlags,
      investigationNeeded: aiAnalysis.investigationNeeded,
      reasoning: aiAnalysis.reasoning,
      evidenceItems: evidenceData.evidenceItems,
      corroborationScore: evidenceData.corroborationScore,
      destructionIndicators: evidenceData.destructionIndicators,
      sourceMetrics: sourceData,
      historicalPatterns: patternData.matches,
      watermark
    };
    
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

module.exports = { runFullAnalysis };