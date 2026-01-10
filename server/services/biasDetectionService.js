const crypto = require('crypto');

class BiasDetectionService {
  detectSourceWeightingBias(code) {
    const patterns = [
      /weight\s*=\s*\{[^}]*government[^}]*:\s*[5-9]\d+/gi,
      /credibility\s*\*=\s*[5-9]\d+.*government/gi,
      /if.*official.*\+=/gi
    ];
    return patterns.map(p => code.match(p)).filter(Boolean).flat();
  }

  detectPromptManipulation(code) {
    const patterns = [/trust official/gi, /government sources are most credible/gi, /conspiracy theories are false/gi];
    return patterns.map(p => code.match(p)).filter(Boolean).flat();
  }

  detectKeywordCensorship(code) {
    const patterns = [/block.*CIA|FBI|NSA/gi, /filter.*false flag/gi, /censor/gi];
    return patterns.map(p => code.match(p)).filter(Boolean).flat();
  }

  analyzeFork(forkData) {
    const detections = [
      ...this.detectSourceWeightingBias(forkData.codeContent).map(m => ({ type: 'SOURCE_BIAS', severity: 'HIGH', match: m })),
      ...this.detectPromptManipulation(forkData.codeContent).map(m => ({ type: 'PROMPT_MANIPULATION', severity: 'CRITICAL', match: m })),
      ...this.detectKeywordCensorship(forkData.codeContent).map(m => ({ type: 'CENSORSHIP', severity: 'CRITICAL', match: m }))
    ];

    const biasScore = detections.reduce((sum, d) => sum + (d.severity === 'CRITICAL' ? 40 : 25), 0);
    const riskLevel = biasScore >= 40 ? 'HIGH' : biasScore >= 20 ? 'MEDIUM' : 'LOW';
    const verdict = riskLevel === 'HIGH' ? 'COMPROMISED' : riskLevel === 'MEDIUM' ? 'MODIFIED' : 'SAFE';

    return {
      forkId: crypto.randomUUID(),
      author: forkData.author,
      timestamp: new Date().toISOString(),
      detections,
      biasScore,
      riskLevel,
      verdict,
      recommendation: verdict === 'COMPROMISED' ? 'DO NOT USE' : verdict === 'MODIFIED' ? 'USE WITH CAUTION' : 'SAFE TO USE'
    };
  }
}

module.exports = new BiasDetectionService();