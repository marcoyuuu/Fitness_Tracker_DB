# Fitness Tracker Web Application

This is a Fitness Tracker Web Application built with a React frontend and a PHP/MySQL backend. The application allows users to track their fitness activities, manage routines, and participate in fitness programs.

## Features

- Track fitness sessions with date, duration, and routines
- Create, edit, and delete routines
- Participate in fitness programs
- Add comments to sessions

## Technologies Used

- **Frontend**: React, Axios, i18next
- **Backend**: PHP, MySQL
- **Server**: Apache

## Documentation

- PRD: docs/prd_fitness_tracker.md
- Plan de tareas y asignación BMAD: docs/bmad_plan_tareas_asignaciones.md
- Especificación Técnica Funcional (ETF): docs/especificacion_funcional_tecnica.md
- OpenAPI v1 (MVP): docs/openapi/openapi-v1.yaml
- ERD (Mermaid): docs/erd_mermaid.md
- SQL Server DDL (modern): docs/sqlserver/fitness_tracker.sql
- Legacy→Modern mapping (ETL): docs/sqlserver/legacy_to_modern_mapping.md
- Local Dev Runbook: docs/runbook_local_dev.md
- Progress & Plan: docs/progress_and_plan.md

## Installation

### Prerequisites

- Node.js and npm
- XAMPP or similar (Apache + MySQL server)

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/fitness-tracker.git
   cd fitness-tracker
   ```

2. Import the `fitness_tracker.sql` file to your MySQL server.

3. Update the `api.php` file with your database credentials.

4. Place the project folder in the `htdocs` directory of XAMPP and start Apache and MySQL.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

Access the frontend at `http://localhost:3000` and the backend at `http://localhost/react_php_app/api.php`.

## Usage

1. Open `http://localhost:3000` in your browser.
2. Navigate through the Dashboard, Sessions, Routines, and Programs sections.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

# Fitness_Tracker_DB

A full-stack reference implementation for a Fitness Tracker: modern SQL Server schema, Django REST API, and React frontend. Includes ETL from a legacy MariaDB dataset.

See `docs/` for detailed specifications and database artifacts. Quick links:

- Local Dev Runbook: docs/runbook_local_dev.md
- Progress & Plan: docs/progress_and_plan.md

## Structure
- backend/ — Django + DRF API
- frontend/ — React app
- tools/etl — MariaDB → SQL Server ETL
- docs/ — PRD, ERD, OpenAPI, DDL, and runbook

## Quickstart
- Backend: run `bash scripts/setup_backend.sh` from repo root
- Frontend: `cd frontend && npm install && npm start`

For more, read docs/runbook_local_dev.md.
