#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Please provide the migration file name eg. create-user"
  exit 1
fi

datetime=$(date +'%Y%m%d%H%M%S')
filename=$(echo "$1" | tr '[:upper:]' '[:lower:]')
migration_file="./Api/database/migrations/${datetime}-${filename}.ts"
cp ./devops/external/db-migration-stub "$migration_file"

echo "✅ Created migration file at ${migration_file}"
