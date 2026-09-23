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
    const [rows] = await req.db.query(
      `SELECT
         r.id, r.date_time, r.participants, r.created_at,
         e.id AS experience_id, e.name AS experience_name, e.image AS experience_image,
         e.category AS experience_category, e.duration AS experience_duration,
         e.price AS experience_price
       FROM reservations r
       JOIN experiences e ON e.id = r.experience_id
       WHERE r.user_id = ?
       ORDER BY r.date_time DESC`,
      [req.user.sub]
    );

    const reservations = rows.map((row) => ({
      id: row.id,
      date_time: row.date_time,
      participants: row.participants,
      created_at: row.created_at,
      experience: {
        id: row.experience_id,
        name: row.experience_name,
        image: row.experience_image,
        category: row.experience_category,
        duration: row.experience_duration,
        price: row.experience_price,
      },
    }));

    res.status(200).json(reservations);

  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }

    const [reservations] = await req.db.query(
      'SELECT id, user_id, date_time FROM reservations WHERE id = ?',
      [id]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    // id is a primary key, so the query returns at most one row — extract it directly
    const reservation = reservations[0];

    if (reservation.user_id !== req.user.sub) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const hoursUntilReservation = (reservation.date_time - new Date()) / (1000 * 60 * 60);
    if (hoursUntilReservation <= 48) {
      return res.status(403).json({ error: 'Cancellation not allowed less than 48 hours before the reservation' });
    }

    await req.db.query('DELETE FROM reservations WHERE id = ?', [id]);

    res.status(204).send();

  } catch (err) {
    console.error('Error cancelling reservation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
