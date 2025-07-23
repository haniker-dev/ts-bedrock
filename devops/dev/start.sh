#!/bin/bash
set -e

echo
concurrently \
  --names "tsc ","lint","api ","web " \
  'tsc --watch --noEmit --preserveWatchOutput' \
  'esw ./ --ext .ts --ext .tsx --watch' \
  'cd Api && source .env.development && tsx watch src/index.ts' \
  'cd Web && vite serve --mode development'
