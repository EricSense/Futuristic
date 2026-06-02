#!/bin/sh
set -e
echo "Futuristic API — preparing database..."
pnpm db:push
pnpm db:seed
echo "Starting API..."
exec node apps/api/dist/server.js
