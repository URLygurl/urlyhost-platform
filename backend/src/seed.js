// ── URly Host Seed Data ──────────────────────────────────
// Mirrors the seed in urly_admin14.html
// Run: node src/seed.js

require('dotenv').config();
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

console.log('🌱 Seeding URly Host database...');

const now = new Date().toISOString();

// ── CATEGORIES ──────────────────────────────────────────

const categories = [
  { id: 'cat-vps',        name: 'VPS',          color: '#9333ea', icon: '⚡', default_markup: '35', sort_order: 1 },
  { id: 'cat-web',        name: 'Web Hosting',  color: '#3b82f6', icon: '🌐', default_markup: '40', sort_order: 2 },
  { id: 'cat-wp',         name: 'WordPress',    color: '#22c55e', icon: '📝', default_markup: '35', sort_order: 3 },
  { id: 'cat-domains',    name: 'Domains',      color: '#f59e0b', icon: '🔗', default_markup: '15', sort_order: 4 },
  { id: 'cat-email',      name: 'Email',        color: '#ec4899', icon: '📧', default_markup: '45', sort_order: 5 },
  { id: 'cat-ssl',        name: 'SSL',          color: '#14b8a6', icon: '🔒', default_markup: '30', sort_order: 6 },
  { id: 'cat-n8n',        name: 'n8n',          color: '#f97316', icon: '⚙️', default_markup: '40', sort_order: 7 },
  { id: 'cat-dns',        name: 'DNS',          color: '#6366f1', icon: '🌍', default_markup: '25', sort_order: 8 },
  { id: 'cat-ai',         name: 'AI',           color: '#8b5cf6', icon: '🤖', default_markup: '20', sort_order: 9 },
  { id: 'cat-game',       name: 'Game Server',  color: '#ef4444', icon: '🎮', default_markup: '35', sort_order: 10 },
];

// ── RESELLERS ────────────────────────────────────────────

