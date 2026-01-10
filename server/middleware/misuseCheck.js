const misuseDetection = require('../services/misuseDetectionService');

const misuseCheckMiddleware = (req, res, next) => {
  const userId = req.user?.id || req.ip;
  
  if (misuseDetection.isBlocked(userId)) {
    return res.status(403).json({
      error: 'Access denied',
      reason: 'User blocked for Terms of Service violation',
      contact: 'contact@3rd-eye-view.com'
    });
  }

  next();
};

module.exports = misuseCheckMiddleware;