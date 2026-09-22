const bcrypt = require("bcryptjs");
// randomBytes -> genere token aleatoire
// creataHash -> hash le token pour bdd
const { randomBytes, createHash } = require("node:crypto");

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

  const token = randomBytes(32).toString("hex");

  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  const maxAge = 168;

  
  await db.execute(
    `INSERT INTO sessions (user_id, token, max_age_hours)
     VALUES (?, ?, ?)`,
    [user.id, tokenHash, maxAge]
  );

  return {
    token,
    token_type: "Bearer",
    expires_in: maxAge,
    user: {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin === 1    }
  };
}

module.exports = { login };