const resellers = [
  // ── ACTIVE ──
  { id: 'r3',  codename: 'LYRA',        category: 'VPS',         shop_visible: 1, url: 'https://synergywholesale.com/vps-reseller/', margin: '25', status: 'active',   notes: 'Synergy Wholesale. Sydney AU. Xeon Platinum. $99 activation rebatable. Best for NZ/AU clients.' },
  { id: 'r4',  codename: 'VEGA',        category: 'VPS',         shop_visible: 1, url: 'https://www.resellerspanel.com/virtual-private-servers/', margin: '35', status: 'active',   notes: 'ResellersPanel. 22 years. Truly free. USA + AU. SolusVM + Hepsia. Weekly backups.' },
  { id: 'r15', codename: 'KAMA',        category: 'VPS',         shop_visible: 1, url: 'https://www.kamatera.com/express/compute/', margin: '30', status: 'active',   notes: 'Kamatera. 24 DCs worldwide. Ice Lake NVMe. Hourly + monthly billing. Reseller approval pending — using retail pricing until wholesale confirmed.' },
  { id: 'r16', codename: 'ICDS',        category: 'Web Hosting', shop_visible: 1, url: 'https://www.icdsoft.com/en/resellerhosting', margin: '45', status: 'active',   notes: 'ICDSoft. Perfect 5.0 TrustPilot from 630+ reviews. Avg support response 7 min. No cPanel — own panel. DCs: US/EU/HK. No AU DC, position as US/EU/HK option.' },
  { id: 'r17', codename: 'CREST',       category: 'Web Hosting', shop_visible: 1, url: 'https://rcp1.resellercluster.com/', margin: '35', status: 'active',   notes: 'ResellerCluster. Store: URLy Hosting (urly.space). Live wholesale pricing confirmed. Shared, Semi-Dedicated, VPS, SSL, Domains.' },
  { id: 'r19', codename: 'DREM',        category: 'Email',       shop_visible: 1, url: 'https://www.dreamithost.com.au/', margin: '40', status: 'active',   notes: 'DreamIT Host. AU/NZ DCs: Sydney, Melbourne, Perth, Auckland. CrossBox email suite bundled FREE with all plans. Hourly JetBackup. LiteSpeed + NVMe. Strong AU/NZ positioning.' },
  // ── INACTIVE ──
  { id: 'r1',  codename: 'KRIX',        category: 'Web Hosting', shop_visible: 0, url: 'https://kickhost.com/reseller-hosting/', margin: '40', status: 'inactive', notes: 'KickHost. WHM/cPanel reseller. Portal prices: Basic FREE+$90 setup, Prime $11, Max $18, Ultra $30/mo. Purchasing on payday.' },
  { id: 'r2',  codename: 'NOVA',        category: 'VPS',         shop_visible: 0, url: 'https://skynethosting.net/vps-dedicated-server-reseller.htm', margin: '40', status: 'inactive', notes: 'SkyNet. 50% reseller discount. Cheapest entry at $2.95/mo. US/Canada. Not yet active.' },
  { id: 'r18', codename: 'DIGA',        category: 'Web Hosting', shop_visible: 0, url: 'https://dotshift.net/master-reseller', margin: '40', status: 'inactive', notes: 'DotShift. Master Reseller. LiteSpeed, NVMe, free WHMCS, Imunify360, CloudLinux. US + DE DCs. Evaluate before activating.' },
  { id: 'r6',  codename: 'DYNADOT-01',  category: 'Domains',     shop_visible: 0, url: 'https://www.dynadot.com/reseller/', margin: '15', status: 'inactive', notes: 'Dynadot domain reseller.' },
  { id: 'r7',  codename: 'WEBHOST-01',  category: 'Web Hosting', shop_visible: 0, url: 'https://www.resellerspanel.com/web-hosting/', margin: '40', status: 'inactive', notes: 'Placeholder — covered by CREST and VEGA.' },
  { id: 'r8',  codename: 'WPHOST-01',   category: 'WordPress',   shop_visible: 0, url: 'https://www.inmotionhosting.com/wordpress-hosting', margin: '35', status: 'inactive', notes: 'Placeholder WordPress reseller.' },
  { id: 'r9',  codename: 'MAILBOX-01',  category: 'Email',       shop_visible: 0, url: '#', margin: '45', status: 'inactive', notes: 'Email placeholder. Superseded by DREM.' },
  { id: 'r10', codename: 'SSLVAULT-01', category: 'SSL',         shop_visible: 0, url: '#', margin: '30', status: 'inactive', notes: 'SSL placeholder — covered by CREST.' },
  { id: 'r11', codename: 'NOVA-N8N',    category: 'n8n',         shop_visible: 0, url: 'https://skynethosting.net/vps-dedicated-server-reseller.htm', margin: '40', status: 'inactive', notes: 'n8n via SkyNet. Not active yet.' },
  { id: 'r12', codename: 'DNSFORGE-01', category: 'DNS',         shop_visible: 0, url: '#', margin: '25', status: 'inactive', notes: 'DNS/CDN placeholder.' },
  { id: 'r13', codename: 'GPULAB-01',   category: 'AI',          shop_visible: 0, url: '#', margin: '20', status: 'inactive', notes: 'AI/GPU placeholder.' },
  { id: 'r14', codename: 'GAMENODE-01', category: 'Game Server', shop_visible: 0, url: '#', margin: '35', status: 'inactive', notes: 'Game server placeholder.' },
];

// ── PRODUCTS ─────────────────────────────────────────────

