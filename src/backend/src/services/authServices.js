const bcrypt = require("bcryptjs");
const { randomBytes, createHash } = require("node:crypto");

async function login(db, { email, password }) {
  const [users] = await db.execute(
    `SELECT id, email, password_hash, role
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
    `INSERT INTO sessions (user_id, token, max_age)
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
      role: user.role
    }
  };
}

module.exports = { login };