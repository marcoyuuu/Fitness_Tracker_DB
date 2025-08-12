# PRD – Fitness Tracker (Web + iOS + Android)

## 0) Contexto breve
Modernización del Fitness Tracker hacia una plataforma multiplataforma (web/mobile) con frontend React Native (Expo) y backend Django/DRF sobre SQL Server, contenedorizado y listo para CI/CD y observabilidad.

## 1) Problema y oportunidad
- Problema: Monolito PHP/MySQL con un único endpoint, baja seguridad y escalabilidad, sin canal móvil ni automatización.
- Oportunidad: Unificar web+iOS+Android con una sola base de UI, APIs por dominio seguras y observables, habilitando crecimiento y time-to-market.

## 2) Objetivos (SMART)
- Experiencia: Publicar MVP móvil+web con registro, sesiones y metas en ≤ Q3; CSAT ≥ 4.2/5.
- Rendimiento: p95 API < 500 ms; p99 < 1 s.
- Seguridad: JWT + RBAC; 0 hallazgos P0/P1 abiertos al release.
- Entrega: CI/CD con pipelines verdes (<10 min), cobertura ≥ 70% unidades por servicio.
- Disponibilidad: 99.9% mensual (SLO) para APIs en producción.

## 3) Alcance v1 (MVP)
- Autenticación/usuarios: registro/login/logout, perfil básico, recuperación de contraseña.
- Sesiones: CRUD con fecha y duración; listar historial.
- Metas: CRUD + marcar completadas.
- i18n ES/EN, accesibilidad AA, tema claro/oscuro.
- Observabilidad básica (logs, métricas RED) y CI/CD operativo.

No objetivos (v2+): Programas avanzados, notificaciones push, analítica avanzada, mensajería/eventos.

## 4) Personas y casos de uso
- Usuario fitness (principiante-intermedio): registra entrenamientos, define metas, revisa progreso.
- Admin/Coach: modera comentarios, gestiona catálogos.

Casos de uso clave:
1) Registrarse, iniciar sesión, actualizar perfil.
2) Crear/editar/eliminar sesiones; ver historial filtrado.
3) Crear/editar/eliminar metas; marcar completadas.
4) (v2) Gestionar ejercicios/rutinas; asociarlas a sesiones y programas.

## 5) Historias de usuario (MVP priorizadas)
- Como usuario, quiero registrarme con email/contraseña para acceder a la app. (P0)
- Como usuario, quiero iniciar y cerrar sesión para proteger mi cuenta. (P0)
- Como usuario, quiero recuperar mi contraseña para restablecer acceso. (P0)
- Como usuario, quiero crear una sesión con fecha y duración para llevar control. (P0)
- Como usuario, quiero ver mi historial por fechas para entender mi progreso. (P1)
- Como usuario, quiero definir metas con fecha límite y marcarlas como completadas. (P0)
- Como usuario, quiero cambiar idioma ES/EN y usar la app con accesibilidad AA. (P1)

Criterios de aceptación por historia: definidos en la sección 10.

## 6) Requisitos funcionales (resumen)
- Usuarios/Auth: OAuth2/JWT, refresh tokens, RBAC (usuario, admin), perfil.
- Sesiones: CRUD, filtros por periodo; comentarios (v2). 
- Metas: CRUD, estado completada.
- Ejercicios, Rutinas, Programas: CRUD y asociaciones (v2+).

## 7) Requisitos no funcionales (clave)
- Rendimiento, disponibilidad, seguridad, privacidad, observabilidad, portabilidad y calidad según ETF.
- Compatibilidad: iOS ≥ 15, Android ≥ 8, navegadores evergreen.

## 8) Suposiciones y dependencias
- SQL Server disponible para entornos; gateway/API Management en v2.
- Equipo con capacidad RN/Expo y DRF; acceso a registries y K8s en preproducción.

## 9) Fases y entregables
- Fase 1 (Fundaciones): Auth/usuarios + CI/CD + base Expo + SQL Server + observabilidad básica.
- Fase 2 (Core MVP): Sesiones y Metas end-to-end; i18n y AA; E2E críticos.
- Fase 3 (v2): Ejercicios y Rutinas; comentarios; gateway; notificaciones; programas.

Hitos: ver plan de tareas BMAD.

## 10) Criterios de aceptación (ejemplos)
- Login/Registro: 
  - Dado un email válido y contraseña fuerte, cuando me registro, entonces recibo JWT y acceso al perfil.
  - Cuando expira el access token, puedo refrescar sin reingresar credenciales.
  - Auditoría de intentos fallidos y bloqueo temporal tras 5 intentos.
- Sesiones:
  - Crear/editar/eliminar sesión con validaciones de fecha y duración; respuesta < 500 ms p95.
  - Listado paginado, filtrable por desde/hasta; orden por fecha desc.
- Metas:
  - CRUD con validaciones; marcar completadas registra timestamp.
- NFR:
  - Cobertura unitaria ≥ 70% en servicios; E2E de flujos críticos pasan en CI.
  - Logs estructurados; métricas HTTP y DB visibles en dashboard.

## 11) Métricas de éxito
- Adopción: ≥ 1,000 MAU a los 60 días del MVP.
- Engagement: ≥ 3 sesiones/usuario/semana en promedio.
- Estabilidad: < 1% crash rate móvil; 99.9% SLO API.
- Entrega: lead time < 7 días; change fail rate < 15%.

## 12) Riesgos y mitigaciones
- Complejidad de microservicios: iniciar con dominios mayores; ADRs; feature flags.
- Migración de datos: ETL probada y reconciliación; doble escritura temporal.
- Seguridad: gates SAST/DAST, rotación de secretos, mínimos privilegios.

## 13) Anexos
- ETF técnica (docs/especificacion_funcional_tecnica.md).
- ERD actualizado, OpenAPI v1, diagramas C4, plan de pruebas (a generar).
