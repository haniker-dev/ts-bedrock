#!/bin/bash
set -e

source ./devops/dev/.env.development
case "${1:-}" in
  "") tsc_args="" ;;
  --watch) tsc_args="--watch --preserveWatchOutput" ;;
  *) echo "usage: check.sh [--watch]" >&2 ; exit 2 ;;
esac
concurrently \
  --names "tsc ","lint" \
  "tsc --noEmit $tsc_args" \
  "npm run --silent lint"
