const rateLimit = require('express-rate-limit');

const rateLimiters = {
  free: rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again later.'
  }),
  
  verified: rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20
  }),
  
  researcher: rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100
  }),
  
  premium: rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 500
  })
};

function getRateLimiter(req, res, next) {
  const tier = req.user?.rate_limit_tier || 'free';
  const limiter = rateLimiters[tier] || rateLimiters.free;
  limiter(req, res, next);
}

module.exports = getRateLimiter;