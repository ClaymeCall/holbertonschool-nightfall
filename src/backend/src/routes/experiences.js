const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin, optionalAuthenticate } = require('../middleware/auth');
const { parsePositiveInt, parseIdParam } = require('../utils/validation');

const EXPERIENCE_COLUMNS = `
  id, name, description, image, category, duration,
  intensity_level, max_participants, price, is_archived
`;

const MIN_INTENSITY_LEVEL = 1;
const MAX_INTENSITY_LEVEL = 5;

function parseNonNegativeNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : null;
}

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
  if (!Number.isInteger(intensity_level) || intensity_level < MIN_INTENSITY_LEVEL || intensity_level > MAX_INTENSITY_LEVEL) {
    return `intensity_level must be an integer between ${MIN_INTENSITY_LEVEL} and ${MAX_INTENSITY_LEVEL}`;
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
 * @route GET /api/experiences/search
 * @description Search experiences. Archived experiences are omitted unless
 *   the caller is authenticated as an admin.
 * @queryparam {string} q - Matched against name and description (substring, case-insensitive).
 * @queryparam {string} category - Exact category match.
 * @queryparam {number} min_duration - Minimum duration, in minutes.
 * @queryparam {number} max_duration - Maximum duration, in minutes.
 * @queryparam {number} intensity_level - Integer from 1 to 5. Matches experiences
 *   with exactly this intensity_level.
 * @queryparam {number} participants - Minimum max_participants an experience must support.
 * @queryparam {number} min_price - Minimum price.
 * @queryparam {number} max_price - Maximum price.
 * @access Public
 */
router.get('/search', optionalAuthenticate, async (req, res) => {
  const { q, category, min_duration, max_duration, intensity_level, participants, min_price, max_price } = req.query;

  const conditions = [];
  const params = [];

  const includeArchived = Boolean(req.user && req.user.is_admin);
  if (!includeArchived) {
    conditions.push('is_archived = FALSE');
  }

  if (q !== undefined) {
    if (typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'q must be a non-empty string' });
    }
    const pattern = `%${q.trim()}%`;
    conditions.push('(name LIKE ? OR description LIKE ?)');
    params.push(pattern, pattern);
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ error: 'category must be a non-empty string' });
    }
    conditions.push('category = ?');
    params.push(category.trim());
  }

  let minDurationValue = null;
  if (min_duration !== undefined) {
    minDurationValue = parsePositiveInt(min_duration);
    if (minDurationValue === null) {
      return res.status(400).json({ error: 'min_duration must be a positive integer' });
    }
    conditions.push('duration >= ?');
    params.push(minDurationValue);
  }

  let maxDurationValue = null;
  if (max_duration !== undefined) {
    maxDurationValue = parsePositiveInt(max_duration);
    if (maxDurationValue === null) {
      return res.status(400).json({ error: 'max_duration must be a positive integer' });
    }
    conditions.push('duration <= ?');
    params.push(maxDurationValue);
  }

  if (minDurationValue !== null && maxDurationValue !== null && minDurationValue > maxDurationValue) {
    return res.status(400).json({ error: 'min_duration must not be greater than max_duration' });
  }

  if (intensity_level !== undefined) {
    const value = Number(intensity_level);
    if (!Number.isInteger(value) || value < MIN_INTENSITY_LEVEL || value > MAX_INTENSITY_LEVEL) {
      return res.status(400).json({
        error: `intensity_level must be an integer between ${MIN_INTENSITY_LEVEL} and ${MAX_INTENSITY_LEVEL}`,
      });
    }
    conditions.push('intensity_level = ?');
    params.push(value);
  }

  if (participants !== undefined) {
    const value = parsePositiveInt(participants);
    if (value === null) {
      return res.status(400).json({ error: 'participants must be a positive integer' });
    }
    conditions.push('max_participants >= ?');
    params.push(value);
  }

  let minPriceValue = null;
  if (min_price !== undefined) {
    minPriceValue = parseNonNegativeNumber(min_price);
    if (minPriceValue === null) {
      return res.status(400).json({ error: 'min_price must be a non-negative number' });
    }
    conditions.push('price >= ?');
    params.push(minPriceValue);
  }

  let maxPriceValue = null;
  if (max_price !== undefined) {
    maxPriceValue = parseNonNegativeNumber(max_price);
    if (maxPriceValue === null) {
      return res.status(400).json({ error: 'max_price must be a non-negative number' });
    }
    conditions.push('price <= ?');
    params.push(maxPriceValue);
  }

  if (minPriceValue !== null && maxPriceValue !== null && minPriceValue > maxPriceValue) {
    return res.status(400).json({ error: 'min_price must not be greater than max_price' });
  }

  try {
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const [rows] = await req.db.query(`SELECT ${EXPERIENCE_COLUMNS} FROM experiences ${whereClause}`, params);
    res.json(rows);
  } catch (err) {
    console.error('Error searching experiences:', err);
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
  const id = parseIdParam(req, res);
  if (id === null) return;

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
  const id = parseIdParam(req, res);
  if (id === null) return;

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
  const id = parseIdParam(req, res);
  if (id === null) return;

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
  const id = parseIdParam(req, res);
  if (id === null) return;

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
