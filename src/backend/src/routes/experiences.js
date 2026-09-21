const express = require('express');
const router = express.Router();

/**
 * @route GET /api/experiences
 * @description Get all experiences
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM experiences');
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
 * @todo Implement authentication middleware
 */
router.post('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

/**
 * @route GET /api/experiences/:id
 * @description Get a single experience by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

/**
 * @route PUT /api/experiences/:id
 * @description Update an experience by ID
 * @access Private (Admin)
 * @todo Implement authentication middleware
 */
router.put('/:id', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

/**
 * @route DELETE /api/experiences/:id
 * @description Delete an experience by ID
 * @access Private (Admin)
 * @todo Implement authentication middleware
 */
router.delete('/:id', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

module.exports = router;