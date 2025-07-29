#!/bin/bash
set -e

echo
echo "🌱 === [DEV] Seeding ==="
export NODE_ENV=development
source ./devops/dev/.env.development
npx tsx ./Api/database/seed.ts

echo
echo "🏁 Database seeding completed."
