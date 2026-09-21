const express = require('express');
const router = express.Router();

const experiencesRouter = require('./experiences');
const authRouter = require('./auth');
const usersRouter = require('./users');

router.use('/experiences', experiencesRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);

module.exports = router;