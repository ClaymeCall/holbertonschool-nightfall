const express = require('express');
const router = express.Router();

const experiencesRouter = require('./experiences');
const authRouter = require('./auth');
const usersRouter = require('./users');
const bookingsRouter = require('./bookings');

router.use('/experiences', experiencesRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/reservations', bookingsRouter);

module.exports = router;