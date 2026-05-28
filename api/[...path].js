// Vercel catch‑all function to forward every /api/* request to the Express app
// Place this file at api/[...path].js
const app = require('../server/index');
module.exports = (req, res) => {
  // Vercel passes the raw Node request; just hand it to Express
  return app(req, res);
};
