const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function synthesizeAnalysis(query, evidenceData, sourceData, patternData) {
  const prompt = `You are an objective evidence analyst. Analyze the following data for the query: "${query}"

Evidence Quality Data:
- Evidence Quality Score: ${evidenceData.evidenceQualityScore}/100
- Corroboration Score: ${evidenceData.corroborationScore}/100
- Evidence Destruction Indicators: ${evidenceData.destructionIndicators}

Source Credibility Data:
- Source Credibility Score: ${sourceData.sourceCredibilityScore}/100
- High Credibility Sources: ${sourceData.highCredSources}
- Low Credibility Sources: ${sourceData.lowCredSources}
- Bias Distribution: ${JSON.stringify(sourceData.biasDistribution)}

Historical Pattern Matches:
${JSON.stringify(patternData.matches, null, 2)}

Provide a JSON response with:
{
  "summary": "2-3 sentence objective summary",
  "logicalConsistencyScore": 0-100,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "redFlags": ["flag1", "flag2"],
  "investigationNeeded": ["item1", "item2"],
  "reasoning": "detailed narrative analysis"
}

Remember: You are evaluating EVIDENCE QUALITY and PATTERNS, not declaring truth or falsehood.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0].text;
    return JSON.parse(content);
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

module.exports = { synthesizeAnalysis };