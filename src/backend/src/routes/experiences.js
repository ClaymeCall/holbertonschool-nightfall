const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin, optionalAuthenticate } = require('../middleware/auth');

const EXPERIENCE_COLUMNS = `
  id, name, description, image, category, duration,
  intensity_level, max_participants, price, is_archived
`;

function validateExperienceInput(body) {
  const { name, description, image, category, duration, intensity_level, max_participants, price } = body || {};

  if (typeof name !== 'string' || name.trim().length === 0) {
    return 'name is required';
  }
  if (typeof description !== 'string' || description.trim().length === 0) {
    return 'description is required';
  }
  if (image !== undefined && typeof image !== 'string') {
    return 'image must be a string';
  }
  if (typeof category !== 'string' || category.trim().length === 0) {
    return 'category is required';
  }
  if (!Number.isInteger(duration) || duration <= 0) {
    return 'duration must be a positive integer';
  }
  if (typeof intensity_level !== 'string' || intensity_level.trim().length === 0) {
    return 'intensity_level is required';
  }
  if (!Number.isInteger(max_participants) || max_participants <= 0) {
    return 'max_participants must be a positive integer';
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    return 'price must be a non-negative number';
  }

  return null;
}

/**
 * @route GET /api/experiences
 * @description Get all experiences. Archived experiences are omitted unless
 *   the caller is authenticated as an admin.
 * @access Public
 */
router.get('/', optionalAuthenticate, async (req, res) => {
  try {
    const includeArchived = Boolean(req.user && req.user.is_admin);
    const query = includeArchived
      ? `SELECT ${EXPERIENCE_COLUMNS} FROM experiences`
      : `SELECT ${EXPERIENCE_COLUMNS} FROM experiences WHERE is_archived = FALSE`;
    const [rows] = await req.db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route POST /api/experiences
 * @description Create a new experience
 * @access Private (Admin)
 */
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const validationError = validateExperienceInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, description, image, category, duration, intensity_level, max_participants, price } = req.body;

  try {
    const [result] = await req.db.query(
      'INSERT INTO experiences (name, description, image, category, duration, intensity_level, max_participants, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, image ?? null, category, duration, intensity_level, max_participants, price]
    );

    const [rows] = await req.db.query(
      `SELECT ${EXPERIENCE_COLUMNS} FROM experiences WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating experience:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/experiences/:id
 * @description Get a single experience by ID. Returns 404 for an archived
 *   experience unless the caller is authenticated as an admin.
 * @access Public
 */
router.get('/:id', optionalAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  try {
    const [rows] = await req.db.query(`SELECT ${EXPERIENCE_COLUMNS} FROM experiences WHERE id = ?`, [id]);
    const experience = rows[0];
    const includeArchived = Boolean(req.user && req.user.is_admin);

    if (!experience || (experience.is_archived && !includeArchived)) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(experience);
  } catch (err) {
    console.error('Error fetching experience:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route PUT /api/experiences/:id
 * @description Update an experience by ID. Does not affect is_archived; use
 *   PATCH /:id/toggle-archive for that.
 * @access Private (Admin)
 */
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  const validationError = validateExperienceInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, description, image, category, duration, intensity_level, max_participants, price } = req.body;

  try {
    const [existing] = await req.db.query('SELECT id FROM experiences WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    await req.db.query(
      `UPDATE experiences
       SET name = ?, description = ?, image = ?, category = ?, duration = ?,
           intensity_level = ?, max_participants = ?, price = ?
       WHERE id = ?`,
      [name, description, image ?? null, category, duration, intensity_level, max_participants, price, id]
    );

    const [rows] = await req.db.query(`SELECT ${EXPERIENCE_COLUMNS} FROM experiences WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating experience:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route PATCH /api/experiences/:id/toggle-archive
 * @description Flip an experience's is_archived flag
 * @access Private (Admin)
 */
router.patch('/:id/toggle-archive', authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  try {
    const [existing] = await req.db.query('SELECT id FROM experiences WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    await req.db.query('UPDATE experiences SET is_archived = NOT is_archived WHERE id = ?', [id]);

    const [rows] = await req.db.query(`SELECT ${EXPERIENCE_COLUMNS} FROM experiences WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error toggling experience archived state:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route DELETE /api/experiences/:id
 * @description Delete an experience by ID
 * @access Private (Admin)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  try {
    const [existing] = await req.db.query('SELECT id FROM experiences WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    await req.db.query('DELETE FROM experiences WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({ error: 'Cannot delete an experience with existing reservations' });
    }
    console.error('Error deleting experience:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
