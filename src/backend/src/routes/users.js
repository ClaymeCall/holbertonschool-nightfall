const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
 * @description Get all users
 * @access Private (Admin)
 * @todo Implement authentication middleware
 */
router.get('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
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
 * @description Delete a user by ID
 * @access Private (Admin)
 * @todo Implement authentication middleware
 */
router.delete('/:id', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

module.exports = router;