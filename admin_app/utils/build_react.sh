#!/bin/bash
set -euo pipefail

# this shell script builds the react project and places build in a dist folder
# use this when you make updates to the react code and want to see changes on the node.js server

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADMIN_DIR="$(cd "${SCRIPT_DIR}/../admin" && pwd)"

cd "${ADMIN_DIR}"

if [ ! -d node_modules ]; then
  echo "node_modules missing. Installing dependencies..."
  npm ci || npm install
fi

echo "Building admin React app in ${ADMIN_DIR}..."
npm run build