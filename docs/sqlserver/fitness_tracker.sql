/*
SQL Server DDL for Fitness Tracker (modernized schema)
- English snake_case API-aligned names
- UUID (uniqueidentifier) PKs
- Timestamps with datetime2
*/

CREATE TABLE users (
  id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  name varchar(100) NULL,
  locale char(2) NOT NULL DEFAULT 'es',
  role varchar(16) NOT NULL DEFAULT 'user',
  created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE sessions (
  id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
  user_id uniqueidentifier NOT NULL,
  date date NOT NULL,
  duration_min int NOT NULL CHECK (duration_min >= 1),
  created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE goals (
  id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
  user_id uniqueidentifier NOT NULL,
  description nvarchar(max) NOT NULL,
  due_date date NULL,
  is_completed bit NOT NULL DEFAULT 0,
  completed_at datetime2 NULL,
  created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE routines (
  id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
  name varchar(255) NOT NULL,
  description nvarchar(max) NULL
);

CREATE TABLE exercises (
  id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
  name varchar(255) NOT NULL,
  description nvarchar(max) NULL,
  sets int NULL,
  reps int NULL,
  weight decimal(10,2) NULL,
  equipment varchar(255) NULL,
  duration time NULL,
  distance decimal(10,2) NULL,
  stretch_type varchar(255) NULL,
  is_strength bit NULL,
  is_cardio bit NULL,
  is_core bit NULL,
  is_plyo bit NULL,
  is_flexibility bit NULL
);

CREATE TABLE programs (
  id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
  name varchar(255) NOT NULL,
  description nvarchar(max) NULL,
  start_date date NOT NULL,
  end_date date NULL
);

/* Join tables */
CREATE TABLE routine_exercises (
  routine_id uniqueidentifier NOT NULL,
  exercise_id uniqueidentifier NOT NULL,
  PRIMARY KEY (routine_id, exercise_id),
  CONSTRAINT fk_routine_exercises_routine FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
  CONSTRAINT fk_routine_exercises_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE program_routines (
  program_id uniqueidentifier NOT NULL,
  routine_id uniqueidentifier NOT NULL,
  PRIMARY KEY (program_id, routine_id),
  CONSTRAINT fk_program_routines_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  CONSTRAINT fk_program_routines_routine FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
);

CREATE TABLE session_routines (
  session_id uniqueidentifier NOT NULL,
  routine_id uniqueidentifier NOT NULL,
  PRIMARY KEY (session_id, routine_id),
  CONSTRAINT fk_session_routines_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_session_routines_routine FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
);

/* Comments for sessions */
CREATE TABLE comments (
  id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
  session_id uniqueidentifier NOT NULL,
  text nvarchar(max) NOT NULL,
  date date NOT NULL,
  CONSTRAINT fk_comments_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

/* Triggers (optional) to update updated_at */
GO
CREATE OR ALTER TRIGGER trg_sessions_updated_at ON sessions AFTER UPDATE AS
BEGIN
  SET NOCOUNT ON;
  UPDATE s SET updated_at = SYSUTCDATETIME() FROM sessions s INNER JOIN inserted i ON s.id = i.id;
END
GO
CREATE OR ALTER TRIGGER trg_goals_updated_at ON goals AFTER UPDATE AS
BEGIN
  SET NOCOUNT ON;
  UPDATE g SET updated_at = SYSUTCDATETIME() FROM goals g INNER JOIN inserted i ON g.id = i.id;
END
GO
CREATE OR ALTER TRIGGER trg_users_updated_at ON users AFTER UPDATE AS
BEGIN
  SET NOCOUNT ON;
  UPDATE u SET updated_at = SYSUTCDATETIME() FROM users u INNER JOIN inserted i ON u.id = i.id;
END
GO
