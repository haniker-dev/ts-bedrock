#!/bin/bash
set -e

source ./devops/dev/.env.development
concurrently \
  --names "tsc ","lint","api ","web " \
  'tsc --watch --noEmit --preserveWatchOutput' \
  'npm run --silent lint' \
  'cd Api && tsx watch src/index.ts' \
  'cd Web && vite serve --mode development'
