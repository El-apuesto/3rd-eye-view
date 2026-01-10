const axios = require('axios');
const biasDetection = require('./biasDetectionService');

class ForkMonitorService {
  constructor() {
    this.registryUrl = process.env.AUDIT_REGISTRY_URL || 'https://3rd-eye-audit.com/api';
  }

  async monitorForks(owner, repo) {
    const forks = await this.getForks(owner, repo);
    for (const fork of forks) {
      await this.analyzeFork(fork);
    }
  }

  async getForks(owner, repo) {
    const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/forks`);
    return res.data;
  }

  async analyzeFork(fork) {
    const code = await this.getForkCode(fork);
    const analysis = biasDetection.analyzeFork({ codeContent: code, author: fork.owner.login });
    await this.reportToRegistry({ forkUrl: fork.html_url, analysis });
    console.log(`Fork ${fork.html_url}: ${analysis.verdict}`);
  }

  async getForkCode(fork) {
    const files = ['server/services/aiAnalysisEngine.js', 'server/services/biasDetectionService.js'];
    let code = '';
    for (const file of files) {
      try {
        const res = await axios.get(`https://raw.githubusercontent.com/${fork.owner.login}/${fork.name}/main/${file}`);
        code += res.data;
      } catch (e) {}
    }
    return code;
  }

  async reportToRegistry(report) {
    try {
      await axios.post(`${this.registryUrl}/forks`, report);
    } catch (e) {
      console.log('AUDIT LOG:', JSON.stringify(report));
    }
  }
}

module.exports = new ForkMonitorService();