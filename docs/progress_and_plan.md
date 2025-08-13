# Project Progress and Plan

## Status Snapshot
- Backend (DRF)
  - Running at http://localhost:8000 with health, Swagger docs, JWT auth, and resources: sessions, goals, routines, exercises, programs, comments.
  - OpenAPI annotated (auth endpoints) and custom JWT auth scheme registered.
  - Migrations applied; minimal auth test passing.
- Frontend (React)
  - AuthContext wired (register/login/logout, `/users/me`).
  - Pages integrated with DRF: Sessions, Goals, Routines, Programs, Exercises.
  - i18n and routing work under subpaths (e.g., `/~maryu/fitness_tracker`).
- Data/ETL
  - SQL Server target schema, Legacy→Modern mapping, and MariaDB→SQL Server ETL toolkit available.

## Requirements Coverage
- PRD/ERD/DDL/OpenAPI/Mapping/ETL: Done
- DRF backend, JWT auth, migrations, admin: Done
- Frontend auth + core pages consuming DRF: Done (Exercises page migrated)
- Dev setup scripts and docs: Done
- CI (backend tests): Done; Frontend CI: Deferred
- Production DB config and deploy guides: Deferred

## Next Steps by Agent
- Frontend (dev + ux-expert)
  - Add form validation, toasts, and loading states across pages.
  - Harden 401 handling (redirect to login, token refresh if desired).
- Backend (dev + architect)
  - Pagination, filtering, and ordering on list endpoints; document in OpenAPI.
  - Add throttling and additional serializer validations.
  - Dev seed command to populate sample exercises/routines.
- Testing (qa)
  - Expand Django tests to cover CRUD + associations for goals/routines/programs.
  - Add React tests for AuthContext and a page (Sessions or Goals).
  - Optional E2E (Cypress): login, create session, create goal, link routine.
- CI/CD (devops + architect)
  - Frontend CI (build + tests) in GitHub Actions; upload build artifacts.
  - Optional Dockerfiles and docker-compose for local.
  - Production SQL Server config checks and env docs.
- Docs (analyst + pm)
  - Add OpenAPI examples for common flows.
  - Postman collection or curl cookbook.

## Short-Term Sprint (2–3 days)
1) Backend pagination + docs
2) Django tests for goals/routines
3) Frontend CI job

## Risks/Notes
- Subpath hosting is handled at runtime; set `PUBLIC_URL` if you need a fixed prefix.
- Model changes require `makemigrations/migrate` before serving.
