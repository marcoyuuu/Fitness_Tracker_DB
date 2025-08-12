# Legacy (MariaDB) → Modern (SQL Server) Mapping

This document maps legacy table/column names to modernized API/DB names for ETL and ORM mapping.

## Tables
- usuario → users
- sesión → sessions
- comentario → comments
- meta → goals
- rutina → routines
- ejercicio → exercises
- programa → programs
- programacontienerutina → program_routines
- rutinacontieneejercicio → routine_exercises
- sesioncontienerutina → session_routines

## Columns
- usuario.UserID → users.id (UUID)
- usuario.Correo → users.email
- usuario.Contraseña → users.password_hash
- usuario.Nombre → users.name

- sesión.SesiónID → sessions.id (UUID)
- sesión.UserID → sessions.user_id (UUID)
- sesión.Fecha → sessions.date
- sesión.Duración → sessions.duration_min (convert HH:MM:SS → minutes)

- comentario.ComentarioID → comments.id
- comentario.SesiónID → comments.session_id
- comentario.Texto → comments.text
- comentario.Fecha → comments.date

- meta.MetaID → goals.id
- meta.UserID → goals.user_id
- meta.FechaLímite → goals.due_date
- meta.Completado → goals.is_completed
- meta.Descripción → goals.description

- rutina.RutinaID → routines.id
- rutina.Nombre → routines.name
- rutina.Descripción → routines.description

- ejercicio.EjercicioID → exercises.id
- ejercicio.Nombre → exercises.name
- ejercicio.Descripción → exercises.description
- ejercicio.Sets → exercises.sets
- ejercicio.Repeticiones → exercises.reps
- ejercicio.Peso → exercises.weight
- ejercicio.Equipamiento → exercises.equipment
- ejercicio.Duración → exercises.duration
- ejercicio.Distancia → exercises.distance
- ejercicio.TipoEstiramiento → exercises.stretch_type
- ejercicio.isEntrenamientoDeFuerza → exercises.is_strength
- ejercicio.isCardio_Circuitos → exercises.is_cardio
- ejercicio.isCore_Estabilidad → exercises.is_core
- ejercicio.isPliométricos → exercises.is_plyo
- ejercicio.isFlexibilidad_Movilidad → exercises.is_flexibility

- programa.ProgramaID → programs.id
- programa.Nombre → programs.name
- programa.Descripción → programs.description
- programa.FechaInicio → programs.start_date
- programa.FechaFin → programs.end_date

- programacontienerutina.ProgramaID → program_routines.program_id
- programacontienerutina.RutinaID → program_routines.routine_id

- rutinacontieneejercicio.RutinaID → routine_exercises.routine_id
- rutinacontieneejercicio.EjercicioID → routine_exercises.exercise_id

- sesioncontienerutina.SesiónID → session_routines.session_id
- sesioncontienerutina.RutinaID → session_routines.routine_id

## Notes
- Generate UUIDs for modern IDs; store legacy ints in a staging table if reconciliation needed.
- For sessions.duration_min, convert legacy time to total minutes.
- Respect ON DELETE CASCADE semantics for session_routines; propagate where applicable.
- Consider bilingual content strategy (store English names or separate localization layer).
