#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# MYR — production deploy script (runs ON the VPS, triggered by GitHub Actions)
# Usage: bash scripts/deploy.sh
# ---------------------------------------------------------------------------
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/myr}"
BRANCH="${BRANCH:-main}"
SERVICE_NAME="${SERVICE_NAME:-myr}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3001/api/health}"

echo "==> Deploying ${APP_DIR} (branch: ${BRANCH})"

# Repo may be owned by root while deploy runs as the deploy user (or vice versa).
git config --global --add safe.directory "${APP_DIR}" >/dev/null 2>&1 || true

cd "${APP_DIR}"

# 1. Pull the latest code ---------------------------------------------------
echo "==> git pull"
git fetch --prune origin
git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"

# 2. .env is gitignored — it must already exist on the VPS -------------------
if [ ! -f .env ]; then
  echo "ERROR: ${APP_DIR}/.env is missing." >&2
  echo "Create it first: cp .env.example .env  &&  edit the production values." >&2
  exit 1
fi

# 3. Install dependencies (dev deps are required by the Vite/tsc build) ------
echo "==> npm ci"
npm ci --no-audit --no-fund

# 4. Build frontend: tsc -b && vite build -----------------------------------
echo "==> npm run build"
npm run build

# 5. Start / reload the app under PM2 ---------------------------------------
echo "==> pm2 reload ${SERVICE_NAME}"
if pm2 describe "${SERVICE_NAME}" >/dev/null 2>&1; then
  pm2 reload "${SERVICE_NAME}" --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

# 6. Health check — fail the deploy if the app did not come up ---------------
echo "==> waiting for ${HEALTH_URL}"
for i in $(seq 1 30); do
  if curl -fsS "${HEALTH_URL}" >/dev/null 2>&1; then
    echo "==> DEPLOY OK — healthy after ${i}s"
    exit 0
  fi
  sleep 1
done

echo "ERROR: health check failed after 30s" >&2
pm2 logs "${SERVICE_NAME}" --lines 50 --nostream || true
exit 1
