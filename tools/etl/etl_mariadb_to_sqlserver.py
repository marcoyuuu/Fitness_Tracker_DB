#!/usr/bin/env python3
"""
MariaDB (legacy) → SQL Server (modern) ETL for Fitness Tracker

Reads from the legacy MariaDB schema (Spanish names) and writes into the
modern SQL Server schema (English snake_case) as defined in docs/sqlserver/fitness_tracker.sql.

Environment variables:
  MYSQL_URL  e.g. mysql+pymysql://user:pass@host:3306/fitness_tracker?charset=utf8mb4
  MSSQL_URL  e.g. mssql+pyodbc://user:pass@host:1433/fitness_tracker?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
  DRY_RUN    optional, if set to "1" only reads and logs without writing

Usage:
  python etl_mariadb_to_sqlserver.py

Notes:
  - Assumes destination tables are empty. If not, add upsert logic as needed.
  - Converts sesión.Duración (HH:MM:SS) to sessions.duration_min (int minutes).
  - Generates UUIDs for all new IDs and keeps in-memory maps to wire FK relations.
"""

import os
import uuid
from datetime import timedelta
from typing import Dict, Any

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine


def get_env(name: str, required: bool = True) -> str:
    v = os.getenv(name)
    if required and (v is None or v.strip() == ""):
        raise SystemExit(f"Missing required env var: {name}")
    return v or ""


