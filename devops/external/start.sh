#!/bin/bash
set -e

echo
echo "🧱 Starting docker containers:"
export DB_DEV_PORT=$(source ./Api/.env.development && echo $DB_PORT)
export DB_TEST_PORT=$(source ./Api/.env.test && echo $DB_PORT)
export DB_TEST_USER=$(source ./Api/.env.test && echo $DB_USER)
export DB_TEST_DATABASE=$(source ./Api/.env.test && echo $DB_DATABASE)
export TOTAL_TEST_DB=$(source ./Api/.env.test && echo $TOTAL_TEST_DB)

docker-compose \
  --project-name ts-bedrock \
  --file ./devops/external/docker-compose.yml \
  --project-directory . \
  up \
  --detach \
  --build \
  --remove-orphans

echo "=========================="
CONTAINER_NAME=ts-bedrock-pg-test-1
if [ "$TOTAL_TEST_DB" -eq 1 ]; then
  echo "Skipping database creation because TOTAL_TEST_DB is 1"
else
  echo "🧪 Setting up multiple test databases:"
  echo "${DB_TEST_DATABASE}1 database exists"
  for i in $(seq 2 $TOTAL_TEST_DB); do
    if docker exec "$CONTAINER_NAME" psql -U "${DB_TEST_USER}" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_TEST_DATABASE}$i'" | grep -q 1; then
      echo "${DB_TEST_DATABASE}$i database exists"
    else
      echo "Creating test database: ${DB_TEST_DATABASE}$i"
      docker exec "$CONTAINER_NAME" \
        psql -U "${DB_TEST_USER}" -d postgres -c "CREATE DATABASE ${DB_TEST_DATABASE}$i;"
    fi
  done
fi
