#!/usr/bin/env bash
set -euo pipefail

DEFAULT_PORTS=(8888 8889 3000 8890 5173 5174)

ports=("${DEFAULT_PORTS[@]}")
if [[ $# -gt 0 ]]; then
  ports=("$@")
fi

print_listeners() {
  local p="$1"
  if ! lsof -nP -iTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "port $p: free"
    return 0
  fi

  echo "port $p: LISTENING"
  lsof -nP -iTCP:"$p" -sTCP:LISTEN || true
}

kill_listeners() {
  local p="$1"
  local pids
  pids=$(lsof -tiTCP:"$p" -sTCP:LISTEN 2>/dev/null || true)

  if [[ -z "$pids" ]]; then
    return 0
  fi

  echo "Killing port $p listeners: $pids"
  kill $pids 2>/dev/null || true

  pids=$(lsof -tiTCP:"$p" -sTCP:LISTEN 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "Still listening on $p; SIGKILL: $pids"
    kill -9 $pids 2>/dev/null || true
  fi
}

echo "== Listening processes (before) =="
for p in "${ports[@]}"; do
  echo "--- $p ---"
  print_listeners "$p"
done

echo
for p in "${ports[@]}"; do
  kill_listeners "$p"
done

echo
echo "== Listening processes (after) =="
for p in "${ports[@]}"; do
  echo "--- $p ---"
  print_listeners "$p"
done
