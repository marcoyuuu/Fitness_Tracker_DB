#!/bin/bash

set -e

# Change to backend/drf directory relative to this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../backend/drf"

# Create venv if it doesn't exist
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# Activate venv
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Copy .env if needed
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

# Run migrations and start server
python manage.py migrate
python manage.py runserver 0.0.0.0:8000