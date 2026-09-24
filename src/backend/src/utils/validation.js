// Request validation shared by the routes and the auth controller.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A positive integer, or null. Also accepts numeric strings, which is what
// query strings and path params are.
function parsePositiveInt(value) {
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : null;
}

// Reads the :id path parameter. When it is invalid the 400 is already sent and
// null is returned, so a route only needs:
//   const id = parseIdParam(req, res);
//   if (id === null) return;
function parseIdParam(req, res) {
  const id = parsePositiveInt(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'id must be a positive integer' });
  }
  return id;
}

function isValidEmail(email) {
  return Boolean(email) && email.length <= 255 && EMAIL_REGEX.test(email);
}

module.exports = { EMAIL_REGEX, parsePositiveInt, parseIdParam, isValidEmail };
