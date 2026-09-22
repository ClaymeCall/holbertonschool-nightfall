const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const { experience_id, date, participants } = req.body;
    if (!Number.isInteger(experience_id) || experience_id < 1) {
      return res.status(400).json({ error: 'experience_id must be a positive integer' });
    }
    if (!Number.isInteger(participants) || participants < 1) {
      return res.status(400).json({ error: 'participants must be a positive integer' });
    }
    const bookingDate = new Date(date);
    if (typeof date !== 'string' || Number.isNaN(bookingDate.getTime())) {
      return res.status(400).json({ error: 'date must be a valid ISO 8601 date-time' });
    }
    if (bookingDate <= new Date()) {
      return res.status(400).json({ error: 'date must be in the future' });
    }
    const [experiences] = await req.db.query(
      'SELECT id, max_participants FROM experiences WHERE id = ?',
      [experience_id]
    );
    if (experiences.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    if (participants > experiences[0].max_participants) {
      return res.status(400).json({
        error: `participants cannot exceed ${experiences[0].max_participants} for this experience`,
      });
    }
    const [result] = await req.db.query(
      'INSERT INTO reservations (experience_id, user_id, date_time, participants) VALUES (?, ?, ?, ?)',
      [experience_id, req.user.sub, bookingDate, participants]
    );

    res.status(201).json({
      id: result.insertId,
      experience_id,
      user_id: req.user.sub,
      date: bookingDate.toISOString(),
      participants,
      status: 'confirmed',
    });

  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
