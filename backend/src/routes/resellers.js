const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/resellers — public (shop needs visible ones)
router.get('/', (req, res) => {
  const { visible } = req.query;
  let rows;
  if (visible === 'true') {
    rows = db.prepare(`SELECT * FROM resellers WHERE shop_visible = 1 AND status = 'active' ORDER BY codename`).all();
  } else {
    rows = db.prepare(`SELECT * FROM resellers ORDER BY codename`).all();
  }
  res.json(rows.map(parse));
});

// GET /api/resellers/:id
router.get('/:id', (req, res) => {
  const row = db.prepare(`SELECT * FROM resellers WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(parse(row));
});

// POST /api/resellers — admin only
router.post('/', requireAuth, (req, res) => {
  const { v4: uuidv4 } = require('uuid');
  const r = { ...req.body, id: req.body.id || `r-${uuidv4()}`, created: new Date().toISOString() };
  db.prepare(`
    INSERT INTO resellers (id, codename, category, shop_visible, url, margin, status, notes, sync_url, whmcs_group, created)
    VALUES (@id, @codename, @category, @shop_visible, @url, @margin, @status, @notes, @sync_url, @whmcs_group, @created)
  `).run(r);
  res.status(201).json(r);
});

// PUT /api/resellers/:id — admin only
router.put('/:id', requireAuth, (req, res) => {
  const r = req.body;
  db.prepare(`
    UPDATE resellers SET
      codename = @codename,
      category = @category,
      shop_visible = @shop_visible,
      url = @url,
      margin = @margin,
      status = @status,
      notes = @notes,
      sync_url = @sync_url,
      whmcs_group = @whmcs_group
    WHERE id = @id
  `).run({ ...r, id: req.params.id });
  res.json({ ok: true });
});

// DELETE /api/resellers/:id — admin only
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare(`DELETE FROM resellers WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

// POST /api/resellers/:id/sync — trigger supplier sync
router.post('/:id/sync', requireAuth, async (req, res) => {
  const reseller = db.prepare(`SELECT * FROM resellers WHERE id = ?`).get(req.params.id);
  if (!reseller) return res.status(404).json({ error: 'Not found' });
  if (!reseller.sync_url) return res.status(400).json({ error: 'No sync URL configured' });

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(reseller.sync_url, { timeout: 10000 });
    const data = await response.json();

    // Log the sync attempt
    db.prepare(`
      INSERT INTO sync_logs (reseller_id, ts, ok, msg, changes)
      VALUES (?, ?, ?, ?, ?)
    `).run(reseller.id, new Date().toISOString(), 1, 'Sync successful', JSON.stringify(data));

    // Update last_sync timestamp
    db.prepare(`UPDATE resellers SET last_sync = ? WHERE id = ?`)
      .run(new Date().toISOString(), reseller.id);

    res.json({ ok: true, data });
  } catch (err) {
    db.prepare(`
      INSERT INTO sync_logs (reseller_id, ts, ok, msg)
      VALUES (?, ?, ?, ?)
    `).run(reseller.id, new Date().toISOString(), 0, err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resellers/:id/sync-logs
router.get('/:id/sync-logs', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM sync_logs WHERE reseller_id = ? ORDER BY ts DESC LIMIT 20
  `).all(req.params.id);
  res.json(rows);
});

function parse(r) {
  return { ...r, shop_visible: !!r.shop_visible };
}

module.exports = router;
