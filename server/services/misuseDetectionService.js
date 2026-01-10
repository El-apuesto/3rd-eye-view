const crypto = require('crypto');

class MisuseDetectionService {
  constructor() {
    this.usageLogs = [];
    this.blockedUsers = new Set();
  }

  logUsage(userId, action, metadata = {}) {
    const log = { timestamp: new Date().toISOString(), userId, action, metadata };
    this.usageLogs.push(log);
    this.detectMisuse(userId);
    return log;
  }

  detectMisuse(userId) {
    const logs = this.usageLogs.filter(l => l.userId === userId && Date.now() - new Date(l.timestamp).getTime() < 3600000);

    if (logs.length > 100) {
      this.blockUser(userId, 'MASS_SURVEILLANCE');
    }

    if (logs.some(l => l.action.includes('identify') || l.metadata.query?.includes('who believes'))) {
      this.blockUser(userId, 'TARGETING_USERS');
    }

    if (logs.filter(l => l.metadata.query?.includes('censor') || l.metadata.query?.includes('remove')).length > 3) {
      this.blockUser(userId, 'CENSORSHIP_ATTEMPT');
    }
  }

  blockUser(userId, reason) {
    this.blockedUsers.add(userId);
    console.error(`USER BLOCKED: ${userId} - ${reason}`);
  }

  isBlocked(userId) {
    return this.blockedUsers.has(userId);
  }

  checkAccess(userId, action) {
    if (this.isBlocked(userId)) {
      return { allowed: false, reason: 'User blocked for TOS violation' };
    }
    const prohibited = ['identify_believers', 'track_users', 'mass_surveillance', 'censor_results'];
    if (prohibited.includes(action)) {
      this.blockUser(userId, `PROHIBITED: ${action}`);
      return { allowed: false, reason: `Action prohibited by TOS` };
    }
    return { allowed: true };
  }
}

module.exports = new MisuseDetectionService();