#!/bin/bash
set -e

echo "🌡  Running rollback for development database:"
export NODE_ENV=development
source ./devops/dev/.env.development
tsx ./Api/database/rollback.ts

echo
echo "🧪 Running rollback for all test databases:"
export NODE_ENV=test
source ./devops/test/.env.test
export TOTAL_TEST_DB=$(source ./devops/test/.env.test && echo $TOTAL_TEST_DB)

for i in $(seq $TOTAL_TEST_DB); do
  (export VITEST_WORKER_ID="${i}" && tsx ./Api/database/rollback.ts) &
done
wait

echo
echo "🏁 Database rollback completed."
