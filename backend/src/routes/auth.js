const router = require('express').Router();
const db = require('../db');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  const row = db.prepare(`SELECT value FROM settings WHERE key = 'admin_password'`).get();
  const correct = row ? row.value : (process.env.ADMIN_PASSWORD || 'urlyhost2024');

  if (password === correct) {
    req.session.admin = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: 'Invalid password' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

// GET /api/auth/status
router.get('/status', (req, res) => {
  res.json({ authenticated: !!req.session.admin });
});

module.exports = router;