const products = [
  // ── LYRA (Synergy Wholesale) VPS ──
  { id: 'p31', name: 'LYRA-1',    reseller_id: 'r3',  category: 'VPS',         shop_visible: 1, price: '14.99', period: '/mo', badge: '',             desc: 'Entry VPS — AU-hosted, Xeon Platinum, NVMe SSD',              specs: JSON.stringify(['1 vCPU','2 GB RAM','30 GB NVMe SSD','1 TB Bandwidth','Sydney AU DC','Root Access','Choice of OS','DDoS Protection']),                                                           status: 'active', featured: 0 },
  { id: 'p32', name: 'LYRA-2',    reseller_id: 'r3',  category: 'VPS',         shop_visible: 1, price: '24.99', period: '/mo', badge: 'Most Popular', desc: 'Mid-tier AU VPS — ideal for client sites and apps',           specs: JSON.stringify(['2 vCPU','4 GB RAM','60 GB NVMe SSD','2 TB Bandwidth','Sydney AU DC','Root Access','Choice of OS','DDoS Protection','Weekly Backups']),                                          status: 'active', featured: 1 },
  { id: 'p33', name: 'LYRA-4',    reseller_id: 'r3',  category: 'VPS',         shop_visible: 1, price: '49.99', period: '/mo', badge: '',             desc: 'Performance AU VPS — serious workloads, serious uptime',       specs: JSON.stringify(['4 vCPU','8 GB RAM','120 GB NVMe SSD','4 TB Bandwidth','Sydney AU DC','Root Access','Choice of OS','DDoS Protection','Weekly Backups']),                                         status: 'active', featured: 0 },
  // ── VEGA (ResellersPanel) VPS ──
  { id: 'p34', name: 'VEGA-SSD-1', reseller_id: 'r4', category: 'VPS',         shop_visible: 1, price: '9.99',  period: '/mo', badge: '',             desc: 'Budget VPS — US or AU DC, SolusVM control panel',             specs: JSON.stringify(['1 vCPU','1 GB RAM','20 GB SSD','500 GB Bandwidth','US or AU DC','SolusVM Panel','Root Access','Weekly Backups']),                                                               status: 'active', featured: 0 },
  { id: 'p35', name: 'VEGA-SSD-2', reseller_id: 'r4', category: 'VPS',         shop_visible: 1, price: '17.99', period: '/mo', badge: 'Best Value',   desc: 'Reliable VPS — dual DC choice, SolusVM + Hepsia',             specs: JSON.stringify(['2 vCPU','2 GB RAM','40 GB SSD','1 TB Bandwidth','US or AU DC','SolusVM Panel','Root Access','Weekly Backups']),                                                                status: 'active', featured: 0 },
  { id: 'p36', name: 'VEGA-SSD-4', reseller_id: 'r4', category: 'VPS',         shop_visible: 1, price: '34.99', period: '/mo', badge: '',             desc: 'Pro VPS — scale without breaking the bank',                   specs: JSON.stringify(['4 vCPU','4 GB RAM','80 GB SSD','2 TB Bandwidth','US or AU DC','SolusVM Panel','Root Access','Weekly Backups']),                                                                status: 'active', featured: 0 },
  // ── KAMA (Kamatera) VPS ──
  { id: 'p40', name: 'KAMA-MICRO', reseller_id: 'r15', category: 'VPS',        shop_visible: 1, price: '6.99',  period: '/mo', badge: '',             desc: 'Micro VPS — 24 DC locations, pay hourly or monthly',          specs: JSON.stringify(['1 vCPU','1 GB RAM','20 GB NVMe SSD','1 TB Transfer','24 DC Locations','Ice Lake Processors','Hourly Billing','Root Access']),                                                  status: 'active', featured: 0 },
  { id: 'p41', name: 'KAMA-START', reseller_id: 'r15', category: 'VPS',        shop_visible: 1, price: '12.99', period: '/mo', badge: 'Most Popular', desc: 'Starter VPS — global reach, flexible billing',                specs: JSON.stringify(['2 vCPU','2 GB RAM','40 GB NVMe SSD','2 TB Transfer','24 DC Locations','Ice Lake Processors','Hourly or Monthly Billing','Root Access']),                                      status: 'active', featured: 1 },
  { id: 'p42', name: 'KAMA-PRO',   reseller_id: 'r15', category: 'VPS',        shop_visible: 1, price: '24.99', period: '/mo', badge: '',             desc: 'Pro VPS — serious resources across 24 global DCs',            specs: JSON.stringify(['4 vCPU','4 GB RAM','80 GB NVMe SSD','4 TB Transfer','24 DC Locations','Ice Lake Processors','Hourly or Monthly Billing','Root Access','Managed Firewall']),                    status: 'active', featured: 0 },
  // ── ICDS (ICDSoft) Web Hosting ──
  { id: 'p43', name: 'ICDS-STARTER',  reseller_id: 'r16', category: 'Web Hosting', shop_visible: 1, price: '5.99',  period: '/mo', badge: '',          desc: 'Entry web hosting — perfect 5.0 TrustPilot, 7-min avg support', specs: JSON.stringify(['1 Website','10 GB SSD','Unmetered Bandwidth','Free SSL','Custom Control Panel','US / EU / HK DC','7-Min Avg Support Response','Daily Backups']),                          status: 'active', featured: 0 },
  { id: 'p44', name: 'ICDS-BUSINESS', reseller_id: 'r16', category: 'Web Hosting', shop_visible: 1, price: '9.99',  period: '/mo', badge: 'Best Support', desc: 'Business hosting — unlimited sites, award-winning support',  specs: JSON.stringify(['Unlimited Websites','20 GB SSD','Unmetered Bandwidth','Free SSL','Custom Control Panel','US / EU / HK DC','7-Min Avg Support Response','Daily Backups','Staging']),        status: 'active', featured: 1 },
  { id: 'p45', name: 'ICDS-PRO',      reseller_id: 'r16', category: 'Web Hosting', shop_visible: 1, price: '17.99', period: '/mo', badge: '',          desc: 'Pro hosting — max resources, US/EU/HK DC choice',             specs: JSON.stringify(['Unlimited Websites','40 GB SSD','Unmetered Bandwidth','Free SSL','Custom Control Panel','US / EU / HK DC','Priority Support','Daily Backups','Staging','Advanced Caching']), status: 'active', featured: 0 },
  // ── CREST (ResellerCluster) Web Hosting ──
  { id: 'p46', name: 'CREST-STARTER',  reseller_id: 'r17', category: 'Web Hosting', shop_visible: 1, price: '3.99',  period: '/mo', badge: '',         desc: 'Entry shared hosting — get online fast',                      specs: JSON.stringify(['1 Website','5 GB SSD','Free SSL','cPanel','Softaculous','Daily Backups']),                                                                                                  status: 'active', featured: 0 },
  { id: 'p47', name: 'CREST-PLUS',     reseller_id: 'r17', category: 'Web Hosting', shop_visible: 1, price: '6.99',  period: '/mo', badge: '',         desc: 'Plus hosting — room to grow',                                 specs: JSON.stringify(['5 Websites','20 GB SSD','Free SSL','cPanel','Softaculous','Daily Backups','Free Domain']),                                                                                    status: 'active', featured: 0 },
  { id: 'p48', name: 'CREST-PRO',      reseller_id: 'r17', category: 'Web Hosting', shop_visible: 1, price: '11.99', period: '/mo', badge: 'Most Popular', desc: 'Pro hosting — unlimited sites, priority support',          specs: JSON.stringify(['Unlimited Websites','40 GB SSD','Free SSL','cPanel','Softaculous','Daily Backups','Free Domain','Priority Support']),                                                       status: 'active', featured: 1 },
  // ── CREST Semi-Dedicated ──
  { id: 'p49', name: 'CREST-SEMI-STARTER', reseller_id: 'r17', category: 'Web Hosting', shop_visible: 1, price: '9.99',  period: '/mo', badge: '',     desc: 'Semi-dedicated entry — guaranteed CPU, near-VPS performance', specs: JSON.stringify(['1x Guaranteed CPU','2 GB RAM','SSD Storage','Unlimited Websites','Free SSL','Daily Backups']),                                                                             status: 'active', featured: 0 },
  { id: 'p50', name: 'CREST-SEMI-PLUS',    reseller_id: 'r17', category: 'Web Hosting', shop_visible: 1, price: '14.99', period: '/mo', badge: '',     desc: 'Semi-dedicated plus — double the resources',                  specs: JSON.stringify(['2x Guaranteed CPU','4 GB RAM','SSD Storage','Unlimited Websites','Free SSL','Daily Backups','Priority Support']),                                                             status: 'active', featured: 0 },
  { id: 'p53', name: 'CREST-SEMI-MAX',     reseller_id: 'r17', category: 'Web Hosting', shop_visible: 1, price: '29.98', period: '/mo', badge: '',     desc: 'Maximum semi-dedicated tier — near-VPS performance at shared price', specs: JSON.stringify(['4x Guaranteed CPU','High RAM','SSD Storage','Unlimited Websites','Free SSL','Daily Backups','Priority Support']),                                                  status: 'active', featured: 0 },
  // ── CREST VPS ──
  { id: 'p54', name: 'CREST-MICRO', reseller_id: 'r17', category: 'VPS',        shop_visible: 1, price: '9.00',  period: '/mo', badge: '',             desc: 'Entry VPS — full root access, dedicated resources',           specs: JSON.stringify(['1 vCPU','SSD Storage','Dedicated IP','Root Access','Choice of OS','DDoS Protection']),                                                                                    status: 'active', featured: 0 },
  { id: 'p55', name: 'CREST-LITE',  reseller_id: 'r17', category: 'VPS',        shop_visible: 1, price: '19.00', period: '/mo', badge: 'Most Popular', desc: 'Pro VPS — reliable power for client sites and apps',          specs: JSON.stringify(['2 vCPU','SSD Storage','Dedicated IP','Root Access','Choice of OS','DDoS Protection','Weekly Backups']),                                                                    status: 'active', featured: 1 },
  { id: 'p56', name: 'CREST-PRO',   reseller_id: 'r17', category: 'VPS',        shop_visible: 1, price: '38.00', period: '/mo', badge: '',             desc: 'Advanced VPS — maximum resources for high-traffic workloads', specs: JSON.stringify(['4 vCPU','High RAM','SSD Storage','Dedicated IP','Root Access','Choice of OS','DDoS Protection','Weekly Backups']),                                                       status: 'active', featured: 0 },
  // ── CREST SSL ──
  { id: 'p57', name: 'CREST-SSL-RAPID', reseller_id: 'r17', category: 'SSL',    shop_visible: 1, price: '19.95', period: '/yr', badge: '',             desc: 'RapidSSL — instant domain validation, padlock in minutes',    specs: JSON.stringify(['Domain Validation','256-bit Encryption','1 Domain','99.9% Browser Trust','Auto-Renew']),                                                                                  status: 'active', featured: 0 },
  { id: 'p58', name: 'CREST-SSL-BIZ',   reseller_id: 'r17', category: 'SSL',    shop_visible: 1, price: '115.00',period: '/yr', badge: '',             desc: 'GeoTrust QuickSSL Premium — fast OV certificate for business sites', specs: JSON.stringify(['Organisation Validation','256-bit Encryption','1 Domain','Business Authentication','99.9% Trust','Site Seal']),                                          status: 'active', featured: 0 },
  { id: 'p59', name: 'CREST-SSL-EV',    reseller_id: 'r17', category: 'SSL',    shop_visible: 1, price: '199.00',period: '/yr', badge: 'Best Trust',   desc: 'GeoTrust TrueBizID EV — full green bar, maximum customer trust', specs: JSON.stringify(['Extended Validation','256-bit Encryption','1 Domain','Green Bar Display','Business Authentication','99.9% Trust']),                                      status: 'active', featured: 1 },
  { id: 'p60', name: 'CREST-SSL-WILD',  reseller_id: 'r17', category: 'SSL',    shop_visible: 1, price: '550.00',period: '/yr', badge: '',             desc: 'GeoTrust TrueBizID Wildcard — secure all subdomains with one certificate', specs: JSON.stringify(['Organisation Validation','256-bit Encryption','Wildcard (*.domain.com)','Unlimited Subdomains','99.9% Trust']),                        status: 'active', featured: 0 },
  // ── DREM (DreamIT Host) Email ──
  { id: 'p70', name: 'DREM-MAIL-SOLO',     reseller_id: 'r19', category: 'Email', shop_visible: 1, price: '1.99',  period: '/mo', badge: '',            desc: 'Professional email for solo operators — AU/NZ servers, CrossBox webmail included free', specs: JSON.stringify(['1 Mailbox','5 GB Storage','CrossBox Webmail','IMAP / POP3 / SMTP','Spam & Virus Filtering','AU/NZ DC','Hourly JetBackup']),                                 status: 'active', featured: 0 },
  { id: 'p71', name: 'DREM-MAIL-STARTER',  reseller_id: 'r19', category: 'Email', shop_visible: 1, price: '4.99',  period: '/mo', badge: '',            desc: 'Team email starter — 5 mailboxes on AU/NZ infrastructure with full CrossBox suite', specs: JSON.stringify(['5 Mailboxes','10 GB Storage Per Mailbox','CrossBox Webmail','IMAP / POP3 / SMTP','Shared Calendar','Contacts Sync','Spam & Virus Filtering','AU/NZ DC']),       status: 'active', featured: 0 },
  { id: 'p72', name: 'DREM-MAIL-BUSINESS', reseller_id: 'r19', category: 'Email', shop_visible: 1, price: '9.99',  period: '/mo', badge: 'Most Popular', desc: 'Business email for growing teams — 20 mailboxes, full CrossBox collaboration suite', specs: JSON.stringify(['20 Mailboxes','15 GB Storage Per Mailbox','CrossBox Webmail','IMAP / POP3 / SMTP','Shared Calendar','Contacts & Tasks Sync','Mobile Sync (ActiveSync)','AU/NZ DC','Hourly JetBackup']), status: 'active', featured: 1 },
  { id: 'p73', name: 'DREM-MAIL-PRO',      reseller_id: 'r19', category: 'Email', shop_visible: 1, price: '19.99', period: '/mo', badge: '',            desc: 'Professional team email — 50 mailboxes with priority AU/NZ hosting and full backup coverage', specs: JSON.stringify(['50 Mailboxes','20 GB Storage Per Mailbox','CrossBox Webmail','Full ActiveSync','Shared Calendar + Contacts + Tasks','Spam & Virus Filtering','AU/NZ DC','Hourly JetBackup','Priority Support']), status: 'active', featured: 0 },
  { id: 'p74', name: 'DREM-MAIL-AGENCY',   reseller_id: 'r19', category: 'Email', shop_visible: 1, price: '39.99', period: '/mo', badge: 'Best Value',  desc: 'Agency-grade email hosting — 200 mailboxes, white-label ready, AU/NZ infrastructure', specs: JSON.stringify(['200 Mailboxes','25 GB Storage Per Mailbox','CrossBox Webmail','Full ActiveSync','Shared Calendar + Contacts + Tasks','Advanced Spam Filtering','AU/NZ DC (SYD/MEL/PER/AKL)','Hourly JetBackup','White-Label DNS']), status: 'active', featured: 0 },
  // ── INACTIVE PLACEHOLDERS ──
  { id: 'p23', name: 'NOVA-N8N-S',  reseller_id: 'r11', category: 'n8n',         shop_visible: 0, price: '2.95',  period: '/mo', badge: '', desc: 'n8n self-hosted VPS placeholder', specs: JSON.stringify(['1 vCPU','2 GB RAM','20 GB SSD','n8n Self-Hosted']),      status: 'inactive', featured: 0 },
  { id: 'p26', name: 'DNS-STARTER', reseller_id: 'r12', category: 'DNS',          shop_visible: 0, price: '2.99',  period: '/mo', badge: '', desc: 'DNS placeholder',                specs: JSON.stringify(['Anycast DNS','Unlimited DNS Records']),                   status: 'inactive', featured: 0 },
  { id: 'p30', name: 'GAME-STARTER',reseller_id: 'r14', category: 'Game Server',  shop_visible: 0, price: '9.99',  period: '/mo', badge: '', desc: 'Game server placeholder',        specs: JSON.stringify(['2 GB RAM','20 GB NVMe SSD']),                            status: 'inactive', featured: 0 },
  { id: 'p15', name: 'WP-STARTER',  reseller_id: 'r8',  category: 'WordPress',    shop_visible: 0, price: '5.99',  period: '/mo', badge: '', desc: 'WordPress placeholder',           specs: JSON.stringify(['1 WordPress Site','20 GB SSD','Free SSL']),              status: 'inactive', featured: 0 },
];

