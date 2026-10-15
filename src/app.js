const express = require('express');

/**
 * Creates a new Express application with its own in-memory state.
 * Each call returns an independent app, which keeps tests isolated.
 *
 * @returns {import('express').Express} Configured Express app.
 */
function createApp() {
  const app = express();
  app.use(express.json());

  /** @type {{sum: number, count: number}} */
  const state = { sum: 0, count: 0 };

  /**
   * POST /average
   * Body: { "number": <finite number> }
   * Responds with the average of all numbers submitted so far.
   */
  app.post('/average', (req, res) => {
    const value = req.body && req.body.number;

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return res
        .status(400)
        .json({ error: 'Request body must be JSON like {"number": 5}' });
    }

    state.sum += value;
    state.count += 1;

    return res.json({ average: state.sum / state.count, count: state.count });
  });

  // Malformed JSON and other errors
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: status === 400 ? 'Invalid JSON body' : 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
