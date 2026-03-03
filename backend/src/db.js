const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './urlyhost.db';
const db = new Database(path.resolve(DB_PATH));

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── SCHEMA ──────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS resellers (
    id TEXT PRIMARY KEY,
    codename TEXT NOT NULL,
    category TEXT NOT NULL,
    shop_visible INTEGER NOT NULL DEFAULT 0,
    url TEXT,
    margin TEXT DEFAULT '30',
    status TEXT DEFAULT 'inactive',
    notes TEXT,
    sync_url TEXT,
    last_sync TEXT,
    whmcs_group TEXT,
    created TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    reseller_id TEXT,
    category TEXT NOT NULL,
    shop_visible INTEGER NOT NULL DEFAULT 0,
    price TEXT DEFAULT '0.00',
    cost_price TEXT,
    period TEXT DEFAULT '/mo',
    badge TEXT,
    desc TEXT,
    specs TEXT,
    status TEXT DEFAULT 'inactive',
    featured INTEGER DEFAULT 0,
    markup_override TEXT,
    whmcs_id TEXT,
    whmcs_status TEXT DEFAULT 'pending',
    created TEXT NOT NULL,
    FOREIGN KEY (reseller_id) REFERENCES resellers(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT,
    icon TEXT,
    default_markup TEXT DEFAULT '30',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    codename TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    status TEXT DEFAULT 'offline',
    system_prompt TEXT,
    n8n_enabled INTEGER DEFAULT 0,
    n8n_webhook TEXT,
    metrics TEXT,
    avatar TEXT,
    created TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reseller_id TEXT NOT NULL,
    ts TEXT NOT NULL,
    ok INTEGER NOT NULL,
    msg TEXT,
    changes TEXT,
    FOREIGN KEY (reseller_id) REFERENCES resellers(id)
  );
`);

module.exports = db;
