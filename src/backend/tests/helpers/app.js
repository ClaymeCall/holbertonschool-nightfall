const express = require('express');

/**
 * Builds a minimal Express app that mounts the users and experiences
 * routers and injects a fake req.db, so routes can be tested without a
 * real MySQL connection.
 */
function buildApp(db) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.db = db;
    next();
  });
  app.use('/api/users', require('../../src/routes/users'));
  app.use('/api/experiences', require('../../src/routes/experiences'));
  app.use('/api/reservations', require('../../src/routes/reservations'));
  return app;
}

function createMockDb() {
  return {
    query: jest.fn(),
    // authenticate() looks the token up in the sessions table; default to
    // "session found" so route tests don't each need to stub this.
    execute: jest.fn().mockResolvedValue([[{ id: 1 }]]),
  };
}

module.exports = { buildApp, createMockDb };
