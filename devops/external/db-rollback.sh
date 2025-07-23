#!/bin/bash
set -e

echo "🌡  Running rollback for development database:"
export NODE_ENV=development
source ./Api/.env.development
tsx ./Api/database/rollback.ts

echo
echo "🧪 Running rollback for all test databases:"
export NODE_ENV=test
source ./Api/.env.test
export TOTAL_TEST_DB=$(source ./Api/.env.test && echo $TOTAL_TEST_DB)
export DB_TEST_DATABASE=$(source ./Api/.env.test && echo $DB_DATABASE)

for i in $(seq $TOTAL_TEST_DB); do
  db="${DB_TEST_DATABASE}${i}"
  (export DB_DATABASE="${db}" && tsx ./Api/database/rollback.ts) &
done
wait

echo
echo "🏁 Database rollback completed."
