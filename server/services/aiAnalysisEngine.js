const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

class AIAnalysisEngine {
  async analyzeWithConfidenceSystem(theory, evidence) {
    const prompt = `Analyze this conspiracy theory using a multi-tier confidence system.

Theory: ${theory.title}
Description: ${theory.description}

Evidence:
${JSON.stringify(evidence, null, 2)}

Provide:
1. Confidence Category: VERIFIED | STRONGLY_SUPPORTED | PLAUSIBLE | UNVERIFIED | CONTRADICTED
2. Confidence Score: 0-100%
3. Knowability Rating: PROVABLE | PARTIALLY_PROVABLE | CURRENTLY_UNPROVABLE | UNFALSIFIABLE
4. Detailed reasoning
5. Key evidence

Format as JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    return JSON.parse(response.content[0].text);
  }

  async analyzeEvidenceQuality(evidence) {
    const prompt = `Analyze evidence quality:
${JSON.stringify(evidence, null, 2)}

Provide:
1. Credible sources count
2. Evidence types
3. Source ratings
4. Contradictions
5. Documentation quality

Format as JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    return JSON.parse(response.content[0].text);
  }

  async compareNarratives(theory, officialNarrative, evidence) {
    const prompt = `Compare theory vs official narrative.

Theory: ${theory.title}
Official: ${officialNarrative}
Evidence: ${JSON.stringify(evidence, null, 2)}

Provide side-by-side scores and evidence. Format as JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    return JSON.parse(response.content[0].text);
  }

  async analyzeMotivation(theory) {
    const prompt = `Analyze WHY this theory exists:
${theory.title}

Analyze motivations, who benefits, psychological patterns. Format as JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    return JSON.parse(response.content[0].text);
  }

  async matchHistoricalPatterns(theory) {
    const verifiedConspiracies = ['MK-ULTRA', 'COINTELPRO', 'Tuskegee', 'Operation Northwoods', 'Gulf of Tonkin', 'Iran-Contra', 'NSA Surveillance', 'Watergate'];

    const prompt = `Compare to proven conspiracies:
${verifiedConspiracies.join(', ')}

Theory: ${theory.title}

Find similar patterns. Format as JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    return JSON.parse(response.content[0].text);
  }

  async analyzeComplete(theory, evidence, officialNarrative) {
    const [confidence, evidenceQuality, comparison, motivation, patterns] = await Promise.all([
      this.analyzeWithConfidenceSystem(theory, evidence),
      this.analyzeEvidenceQuality(evidence),
      this.compareNarratives(theory, officialNarrative, evidence),
      this.analyzeMotivation(theory),
      this.matchHistoricalPatterns(theory)
    ]);

    return { confidence, evidenceQuality, comparison, motivation, patterns, timestamp: new Date().toISOString() };
  }
}

module.exports = new AIAnalysisEngine();