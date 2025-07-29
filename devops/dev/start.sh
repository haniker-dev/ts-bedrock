#!/bin/bash
set -e

source ./devops/dev/.env.development
concurrently \
  --names "tsc ","lint","api ","web " \
  'tsc --watch --noEmit --preserveWatchOutput' \
  'esw ./ --ext .ts --ext .tsx --watch' \
  'cd Api && tsx watch src/index.ts' \
  'cd Web && vite serve --mode development'
