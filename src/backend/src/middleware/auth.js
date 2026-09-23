const jwt = require('jsonwebtoken');
/**
 * Verifies the Bearer JWT on the request and attaches its payload to req.user.
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const [sessions] = await req.db.execute(
      "SELECT id FROM sessions WHERE token = ? LIMIT 1",
      [token]
    );

    if (sessions.length === 0) {
      return res.status(401).json({
        error: "Session expirée ou invalidée"
      });
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    req.token = token;
    
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

module.exports = { authenticate, requireAdmin };
