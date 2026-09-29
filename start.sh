#!/bin/sh
set -e

# Start backend in background
echo "Starting backend on port 4000..."
cd /app/backend && node dist/index.js &

# Start frontend in foreground (keeps container alive)
echo "Starting frontend on port 3000..."
cd /app/frontend && PORT=3000 HOSTNAME=0.0.0.0 node server.js
