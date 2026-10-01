#!/bin/bash
set -e

source ./devops/dev/.env.development
case "${1:-}" in
  "") tsc_args="" ; lint="lint" ;;
  --watch) tsc_args="--watch --preserveWatchOutput" ; lint="lint" ;;
  --strict) tsc_args="" ; lint="lint:strict" ;;
  *) echo "usage: check.sh [--watch|--strict]" >&2 ; exit 2 ;;
esac
concurrently \
  --names "tsc ","lint" \
  "tsc --noEmit $tsc_args" \
  "npm run --silent $lint"
