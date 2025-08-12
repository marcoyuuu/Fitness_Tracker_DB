# Especificación Técnica Funcional (ETF) – Modernización “Fitness Tracker”

## Resumen ejecutivo

Este documento consolida requerimientos de negocio y producto, arquitectura objetivo y lineamientos técnicos para modernizar la aplicación **Fitness Tracker** hacia una plataforma **multiplataforma (web + iOS + Android)** con **frontend React Native (Expo)** y **backend Django/DRF** sobre **SQL Server**, empaquetada en contenedores y preparada para la nube. La meta es elevar **escalabilidad, seguridad, mantenibilidad y agilidad del equipo**, migrando gradualmente desde el monolito PHP/MySQL a una arquitectura modular, orientada a servicios y con automatización CI/CD.

---

# 1) Introducción y alcance

### Propósito

Definir de forma integral **qué** debe hacer el sistema, **cómo** debe comportarse a nivel técnico y **bajo qué arquitectura** debe operar tras la modernización.

### Alcance

* Canales: **Aplicación móvil (iOS/Android) + Web** usando una sola base de código con Expo.
* Módulos: **Usuarios/Autenticación, Sesiones, Ejercicios, Rutinas, Programas, Metas, Comentarios**, i18n (ES/EN).
* Backend: **Django REST Framework** (servicios por dominio), **SQL Server** como base transaccional, **mensajería** para eventos (opcional).
* DevOps: **Docker + Kubernetes**, **CI/CD**, observabilidad y seguridad end-to-end.
* Migración: **MySQL → SQL Server**, de monolito PHP a servicios Django en fases.

### Audiencia

CTO, VP Engineering, Arquitectura de Software, Líderes de Producto, QA y Seguridad.

---

# 2) Visión general del sistema

### Estado actual (síntesis)

* Frontend: React (web), i18next (ES/EN).
* Backend: PHP con un único endpoint dinámico para CRUD.
* Datos: MySQL con entidades principales (Usuario, Sesión, Comentario, Rutina, Ejercicio y subtipos, Programa, Meta) y tablas puente para relaciones M\:N.
* Limitaciones: monolito con bajo desacoplamiento, seguridad básica, web-only, sin canal móvil, sin despliegue automatizado ni observabilidad avanzada.

### Objetivos de modernización

* **Escalabilidad horizontal** y resiliencia (contenedores, orquestación).
* **Multiplataforma** con una sola base de código UI.
* **Modularidad** por dominios con contratos de API claros.
* **Seguridad** robusta (OAuth2/JWT, cifrado, RBAC, auditoría).
* **Velocidad de entrega** (CI/CD, testing automatizado).
* **Observabilidad** (métricas, logs, trazas) y **operación cloud-ready**.

---

# 3) Requerimientos funcionales

> Nota: se listan a nivel de capacidad; los flujos detallados, reglas de validación y excepciones se documentarán por historia de usuario/criterio de aceptación.

### 3.1. Usuarios y autenticación

* Registro, inicio/cierre de sesión, recuperación de contraseña.
* **Autenticación**: OAuth2/JWT; **autorización**: RBAC (roles: usuario, admin).
* Gestión de perfil (nombre, correo, idioma).
* Políticas: contraseña segura, bloqueo por intentos, MFA opcional.

### 3.2. Sesiones de entrenamiento

* Crear/editar/eliminar sesión con **fecha** y **duración**; asociar una o varias **rutinas**.
* Listar historial, filtrar por periodo, rutina y programa.
* Adjuntar **comentarios** por sesión.

### 3.3. Ejercicios

* CRUD de ejercicios con **atributos por categoría** (cardio, fuerza, core, pliométricos, flexibilidad).
* Soportar campos condicionales por tipo (p.ej., cardio: duración/distancia; fuerza: peso/equipamiento).
* Búsqueda por nombre, tipo, equipo; duplicar/plantillas.

### 3.4. Rutinas

* CRUD de rutinas; agregar/quitar **ejercicios** y ordenarlos.
* Reutilización en sesiones y programas.

### 3.5. Programas

* CRUD de programas; asociar **rutinas** (1..N) con **fechas** de inicio/fin.
* Asignación a usuarios (seguir programa) y progreso.

### 3.6. Metas

* CRUD de **metas** por usuario con **descripción** y **fecha límite**; marcar como **completadas**.
* Recordatorios/notificaciones (push/email) opcionales.

### 3.7. Comentarios

* CRUD de comentarios por sesión; moderación básica (eliminar por admin/autor).

### 3.8. Internacionalización y accesibilidad

