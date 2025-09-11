set -euo pipefail

# this shell script will build the node.js server
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADMIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
server_file="${ADMIN_ROOT}/server_side/server.js"
exec node "${server_file}"