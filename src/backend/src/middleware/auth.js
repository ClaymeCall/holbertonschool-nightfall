const jwt = require('jsonwebtoken');

/**
 * Verifies the Bearer JWT on the request and attaches its payload to req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

/**
 * Must run after authenticate(). Rejects non-admin users.
 */
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

/**
 * Like authenticate(), but proceeds as anonymous instead of returning 401
 * when there's no (or an invalid) Bearer token. Lets a handler branch on
 * req.user for callers who are authenticated without requiring auth.
 */
function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    // Invalid/expired token: treat the caller as anonymous rather than failing.
  }
  next();
}

module.exports = { authenticate, requireAdmin, optionalAuthenticate };
