# ETL: MariaDB → SQL Server (Fitness Tracker)

Migrate legacy data from the MariaDB schema (docs/fitness_tracker.sql) into the modern SQL Server schema (docs/sqlserver/fitness_tracker.sql).

## Prereqs
- Python 3.10+
- ODBC Driver 18 for SQL Server installed
- `pip install -r tools/etl/requirements.txt`

## Configure
1. Copy `.env.example` to `.env` and adjust credentials:
   - `MYSQL_URL` (legacy source)
   - `MSSQL_URL` (modern target)
2. Create the target schema in SQL Server using `docs/sqlserver/fitness_tracker.sql`.

## Run
- Dry run (no writes):
  ```bash
  DRY_RUN=1 MYSQL_URL=... MSSQL_URL=... python tools/etl/etl_mariadb_to_sqlserver.py
  ```
- Execute migration:
  ```bash
  MYSQL_URL=... MSSQL_URL=... python tools/etl/etl_mariadb_to_sqlserver.py
  ```

## What it does
- Users: usuario → users (new UUIDs)
- Sessions: sesión → sessions (Duración HH:MM:SS → duration_min minutes)
- Goals: meta → goals
- Routines: rutina → routines
- Exercises: ejercicio → exercises
- Programs: programa → programs
- Comments: comentario → comments
- Joins: programacontienerutina, rutinacontieneejercicio, sesioncontienerutina → respective join tables

## Notes
- Assumes empty destination tables; add upsert/conflict handling if needed.
- Localizes default user locale to `es` and role to `user`; adjust as needed.
- For large datasets, consider batching and chunked reads.
