const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { EMAIL_REGEX, parseIdParam } = require('../utils/validation');

const MIN_PASSWORD_LENGTH = 8;

/**
 * @route POST /api/users
 * @description Create a new user (Admin only)
 * @access Private (Admin)
 */
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { email, password, is_admin } = req.body || {};

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    });
  }
  if (is_admin !== undefined && typeof is_admin !== 'boolean') {
    return res.status(400).json({ error: 'is_admin must be a boolean' });
  }

  try {
    const [existing] = await req.db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await req.db.query(
      'INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)',
      [email, passwordHash, Boolean(is_admin)]
    );

    const [rows] = await req.db.query(
      'SELECT id, email, is_admin, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/users
 * @description Get all users, each with their reservations (and each
 *   reservation's experience) nested under it (Admin only)
 * @access Private (Admin)
 */
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        u.id AS user_id, u.email, u.is_admin, u.created_at AS user_created_at,
        r.id AS reservation_id, r.date_time, r.participants,
        r.created_at AS reservation_created_at,
        e.id AS experience_id, e.name AS experience_name,
        e.category AS experience_category, e.duration AS experience_duration,
        e.price AS experience_price
      FROM users u
      LEFT JOIN reservations r ON r.user_id = u.id
      LEFT JOIN experiences e ON e.id = r.experience_id
      ORDER BY u.id, r.date_time
    `);

    const usersById = new Map();
    for (const row of rows) {
      if (!usersById.has(row.user_id)) {
        usersById.set(row.user_id, {
          id: row.user_id,
          email: row.email,
          is_admin: row.is_admin,
          created_at: row.user_created_at,
          reservations: [],
        });
      }

      if (row.reservation_id !== null) {
        usersById.get(row.user_id).reservations.push({
          id: row.reservation_id,
          date_time: row.date_time,
          participants: row.participants,
          created_at: row.reservation_created_at,
          experience: {
            id: row.experience_id,
            name: row.experience_name,
            category: row.experience_category,
            duration: row.experience_duration,
            price: row.experience_price,
          },
        });
      }
    }

    res.json(Array.from(usersById.values()));
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/users/:id
 * @description Get a single user by ID
 * @access Private
 * @todo Implement authentication middleware
 */
router.get('/:id', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

/**
 * @route PUT /api/users/:id
 * @description Update a user by ID
 * @access Private
 * @todo Implement authentication middleware
 */
router.put('/:id', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

/**
 * @route DELETE /api/users/:id
 * @description Delete a user by ID (Admin only)
 * @access Private (Admin)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;

  try {
    const [existing] = await req.db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await req.db.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({ error: 'Cannot delete a user with existing reservations' });
    }
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
