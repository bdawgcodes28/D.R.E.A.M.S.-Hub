set -euo pipefail

# define projects variables ------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
admin_app="${ROOT_DIR}/admin_app"
client_app="${ROOT_DIR}/client_app"

# sever side diretory locations --------------------------
admin_server_side="${admin_app}/server_side"
client_server_side="${client_app}/server_side"


# this shell script call all commands relative to the actuall .sh file
cd "${admin_server_side}"

# install node.js dependencies (only what's needed)
dependencies="express body-parser url path fs dotenv"

# initialize node runtime environment if needed
if [ ! -f package.json ]; then
  npm init -y
fi

# prefer clean, lockfile-respecting install if lockfile exists
if [ -f package-lock.json ]; then
  npm ci
else
  # ensure required deps are present
  for pkg in ${dependencies}; do
    if ! npm ls --depth=0 "${pkg}" >/dev/null 2>&1; then
      missing_pkgs+=" ${pkg}"
    fi
  done
  if [ "${missing_pkgs:-}" != "" ]; then
    npm install ${missing_pkgs}
  fi
fi

# start the server
exec node server.js
