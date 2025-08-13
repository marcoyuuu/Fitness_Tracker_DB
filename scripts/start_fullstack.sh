#!/usr/bin/env bash
set -Eeuo pipefail

# Start Django backend (on :8000) and React frontend (on :3000) together.
# - Backend runs in background with logs to .logs/backend.log
# - Frontend runs in foreground (Ctrl+C stops it); trap will stop backend

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/.."
BACKEND_DIR="${REPO_ROOT}/backend/drf"
FRONTEND_DIR="${REPO_ROOT}/frontend"
LOG_DIR="${REPO_ROOT}/.logs"
BACKEND_URL="http://localhost:8000/health"
ALT_URL="http://localhost:8000/api/schema/"

mkdir -p "${LOG_DIR}"

backend_pid=""

log() { echo "[start_fullstack] $*"; }

wait_for_backend() {
  local tries=0
  local max=40
  while (( tries < max )); do
    if curl -fsS "${BACKEND_URL}" >/dev/null 2>&1 || curl -fsS "${ALT_URL}" >/dev/null 2>&1; then
      return 0
    fi
    ((tries++))
    sleep 0.5
  done
  return 1
}

start_backend() {
  log "Starting backend..."
  cd "${BACKEND_DIR}"

  # Create venv if needed
  if [[ ! -d .venv ]]; then
    python3 -m venv .venv
  fi
  # Activate venv
  # shellcheck disable=SC1091
  source .venv/bin/activate

  python -m pip install --upgrade pip >/dev/null
  pip install -r requirements.txt >/dev/null

  # Ensure env
  [[ -f .env ]] || cp .env.example .env

  python manage.py migrate
  # Runserver in background and log output
  python manage.py runserver 0.0.0.0:8000 >"${LOG_DIR}/backend.log" 2>&1 &
  backend_pid=$!
  log "Backend PID ${backend_pid}; logs: ${LOG_DIR}/backend.log"

  if wait_for_backend; then
    log "Backend is up at http://localhost:8000"
  else
    log "Warning: backend did not become healthy in time; check logs."
  fi
}

start_frontend() {
  log "Starting frontend..."
  cd "${FRONTEND_DIR}"
  npm install
  # Prevent auto-opening browser
  BROWSER=none npm start
}

cleanup() {
  log "Shutting down..."
  if [[ -n "${backend_pid}" ]] && ps -p "${backend_pid}" >/dev/null 2>&1; then
    log "Stopping backend PID ${backend_pid}"
    kill "${backend_pid}" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

# If backend appears up already, skip starting it here
if curl -fsS "${BACKEND_URL}" >/dev/null 2>&1 || curl -fsS "${ALT_URL}" >/dev/null 2>&1; then
  log "Backend already running on :8000; skipping start."
else
  start_backend
fi

# Run frontend in foreground
start_frontend
