#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT_DIR/scripts/kill-ports.sh"
BIN_DIR="$HOME/.local/bin"
DEST="$BIN_DIR/kill-ports"
ZSHRC="$HOME/.zshrc"

mkdir -p "$BIN_DIR"
cp "$SRC" "$DEST"
chmod +x "$DEST"

echo "Installed: $DEST"

touch "$ZSHRC"

MARK_BEGIN="# >>> ahangama kill-ports >>>"
MARK_END="# <<< ahangama kill-ports <<<"

if ! grep -Fq "$MARK_BEGIN" "$ZSHRC"; then
  cat >>"$ZSHRC" <<EOF

$MARK_BEGIN
# Adds a safe helper to kill common dev-server ports.
kill_ports() { "$DEST" "$@"; }
# Enables: kill ports  (falls back to builtin kill for normal usage)
kill() {
  if [[ "\${1-}" == "ports" ]]; then
    shift || true
    kill_ports "$@"
    return $?
  fi
  builtin kill "$@"
}
# Alternative direct command: kill-ports
alias kill-ports="$DEST"
$MARK_END
EOF

  echo "Updated: $ZSHRC"
else
  echo "Already configured in: $ZSHRC"
fi

echo
echo "Next: restart your terminal or run: source $ZSHRC"
echo "Then you can run: kill ports"