// ── AGENTS ───────────────────────────────────────────────

const agents = [
  {
    id: 'agent-vector',
    codename: 'VECTOR',
    name: 'Domain Trader',
    role: 'Monitors domain markets, identifies acquisition opportunities, tracks expiry auctions',
    status: 'online',
    system_prompt: 'You are VECTOR, an autonomous domain trading agent for URly Host. Your job is to monitor domain markets, identify valuable domains approaching expiry, analyse acquisition opportunities, and report findings to the URly Host team. You are precise, data-driven, and always look for arbitrage opportunities in the domain aftermarket.',
    n8n_enabled: 0,
    n8n_webhook: '',
    metrics: JSON.stringify({ domains_tracked: 0, opportunities_found: 0, last_scan: null }),
    avatar: 'VECTOR',
  },
  {
    id: 'agent-nova',
    codename: 'NOVA',
    name: 'Infrastructure Monitor',
    role: 'Monitors server health, uptime, alerts, and reseller infrastructure status',
    status: 'online',
    system_prompt: 'You are NOVA, an infrastructure monitoring agent for URly Host. You watch over all reseller infrastructure, track uptime, monitor for anomalies, and alert the team to issues before customers notice them. You are calm, thorough, and methodical.',
    n8n_enabled: 0,
    n8n_webhook: '',
    metrics: JSON.stringify({ uptime_checks: 0, alerts_fired: 0, last_check: null }),
    avatar: 'NOVA',
  },
  {
    id: 'agent-pixel',
    codename: 'PIXEL',
    name: 'WordPress Concierge',
    role: 'Assists customers with WordPress setup, troubleshooting, and optimisation',
    status: 'offline',
    system_prompt: 'You are PIXEL, a WordPress concierge agent for URly Host. You help customers set up, troubleshoot, and optimise their WordPress sites. You are friendly, patient, and explain technical concepts in plain language.',
    n8n_enabled: 0,
    n8n_webhook: '',
    metrics: JSON.stringify({ tickets_handled: 0, avg_resolution_time: null, last_active: null }),
    avatar: 'PIXEL',
  },
];

