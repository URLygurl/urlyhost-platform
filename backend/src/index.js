require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'urlyhost-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
  },
}));

// ── Serve frontend static files ───────────────────────────
app.use(express.static(path.join(__dirname, '../../frontend')));

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/resellers',  require('./routes/resellers'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/settings',   require('./routes/settings'));
app.use('/api/agents',     require('./routes/agents'));

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ── Catch-all → serve frontend ────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/urly_shop5.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 URly Host API running on port ${PORT}`);
});
