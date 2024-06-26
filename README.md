### Fitness Tracker Web Application

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
