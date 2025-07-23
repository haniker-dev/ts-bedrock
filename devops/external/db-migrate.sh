#!/bin/bash
set -e

echo
echo "✈️  === [DEV] Migration ==="

echo
echo "🌡  Running migration for development database:"
export NODE_ENV=development
source ./Api/.env.development
npx tsx ./Api/database/migrate.ts

echo
echo "✈️  === [TEST] Migration ==="

echo
echo "🧪 Running migration for test database:"
export NODE_ENV=test
source ./Api/.env.test
export TOTAL_TEST_DB=$(source ./Api/.env.test && echo $TOTAL_TEST_DB)
export DB_TEST_DATABASE=$(source ./Api/.env.test && echo $DB_DATABASE)

for i in $(seq $TOTAL_TEST_DB); do
  db="${DB_TEST_DATABASE}${i}"
  (export DB_DATABASE="${db}" && tsx ./Api/database/migrate.ts) &
done
wait

echo
echo "🏁 Database migration completed."
