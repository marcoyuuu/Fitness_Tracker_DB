# Fitness Tracker API (Django/DRF)

Minimal scaffold aligned to OpenAPI v1. Uses SQL Server via mssql-django.

## Setup
1. Create virtual env and install (Linux/macOS):
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
2. Copy .env and run migrations (uses sqlite by default):
```bash
cp .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```
OpenAPI docs at /api/schema/ and /api/docs/.

### Auth endpoints
- POST /api/auth/register { email, password, name?, locale? }
- POST /api/auth/login { email, password } -> { access, refresh }
- POST /api/auth/refresh { refresh } -> new tokens
- GET/PATCH /api/users/me with Authorization: Bearer <access>

### Quick smoke test
```bash
curl -sS -X POST http://localhost:8000/api/auth/register \
	-H 'Content-Type: application/json' \
	-d '{"email":"test@example.com","password":"secret123"}' | tee /tmp/reg.json
ACCESS=$(jq -r '.access' /tmp/reg.json)
curl -H "Authorization: Bearer $ACCESS" http://localhost:8000/api/users/me
```
