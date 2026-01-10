const { query } = require('../config/database');

// Historical proven conspiracies database
const PROVEN_CONSPIRACIES = [
  {
    name: 'MK-ULTRA',
    period: '1953-1973',
    category: 'government_experimentation',
    patterns: [
      'government_denial',
      'classified_documents',
      'whistleblower_testimony',
      'destroyed_evidence',
      'illegal_activity',
      'targeting_citizens'
    ],
    provenTrue: true,
    declassifiedYear: 1975
  },
  {
    name: 'COINTELPRO',
    period: '1956-1971',
    category: 'government_surveillance',
    patterns: [
      'government_denial',
      'targeting_activists',
      'illegal_surveillance',
      'destroyed_evidence',
      'whistleblower_testimony',
      'official_obstruction'
    ],
    provenTrue: true,
    declassifiedYear: 1971
  },
  {
    name: 'Tuskegee Syphilis Experiment',
    period: '1932-1972',
    category: 'medical_ethics',
    patterns: [
      'government_denial',
      'targeting_minorities',
      'medical_malpractice',
      'whistleblower_testimony',
      'decades_long_coverup'
    ],
    provenTrue: true,
    declassifiedYear: 1972
  },
  {
    name: 'Operation Northwoods',
    period: '1962',
    category: 'false_flag',
    patterns: [
      'classified_documents',
      'planned_deception',
      'targeting_civilians',
      'military_involvement',
      'rejected_by_leadership'
    ],
    provenTrue: true,
    declassifiedYear: 1997
  },
  {
    name: 'NSA Mass Surveillance',
    period: '2001-Present',
    category: 'surveillance',
    patterns: [
      'government_denial',
      'whistleblower_testimony',
      'illegal_surveillance',
      'classified_programs',
      'targeting_citizens',
      'media_complicity'
    ],
    provenTrue: true,
    declassifiedYear: 2013
  },
  {
    name: 'Iran-Contra Affair',
    period: '1985-1986',
    category: 'political_corruption',
    patterns: [
      'government_denial',
      'destroyed_evidence',
      'congressional_violation',
      'whistleblower_testimony',
      'official_obstruction',
      'pardons_issued'
    ],
    provenTrue: true,
    declassifiedYear: 1986
  },
  {
    name: 'Gulf of Tonkin Incident',
    period: '1964',
    category: 'war_justification',
    patterns: [
      'government_denial',
      'false_intelligence',
      'military_involvement',
      'media_manipulation',
      'war_escalation'
    ],
    provenTrue: true,
    declassifiedYear: 2005
  },
  {
    name: 'Operation Paperclip',
    period: '1945-1959',
    category: 'government_secrets',
    patterns: [
      'classified_documents',
      'whitewashed_records',
      'government_denial',
      'presidential_orders_violated',
      'decades_long_coverup'
    ],
    provenTrue: true,
    declassifiedYear: 1990s
  },
  {
    name: 'Watergate',
    period: '1972',
    category: 'political_corruption',
    patterns: [
      'government_denial',
      'destroyed_evidence',
      'whistleblower_testimony',
      'official_obstruction',
      'resignation',
      'indictments'
    ],
    provenTrue: true,
    declassifiedYear: 1972
  }
];

// Pattern indicators and their red flag levels
const PATTERN_INDICATORS = {
  government_denial: { weight: 3, description: 'Official denial of allegations' },
  destroyed_evidence: { weight: 5, description: 'Evidence destroyed or missing' },
  whistleblower_testimony: { weight: 4, description: 'Whistleblowers coming forward' },
  classified_documents: { weight: 3, description: 'Relevant documents classified' },
  official_obstruction: { weight: 5, description: 'Investigation obstruction' },
  targeting_citizens: { weight: 4, description: 'Citizens targeted by government' },
  illegal_activity: { weight: 5, description: 'Illegal government activities' },
  media_manipulation: { weight: 3, description: 'Media manipulation or complicity' },
  decades_long_coverup: { weight: 4, description: 'Cover-up spanning decades' },
  pardons_issued: { weight: 4, description: 'Pardons for involved parties' },
  congressional_violation: { weight: 5, description: 'Violation of Congressional law' }
};

