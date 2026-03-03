const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/products
router.get('/', (req, res) => {
  const { visible, category, reseller_id } = req.query;
  let query = `SELECT * FROM products WHERE 1=1`;
  const params = [];

  if (visible === 'true') {
    query += ` AND shop_visible = 1 AND status = 'active'`;
  }
  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }
  if (reseller_id) {
    query += ` AND reseller_id = ?`;
    params.push(reseller_id);
  }
  query += ` ORDER BY featured DESC, name ASC`;

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(parse));
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const row = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(parse(row));
});

// POST /api/products — admin only
router.post('/', requireAuth, (req, res) => {
  const { v4: uuidv4 } = require('uuid');
  const p = { ...req.body, id: req.body.id || `p-${uuidv4()}`, created: new Date().toISOString() };
  if (Array.isArray(p.specs)) p.specs = JSON.stringify(p.specs);

  db.prepare(`
    INSERT INTO products (id, name, reseller_id, category, shop_visible, price, cost_price, period, badge, desc, specs, status, featured, markup_override, created)
    VALUES (@id, @name, @reseller_id, @category, @shop_visible, @price, @cost_price, @period, @badge, @desc, @specs, @status, @featured, @markup_override, @created)
  `).run(p);
  res.status(201).json(parse(p));
});

// PUT /api/products/:id — admin only
router.put('/:id', requireAuth, (req, res) => {
  const p = req.body;
  if (Array.isArray(p.specs)) p.specs = JSON.stringify(p.specs);

  db.prepare(`
    UPDATE products SET
      name = @name,
      reseller_id = @reseller_id,
      category = @category,
      shop_visible = @shop_visible,
      price = @price,
      cost_price = @cost_price,
      period = @period,
      badge = @badge,
      desc = @desc,
      specs = @specs,
      status = @status,
      featured = @featured,
      markup_override = @markup_override,
      whmcs_id = @whmcs_id,
      whmcs_status = @whmcs_status
    WHERE id = @id
  `).run({ ...p, id: req.params.id });
  res.json({ ok: true });
});

// DELETE /api/products/:id — admin only
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare(`DELETE FROM products WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

function parse(p) {
  return {
    ...p,
    shop_visible: !!p.shop_visible,
    featured: !!p.featured,
    specs: safeParseJSON(p.specs, []),
  };
}

function safeParseJSON(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

module.exports = router;
