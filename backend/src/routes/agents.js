const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/agents — admin only
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare(`SELECT * FROM agents ORDER BY codename`).all();
  res.json(rows.map(parse));
});

// GET /api/agents/:id
router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare(`SELECT * FROM agents WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(parse(row));
});

// POST /api/agents — admin only
router.post('/', requireAuth, (req, res) => {
  const { v4: uuidv4 } = require('uuid');
  const a = { ...req.body, id: req.body.id || `agent-${uuidv4()}`, created: new Date().toISOString() };
  if (typeof a.metrics === 'object') a.metrics = JSON.stringify(a.metrics);

  db.prepare(`
    INSERT INTO agents (id, codename, name, role, status, system_prompt, n8n_enabled, n8n_webhook, metrics, avatar, created)
    VALUES (@id, @codename, @name, @role, @status, @system_prompt, @n8n_enabled, @n8n_webhook, @metrics, @avatar, @created)
  `).run(a);
  res.status(201).json(parse(a));
});

// PUT /api/agents/:id — admin only
router.put('/:id', requireAuth, (req, res) => {
  const a = req.body;
  if (typeof a.metrics === 'object') a.metrics = JSON.stringify(a.metrics);

  db.prepare(`
    UPDATE agents SET
      codename = @codename,
      name = @name,
      role = @role,
      status = @status,
      system_prompt = @system_prompt,
      n8n_enabled = @n8n_enabled,
      n8n_webhook = @n8n_webhook,
      metrics = @metrics,
      avatar = @avatar
    WHERE id = @id
  `).run({ ...a, id: req.params.id });
  res.json({ ok: true });
});

// DELETE /api/agents/:id — admin only
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare(`DELETE FROM agents WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

// POST /api/agents/:id/toggle-n8n — flip n8n enabled flag
router.post('/:id/toggle-n8n', requireAuth, (req, res) => {
  const row = db.prepare(`SELECT n8n_enabled FROM agents WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const next = row.n8n_enabled ? 0 : 1;
  db.prepare(`UPDATE agents SET n8n_enabled = ? WHERE id = ?`).run(next, req.params.id);
  res.json({ ok: true, n8n_enabled: !!next });
});

function parse(a) {
  return {
    ...a,
    n8n_enabled: !!a.n8n_enabled,
    metrics: safeParseJSON(a.metrics, {}),
  };
}

function safeParseJSON(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

module.exports = router;
