const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const aiAnalysis = {
  // Main analysis function
  runAnalysis: async (theory, method, userWeights = null) => {
    try {
      switch (method) {
        case 'confidence':
          return await aiAnalysis.confidenceAnalysis(theory, userWeights);
        case 'evidence':
          return await aiAnalysis.evidenceAnalysis(theory, userWeights);
        case 'comparative':
          return await aiAnalysis.comparativeAnalysis(theory, userWeights);
        default:
          throw new Error(`Unknown analysis method: ${method}`);
      }
    } catch (error) {
      console.error(`Error in ${method} analysis:`, error);
      throw error;
    }
  },

  // Method 1: Multi-Tier Confidence System
  confidenceAnalysis: async (theory, userWeights) => {
    const prompt = `You are an expert analyst evaluating a conspiracy theory using evidence-based methodology.

Theory Title: ${theory.title}
Theory Description: ${theory.description}

Your task is to analyze this theory and provide:

1. CONFIDENCE CATEGORY (choose one):
   - Verified (90-100%): Multiple credible sources, official documentation, declassified materials
   - Strongly Supported (70-89%): Significant evidence from credible sources, internal consistency
   - Plausible (40-69%): Some evidence, logical coherence, but gaps remain
   - Unverified (20-39%): Insufficient evidence, relies on speculation
   - Contradicted (0-19%): Evidence actively disputes the theory

2. CONFIDENCE SCORE: Specific percentage (0-100)

3. KNOWABILITY RATING:
   - Provable: Can be verified with available evidence
   - Partially Provable: Some aspects can be verified
   - Currently Unknowable: Insufficient information available
   - Unfalsifiable: Cannot be proven or disproven

4. REASONING: Detailed explanation of your assessment

5. KEY EVIDENCE: List the most important pieces of evidence (supporting and contradicting)

6. RED FLAGS: Any signs of:
   - Destroyed or missing evidence
   - Investigation obstruction
   - Pattern matching to proven conspiracies
   - Classified documents beyond normal timeframes

Provide your analysis in JSON format with keys: category, confidenceScore, knowability, reasoning, keyEvidence (array), redFlags (array).

Be objective and thorough. Consider historical context where government conspiracies have been proven true (MK-ULTRA, COINTELPRO, etc.).`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      method: 'confidence',
      ...analysis,
      timestamp: new Date().toISOString()
    };
  },

  // Method 2: Evidence-Based Scoring
  evidenceAnalysis: async (theory, userWeights) => {
    const weights = userWeights || {
      governmentDocs: 0.3,
      mainstream: 0.2,
      alternative: 0.15,
      academic: 0.25,
      whistleblower: 0.1
    };

    const prompt = `You are an expert analyst evaluating evidence for a conspiracy theory.

Theory Title: ${theory.title}
Theory Description: ${theory.description}

Source Weighting Preferences:
- Government Documents: ${weights.governmentDocs * 100}%
- Mainstream Media: ${weights.mainstream * 100}%
- Alternative Media: ${weights.alternative * 100}%
- Academic Sources: ${weights.academic * 100}%
- Whistleblowers: ${weights.whistleblower * 100}%

Analyze the available evidence and provide:

1. EVIDENCE QUALITY BREAKDOWN:
   - Primary sources (documents, recordings, official records)
   - Secondary sources (investigative journalism, expert analysis)
   - Tertiary sources (blogs, social media, hearsay)
   - Count and quality rating for each type

2. SOURCE ANALYSIS:
   - Number of credible sources supporting the theory
   - Number of credible sources contradicting it
   - Source diversity (ideological spread)
   - Historical accuracy of sources

3. VERIFICATION STATUS:
   - Verified facts: Claims that have been independently confirmed
   - Unverified claims: Assertions lacking independent confirmation
   - Contradicted claims: Assertions disputed by evidence

4. EVIDENCE SCORE: Overall evidence quality (0-100)

5. SOURCE CREDIBILITY: Average credibility of sources (0-100)

6. GAPS: What evidence is missing that would strengthen or weaken the theory?

Provide response in JSON format with keys: evidenceBreakdown (object), sourceAnalysis (object), verificationStatus (object), evidenceScore, sourceCredibility, evidenceGaps (array).

Apply the user's source weighting preferences in your analysis.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      method: 'evidence',
      userWeights: weights,
      ...analysis,
      timestamp: new Date().toISOString()
    };
  },

  // Method 3: Comparative Analysis
  comparativeAnalysis: async (theory, userWeights) => {
    const prompt = `You are an expert analyst comparing an official narrative against a conspiracy theory.

Theory Title: ${theory.title}
Theory Description: ${theory.description}

Provide a side-by-side comparative analysis:

1. OFFICIAL NARRATIVE:
   - Key claims
   - Supporting evidence
   - Strengths of the narrative
   - Weaknesses or gaps

2. CONSPIRACY THEORY:
   - Key claims
   - Supporting evidence
   - Strengths of the theory
   - Weaknesses or gaps

3. CONFLICTS:
   - Where do they directly contradict?
   - What evidence supports each side at conflict points?

4. COMMON GROUND:
   - What facts do both sides agree on?
   - Where is there overlap?

5. UNANSWERED QUESTIONS:
   - What questions does each narrative leave unanswered?
   - What evidence would decisively settle the dispute?

6. WHO BENEFITS:
   - Who benefits from the official narrative being accepted?
   - Who benefits from the conspiracy theory being accepted?
   - Financial, political, or social incentives on each side

7. COMPARATIVE SCORES:
   - Official narrative credibility (0-100)
   - Conspiracy theory credibility (0-100)
   - Likelihood that truth lies between them (0-100)

Provide response in JSON format with keys: officialNarrative (object), conspiracyTheory (object), conflicts (array), commonGround (array), unansweredQuestions (array), benefitAnalysis (object), comparativeScores (object).

Be balanced and objective. Consider that official narratives can be false and conspiracy theories can be true.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      method: 'comparative',
      ...analysis,
      timestamp: new Date().toISOString()
    };
  },

  // Motivational Analysis - Why does this theory exist?
  motivationalAnalysis: async (theory) => {
    const prompt = `Analyze WHY this conspiracy theory might exist, regardless of whether it's true or false.

Theory: ${theory.title}
Description: ${theory.description}

Consider:
1. Psychological factors (pattern-seeking, agency detection, distrust)
2. Distraction theories (is this distracting from something else?)
3. Cover-up possibilities (could this be covering up different wrongdoing?)
4. Financial incentives (who profits from this narrative?)
5. Political motivations (who gains power from this belief?)
6. Social factors (group identity, belonging, counter-culture)
7. Historical patterns (does this match previous propaganda/disinformation campaigns?)

Provide analysis in JSON with keys: psychologicalFactors (array), distractionPossibility (object), coverUpAnalysis (object), financialIncentives (array), politicalMotivations (array), socialFactors (array), historicalPatterns (array).`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3072,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    return JSON.parse(jsonMatch[0]);
  }
};

module.exports = aiAnalysis;
