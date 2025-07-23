#!/bin/bash
set -e

source ./Api/.env.test 

cd ./Api
# "$@" will expands to all arguments passed to this script
npx jest --maxWorkers=${TOTAL_TEST_DB} "$@"
