#!/bin/bash
set -e

source ./devops/test/.env.test

# "$@" will expands to all arguments passed to this script
echo "Running tests with ${TOTAL_TEST_DB} workers"
vitest run --maxWorkers=${TOTAL_TEST_DB} --no-isolate "$@"