def hhmmss_to_minutes(hhmmss: str) -> int:
    if not hhmmss:
        return 0
    parts = hhmmss.split(":")
    if len(parts) != 3:
        # Fallback try for mm:ss
        if len(parts) == 2:
            h, m, s = 0, int(parts[0]), int(parts[1])
        else:
            return 0
    else:
        h, m, s = int(parts[0]), int(parts[1]), int(parts[2])
    return int(timedelta(hours=h, minutes=m, seconds=s).total_seconds() // 60)


def connect_engines() -> tuple[Engine, Engine]:
    mysql_url = get_env("MYSQL_URL")
    mssql_url = get_env("MSSQL_URL")
    src = create_engine(mysql_url, future=True)
    dst = create_engine(mssql_url, future=True)
    return src, dst


def insert_one(conn, sql: str, params: Dict[str, Any]):
    conn.execute(text(sql), params)


def migrate(src: Engine, dst: Engine, dry_run: bool = False):
    users_map: Dict[int, str] = {}
    sessions_map: Dict[int, str] = {}
    goals_map: Dict[int, str] = {}
    routines_map: Dict[int, str] = {}
    exercises_map: Dict[int, str] = {}
    programs_map: Dict[int, str] = {}

    with src.connect() as sconn:
        # Users
        users = sconn.execute(text("SELECT `UserID`,`Nombre`,`Correo`,`Contraseña` FROM `usuario`"))
        rows = users.fetchall()
        print(f"[users] fetched: {len(rows)}")
        if not dry_run:
            with dst.begin() as dtxn:
                for (UserID, Nombre, Correo, Contrasena) in rows:
                    new_id = str(uuid.uuid4())
                    users_map[UserID] = new_id
                    insert_one(dtxn, """
                        INSERT INTO users (id,email,password_hash,name,locale,role)
                        VALUES (:id,:email,:password_hash,:name,'es','user')
                    """, {
                        "id": new_id,
                        "email": Correo,
                        "password_hash": Contrasena,
                        "name": Nombre,
                    })

        # Sessions
        sessions = sconn.execute(text("SELECT `SesiónID`,`UserID`,`Fecha`,`Duración` FROM `sesión`"))
        srows = sessions.fetchall()
        print(f"[sessions] fetched: {len(srows)}")
        if not dry_run:
            with dst.begin() as dtxn:
                for (SesionID, UserID, Fecha, Duracion) in srows:
                    new_id = str(uuid.uuid4())
                    sessions_map[SesionID] = new_id
                    insert_one(dtxn, """
                        INSERT INTO sessions (id,user_id,date,duration_min)
                        VALUES (:id,:user_id,:date,:duration_min)
                    """, {
                        "id": new_id,
                        "user_id": users_map[UserID],
                        "date": Fecha,
                        "duration_min": hhmmss_to_minutes(Duracion),
                    })

        # Goals (meta)
        goals = sconn.execute(text("SELECT `MetaID`,`UserID`,`FechaLímite`,`Completado`,`Descripción` FROM `meta`"))
        grows = goals.fetchall()
        print(f"[goals] fetched: {len(grows)}")
        if not dry_run:
            with dst.begin() as dtxn:
                for (MetaID, UserID, FechaLimite, Completado, Descripcion) in grows:
                    new_id = str(uuid.uuid4())
                    goals_map[MetaID] = new_id
                    insert_one(dtxn, """
                        INSERT INTO goals (id,user_id,description,due_date,is_completed)
                        VALUES (:id,:user_id,:description,:due_date,:is_completed)
                    """, {
                        "id": new_id,
                        "user_id": users_map[UserID],
                        "description": Descripcion or "",
                        "due_date": FechaLimite,
                        "is_completed": 1 if Completado else 0,
                    })

        # Routines
        routines = sconn.execute(text("SELECT `RutinaID`,`Nombre`,`Descripción` FROM `rutina`"))
        rrows = routines.fetchall()
        print(f"[routines] fetched: {len(rrows)}")
        if not dry_run:
            with dst.begin() as dtxn:
                for (RutinaID, Nombre, Descripcion) in rrows:
                    new_id = str(uuid.uuid4())
                    routines_map[RutinaID] = new_id
                    insert_one(dtxn, """
                        INSERT INTO routines (id,name,description)
                        VALUES (:id,:name,:description)
                    """, {
                        "id": new_id,
                        "name": Nombre,
                        "description": Descripcion,
                    })

        # Exercises
        exercises = sconn.execute(text(
            "SELECT `EjercicioID`,`Nombre`,`Descripción`,`Sets`,`Repeticiones`,`Peso`,`Equipamiento`,`Duración`,`Distancia`,`TipoEstiramiento`,`isEntrenamientoDeFuerza`,`isCardio_Circuitos`,`isCore_Estabilidad`,`isPliométricos`,`isFlexibilidad_Movilidad` FROM `ejercicio`"
        ))
        erows = exercises.fetchall()
        print(f"[exercises] fetched: {len(erows)}")
        if not dry_run:
            with dst.begin() as dtxn:
                for row in erows:
                    (
                        EjercicioID, Nombre, Descripcion, Sets, Reps, Peso, Equip, Duracion, Distancia,
                        TipoEstiramiento, isFuerza, isCardio, isCore, isPlyo, isFlex
+                    ) = row
+                    new_id = str(uuid.uuid4())
+                    exercises_map[EjercicioID] = new_id
+                    insert_one(dtxn, """
+                        INSERT INTO exercises (id,name,description,sets,reps,weight,equipment,duration,distance,stretch_type,
+                                               is_strength,is_cardio,is_core,is_plyo,is_flexibility)
+                        VALUES (:id,:name,:description,:sets,:reps,:weight,:equipment,:duration,:distance,:stretch_type,
+                                :is_strength,:is_cardio,:is_core,:is_plyo,:is_flexibility)
+                    """, {
+                        "id": new_id,
+                        "name": Nombre,
+                        "description": Descripcion,
+                        "sets": Sets,
+                        "reps": Reps,
+                        "weight": float(Peso) if Peso is not None else None,
+                        "equipment": Equip,
+                        "duration": str(Duracion) if Duracion is not None else None,
+                        "distance": float(Distancia) if Distancia is not None else None,
+                        "stretch_type": TipoEstiramiento,
+                        "is_strength": 1 if isFuerza else 0,
+                        "is_cardio": 1 if isCardio else 0,
+                        "is_core": 1 if isCore else 0,
+                        "is_plyo": 1 if isPlyo else 0,
+                        "is_flexibility": 1 if isFlex else 0,
+                    })
+
+        # Programs
+        programs = sconn.execute(text("SELECT `ProgramaID`,`Nombre`,`Descripción`,`FechaInicio`,`FechaFin` FROM `programa`"))
+        prows = programs.fetchall()
+        print(f"[programs] fetched: {len(prows)}")
+        if not dry_run:
+            with dst.begin() as dtxn:
+                for (ProgramaID, Nombre, Descripcion, FechaInicio, FechaFin) in prows:
+                    new_id = str(uuid.uuid4())
+                    programs_map[ProgramaID] = new_id
+                    insert_one(dtxn, """
+                        INSERT INTO programs (id,name,description,start_date,end_date)
+                        VALUES (:id,:name,:description,:start_date,:end_date)
+                    """, {
+                        "id": new_id,
+                        "name": Nombre,
+                        "description": Descripcion,
+                        "start_date": FechaInicio,
+                        "end_date": FechaFin,
+                    })
+
+        # Comments
+        comments = sconn.execute(text("SELECT `ComentarioID`,`SesiónID`,`Texto`,`Fecha` FROM `comentario`"))
+        crows = comments.fetchall()
+        print(f"[comments] fetched: {len(crows)}")
+        if not dry_run:
+            with dst.begin() as dtxn:
+                for (ComentarioID, SesionID, Texto, Fecha) in crows:
+                    new_id = str(uuid.uuid4())
+                    insert_one(dtxn, """
+                        INSERT INTO comments (id,session_id,text,date)
+                        VALUES (:id,:session_id,:text,:date)
+                    """, {
+                        "id": new_id,
+                        "session_id": sessions_map[SesionID],
+                        "text": Texto,
+                        "date": Fecha,
+                    })
+
+        # Join tables
+        # rutinacontieneejercicio
+        rce = sconn.execute(text("SELECT `RutinaID`,`EjercicioID` FROM `rutinacontieneejercicio`"))
+        rce_rows = rce.fetchall()
+        print(f"[routine_exercises] fetched: {len(rce_rows)}")
+        if not dry_run:
+            with dst.begin() as dtxn:
+                for (RutinaID, EjercicioID) in rce_rows:
+                    insert_one(dtxn, """
+                        INSERT INTO routine_exercises (routine_id,exercise_id)
+                        VALUES (:routine_id,:exercise_id)
+                    """, {
+                        "routine_id": routines_map[RutinaID],
+                        "exercise_id": exercises_map[EjercicioID],
+                    })
+
+        # programacontienerutina
+        pcr = sconn.execute(text("SELECT `ProgramaID`,`RutinaID` FROM `programacontienerutina`"))
+        pcr_rows = pcr.fetchall()
+        print(f"[program_routines] fetched: {len(pcr_rows)}")
+        if not dry_run:
+            with dst.begin() as dtxn:
+                for (ProgramaID, RutinaID) in pcr_rows:
+                    insert_one(dtxn, """
+                        INSERT INTO program_routines (program_id,routine_id)
+                        VALUES (:program_id,:routine_id)
+                    """, {
+                        "program_id": programs_map[ProgramaID],
+                        "routine_id": routines_map[RutinaID],
+                    })
+
+        # sesioncontienerutina
+        scr = sconn.execute(text("SELECT `SesiónID`,`RutinaID` FROM `sesioncontienerutina`"))
+        scr_rows = scr.fetchall()
+        print(f"[session_routines] fetched: {len(scr_rows)}")
+        if not dry_run:
+            with dst.begin() as dtxn:
+                for (SesionID, RutinaID) in scr_rows:
+                    insert_one(dtxn, """
+                        INSERT INTO session_routines (session_id,routine_id)
+                        VALUES (:session_id,:routine_id)
+                    """, {
+                        "session_id": sessions_map[SesionID],
+                        "routine_id": routines_map[RutinaID],
+                    })
+
+    print("ETL finished.")
+
+
+if __name__ == "__main__":
+    dry_run = os.getenv("DRY_RUN", "0") == "1"
+    src, dst = connect_engines()
+    migrate(src, dst, dry_run=dry_run)
