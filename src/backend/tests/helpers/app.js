const express = require('express');

/**
 * Builds a minimal Express app that mounts the given router at /api/users
 * and injects a fake req.db, so routes can be tested without a real
 * MySQL connection.
 */
function buildApp(db) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.db = db;
    next();
  });
  app.use('/api/users', require('../../src/routes/users'));
  return app;
}

function createMockDb() {
  return { query: jest.fn() };
}

module.exports = { buildApp, createMockDb };
