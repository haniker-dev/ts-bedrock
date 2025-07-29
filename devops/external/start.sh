#!/bin/bash
set -e

PROJECT_NAME="ts-bedrock"
CONTAINER_NAME=${PROJECT_NAME}-pg-test-1

echo
echo "🧱 Starting docker containers:"
export DB_DEV_PORT=$(source ./devops/dev/.env.development && echo $DB_PORT)
export DB_TEST_PORT=$(source ./devops/test/.env.test && echo $DB_PORT)
export DB_TEST_USER=$(source ./devops/test/.env.test && echo $DB_USER)
export DB_TEST_DATABASE=$(source ./devops/test/.env.test && echo $DB_DATABASE)
export TOTAL_TEST_DB=$(source ./devops/test/.env.test && echo $TOTAL_TEST_DB)

docker-compose \
  --project-name $PROJECT_NAME \
  --file ./devops/external/docker-compose.yml \
  --project-directory . \
  up \
  --detach \
  --build \
  --remove-orphans

echo "=========================="
if [ "$TOTAL_TEST_DB" -eq 1 ]; then
  echo "Skipping database creation because TOTAL_TEST_DB is 1"
else
  echo "⏳ Waiting for Postgres container to be ready..."
  until docker exec "$CONTAINER_NAME" pg_isready -U "$DB_TEST_USER" > /dev/null 2>&1; do
    sleep 2
  done


  echo "=========================="
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