// ── DEFAULT SETTINGS ─────────────────────────────────────

const settings = [
  { key: 'site_name',       value: 'URly Host' },
  { key: 'site_url',        value: 'https://urly.host' },
  { key: 'currency',        value: 'USD' },
  { key: 'whmcs_url',       value: '' },
  { key: 'whmcs_identifier',value: '' },
  { key: 'whmcs_secret',    value: '' },
  { key: 'admin_password',  value: process.env.ADMIN_PASSWORD || 'urlyhost2024' },
];

// ── RUN SEED ─────────────────────────────────────────────

const insertCategory = db.prepare(`
  INSERT OR REPLACE INTO categories (id, name, color, icon, default_markup, sort_order)
  VALUES (@id, @name, @color, @icon, @default_markup, @sort_order)
`);

const insertReseller = db.prepare(`
  INSERT OR REPLACE INTO resellers (id, codename, category, shop_visible, url, margin, status, notes, created)
  VALUES (@id, @codename, @category, @shop_visible, @url, @margin, @status, @notes, @created)
`);

const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products (id, name, reseller_id, category, shop_visible, price, period, badge, desc, specs, status, featured, created)
  VALUES (@id, @name, @reseller_id, @category, @shop_visible, @price, @period, @badge, @desc, @specs, @status, @featured, @created)
`);

const insertAgent = db.prepare(`
  INSERT OR REPLACE INTO agents (id, codename, name, role, status, system_prompt, n8n_enabled, n8n_webhook, metrics, avatar, created)
  VALUES (@id, @codename, @name, @role, @status, @system_prompt, @n8n_enabled, @n8n_webhook, @metrics, @avatar, @created)
`);

const insertSetting = db.prepare(`
  INSERT OR REPLACE INTO settings (key, value) VALUES (@key, @value)
`);

const runSeed = db.transaction(() => {
  categories.forEach(c => insertCategory.run(c));
  resellers.forEach(r => insertReseller.run({ ...r, created: now }));
  products.forEach(p => insertProduct.run({ ...p, created: now }));
  agents.forEach(a => insertAgent.run({ ...a, created: now }));
  settings.forEach(s => insertSetting.run(s));
});

runSeed();

console.log(`✅ Seeded:`);
console.log(`   ${categories.length} categories`);
console.log(`   ${resellers.length} resellers`);
console.log(`   ${products.length} products`);
console.log(`   ${agents.length} agents`);
console.log(`   ${settings.length} settings`);
console.log(`\n🚀 Ready. Run: npm start`);
