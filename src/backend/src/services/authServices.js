const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const TOKEN_MAX_AGE_HOURS = 168;

async function login(db, { email, password }) {
  const [users] = await db.execute(
    `SELECT id, email, password_hash, is_admin
     FROM users
     WHERE email = ?`,
    [email]
  );

  const user = users[0];

  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!valid) {
    return null;
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      is_admin: user.is_admin === 1
    },
    process.env.JWT_SECRET,
    { expiresIn: `${TOKEN_MAX_AGE_HOURS}h`, jwtid: crypto.randomUUID() }
  );

  await db.execute(
    `INSERT INTO sessions (user_id, token, max_age_hours)
     VALUES (?, ?, ?)`,
    [user.id, token, TOKEN_MAX_AGE_HOURS]
  );

  return {
    token,
    token_type: "Bearer",
    expires_in: TOKEN_MAX_AGE_HOURS,
    user: {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin === 1
    }
  };
}

async function register(db, { email, password }) {
  const [users] = await db.execute(
    `SELECT id
     FROM users
     WHERE email = ?`,
    [email]
  );

  if (users.length > 0) {
    return null;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await db.execute(
    `INSERT INTO users (email, password_hash, is_admin)
     VALUES (?, ?, ?)`,
    [email, passwordHash, false]
  );

  return {
    id: result.insertId,
    email,
    is_admin: false
  };
}

async function logout(db, token) {
  const [result] = await db.execute(
    "DELETE FROM sessions WHERE token = ?",
    [token]
  );

  return result.affectedRows === 1;
}
module.exports = { login, register, logout };