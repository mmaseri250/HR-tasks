#!/usr/bin/env bash
# Wrapper pointing to build.sh for POS / POSIX deployment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/build.sh" "$@"
