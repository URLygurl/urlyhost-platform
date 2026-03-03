FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy source
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Create data directory for SQLite
RUN mkdir -p /data

WORKDIR /app/backend

# Seed on first run, then start
CMD ["sh", "-c", "node src/seed.js && node src/index.js"]

EXPOSE 3000
