const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/categories
router.get('/', (req, res) => {
  const rows = db.prepare(`SELECT * FROM categories ORDER BY sort_order ASC`).all();
  res.json(rows);
});

// PUT /api/categories/:id — admin only
router.put('/:id', requireAuth, (req, res) => {
  const c = req.body;
  db.prepare(`
    UPDATE categories SET
      name = @name,
      color = @color,
      icon = @icon,
      default_markup = @default_markup,
      sort_order = @sort_order
    WHERE id = @id
  `).run({ ...c, id: req.params.id });
  res.json({ ok: true });
});

module.exports = router;