* Localización **ES/EN** desde UI; formatos regionales.
* Accesibilidad AA: tamaños, contraste, labels, navegación por teclado/lector pantalla.

---

# 4) Requerimientos no funcionales

| Categoría      | Especificación clave                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| Rendimiento    | p95 de API < 500 ms; p99 < 1 s.                                                           |
| Disponibilidad | Objetivo 99.9% mensual (SLO).                                                             |
| Escalabilidad  | Horizontal por servicio (HPA en Kubernetes).                                              |
| Seguridad      | OAuth2/JWT, TLS 1.2+, RBAC, hashing de contraseñas (bcrypt/argon2), rotación de secretos. |
| Privacidad     | Cifrado en tránsito y reposo; minimización de datos personales; retención definida.       |
| Observabilidad | Logs estructurados, métricas (RED/USE), trazas distribuidas.                              |
| Compatibilidad | iOS ≥ 15, Android ≥ 8.0, navegadores evergreen.                                           |
| Portabilidad   | Contenedores OCI; IaC reproducible.                                                       |
| Calidad        | Cobertura unitaria mínima 70%; E2E críticos; linting y SAST en CI.                        |

---

# 5) Modelo de datos (resumen funcional)

**Entidades principales**: Usuario, Sesión, Comentario, Ejercicio (con tipos/campos específicos), Rutina, Programa, Meta; **relaciones M\:N**: Rutina–Ejercicio, Programa–Rutina, Sesión–Rutina.

**Decisión de diseño** para la modernización:

* Unificar el manejo de tipos de ejercicio con un **campo `exercise_type` (enum)** y **atributos opcionales** por tipo; evitar múltiples flags booleanos para mayor claridad y validación.
* Estandarizar **nombres sin acentos** y en **snake\_case** (e.g., `sesion_id`, `duracion_min`) para interoperabilidad.
* Mantener **tablas puente** para M\:N; claves foráneas con `ON DELETE/UPDATE` apropiados; índices compuestos en tablas de relación.

*(El ERD actualizado y el diccionario de datos se anexarán como artefactos oficiales.)*

---

# 6) Arquitectura técnica objetivo

### 6.1. Frontend (Cliente)

