#!/usr/bin/env bash
set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-http://localhost:4200}"
API_URL="${API_URL:-http://localhost:3000/api}"

check() {
  local name="$1"
  local url="$2"
  local status

  status="$(curl --silent --output /dev/null --write-out '%{http_code}' "$url")"

  if [[ "$status" -ge 200 && "$status" -lt 400 ]]; then
    printf 'OK   %s (%s) -> %s\n' "$name" "$url" "$status"
  else
    printf 'FAIL %s (%s) -> %s\n' "$name" "$url" "$status" >&2
    exit 1
  fi
}

check "frontend" "$FRONTEND_URL"
check "backend" "$API_URL"
