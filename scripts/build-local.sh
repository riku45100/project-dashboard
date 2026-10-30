#!/usr/bin/env bash
# Build and preview the React frontend locally.
# Usage: ./scripts/build-local.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node.js 22 or later, then retry."
  exit 1
fi

cd "$FRONTEND_DIR"

if [ ! -f package-lock.json ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Installing dependencies from package-lock.json..."
  npm ci
fi

echo "Running TypeScript checks..."
npm run typecheck

echo "Building production bundle..."
npm run build

echo "Starting local preview at http://localhost:4173"
npm run preview -- --host