const patternMatcher = {
  // Find matching patterns from proven conspiracies
  findPatterns: async (theory) => {
    try {
      // Extract patterns from theory description
      const theoryPatterns = patternMatcher.extractPatterns(theory);

      // Match against proven conspiracies
      const matches = [];

      for (const proven of PROVEN_CONSPIRACIES) {
        const commonPatterns = theoryPatterns.filter(p => 
          proven.patterns.includes(p)
        );

        if (commonPatterns.length > 0) {
          const matchScore = (commonPatterns.length / proven.patterns.length) * 100;

          matches.push({
            conspiracy: proven.name,
            period: proven.period,
            category: proven.category,
            declassifiedYear: proven.declassifiedYear,
            commonPatterns,
            matchScore: Math.round(matchScore),
            yearsSinceDeclassification: new Date().getFullYear() - proven.declassifiedYear,
            relevance: matchScore > 50 ? 'high' : matchScore > 30 ? 'medium' : 'low'
          });
        }
      }

      // Sort by match score
      matches.sort((a, b) => b.matchScore - a.matchScore);

      return matches;
    } catch (error) {
      console.error('Error finding patterns:', error);
      return [];
    }
  },

  // Extract patterns from theory text
  extractPatterns: (theory) => {
    const patterns = [];
    const text = `${theory.title} ${theory.description}`.toLowerCase();

    // Check for each pattern indicator
    const checks = {
      government_denial: ['denied', 'denial', 'refuted', 'dismissed'],
      destroyed_evidence: ['destroyed', 'missing', 'lost', 'disappeared', 'shredded'],
      whistleblower_testimony: ['whistleblower', 'insider', 'leaked', 'testimony'],
      classified_documents: ['classified', 'secret', 'redacted', 'sealed'],
      official_obstruction: ['obstruction', 'blocked', 'prevented', 'interference'],
      targeting_citizens: ['citizens', 'americans', 'public', 'people'],
      illegal_activity: ['illegal', 'unlawful', 'criminal', 'violation'],
      media_manipulation: ['media', 'propaganda', 'narrative', 'coverage'],
      decades_long_coverup: ['decades', 'years', 'cover-up', 'coverup', 'hidden']
    };

    for (const [pattern, keywords] of Object.entries(checks)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        patterns.push(pattern);
      }
    }

    return patterns;
  },

  // Calculate red flag score
  calculateRedFlagScore: (patterns) => {
    let score = 0;
    const details = [];

    for (const pattern of patterns) {
      if (PATTERN_INDICATORS[pattern]) {
        score += PATTERN_INDICATORS[pattern].weight;
        details.push({
          pattern,
          weight: PATTERN_INDICATORS[pattern].weight,
          description: PATTERN_INDICATORS[pattern].description
        });
      }
    }

    return {
      score,
      maxScore: Object.values(PATTERN_INDICATORS).reduce((sum, p) => sum + p.weight, 0),
      percentage: Math.round((score / 50) * 100), // 50 is approx max realistic score
      level: score >= 15 ? 'high' : score >= 8 ? 'medium' : 'low',
      details
    };
  },

  // Get historical context
  getHistoricalContext: (category) => {
    const conspiraciesInCategory = PROVEN_CONSPIRACIES.filter(
      c => c.category === category
    );

    return {
      category,
      provenCount: conspiraciesInCategory.length,
      examples: conspiraciesInCategory.map(c => c.name),
      message: conspiraciesInCategory.length > 0 
        ? `${conspiraciesInCategory.length} conspiracy theories in this category have been proven true.`
        : 'No proven conspiracies found in this category.'
    };
  },

  // Assess declassification timeline
  assessDeclassificationTimeline: (theory) => {
    const currentYear = new Date().getFullYear();
    const eventYear = patternMatcher.extractEventYear(theory);

    if (!eventYear) {
      return {
        assessment: 'unknown',
        message: 'Event date unclear'
      };
    }

    const yearsSince = currentYear - eventYear;

    // Typical declassification: 25-50 years
    if (yearsSince < 25) {
      return {
        yearsSince,
        assessment: 'too_recent',
        message: 'May be too recent for declassification (typically 25+ years)',
        expectedDeclassification: eventYear + 25
      };
    } else if (yearsSince < 50) {
      return {
        yearsSince,
        assessment: 'potential',
        message: 'Within typical declassification timeframe',
        shouldBeAvailable: true
      };
    } else {
      return {
        yearsSince,
        assessment: 'overdue',
        message: 'Documents should likely be declassified by now',
        shouldBeAvailable: true,
        redFlag: 'Documents may be deliberately withheld'
      };
    }
  },

  // Extract event year from theory
  extractEventYear: (theory) => {
    const text = `${theory.title} ${theory.description}`;
    const yearMatch = text.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : null;
  }
};

module.exports = patternMatcher;
