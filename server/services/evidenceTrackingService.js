class EvidenceTrackingService {
  async trackDestroyedEvidence(theoryId, evidence) {
    const indicators = [/destroyed/gi, /missing/gi, /disappeared/gi, /classified/gi, /sealed/gi, /withheld/gi];
    const destroyed = evidence.filter(e => indicators.some(p => p.test(JSON.stringify(e))));

    return {
      theoryId,
      destroyedCount: destroyed.length,
      destroyed,
      flag: destroyed.length > 0 ? 'EVIDENCE_DESTROYED' : 'NONE'
    };
  }

  async assessInvestigationQuality(investigation) {
    const text = JSON.stringify(investigation).toLowerCase();
    const issues = {
      obstruction: /obstruct|blocked|refused|denied access/gi.test(text),
      destroyed: /destroyed evidence|deleted|shredded/gi.test(text),
      inadequate: /inadequate|insufficient|underfunded/gi.test(text),
      dissent: /dissenting opinion|disagreed|criticized/gi.test(text)
    };

    const issueCount = Object.values(issues).filter(Boolean).length;
    return {
      issues,
      qualityScore: Math.max(0, 100 - issueCount * 15),
      assessment: issueCount >= 3 ? 'COMPROMISED' : issueCount >= 2 ? 'QUESTIONABLE' : 'ADEQUATE',
      compromised: issueCount >= 3
    };
  }

  async trackTimeline(eventDate) {
    const yearsElapsed = (Date.now() - new Date(eventDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    const overdue = yearsElapsed > 25;

    return {
      eventDate,
      yearsElapsed: Math.floor(yearsElapsed),
      status: overdue ? 'OVERDUE' : 'WAITING',
      overdue
    };
  }
}

module.exports = new EvidenceTrackingService();