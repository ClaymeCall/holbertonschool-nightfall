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

router.get('/', async (req, res) => {
  try {
    // Only return the authenticated user's own reservations — never trust a
    // user_id from the client, always take it from the verified JWT (req.user.sub)
    const [reservations] = await req.db.query(
      'SELECT id, experience_id, user_id, date_time, participants FROM reservations WHERE user_id = ? ORDER BY date_time DESC',
      [req.user.sub]
    );

    const formatted = reservations.map((reservation) => ({
      id: reservation.id,
      experience_id: reservation.experience_id,
      user_id: reservation.user_id,
      date: reservation.date_time.toISOString(),
      participants: reservation.participants,
      // Hardcoded: the reservations table has no `status` column yet (added in #28)
      status: 'confirmed',
    }));

    res.status(200).json(formatted);

  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
