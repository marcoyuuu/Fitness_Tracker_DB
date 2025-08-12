# Plan de Tareas y Asignación BMAD – Fitness Tracker

Este plan deriva del PRD y la ETF. Estructura el trabajo en épicas/fases, define entregables, criterios de “Done” y asigna agentes BMAD.

Agentes disponibles (bundle): pm, po, architect, analyst, dev, qa, sm, ux-expert, bmad-orchestrator.

## 1) Épicas y entregables

1) Fundaciones Plataforma (Semana 1–3)
- Entregables:
  - Monorepo/base Expo (web+iOS+Android) y React Native listo.
  - Proyecto backend Django/DRF con configuración base.
  - SQL Server: esquema base y conectividad local/CI.
  - Dockerfiles, docker-compose local, pipeline CI (lint, test, build).
  - Observabilidad básica: logs estructurados, métricas HTTP.
- DoD: Pipelines verdes; contenedores build/run; dashboards básicos disponibles.
- Owner: architect; Soporte: dev, qa; Aprob: pm/po.

2) Autenticación y Usuarios (Semana 2–4)
- Entregables: Endpoints DRF (signup/login/logout, refresh), JWT, RBAC (usuario/admin), perfil; pantallas Expo de auth; migraciones SQL Server.
- DoD: E2E de auth pasa; cobertura unidades ≥ 70% en módulo users; p95 < 500 ms.
- Owner: dev; Soporte: architect, qa, ux-expert; Aprob: po.

3) Sesiones (Workouts) E2E (Semana 4–6)
- Entregables: CRUD sesiones, filtros por periodo; UI de historial; validaciones.
- DoD: E2E de sesiones; p95 < 500 ms; paginación estándar; registros de auditoría.
- Owner: dev; Soporte: analyst (criterios), qa; Aprob: po.

4) Metas E2E (Semana 5–6)
- Entregables: CRUD metas, marcar completadas, UI metas.
- DoD: E2E metas pasa; notificaciones diferidas a v2; cobertura unitaria.
- Owner: dev; Soporte: qa, ux-expert; Aprob: po.

5) i18n y Accesibilidad (Semana 3–6 transversal)
- Entregables: i18n ES/EN, toggle idioma; AA WCAG AA; theming.
- DoD: Audit AA con checklist; textos 100% traducidos para MVP.
- Owner: ux-expert; Soporte: dev; Aprob: po.

6) Observabilidad y SRE mínimo (Semana 2–6)
- Entregables: dashboards RED, alertas básicas; trazas app→DB (v2).
- DoD: Tableros muestran latencias p50/p95/p99 y códigos.
- Owner: architect; Soporte: qa; Aprob: pm.

7) Datos y Migración (Plan + POC) (Semana 3–6)
- Entregables: ERD actualizado, diccionario datos; plan ETL MySQL→SQL Server; script POC.
- DoD: ETL POC ejecuta en entorno dev; reconciliación en ≥ 95% de registros de prueba.
- Owner: analyst; Soporte: architect; Aprob: pm.

8) QA y E2E (transversal)
- Entregables: pruebas unitarias, integración y 2 flujos E2E (auth→sesión→meta).
- DoD: Matriz de pruebas, cobertura ≥ 70%, CI con reportes.
- Owner: qa; Soporte: dev; Aprob: pm.

9) Documentación y OpenAPI (transversal)
- Entregables: OpenAPI v1, ADRs clave, README de despliegue local.
- DoD: Publicado en docs/ y referenciado en CI.
- Owner: analyst; Soporte: architect; Aprob: pm/po.

10) Preparación v2 (Ejercicios, Rutinas) (Semana 6–8)
- Entregables: modelo exercise_type, CRUD ejercicios/rutinas (alfa), UI básica.
- DoD: APIs estables y alpha UI detrás de feature flag.
- Owner: dev; Soporte: analyst, qa; Aprob: po.

## 2) Backlog detallado y asignación (extracto)

ID | Tarea | Owner | Est | Deps
---|---|---|---|---
T-01 | Crear PRD y alinear con ETF | po | 1d | —
T-02 | Definir ADR: arquitectura objetivo y dominios | architect | 1d | —
T-03 | Inicializar Expo (web/iOS/Android) + lint | dev | 1d | T-02
T-04 | Inicializar Django/DRF + settings por entorno | dev | 1d | T-02
T-05 | Dockerfiles + docker-compose local | dev | 1d | T-03,T-04
T-06 | Pipeline CI (lint/test/build) | pm | 1d | T-05
T-07 | Esquema SQL Server inicial (users, sessions, goals) | analyst | 1d | T-02
T-08 | JWT/Refresh tokens + RBAC en DRF | dev | 2d | T-04,T-07
T-09 | Pantallas Auth en Expo + i18n | ux-expert | 2d | T-03,T-08
T-10 | CRUD sesiones + filtros + tests | dev | 3d | T-04,T-07
T-11 | CRUD metas + tests | dev | 2d | T-04,T-07
T-12 | E2E Cypress/Detox flujos críticos | qa | 2d | T-09,T-10,T-11
T-13 | Observabilidad básica (logs/métricas) | architect | 1d | T-04
T-14 | ERD actualizado + diccionario datos | analyst | 2d | T-07
T-15 | OpenAPI v1 publicado | analyst | 1d | T-08,T-10,T-11
T-16 | Checklist AA y fixes UI | ux-expert | 1d | T-09

Notas: Est = estimación calendario. Ajustar según capacidad real.

## 3) RACI por área (MVP)
- Producto: Aprob = po; Responsable operativo = pm.
- Arquitectura/Infra: Responsable = architect; Consultados = dev, qa.
- Implementación backend/frontend: Responsable = dev; Apoyo = ux-expert.
- Calidad: Responsable = qa; Aprobación de salida = pm.
- Datos/Migración: Responsable = analyst; Aprob = pm.

## 4) Tablero de seguimiento sugerido
- Columnas: Backlog, Ready, In Progress, In Review, Test, Done.
- Definición de Ready: historia con criterios de aceptación, mocks UI (si aplica) y dependencias claras.
- Definición de Done: código mergeado, tests verdes, docs actualizadas, métricas observables.

## 5) Hitos y criterios de salida
- Hito 1 (Fin Semana 3): Fundaciones listas; auth básica operativa en dev.
- Hito 2 (Fin Semana 6): MVP completo (auth, sesiones, metas, i18n/AA, CI/CD, QA/E2E) desplegado en preprod.
- Hito 3 (Semana 8): v2 alfa (ejercicios/rutinas) detrás de feature flag.

## 6) Comandos BMAD sugeridos (opcionales)
- Para orientación: `*workflow-guidance`
- Cambiar a agente específico: `*agent pm`, `*agent architect`, `*agent dev`, etc.
- Ejecutar tareas/plantillas (si están disponibles): `*task create-doc`, `*checklist advanced-elicitation`.

---

Este plan puede evolucionar con feedback del equipo y métricas de entrega.
