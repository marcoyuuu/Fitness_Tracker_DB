# ERD (Mermaid) – Fitness Tracker (SQL dump coverage)

```mermaid
erDiagram
    %% Entities and relationships based on docs/fitness_tracker.sql (MariaDB)

    USUARIO ||--o{ SESION : has
    USUARIO ||--o{ META : has
    SESION ||--o{ COMENTARIO : has

    %% Many-to-many via link tables
    SESION }o--o{ RUTINA : includes
    RUTINA }o--o{ EJERCICIO : contains
    PROGRAMA }o--o{ RUTINA : contains

    USUARIO {
        int UserID PK
        varchar Nombre
        varchar Correo UK
        varchar Contraseña
    }

    SESION {
        int "SesiónID" PK
        int UserID FK
        date Fecha
        time "Duración"
    }

    COMENTARIO {
        int ComentarioID PK
        int "SesiónID" FK
        text Texto
        date Fecha
    }

    META {
        int MetaID PK
        int UserID FK
        date "FechaLímite"
        bool Completado
        text "Descripción"
    }

    RUTINA {
        int RutinaID PK
        varchar Nombre
        text "Descripción"
    }

    EJERCICIO {
        int EjercicioID PK
        varchar Nombre
        text "Descripción"
        int Sets
        int Repeticiones
        decimal Peso
        varchar Equipamiento
        time "Duración"
        decimal Distancia
        varchar TipoEstiramiento
        bool isEntrenamientoDeFuerza
        bool isCardio_Circuitos
        bool isCore_Estabilidad
        bool isPliométricos
        bool isFlexibilidad_Movilidad
    }

    PROGRAMA {
        int ProgramaID PK
        varchar Nombre
        text "Descripción"
        date FechaInicio
        date FechaFin
    }

    PROGRAMACONTIENERUTINA {
        int ProgramaID PK, FK
        int RutinaID PK, FK
    }

    RUTINACONTIENEEJERCICIO {
        int RutinaID PK, FK
        int EjercicioID PK, FK
    }

    SESIONCONTIENERUTINA {
        int "SesiónID" PK, FK
        int RutinaID PK, FK
    }
```

## Diccionario de Datos (resumen)
- usuario
  - UserID: int, PK, AUTO_INCREMENT
  - Nombre: varchar(255) NOT NULL
  - Correo: varchar(255) NOT NULL, UNIQUE
  - Contraseña: varchar(255) NOT NULL
- sesión
  - SesiónID: int, PK, AUTO_INCREMENT
  - UserID: int, FK→usuario.UserID
  - Fecha: date NOT NULL
  - Duración: time NOT NULL
- comentario
  - ComentarioID: int, PK, AUTO_INCREMENT
  - SesiónID: int, FK→sesión.SesiónID
  - Texto: text NOT NULL
  - Fecha: date NOT NULL
- meta
  - MetaID: int, PK, AUTO_INCREMENT
  - UserID: int, FK→usuario.UserID
  - FechaLímite: date NOT NULL
  - Completado: tinyint(1) DEFAULT 0
  - Descripción: text NULL
- rutina
  - RutinaID: int, PK, AUTO_INCREMENT
  - Nombre: varchar(255) NOT NULL
  - Descripción: text NULL
- ejercicio
  - EjercicioID: int, PK, AUTO_INCREMENT
  - Nombre: varchar(255) NOT NULL
  - Descripción: text NULL
  - Sets: int NULL
  - Repeticiones: int NULL
  - Peso: decimal(5,2) NULL
  - Equipamiento: varchar(255) NULL
  - Duración: time NULL
  - Distancia: decimal(5,2) NULL
  - TipoEstiramiento: varchar(255) NULL
  - isEntrenamientoDeFuerza / isCardio_Circuitos / isCore_Estabilidad / isPliométricos / isFlexibilidad_Movilidad: tinyint(1) DEFAULT 0
- programa
  - ProgramaID: int, PK, AUTO_INCREMENT
  - Nombre: varchar(255) NOT NULL
  - Descripción: text NULL
  - FechaInicio: date NOT NULL
  - FechaFin: date NULL
- programacontienerutina (join)
  - ProgramaID: int, PK, FK→programa.ProgramaID
  - RutinaID: int, PK, FK→rutina.RutinaID
- rutinacontieneejercicio (join)
  - RutinaID: int, PK, FK→rutina.RutinaID
  - EjercicioID: int, PK, FK→ejercicio.EjercicioID
- sesioncontienerutina (join)
  - SesiónID: int, PK, FK→sesión.SesiónID (ON DELETE/UPDATE CASCADE)
  - RutinaID: int, PK, FK→rutina.RutinaID (ON DELETE/UPDATE CASCADE)
