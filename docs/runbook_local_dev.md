# Local Development Runbook

This guide covers running the Django REST API and React frontend locally, testing key flows, and hosting the frontend under a subpath (e.g., `/~maryu/fitness_tracker`).

## Prerequisites
- Python 3.10+ (tested with 3.12)
- Node.js 18+ and npm
- Linux/macOS shell (bash)

## Backend (Django + DRF)

- From the repo root, start the backend:

```bash
bash scripts/setup_backend.sh
```

What it does:
- Creates/activates a venv in `backend/drf/.venv`
- Installs dependencies from `backend/drf/requirements.txt`
- Copies `.env.example` → `.env` if missing (SQLite dev by default)
- Runs `migrate` and starts the dev server at http://localhost:8000

Key URLs:
- Root → redirects to Swagger UI: `http://localhost:8000/` → `/api/docs/`
- Health: `http://localhost:8000/health`
- OpenAPI schema: `http://localhost:8000/api/schema/`
- Swagger UI: `http://localhost:8000/api/docs/`

Auth endpoints (JWT):
- `POST /api/auth/register` → `{ email, password, name? }`
- `POST /api/auth/login` → `{ email, password }`
- `POST /api/auth/refresh` → `{ refresh }`
- Use `Authorization: Bearer <access>` for authenticated requests (e.g., `GET /api/users/me`).

Common backend tasks:
- Make migrations after model changes:
  ```bash
  cd backend/drf
  source .venv/bin/activate
  python manage.py makemigrations
  python manage.py migrate
  ```
- Run tests (SQLite in-memory via `settings_test`):
  ```bash
  cd backend/drf
  source .venv/bin/activate
  python manage.py test -v 2 --settings=fitness_api.settings_test
  ```

Notes:
- CORS is enabled in dev to allow the React app to call the API.
- The default DB is SQLite; production can switch to SQL Server via env (`DB_ENGINE=mssql`, see `settings.py`).

## Frontend (React)

- Start the app (in another terminal):
```bash
cd frontend
npm install
npm start
```
- Default dev URL: `http://localhost:3000`
- API base URL is configured in `src/api/client.js` (defaults to `http://localhost:8000/api`).

### Hosting under a subpath (e.g., `/~maryu/fitness_tracker`)
The app auto-detects its base path at runtime and configures React Router and i18n accordingly:
- Router basename: detected via `src/utils/basePath.js`
- i18n translation load path: `${basePath}/locales/{{lng}}/{{ns}}.json`
- For builds, `package.json` has `"homepage": "."` to emit relative asset paths.
- Optionally set `PUBLIC_URL=/~maryu/fitness_tracker` in `frontend/.env.development.local` for consistency.

Verify translations load by checking the Network tab for requests like:
- `/~maryu/fitness_tracker/locales/en/translation.json` (status 200)

### Known harmless warning
You may see a dev warning about a missing source map in a dependency (`@react-aria/ssr`). To silence it in dev:
- Create `frontend/.env.development` with:
  ```
  GENERATE_SOURCEMAP=false
  ```

## Smoke tests
- Register or login in the frontend, then visit Sessions/Goals/Routines/Programs pages and perform basic CRUD.
- Alternatively use Swagger UI to exercise the API directly.

## Troubleshooting
- 404 at `/`: fixed by redirect to `/api/docs/` (already configured).
- “Models have changes not reflected in a migration”: run `makemigrations` then `migrate`.
- 401 from API: ensure you’re logged in and the Authorization header is set; `AuthContext` handles this in the app.
