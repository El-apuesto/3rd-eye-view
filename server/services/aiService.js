const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

class AIService {
  /**
   * Method 1: Multi-Tier Confidence System
   */
  static async analyzeWithConfidenceSystem(theory, sources, userWeights = {}) {
    const startTime = Date.now();
    
    const prompt = this.buildConfidenceSystemPrompt(theory, sources, userWeights);
    
    try {
      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: parseInt(process.env.MAX_TOKENS) || 4096,
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const analysisText = message.content[0].text;
      const parsed = this.parseConfidenceAnalysis(analysisText);
      
      return {
        ...parsed,
        processing_time_ms: Date.now() - startTime,
        ai_model: message.model,
        raw_response: analysisText
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  }

  /**
   * Method 2: Evidence-Based Scoring
   */
  static async analyzeWithEvidenceScoring(theory, sources, userWeights = {}) {
    const startTime = Date.now();
    
    const prompt = this.buildEvidenceScoringPrompt(theory, sources, userWeights);
    
    try {
      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: parseInt(process.env.MAX_TOKENS) || 4096,
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const analysisText = message.content[0].text;
      const parsed = this.parseEvidenceAnalysis(analysisText);
      
      return {
        ...parsed,
        processing_time_ms: Date.now() - startTime,
        ai_model: message.model,
        raw_response: analysisText
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  }

  /**
   * Method 3: Comparative Analysis
   */
  static async analyzeWithComparison(theory, sources, userWeights = {}) {
    const startTime = Date.now();
    
    const prompt = this.buildComparativePrompt(theory, sources, userWeights);
    
    try {
      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: parseInt(process.env.MAX_TOKENS) || 4096,
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const analysisText = message.content[0].text;
      const parsed = this.parseComparativeAnalysis(analysisText);
      
      return {
        ...parsed,
        processing_time_ms: Date.now() - startTime,
        ai_model: message.model,
        raw_response: analysisText
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  }

  /**
   * Motivational Analysis - Why does this theory exist?
   */
  static async analyzeMotivation(theory, sources) {
    const prompt = `
Analyze WHY this conspiracy theory exists. Consider:

1. **Psychological Reasons**: What cognitive biases or fears might drive belief?
2. **Distraction Theory**: Could this serve to distract from another issue?
3. **Cover-up Potential**: Could this theory itself be covering something else?
4. **Financial Incentives**: Who profits from this narrative?
5. **Political Motivations**: What political purposes might this serve?

**Theory**: ${theory.title}
**Description**: ${theory.description}
**Official Narrative**: ${theory.official_narrative || 'Not provided'}
**Conspiracy Narrative**: ${theory.conspiracy_narrative || 'Not provided'}

Provide a comprehensive motivational analysis in JSON format:
{
  "psychological_factors": ["factor1", "factor2"],
  "distraction_potential": { "likelihood": "high/medium/low", "from_what": "explanation" },
  "cover_up_potential": { "likelihood": "high/medium/low", "covering_what": "explanation" },
  "financial_beneficiaries": ["who benefits and how"],
  "political_purposes": ["purpose1", "purpose2"],
  "summary": "overall motivation summary"
}
`;

    try {
      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const text = message.content[0].text;
      return this.extractJSON(text) || text;
    } catch (error) {
      console.error('Motivation Analysis Error:', error);
      throw error;
    }
  }

  /**
   * Counter-Narrative Analysis - Who benefits from each narrative?
   */
  static async analyzeCounterNarrative(theory, sources) {
    const prompt = `
Analyze who benefits from BOTH the official narrative AND the conspiracy theory:

**Theory**: ${theory.title}
**Official Narrative**: ${theory.official_narrative || 'Not provided'}
**Conspiracy Narrative**: ${theory.conspiracy_narrative || 'Not provided'}

 Provide analysis in JSON format:
{
  "official_narrative_beneficiaries": [
    { "who": "entity", "how": "explanation", "strength": "high/medium/low" }
  ],
  "conspiracy_theory_beneficiaries": [
    { "who": "entity", "how": "explanation", "strength": "high/medium/low" }
  ],
  "incentive_analysis": "Overall assessment of incentive structures",
  "truth_indicators": "Which narrative's beneficiaries suggest truth?"
}
`;

    try {
      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const text = message.content[0].text;
      return this.extractJSON(text) || text;
    } catch (error) {
      console.error('Counter-Narrative Analysis Error:', error);
      throw error;
    }
  }

  /**
   * Historical Pattern Matching
   */
  static async findHistoricalPatterns(theory) {
    const knownConspiracies = [
      'MK-ULTRA', 'COINTELPRO', 'Tuskegee Experiment', 'Operation Northwoods',
      'Watergate', 'Iran-Contra', 'NSA Surveillance', 'Operation Paperclip'
    ];

    const prompt = `
Compare this conspiracy theory to historically proven conspiracies and identify patterns:

**Known Proven Conspiracies**: ${knownConspiracies.join(', ')}

**Current Theory**: ${theory.title}
**Description**: ${theory.description}

**Evidence Status**:
- Evidence Destroyed: ${theory.evidence_destroyed ? 'Yes' : 'No'}
- Investigation Quality Score: ${theory.investigation_quality_score || 'Unknown'}
- Government Related: ${theory.government_related ? 'Yes' : 'No'}

Identify patterns matching proven conspiracies. Return JSON:
{
  "matching_patterns": [
    {
      "pattern": "pattern description",
      "similar_to": ["conspiracy names"],
      "strength": "strong/moderate/weak"
    }
  ],
  "red_flags": ["warning signs that match proven conspiracies"],
  "unique_aspects": ["aspects that don't match historical patterns"],
  "overall_similarity_score": 0-100
}
`;

    try {
      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const text = message.content[0].text;
      return this.extractJSON(text) || text;
    } catch (error) {
      console.error('Pattern Matching Error:', error);
      throw error;
    }
  }

  // Helper methods for building prompts
  static buildConfidenceSystemPrompt(theory, sources, userWeights) {
    const weightedSources = this.applySourceWeights(sources, userWeights);
    
    return `
Analyze this conspiracy theory using a multi-tier confidence system.

**THEORY INFORMATION**
Title: ${theory.title}
Description: ${theory.description}
Official Narrative: ${theory.official_narrative || 'Not provided'}
Conspiracy Narrative: ${theory.conspiracy_narrative || 'Not provided'}
Category: ${theory.category}
Government Related: ${theory.government_related ? 'Yes' : 'No'}
Evidence Destroyed: ${theory.evidence_destroyed ? 'Yes' : 'No'}
Timeline: ${theory.timeline_date || 'Unknown'}

**SOURCES** (${sources.length} total, weighted by user preferences)
${this.formatSources(weightedSources)}

**ANALYSIS REQUIREMENTS**

1. Assign a confidence category:
   - VERIFIED: Documented proof exists
   - STRONGLY_SUPPORTED: Significant credible evidence
   - PLAUSIBLE: Some evidence, logical coherence
   - UNVERIFIED: Insufficient evidence
   - CONTRADICTED: Evidence contradicts claims

2. Provide a confidence score (0-100%)

3. Assign a knowability rating:
   - PROVABLE: Can be proven with available evidence
   - DIFFICULT: Hard to prove but possible
   - IMPOSSIBLE: Cannot be proven with current information

4. Count evidence metrics
5. Identify contradictions
6. Provide reasoning

Return response in this JSON format:
{
  "confidence_category": "category",
  "confidence_score": 0-100,
  "knowability_rating": "rating",
  "evidence_count": number,
  "credible_sources_count": number,
  "contradictions_found": number,
  "reasoning": "detailed explanation",
  "key_evidence": ["evidence1", "evidence2"],
  "key_contradictions": ["contradiction1", "contradiction2"]
}
`;
  }

  static buildEvidenceScoringPrompt(theory, sources, userWeights) {
    const weightedSources = this.applySourceWeights(sources, userWeights);
    
    return `
Score this conspiracy theory based on evidence quality without making truth judgments.

**THEORY**: ${theory.title}
${theory.description}

**SOURCES**
${this.formatSources(weightedSources)}

**SCORING CRITERIA**
1. Document Quality (0-100): Official documents, verified records
2. Testimony Quality (0-100): Witness credibility, consistency
3. Forensic Evidence (0-100): Physical or technical evidence
4. Source Diversity (0-100): Range of independent sources
5. Logical Coherence (0-100): Internal consistency

Return JSON:
{
  "scores": {
    "document_quality": 0-100,
    "testimony_quality": 0-100,
    "forensic_evidence": 0-100,
    "source_diversity": 0-100,
    "logical_coherence": 0-100
  },
  "evidence_summary": {
    "documents": ["list"],
    "testimony": ["list"],
    "forensic": ["list"]
  },
  "analysis": "neutral evidence assessment"
}
`;
  }

  static buildComparativePrompt(theory, sources, userWeights) {
    const weightedSources = this.applySourceWeights(sources, userWeights);
    
    return `
Compare the official narrative vs. conspiracy theory side-by-side.

**THEORY**: ${theory.title}
**Official Narrative**: ${theory.official_narrative || 'Not provided'}
**Conspiracy Narrative**: ${theory.conspiracy_narrative || 'Not provided'}

**SOURCES**
${this.formatSources(weightedSources)}

**ANALYSIS TASKS**
1. Evidence supporting official narrative
2. Evidence supporting conspiracy theory
3. Areas where they conflict
4. What evidence would settle the question

Return JSON:
{
  "official_narrative_support": {
    "evidence": ["item1", "item2"],
    "strength": "strong/moderate/weak",
    "gaps": ["gap1", "gap2"]
  },
  "conspiracy_theory_support": {
    "evidence": ["item1", "item2"],
    "strength": "strong/moderate/weak",
    "gaps": ["gap1", "gap2"]
  },
  "key_conflicts": ["conflict1", "conflict2"],
  "settling_evidence_needed": ["what would prove each side"],
  "current_balance": "assessment of which has more support"
}
`;
  }

  static applySourceWeights(sources, userWeights) {
    const defaultWeights = {
      government: 0.5,
      mainstream_media: 0.5,
      alternative_media: 0.5,
      academic: 0.8,
      whistleblower: 0.6
    };

    const weights = { ...defaultWeights, ...userWeights };

    return sources.map(source => ({
      ...source,
      adjusted_credibility: source.credibility_score * (weights[source.source_type] || 0.5)
    })).sort((a, b) => b.adjusted_credibility - a.adjusted_credibility);
  }

  static formatSources(sources) {
    return sources.slice(0, 20).map((source, idx) => `
${idx + 1}. [${source.source_name}] (${source.source_type}, credibility: ${source.credibility_score?.toFixed(2)})
   ${source.title}
   ${source.content_snippet || ''}
   URL: ${source.url}
`).join('\n');
  }

  static extractJSON(text) {
    try {
      // Try to find JSON in code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      // Try to parse the whole text
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  static parseConfidenceAnalysis(text) {
    const json = this.extractJSON(text);
    if (json) return json;
    
    // Fallback parsing if JSON extraction fails
    return {
      confidence_category: 'unverified',
      confidence_score: 50,
      knowability_rating: 'difficult',
      reasoning: text
    };
  }

  static parseEvidenceAnalysis(text) {
    const json = this.extractJSON(text);
    return json || { analysis: text };
  }

  static parseComparativeAnalysis(text) {
    const json = this.extractJSON(text);
    return json || { analysis: text };
  }
}

module.exports = AIService;
