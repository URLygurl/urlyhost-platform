# URly Host Platform

Hosting reseller admin console + customer storefront.

## Stack
- **Backend:** Node.js + Express
- **Database:** SQLite (dev) → PostgreSQL (prod)
- **Frontend:** Single-file HTML (admin + shop)
- **Deploy:** Coolify on Kamatera VPS

## Structure
```
backend/   Express API
frontend/  Admin console + shop HTML files
```

## Quick Start

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm start
```

API runs on port 3000 by default.

## API Routes
- `GET/POST /api/resellers`
- `GET/POST /api/products`
- `GET/POST /api/categories`
- `GET/POST /api/settings`
- `GET/POST /api/agents`
