const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/settings — admin only (contains sensitive keys)
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare(`SELECT * FROM settings`).all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  // Never expose admin password in response
  delete settings.admin_password;
  res.json(settings);
});

// PUT /api/settings — admin only
router.put('/', requireAuth, (req, res) => {
  const upsert = db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (@key, @value)`);
  const update = db.transaction((obj) => {
    for (const [key, value] of Object.entries(obj)) {
      upsert.run({ key, value: String(value) });
    }
  });
  update(req.body);
  res.json({ ok: true });
});

// PUT /api/settings/password — change admin password
router.put('/password', requireAuth, (req, res) => {
  const { current, newPassword } = req.body;
  const row = db.prepare(`SELECT value FROM settings WHERE key = 'admin_password'`).get();
  const stored = row ? row.value : (process.env.ADMIN_PASSWORD || 'urlyhost2024');

  if (current !== stored) {
    return res.status(401).json({ error: 'Current password incorrect' });
  }
  db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password', ?)`).run(newPassword);
  res.json({ ok: true });
});

module.exports = router;