* **React Native + Expo** (monorepo): iOS, Android y Web con **Expo Router**/**React Navigation**.
* **i18n** con `react-i18next`; **estado** con React Query/RTK Query para cacheo de datos y sincronización.
* **Offline-first** (persistencia local y reintentos); notificaciones push (Expo Notifications).
* Diseño de componentes accesibles y theming consistente.

### 6.2. Backend (Servicios)

* **Django + Django REST Framework** por dominio:

  * `users` (auth + perfiles), `workouts` (sesiones/comentarios), `exercises`, `routines`, `programs`, `goals`.
* **API Gateway** (Kong / API Management) para autenticación, rate limiting, auditoría y versionado (`/api/v1`).
* **Mensajería** (RabbitMQ/Kafka) para eventos: *SessionCreated*, *GoalCompleted*, *ProgramAssigned* (telemetría, notificaciones, analítica).
* **Tareas asíncronas** (Celery + Redis) para envíos de notificaciones y reportes.

### 6.3. Datos

* **SQL Server** como base OLTP principal (database-per-service lógico mediante esquemas).
* **Migración** desde MySQL con ETL validado y doble escritura temporal si se requiere convivencia.
* **Caché** con Redis (sesiones, lookups).

### 6.4. Infraestructura, entrega y operación

* **Contenedores** Docker + **Kubernetes** (AKS/EKS/GKE).
* **CI/CD** con GitHub Actions: build, test, SAST/DAST, escaneo de imágenes, despliegue Helm.
* **Observabilidad**: Prometheus/Grafana, ELK/EFK, OpenTelemetry/Jaeger; alertas (SLO-based).
* **Seguridad**: secretos en Vault/KMS, políticas de red (NetworkPolicies), imágenes mínimas, SBOM y firmas (Cosign).

---

# 7) Contratos de API (alto nivel)

> Interfaces REST por recurso; se detalla formato, errores y paginación en OpenAPI.

* **Usuarios**: registro/login/logout, refresh tokens, perfil, cambio de password.
* **Sesiones**: CRUD; filtros por fecha/rutina; comentarios como subrecurso.
* **Ejercicios**: CRUD; búsqueda por tipo/equipo; metadatos por categoría.
* **Rutinas**: CRUD; gestión de lista ordenada de ejercicios.
* **Programas**: CRUD; asociación de rutinas; seguimiento.
* **Metas**: CRUD; marcar completado; listar por usuario.

Políticas transversales: **versionado** (`/v1`), **idempotencia** (empotent-keys en POST críticos), **paginación y ordenado** estándar, **códigos de error** y **cuerpo de error** unificado.

---

# 8) Estrategia de migración

**Fase 0 – Preparación**
Infraestructura cloud, clúster K8s, registries, observabilidad base y pipelines CI/CD.

**Fase 1 – Fundaciones**
Servicio `users` (auth/JWT, RBAC) + pasarela API. Esquemas en SQL Server.

**Fase 2 – Dominios núcleo**
`exercises` y `routines` (solo lectura inicialmente para desacoplar UI). ETL de catálogos.

**Fase 3 – Workouts/Metas**
`workouts` (sesiones/comentarios) y `goals`. Doble escritura y *feature flags* en UI.

**Fase 4 – Programas**
`programs` + integraciones de notificaciones. Corte paulatino del monolito.

**Fase 5 – Descomisionado**
Apagar endpoints PHP, congelar MySQL, *post-migration review* y optimizaciones.

**Corte controlado**: *blue/green* o *canary* en el gateway; *error budget* y *rollback* automatizado.

---

# 9) Calidad, pruebas y aceptación

| Tipo        | Alcance mínimo                                             |
| ----------- | ---------------------------------------------------------- |
| Unitarias   | Validadores DRF, servicios de dominio, utilidades de UI.   |
| Integración | API por servicio, base de datos, colas.                    |
| E2E         | Flujos clave (registro → sesión → meta → progreso).        |
| Carga       | p95 y saturación; pruebas con datos realistas.             |
| Seguridad   | SAST/DAST, pruebas de auth, control de acceso y auditoría. |

**Criterios de aceptación**: cumplimiento de NFR críticos, cobertura, cero P0/P1 abiertos, dashboards de SLO y alertas operativas activos.

---

# 10) Seguridad y cumplimiento

* **Identidad y acceso**: OAuth2/OpenID Connect, **JWT** con expiración corta + refresh, **scopes** y **roles**.
* **Protección de datos**: TLS en tránsito; cifrado de discos/columnas sensibles; políticas de retención.
* **Hardening**: imágenes mínimas, usuarios no root, políticas PodSecurity/OPA, escaneo de vulnerabilidades.
* **Auditoría**: trazabilidad de acciones (quién, qué, cuándo, desde dónde).
* **Privacidad**: minimización de PII, consentimiento y políticas de privacidad transparentes.

---

# 11) Gobernanza y organización

* **Ownership por dominio** (service owners); repos separados o mono-repo con límites claros.
* **Estándares**: guías de estilo, revisiones de arquitectura, ADRs, convenciones de API y nomenclatura.
* **RACI** para decisiones críticas (seguridad, releases, cambios de esquema).
* **Documentación viva**: OpenAPI, diagramas C4, runbooks y *playbooks* de incidentes.

---

# 12) Riesgos y mitigaciones

| Riesgo                        | Mitigación                                                                 |
| ----------------------------- | -------------------------------------------------------------------------- |
| Complejidad de microservicios | Empezar con **servicios por dominio mayores**; evitar sobre-fragmentación. |
| Migración de datos            | ETL con pruebas de reconciliación; doble escritura temporal.               |
| Deuda en seguridad            | “Security by default”; *gates* en CI/CD; revisión periódica.               |
| Desalineación de equipo       | ADRs, *guilds* técnicas, *demo* quincenal, métricas de entrega.            |

---

# 13) Roadmap y hitos (alto nivel)

1. **Q1**: Infraestructura, auth/usuarios, API Gateway, pipeline CI/CD.
2. **Q2**: Ejercicios+Rutinas (read/write), UI Expo beta (web/mobile).
3. **Q3**: Sesiones/Comentarios, Metas, observabilidad completa; canary cutover.
4. **Q4**: Programas, notificaciones, cierre de monolito y *post-mortem* de migración.

---

## Anexos (a entregar)

* ERD actualizado y diccionario de datos.
* OpenAPI v1 de servicios.
* Diagramas C4 (Contexto, Contenedores, Componentes).
* Plan de pruebas y *test matrix*.
* Runbooks operativos y tableros de observabilidad.

---

### Cierre

Esta ETF proporciona una base unificada para alinear negocio, producto y tecnología en la modernización de **Fitness Tracker**. Con esta guía, el equipo puede programar talleres de detalle (APIs, ERD final, seguridad avanzada) y arrancar la construcción bajo un marco **escalable, seguro y cloud-ready**. ¿Quieres que preparemos los **artefactos anexos** (OpenAPI inicial, ERD normalizado y diagramas C4) en una siguiente iteración?
