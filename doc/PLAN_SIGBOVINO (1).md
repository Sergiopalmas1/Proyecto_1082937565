# SIG Bovino — Plan Maestro del Sistema
> Software de Inventario de Ganado | Versión 3.0
> Proyecto Fullstack Individual | Mayo 2026
> Stack: Next.js + TypeScript + Supabase Postgres + Vercel Blob + Vercel
> Estudiante: Sergio Palma | Doc: 1082937565

---

## Índice General

1. [Definición del sistema](#1-definición-del-sistema)
2. [Problema que resuelve](#2-problema-que-resuelve)
3. [Actores del sistema](#3-actores-del-sistema)
4. [Roles y permisos](#4-roles-y-permisos)
5. [Casos de uso](#5-casos-de-uso)
6. [Requerimientos funcionales](#6-requerimientos-funcionales)
7. [Reglas de negocio](#7-reglas-de-negocio)
8. [Stack tecnológico](#8-stack-tecnológico)
9. [Arquitectura de persistencia (Supabase + Blob + Seed)](#9-arquitectura-de-persistencia)
10. [Bootstrap y migrations](#10-bootstrap-y-migrations)
11. [Capa de datos unificada (`dataService`)](#11-capa-de-datos-unificada)
12. [Modelo de datos — Supabase Postgres](#12-modelo-de-datos--supabase-postgres)
13. [Auditoría y archivos en Vercel Blob](#13-auditoría-y-archivos-en-vercel-blob)
14. [Arquitectura de rutas](#14-arquitectura-de-rutas)
15. [Requerimientos no funcionales](#15-requerimientos-no-funcionales)
16. [Flujos de usuario y de trabajo](#16-flujos-de-usuario-y-de-trabajo)
17. [Diseño de interfaz](#17-diseño-de-interfaz)
18. [Plan de fases de implementación](#18-plan-de-fases-de-implementación)
19. [Estrategia de seguridad](#19-estrategia-de-seguridad)
20. [Reportes oficiales](#20-reportes-oficiales)
21. [Glosario](#21-glosario)

---

## 1. Definición del sistema

**SIG Bovino** es un sistema de software diseñado para digitalizar y centralizar la administración del inventario bovino de una finca o empresa agropecuaria. Reemplaza los registros manuales en libretas por una base de datos organizada, consultable y con generación automática de reportes oficiales.

El sistema permite registrar, clasificar y hacer seguimiento de cada animal, controlar su producción de leche por turnos, mantener su historial de vacunación con alertas automáticas, registrar el estado reproductivo de las hembras, visualizar el árbol genealógico y generar reportes oficiales para entidades sanitarias como el ICA y para efectos fiscales.

SIG Bovino opera completamente desde el navegador, persiste los datos estructurados en una base de datos Postgres gestionada por Supabase, y deriva la auditoría completa y los archivos binarios (fotos de animales, certificados sanitarios) a Vercel Blob para mantener Postgres dedicado solo a datos consultables con SQL.

---

## 2. Problema que resuelve

| Problema actual | Cómo lo resuelve SIG Bovino |
|---|---|
| Pérdida de información por registros manuales en libretas o cuadernos. | Centraliza el inventario en una base de datos consultable desde cualquier dispositivo. |
| Dificultad para saber cuántos animales hay, dónde están y en qué estado. | Tablero general con conteos por bodega, estado y categoría. |
| Imposibilidad de comparar producción de leche entre períodos. | Reportes comparativos automáticos con totales, promedios y gráficas. |
| Falta de trazabilidad para vacunaciones y cumplimiento de normas sanitarias. | Registro de cada vacuna con cálculo automático de próxima dosis y alertas con 7 días de anticipación. |
| Ausencia de reportes listos para declaración de renta o auditorías. | Inventario valorado del hato exportable en PDF/Excel. |
| Dificultad para conocer el linaje de los animales. | Árbol genealógico vinculando madre, padre y crías. |

### Dirigido a

- Propietarios de fincas ganaderas familiares o medianas empresas agropecuarias.
- Operarios y veterinarios que gestionan el día a día del hato.
- Entidades sanitarias como el ICA que requieren informes de vacunación.
- Contadores o asesores fiscales que necesitan reportes de inventario valorado.

---

## 3. Actores del sistema

| Actor | Tipo | Descripción |
|---|---|---|
| **Administrador** | Humano — Principal | Propietario o responsable del hato. Acceso total. Único que ejecuta el bootstrap del sistema. |
| **Veterinario** | Humano — Especializado | Profesional de salud animal. Registra vacunaciones y estado reproductivo. |
| **Operario de Campo** | Humano — Operacional | Personal que ejecuta tareas diarias: ordeño, observación de novedades. |
| **Sistema** | No humano — Automático | Procesos automáticos: cálculo de edad, alertas de vacunación, validaciones, comparativos, auditoría. |
| **Supabase Postgres** | No humano — Datos | Persistencia de datos estructurados de dominio. |
| **Vercel Blob** | No humano — Datos | Persistencia de auditoría completa y archivos binarios (fotos, certificados). |

---

## 4. Roles y permisos

### Matriz de permisos

| Recurso / Acción | Admin | Veterinario | Operario |
|---|:-:|:-:|:-:|
| Login / cambiar contraseña propia | ✅ | ✅ | ✅ |
| **BOOTSTRAP DEL SISTEMA** | | | |
| Acceder a `/admin/db-setup` | ✅ | ❌ | ❌ |
| Ejecutar migrations y seed | ✅ | ❌ | ❌ |
| **ANIMALES** | | | |
| Registrar / editar animal | ✅ | ✅ | ✅ |
| Eliminar / dar de baja animal | ✅ | ❌ | ❌ |
| Ver lista y detalle de animales | ✅ | ✅ | ✅ |
| Ver árbol genealógico | ✅ | ✅ | ✅ |
| Subir foto del animal a Blob | ✅ | ✅ | ❌ |
| **BODEGAS** | | | |
| Crear / editar bodega | ✅ | ❌ | ❌ |
| Ver bodegas | ✅ | ✅ | ✅ |
| Asignar animal a bodega | ✅ | ✅ | ❌ |
| **PRODUCCIÓN DE LECHE** | | | |
| Registrar producción | ✅ | ❌ | ✅ |
| Ver historial | ✅ | ✅ | ✅ |
| Editar / eliminar registro | ✅ | ❌ | ❌ |
| **VACUNACIÓN** | | | |
| Registrar vacuna individual o masiva | ✅ | ✅ | ❌ |
| Ver historial de vacunación | ✅ | ✅ | ✅ |
| Subir certificado a Blob | ✅ | ✅ | ❌ |
| **ESTADO REPRODUCTIVO** | | | |
| Registrar evento reproductivo | ✅ | ✅ | ❌ |
| Ver historial reproductivo | ✅ | ✅ | ✅ |
| **REPORTES** | | | |
| Ver reportes de producción | ✅ | ✅ | ✅ |
| Generar reporte sanitario para ICA | ✅ | ✅ | ❌ |
| Generar reporte de inventario valorado | ✅ | ❌ | ❌ |
| Exportar reportes en PDF / Excel | ✅ | ✅ | ✅ |
| **USUARIOS** | | | |
| Crear / editar / suspender usuarios | ✅ | ❌ | ❌ |
| Asignar roles | ✅ | ❌ | ❌ |
| **AUDITORÍA** | | | |
| Ver bitácora de cambios (Blob) | ✅ | ❌ | ❌ |

### Comportamiento por rol

**Administrador**: acceso total. Es el responsable del hato y de la configuración del sistema. Único rol que puede gestionar usuarios, ver la auditoría y generar reportes fiscales. Es también el único que puede ejecutar el bootstrap inicial.

**Veterinario**: enfocado en la salud animal. Registra vacunaciones (individuales o masivas), estado reproductivo, sube certificados sanitarios a Blob y genera el reporte oficial para el ICA.

**Operario de Campo**: enfocado en la operación diaria. Registra producción de leche por turnos, observa novedades y consulta el listado de animales.

---

## 5. Casos de uso

### Módulo 1 — Bootstrap (admin)

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-B1 | Diagnosticar estado del sistema | Admin | Verifica conectividad con Supabase y con Blob, lista migrations aplicadas y pendientes, conteos por tabla. |
| CU-B2 | Aplicar migrations | Admin | Ejecuta las migrations pendientes de `supabase/migrations/` contra la base de datos remota. |
| CU-B3 | Cargar seed inicial | Admin | Inserta los datos iniciales de `data/seed.json` (admin por defecto y catálogo de vacunas) en Supabase. |

### Módulo 2 — Autenticación

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-A1 | Iniciar sesión | Todos | El usuario ingresa correo y contraseña. |
| CU-A2 | Cerrar sesión | Todos | El usuario cierra su sesión. |
| CU-A3 | Cambiar contraseña | Todos | El usuario actualiza su contraseña verificando la actual. |

### Módulo 3 — Animales

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-01 | Registrar nuevo animal | Admin / Veterinario / Operario | Registra animal con código único, nombre, sexo, fecha nacimiento, raza, color, peso, bodega, vínculos genealógicos. |
| CU-A4 | Editar animal | Admin / Veterinario / Operario | Modifica datos. Registrado en bitácora. |
| CU-A5 | Dar de baja animal | Admin | Cambia status a `baja`, `vendido` o `muerto`. No recibe nuevos registros. |
| CU-A6 | Ver árbol genealógico | Todos | Visualiza padres, hermanos y crías. |
| CU-A7 | Subir foto del animal | Admin / Veterinario | Adjunta imagen al animal (almacenada en Blob). |

### Módulo 4 — Bodegas

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-A8 | Crear bodega | Admin | Define bodega con nombre, tipo, superficie y capacidad. |
| CU-A9 | Asignar animal a bodega | Admin / Veterinario | Mueve animal validando que no se exceda capacidad. |

### Módulo 5 — Producción de leche

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-02 | Registrar producción | Operario / Admin | Registra litros por animal, turno y fecha. |
| CU-04 | Generar reporte comparativo de producción | Admin | Compara dos períodos con totales, promedios y gráfica. |
| CU-A10 | Ver producción por animal | Todos | Consulta historial de una hembra. |

### Módulo 6 — Vacunación

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-03 | Registrar vacunación individual o masiva | Veterinario / Admin | Registra vacuna en uno o varios animales. Cálculo automático de próxima dosis. |
| CU-A11 | Recibir alerta de próxima vacuna | Sistema | Dashboard muestra alertas cuando faltan ≤7 días para próxima dosis. |
| CU-A12 | Generar reporte sanitario para ICA | Veterinario / Admin | Exporta PDF con historial de vacunación. |
| CU-A13 | Subir certificado de vacunación | Veterinario / Admin | Adjunta PDF del certificado al registro (en Blob). |

### Módulo 7 — Estado reproductivo

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-A14 | Registrar evento reproductivo | Veterinario / Admin | Registra celo, preñez, parto, lactancia, vacía. |
| CU-A15 | Ver historial reproductivo | Todos | Consulta historial de una hembra. |

### Módulo 8 — Reportes

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-A16 | Generar reporte de inventario valorado | Admin | Lista animales con valor estimado para declaración de renta. |
| CU-A17 | Exportar reportes | Todos según permisos | Descarga reporte en PDF o Excel. |

### Módulo 9 — Administración

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-A18 | Crear usuario | Admin | Crea usuario con contraseña temporal. |
| CU-A19 | Suspender usuario | Admin | Suspende cuenta para impedir acceso. |
| CU-A20 | Ver bitácora | Admin | Consulta auditoría completa desde Blob. |

---

## 6. Requerimientos funcionales

### Bootstrap del sistema

| ID | Requerimiento |
|---|---|
| RF-B1 | El sistema debe poder ejecutarse sin Supabase configurado, sirviendo los datos del seed local de `data/` para navegación inicial. |
| RF-B2 | El sistema debe ofrecer una página `/admin/db-setup` accesible solo al admin para diagnóstico, aplicación de migrations y carga del seed inicial. |
| RF-B3 | Las migrations deben estar versionadas en `supabase/migrations/` y aplicarse en orden numérico. |
| RF-B4 | Una vez aplicadas las migrations y cargado el seed, el sistema debe persistir todas las operaciones en Supabase. |

### Funcionalidades del dominio

| ID | Requerimiento |
|---|---|
| RF-01 | El sistema debe permitir registrar cada animal con código único, nombre, sexo, fecha de nacimiento, raza, color, peso, bodega y estado. |
| RF-02 | El sistema debe calcular automáticamente la edad del animal a partir de su fecha de nacimiento. |
| RF-03 | El sistema debe permitir crear bodegas con nombre, tipo, superficie y capacidad máxima, y asignar animales a ellas. |
| RF-04 | El sistema debe permitir registrar litros producidos por animal, turno (mañana/tarde) y fecha. |
| RF-05 | El sistema debe generar reportes de producción diaria, por animal y comparativos entre períodos. |
| RF-06 | El sistema debe registrar vacunas y calcular automáticamente la fecha de próxima dosis, generando alertas con 7 días de anticipación. |
| RF-07 | El sistema debe registrar y consultar el estado reproductivo de cada hembra. |
| RF-08 | El sistema debe mantener y mostrar el árbol genealógico vinculando madre, padre y crías. |
| RF-09 | El sistema debe permitir exportar todos los reportes en PDF y Excel. |
| RF-10 | El sistema debe generar un inventario valorado del hato con precios estimados por cabeza. |
| RF-11 | El sistema debe generar un informe de vacunación exportable para presentar ante el ICA. |
| RF-12 | El sistema debe permitir al administrador gestionar cuentas de usuario asignando roles. |

### Auditoría y archivos

| ID | Requerimiento |
|---|---|
| RF-A1 | Toda operación de escritura sobre animales, bodegas, producción, vacunaciones y eventos reproductivos debe quedar registrada en auditoría. |
| RF-A2 | La auditoría se persiste en Vercel Blob, particionada por mes (`audit/<YYYYMM>.json`). |
| RF-A3 | El admin puede consultar la auditoría desde `/admin/audit` con filtros por mes, usuario y entidad. |
| RF-A4 | Las fotos de animales se almacenan en Vercel Blob en path `cattle/<id>/photo.<ext>`. La tabla `cattle` guarda solo el path. |
| RF-A5 | Los certificados de vacunación se almacenan en Vercel Blob en path `vaccinations/<id>/<filename>.pdf`. La tabla `vaccinations` guarda solo el path. |

---

## 7. Reglas de negocio

| ID | Regla | Implementación técnica |
|---|---|---|
| RN-01 | Cada animal debe tener un código único e irrepetible. | UNIQUE en `cattle.code`. Validación con Zod en el servidor. |
| RN-02 | Solo las hembras pueden tener registros de estado reproductivo y de producción de leche. | Validación en `dataService` antes de insertar. |
| RN-03 | Un animal dado de baja no puede recibir nuevos registros. | Verificar `cattle.status = 'activo'` antes de cualquier escritura asociada. |
| RN-04 | La fecha de nacimiento de una cría no puede ser anterior a la de su madre. | Validación en `dataService` cuando se asigna `dam_id`. |
| RN-05 | Ninguna bodega puede superar su capacidad máxima. | Antes de asignar animal, contar activos en bodega y comparar con `max_capacity`. |
| RN-06 | El valor de producción no puede ser negativo ni superar 60 litros por ordeño. | CHECK en Postgres + validación Zod. |
| RN-07 | Un animal no puede estar asignado a más de una bodega al mismo tiempo. | `cattle.shed_id` es FK simple. |
| RN-08 | Toda modificación a un animal debe quedar registrada con usuario, fecha y hora. | `dataService.recordAudit()` automáticamente en cada update. La auditoría vive en Vercel Blob, no en Postgres. |
| RN-09 | El árbol genealógico no puede generar ciclos. | Validación recursiva en `genealogyService` antes de asignar `dam_id` o `sire_id`. |
| RN-10 | Para generar comparativo, cada período debe abarcar mínimo 7 días. | Validación Zod en endpoint del reporte. |
| RN-11 | No se permite registrar dos producciones del mismo animal, fecha y turno. | UNIQUE compuesto en `milk_production(cattle_id, production_date, shift)`. |
| RN-12 | Si la producción cae más del 20% respecto al promedio de los últimos 7 días, se genera alerta para el Administrador. | Cálculo en `dataService` al insertar; insertar registro en `production_alerts`. |
| RN-13 | El sistema arranca en modo seed (lectura desde `data/`) hasta que el admin ejecute el bootstrap. | Flag `getSystemMode()` en `dataService`. |
| RN-14 | Solo hembras pueden recibir vacuna de Brucelosis (regla del ICA). | Tabla `vaccine_types` con campo `allowed_sex` nullable; validación en `dataService` al registrar vacunación. |

---

## 8. Stack tecnológico

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.x | Rutas, server components, API routes |
| Lenguaje | TypeScript | 5.x | Tipado estático |
| UI | React | 19.x | Componentes del cliente |
| Estilos | Tailwind CSS | 4.x | Utilidades, responsive |
| Animaciones | Framer Motion | 12.x | Transiciones |
| Validación | Zod | 4.x | Validación servidor y cliente |
| Autenticación | JWT (jose) + bcryptjs | — | Sesiones HttpOnly |
| Base de datos | Supabase Postgres | — | Datos estructurados |
| Cliente DB (migrations) | `pg` (node-postgres) | 8.x | SQL crudo desde la API de bootstrap |
| Cliente DB (queries) | `@supabase/supabase-js` | 2.x | Queries del día a día |
| Auditoría y archivos | `@vercel/blob` | — | Logs y archivos binarios |
| Gráficas | Recharts | 2.x | Comparativos de producción |
| Export PDF | jsPDF + jspdf-autotable | 2.x | Reportes oficiales |
| Export Excel | xlsx (SheetJS) | 0.20.x | Reportes .xlsx |
| Iconos | Lucide React | — | Iconografía |
| Deploy | Vercel | — | Hosting serverless |

### Variables de entorno requeridas

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=                  # Conexión Postgres directa para migrations con pg

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Auth
JWT_SECRET=                    # Mínimo 32 caracteres aleatorios

# Bootstrap
ADMIN_BOOTSTRAP_SECRET=        # Secreto para autorizar /api/system/bootstrap
```

> Las variables `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `JWT_SECRET` y `ADMIN_BOOTSTRAP_SECRET` solo se usan en código del servidor. Nunca aparecen en componentes con `'use client'`.

---

## 9. Arquitectura de persistencia

SIG Bovino usa **tres destinos de persistencia** con responsabilidades claramente separadas. Esto permite optimizar cada caso de uso y mantenerse dentro de los límites del free tier.

### 9.1 Destinos de persistencia

| Destino | Qué guarda | Por qué |
|---|---|---|
| **Supabase Postgres** | Datos estructurados de dominio: usuarios, bodegas, animales, producción, vacunaciones, eventos reproductivos, alertas. | Necesita queries con JOIN, GROUP BY, agregaciones temporales, validación de unicidad. SQL aporta valor central al sistema. |
| **Vercel Blob** | (1) Auditoría completa append-only particionada por mes. (2) Fotos de animales. (3) Certificados de vacunación. | Append-only y datos pesados que saturarían Postgres. Blob es ideal para logs y binarios. Los reportes generados (PDF/Excel) se entregan al vuelo y NO se persisten. |
| **`data/` en el repo** | Solo seed inicial: `config.json`, `seed.json` con admin por defecto y catálogo inicial de vacunas. | Read-only en producción. Se usa para arrancar antes del bootstrap. |

### 9.2 Reglas de oro

1. **Postgres es la fuente de verdad para datos de dominio.** Si un dato de animal/producción/vacunación/usuario no está en Postgres, no existe.
2. **Blob es la fuente de verdad para auditoría y archivos binarios.** No se duplica en Postgres.
3. **`data/` es solo semilla.** Se lee una vez en el bootstrap inicial. Después no se lee nunca más en producción. Nunca se escribe en runtime.
4. **`dataService.ts` es el ÚNICO punto de acceso a datos** desde cualquier capa superior (API Routes, services). Nadie importa `supabase.ts`, `blobAudit.ts` ni `blobFiles.ts` directamente.
5. **CERO caché en memoria** para datos transaccionales. Cada lectura va directo a Postgres o a Blob según corresponda.
6. **CERO CDN cache** en `/api/:path*`. Headers `no-store` desde `next.config.ts`.
7. **CERO browser cache** para respuestas con datos del usuario. `withAuth` agrega `no-store` a cada respuesta.
8. **`get()` del SDK de Blob, nunca `fetch(url)`** — los blobs privados fallan silenciosamente con `fetch`.
9. **Token de Blob accedido con función lazy** (`getBlobToken()`), nunca constante de módulo. Los tokens no existen en build time.
10. **Read-modify-write sobre el mismo archivo de auditoría** se serializa con `withFileLock()` para evitar race conditions.

---

## 10. Bootstrap y migrations

El sistema arranca con un `data/seed.json` que contiene el admin por defecto y el catálogo inicial de vacunas. La primera vez que el admin entra, ejecuta el bootstrap desde `/admin/db-setup` y a partir de ahí todo opera contra Supabase.

### 10.1 Estructura del directorio `data/` (solo semilla)

```
data/
  config.json           ← { "version": "1.0", "system_name": "SIG Bovino" }
  seed.json             ← {
                            "users": [{ email, password_hash, role: "admin", ... }],
                            "vaccine_types": [
                              { name: "Fiebre Aftosa", periodicity_days: 180, is_mandatory: true, allowed_sex: null },
                              { name: "Brucelosis", periodicity_days: 365, is_mandatory: true, allowed_sex: "hembra" },
                              ...
                            ]
                          }
  README.md             ← Instrucciones para el estudiante
```

> **Importante:** El `password_hash` de `seed.json` se genera **manualmente con un script o en build time**, nunca en runtime. El hash de `admin123` con bcrypt 10 salt rounds queda hardcodeado en el seed.

### 10.2 Estructura de `supabase/migrations/`

```
supabase/
  migrations/
    0001_init_users.sql              ← Fase 1: tabla users + tabla _migrations
    0002_init_sheds.sql              ← Fase 3: tabla sheds
    0003_init_cattle.sql             ← Fase 4: tabla cattle con FKs y self-ref
    0004_init_milk_production.sql    ← Fase 5: tablas milk_production y production_alerts
    0005_init_vaccinations.sql       ← Fase 6: tablas vaccine_types y vaccinations
    0006_init_reproductive.sql       ← Fase 7: tabla reproductive_events
```

Cada migration es un archivo SQL idempotente cuando es razonable (`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`).

### 10.3 Tabla de control `_migrations`

Se crea en la primera migration y registra qué se ha aplicado:

```sql
CREATE TABLE IF NOT EXISTS _migrations (
  id          SERIAL       PRIMARY KEY,
  filename    VARCHAR(255) UNIQUE NOT NULL,
  applied_at  TIMESTAMPTZ  DEFAULT NOW()
);
```

### 10.4 API Route de bootstrap

`POST /api/system/bootstrap` — autenticada con sesión admin **más** `ADMIN_BOOTSTRAP_SECRET` enviado en header. Hace:

1. Conecta a Postgres con `pg` y `DATABASE_URL`.
2. Crea la tabla `_migrations` si no existe.
3. Lista archivos de `supabase/migrations/`.
4. Para cada archivo no presente en `_migrations`, ejecuta el SQL y registra el archivo.
5. Si es la primera vez, carga el seed: lee `data/seed.json` e inserta usuario admin + catálogo de vacunas (saltando duplicados por email/name).
6. Retorna reporte: migrations aplicadas, registros insertados, errores.

### 10.5 API Route de diagnóstico

`GET /api/system/diagnose` — autenticada con sesión admin. Retorna:

- ¿Hay conexión a Supabase? (ping con `SELECT 1`)
- ¿Hay conexión a Blob? (intentar `list()` con prefix vacío y limit 1)
- Migrations aplicadas vs pendientes
- Conteo de registros por tabla principal (`users`, `sheds`, `cattle`, `milk_production`, `vaccinations`, `reproductive_events`)
- Tamaño aproximado del último mes de auditoría en Blob
- Cantidad aproximada de archivos en `cattle/` y `vaccinations/` en Blob

### 10.6 Página `/admin/db-setup`

UI con dos tabs:

**Tab 1 — Diagnóstico**: estado de Supabase, Blob, migrations, conteos. Botón "Re-diagnosticar".

**Tab 2 — Bootstrap & Migrations**: lista las migrations pendientes y un botón "Ejecutar bootstrap" con confirmación previa.

> Esta página es accesible **solo cuando el usuario tiene `role='admin'`**. En modo seed (Supabase aún no inicializado), el admin del `data/seed.json` puede iniciar sesión y entrar — el `dataService` enruta el login al seed.

---

## 11. Capa de datos unificada

`lib/dataService.ts` es el **único punto de acceso a datos** desde el resto de la aplicación. Encapsula tres backends y decide cuál usar según el estado del sistema y el tipo de operación.

### 11.1 Modos de operación

| Modo | Cuándo aplica | Lecturas | Escrituras |
|---|---|---|---|
| **`seed`** | Sistema sin migrations aplicadas | `data/*.json` (read-only) | Bloqueadas — solo permite ver y hacer login con admin para ejecutar bootstrap. |
| **`live`** | Migrations aplicadas, Supabase listo | Postgres (vía `supabase-js`) | Postgres + auditoría a Blob + archivos a Blob |

El modo se determina al inicio de cada API request con un flag cacheado en memoria por instancia (refrescado vía `SELECT 1 FROM _migrations LIMIT 1`). Esto es una excepción puntual a la regla de "cero caché", justificada porque el modo cambia exactamente una vez en la vida del sistema.

### 11.2 Estructura interna

```
lib/
  dataService.ts          ← ÚNICO punto de acceso. API pública tipada.
  supabase.ts             ← Cliente Supabase (server). Solo lo importa dataService.
  blobAudit.ts            ← Cliente Blob para auditoría. Solo lo importa dataService.
  blobFiles.ts            ← Cliente Blob para archivos binarios. Solo lo importa dataService.
  pgMigrate.ts            ← Cliente pg para migrations. Solo lo importa la API de bootstrap.
  seedReader.ts           ← Lector de data/*.json. Solo lo importa dataService en modo seed.
```

### 11.3 API pública del `dataService`

```typescript
// Auth y usuarios
export async function getUserByEmail(email: string): Promise<User | null>
export async function getUserById(id: string): Promise<User | null>
export async function createUser(data: CreateUserRequest): Promise<User>
export async function updateUser(id: string, data: UpdateUserRequest): Promise<User>
export async function listUsers(): Promise<User[]>

// Bodegas
export async function getSheds(): Promise<ShedWithCount[]>
export async function getShedById(id: string): Promise<Shed | null>
export async function createShed(data: CreateShedRequest): Promise<Shed>
export async function updateShed(id: string, data: UpdateShedRequest): Promise<Shed>

// Animales
export async function getCattle(filters?: CattleFilters): Promise<Cattle[]>
export async function getCattleById(id: string): Promise<CattleWithRelations | null>
export async function createCattle(userId: string, data: CreateCattleRequest): Promise<Cattle>
export async function updateCattle(id: string, userId: string, data: UpdateCattleRequest): Promise<Cattle>
export async function changeCattleStatus(id: string, userId: string, newStatus: string, reason: string): Promise<Cattle>
export async function getGenealogyTree(id: string): Promise<GenealogyTree>
export async function uploadCattlePhoto(id: string, file: Buffer, ext: string): Promise<string>  // retorna path en Blob

// Producción
export async function getMilkProduction(filters?: MilkFilters): Promise<MilkProduction[]>
export async function registerMilkProduction(userId: string, data: CreateMilkRequest): Promise<MilkProduction>
export async function getCompareProductionReport(periodA: DateRange, periodB: DateRange): Promise<ProductionCompareReport>

// Vacunación
export async function getVaccineTypes(): Promise<VaccineType[]>
export async function getVaccinations(filters?: VaccinationFilters): Promise<Vaccination[]>
export async function registerVaccination(userId: string, data: CreateVaccinationRequest): Promise<Vaccination>
export async function registerMassVaccination(userId: string, data: MassVaccinationRequest): Promise<MassVaccinationResult>
export async function uploadVaccinationCertificate(id: string, file: Buffer, filename: string): Promise<string>
export async function getUpcomingVaccinationAlerts(): Promise<VaccinationAlert[]>

// Reproducción
export async function getReproductiveEvents(cattleId: string): Promise<ReproductiveEvent[]>
export async function registerReproductiveEvent(userId: string, data: CreateReproductiveEventRequest): Promise<ReproductiveEvent>
export async function getCurrentReproductiveStatus(cattleId: string): Promise<string | null>

// Auditoría (siempre va a Blob)
export async function recordAudit(entry: AuditEntry): Promise<void>
export async function readAuditMonth(yyyymm: string): Promise<AuditEntry[]>

// Sistema
export async function getSystemMode(): Promise<'seed' | 'live'>
```

### 11.4 Reglas para implementar `dataService`

1. **Cada función chequea `getSystemMode()` antes de leer/escribir.** En modo `seed` solo permite las operaciones mínimas para login admin y bootstrap.
2. **Cada operación de escritura sobre dominio llama a `recordAudit()` antes de retornar.** La auditoría falla en silencio (try/catch) — si Blob no responde, no rompe la operación principal.
3. **Las queries usan el cliente de Supabase con `SUPABASE_SERVICE_ROLE_KEY`** y siempre filtran por las restricciones de rol que correspondan.
4. **No hay caché en memoria de los resultados** — cada llamada va a Postgres.
5. **Batch reads con `Promise.all()`** cuando el endpoint necesite varios datasets (típico del dashboard y la ficha del animal).
6. **`uploadCattlePhoto` y `uploadVaccinationCertificate`** suben directo a Blob via `blobFiles.ts`, validan el tipo MIME y el tamaño máximo (5 MB para fotos, 5 MB para PDFs), y retornan el `path` que se persiste en la columna correspondiente de Postgres.

### 11.5 Reglas para `next.config.ts`

```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        { key: 'Pragma', value: 'no-cache' },
      ],
    },
  ];
}
```

---

## 12. Modelo de datos — Supabase Postgres

### Diagrama de entidades

```
┌──────────┐
│  users   │
└──────────┘

┌──────────┐       ┌──────────┐       ┌──────────────────┐
│  sheds   │──<────│ cattle   │──<────│ milk_production  │
└──────────┘       │          │       └──────────────────┘
                   │          │       ┌──────────────────┐
                   │          │──<────│ vaccinations     │──>── vaccine_types
                   │          │       └──────────────────┘
                   │          │       ┌──────────────────┐
                   │          │──<────│reproductive_     │
                   │          │       │      events      │
                   │ (self    │       └──────────────────┘
                   │  ref)    │
                   └────┬─────┘
                        │ dam_id, sire_id
                        ▼
                   (otro cattle)

┌────────────────┐
│ vaccine_types  │ (catálogo independiente, cargado en seed)
└────────────────┘

┌────────────────────┐
│ production_alerts  │ (RN-12)
└────────────────────┘
```

> **No existe tabla `cattle_audit` en Postgres.** La auditoría vive en Vercel Blob particionada por mes.
> **No se almacenan binarios en Postgres.** Las fotos y certificados van a Blob; las tablas guardan solo el path.

### Migration `0001_init_users.sql`

```sql
CREATE TABLE IF NOT EXISTS users (
  id                    UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name                  VARCHAR(100) NOT NULL,
  email                 VARCHAR(255) UNIQUE NOT NULL,
  password_hash         TEXT         NOT NULL,
  role                  VARCHAR(15)  NOT NULL
                        CHECK (role IN ('admin', 'veterinario', 'operario')),
  is_active             BOOLEAN      DEFAULT true,
  must_change_password  BOOLEAN      DEFAULT false,
  last_login_at         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS _migrations (
  id          SERIAL       PRIMARY KEY,
  filename    VARCHAR(255) UNIQUE NOT NULL,
  applied_at  TIMESTAMPTZ  DEFAULT NOW()
);
```

### Migration `0002_init_sheds.sql`

```sql
CREATE TABLE IF NOT EXISTS sheds (
  id           UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  type         VARCHAR(30)   NOT NULL
               CHECK (type IN ('pastizal', 'establo', 'corral', 'enfermería', 'parto', 'otro')),
  surface_m2   DECIMAL(10,2),
  max_capacity INTEGER       NOT NULL CHECK (max_capacity > 0),
  is_active    BOOLEAN       DEFAULT true,
  created_at   TIMESTAMPTZ   DEFAULT NOW()
);
```

### Migration `0003_init_cattle.sql`

```sql
CREATE TABLE IF NOT EXISTS cattle (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  code            VARCHAR(30)   UNIQUE NOT NULL,
  name            VARCHAR(100),
  sex             VARCHAR(10)   NOT NULL CHECK (sex IN ('macho', 'hembra')),
  birth_date      DATE          NOT NULL,
  breed           VARCHAR(80),
  color           VARCHAR(80),
  weight_kg       DECIMAL(7,2),
  shed_id         UUID          REFERENCES sheds(id) ON DELETE SET NULL,
  status          VARCHAR(15)   DEFAULT 'activo'
                  CHECK (status IN ('activo', 'baja', 'vendido', 'muerto')),
  status_reason   TEXT,
  status_date     DATE,
  dam_id          UUID          REFERENCES cattle(id) ON DELETE SET NULL,  -- madre
  sire_id         UUID          REFERENCES cattle(id) ON DELETE SET NULL,  -- padre
  estimated_value DECIMAL(12,2),
  photo_path      TEXT,         -- path en Blob (cattle/<id>/photo.<ext>)
  notes           TEXT,
  created_by      UUID          REFERENCES users(id) ON DELETE SET NULL,
  updated_by      UUID          REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cattle_status ON cattle(status);
CREATE INDEX IF NOT EXISTS idx_cattle_shed ON cattle(shed_id);
CREATE INDEX IF NOT EXISTS idx_cattle_dam ON cattle(dam_id);
CREATE INDEX IF NOT EXISTS idx_cattle_sire ON cattle(sire_id);
CREATE INDEX IF NOT EXISTS idx_cattle_code ON cattle(code);
```

### Migration `0004_init_milk_production.sql`

```sql
CREATE TABLE IF NOT EXISTS milk_production (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  cattle_id       UUID          NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
  production_date DATE          NOT NULL,
  shift           VARCHAR(10)   NOT NULL CHECK (shift IN ('mañana', 'tarde')),
  liters          DECIMAL(5,2)  NOT NULL CHECK (liters >= 0 AND liters <= 60),
  recorded_by     UUID          REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   DEFAULT NOW(),
  UNIQUE (cattle_id, production_date, shift)
);

CREATE INDEX IF NOT EXISTS idx_milk_cattle_date ON milk_production(cattle_id, production_date DESC);

CREATE TABLE IF NOT EXISTS production_alerts (
  id              UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  cattle_id       UUID         NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
  production_id   UUID         REFERENCES milk_production(id) ON DELETE CASCADE,
  alert_type      VARCHAR(30)  DEFAULT 'production_drop',
  current_liters  DECIMAL(5,2),
  average_liters  DECIMAL(5,2),
  drop_percentage DECIMAL(5,2),
  is_resolved     BOOLEAN      DEFAULT false,
  created_at      TIMESTAMPTZ  DEFAULT NOW()
);
```

### Migration `0005_init_vaccinations.sql`

```sql
CREATE TABLE IF NOT EXISTS vaccine_types (
  id               UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name             VARCHAR(100) NOT NULL UNIQUE,
  description      TEXT,
  periodicity_days INTEGER      NOT NULL,
  is_mandatory     BOOLEAN      DEFAULT false,
  allowed_sex      VARCHAR(10)  CHECK (allowed_sex IS NULL OR allowed_sex IN ('macho','hembra')),
  is_active        BOOLEAN      DEFAULT true,
  created_at       TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vaccinations (
  id               UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  cattle_id        UUID         NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
  vaccine_type_id  UUID         NOT NULL REFERENCES vaccine_types(id),
  vaccine_name     VARCHAR(150),
  applied_date     DATE         NOT NULL,
  dose             VARCHAR(30),
  next_dose_date   DATE,
  applied_by       UUID         REFERENCES users(id) ON DELETE SET NULL,
  certificate_path TEXT,        -- path en Blob (vaccinations/<id>/<filename>.pdf)
  notes            TEXT,
  created_at       TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vacc_cattle ON vaccinations(cattle_id);
CREATE INDEX IF NOT EXISTS idx_vacc_next_dose ON vaccinations(next_dose_date);
```

> El catálogo inicial de `vaccine_types` se carga en el bootstrap desde `data/seed.json`, no en la migration. Esto permite ajustar el catálogo sin tocar migrations versionadas.

### Migration `0006_init_reproductive.sql`

```sql
CREATE TABLE IF NOT EXISTS reproductive_events (
  id             UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  cattle_id      UUID         NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
  event_type     VARCHAR(15)  NOT NULL
                 CHECK (event_type IN ('celo', 'preñez', 'parto', 'lactancia', 'vacía')),
  event_date     DATE         NOT NULL,
  expected_birth DATE,
  notes          TEXT,
  registered_by  UUID         REFERENCES users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repro_cattle_date ON reproductive_events(cattle_id, event_date DESC);
```

### Notas sobre RLS

En esta versión del proyecto **no se activa RLS en Supabase**. Las API Routes usan `SUPABASE_SERVICE_ROLE_KEY` que bypasea RLS. La seguridad real está en el código del `dataService` y en `withRole` que valida el rol del JWT antes de cualquier operación. Mantener RLS desactivado simplifica el setup y el aislamiento queda 100% en código del servidor.

---

## 13. Auditoría y archivos en Vercel Blob

### 13.1 Auditoría — particionada por mes

**Path:** `audit/<YYYYMM>.json`
**Formato:** array JSON append-only.

**Estructura de cada entrada:**

```typescript
type AuditEntry = {
  id: string;             // UUID generado por dataService
  timestamp: string;      // ISO 8601
  user_id: string;        // Quien hizo la acción
  user_email: string;     // Snapshot del email
  user_role: 'admin' | 'veterinario' | 'operario';
  action: 'create' | 'update' | 'delete' | 'status_change' | 'login' | 'logout' | 'bootstrap' | 'mass_vaccination';
  entity: 'user' | 'shed' | 'cattle' | 'milk_production' | 'vaccination' | 'reproductive_event' | 'system';
  entity_id?: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
  metadata?: Record<string, unknown>;
};
```

### 13.2 Implementación de `lib/blobAudit.ts`

```typescript
// Solo lo importa dataService

import { put, get } from '@vercel/blob';

const _fileLocks = new Map<string, Promise<unknown>>();

async function withFileLock<T>(filename: string, fn: () => Promise<T>): Promise<T> {
  const prev = _fileLocks.get(filename) ?? Promise.resolve();
  let resolve!: () => void;
  const lock = new Promise<void>((r) => { resolve = r; });
  _fileLocks.set(filename, lock);
  try {
    await prev;
    return await fn();
  } finally {
    resolve();
    if (_fileLocks.get(filename) === lock) _fileLocks.delete(filename);
  }
}

// Lazy, NUNCA constante de módulo
function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export async function appendAudit(entry: AuditEntry): Promise<void> {
  const yyyymm = entry.timestamp.slice(0, 7).replace('-', '');
  const filename = `audit/${yyyymm}.json`;

  await withFileLock(filename, async () => {
    const existing = await readAuditFile(filename);
    existing.push(entry);
    await writeAuditFile(filename, existing);
  });
}

async function readAuditFile(filename: string): Promise<AuditEntry[]> {
  const token = getBlobToken();
  if (!token) return [];
  try {
    // ⚠️ get() del SDK, NUNCA fetch(url) — los blobs privados fallan silenciosamente con fetch
    const result = await get(filename, { token, access: 'private' });
    if (!result || result.statusCode !== 200) return [];
    const text = await new Response(result.stream).text();
    return JSON.parse(text);
  } catch {
    return [];
  }
}

async function writeAuditFile(filename: string, entries: AuditEntry[]): Promise<void> {
  const token = getBlobToken();
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN not configured');
  await put(filename, JSON.stringify(entries, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
}

export async function readAuditMonth(yyyymm: string): Promise<AuditEntry[]> {
  return readAuditFile(`audit/${yyyymm}.json`);
}
```

### 13.3 Implementación de `lib/blobFiles.ts`

```typescript
// Solo lo importa dataService

import { put, get, del } from '@vercel/blob';

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export async function uploadFile(path: string, content: Buffer | string, contentType?: string): Promise<string> {
  const token = getBlobToken();
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN not configured');
  const result = await put(path, content, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
    token,
  });
  return result.pathname; // se persiste en Postgres
}

export async function readFile(path: string): Promise<{ stream: ReadableStream; contentType: string } | null> {
  const token = getBlobToken();
  if (!token) return null;
  try {
    const result = await get(path, { token, access: 'private' });
    if (!result || result.statusCode !== 200) return null;
    return { stream: result.stream, contentType: result.contentType ?? 'application/octet-stream' };
  } catch {
    return null;
  }
}

export async function deleteFile(path: string): Promise<void> {
  const token = getBlobToken();
  if (!token) return;
  try {
    await del(path, { token });
  } catch {
    // silencioso — el archivo ya no existe
  }
}
```

### 13.4 Limitaciones documentadas del lock

`withFileLock` solo serializa escrituras dentro de la misma instancia serverless. Vercel puede crear múltiples instancias bajo carga, y dos escrituras en instancias distintas al mismo archivo de auditoría pueden producir una carrera. Para SIG Bovino (uso por una finca con pocos usuarios concurrentes), el riesgo es bajo. Documentado como tradeoff conocido.

### 13.5 Estimación de uso en Blob

| Tipo de dato | Estimación por finca (100 animales, 1 año) |
|---|---|
| Auditoría (~30 escrituras/usuario/día × 5 usuarios × 365 días × 400 bytes) | ~22 MB |
| Fotos de animales (300 KB c/u, comprimidas, 100 fotos) | ~30 MB |
| Certificados de vacunación (200 KB c/u, ~600 al año) | ~120 MB |
| **Total Blob** | **~170 MB** |

> Plan gratuito de Vercel Blob: 1 GB. Sin presión incluso al cabo de varios años.

### 13.6 Servir archivos al cliente

Los archivos de Blob son privados. Para mostrar la foto del animal o descargar un certificado, el frontend hace `GET /api/files?path=cattle/abc/photo.jpg`. El endpoint:

1. Valida sesión con `withAuth`.
2. Verifica que el path esté autorizado (foto del animal → todos los roles pueden verla; certificado → solo admin/veterinario).
3. Llama a `dataService.getFile(path)`.
4. Streamea el contenido al cliente con el `Content-Type` correcto.

Nunca se expone el path de Blob al cliente directamente.

---

## 14. Arquitectura de rutas

### Estructura de carpetas

```
app/
  layout.tsx
  page.tsx                       ← Redirige según sesión y rol
  login/page.tsx                 ← Primera cara del sistema
  dashboard/page.tsx             ← Panel principal por rol
  cattle/
    page.tsx                     ← Lista y búsqueda
    new/page.tsx                 ← Crear animal
    [id]/
      page.tsx                   ← Ficha con tabs
      edit/page.tsx
      genealogy/page.tsx
  sheds/
    page.tsx
    new/page.tsx
    [id]/page.tsx
  milk/
    page.tsx                     ← Captura optimizada para campo
    history/page.tsx
  vaccinations/
    page.tsx                     ← Alertas y historial
    new/page.tsx                 ← Individual o masiva
  reproduction/page.tsx
  reports/
    page.tsx                     ← Centro de reportes
    production/page.tsx
    sanitary/page.tsx
    inventory/page.tsx
  admin/
    db-setup/page.tsx            ← Bootstrap (solo admin)
    users/page.tsx               ← Gestión de usuarios (solo admin)
    audit/page.tsx               ← Bitácora desde Blob (solo admin)
  api/
    system/
      bootstrap/route.ts
      diagnose/route.ts
      mode/route.ts
    auth/
      login/route.ts
      logout/route.ts
      me/route.ts
      change-password/route.ts
    cattle/
      route.ts                   ← GET | POST
      [id]/route.ts              ← GET | PUT | DELETE
      [id]/genealogy/route.ts
      [id]/photo/route.ts        ← POST (subida)
    sheds/
      route.ts
      [id]/route.ts
    milk/
      route.ts
      summary/route.ts
      compare/route.ts
    vaccinations/
      route.ts                   ← GET | POST (individual o masiva)
      alerts/route.ts
      types/route.ts
      [id]/certificate/route.ts  ← POST (subida)
    reproduction/route.ts
    reports/
      production/route.ts
      sanitary/route.ts
      inventory/route.ts
    files/route.ts               ← GET (descarga autorizada de archivos de Blob)
    users/
      route.ts
      [id]/route.ts
    audit/route.ts
    dashboard/route.ts

components/
  ui/
  layout/
  cattle/                        ← CattleCard, CattleForm, CattleTable, GenealogyTree
  milk/                          ← MilkForm, MilkChart, ProductionDropAlert
  vaccinations/                  ← VaccinationForm, VaccinationAlerts, MassVaccinationForm
  reproduction/                  ← ReproductiveTimeline, ReproductiveForm
  reports/                       ← ReportFilters, ReportPreview
  admin/                         ← DiagnosticPanel, BootstrapPanel, AuditViewer, SeedModeBanner

lib/
  types.ts
  schemas.ts
  auth.ts
  withAuth.ts
  withRole.ts
  dataService.ts                 ← ÚNICO punto de acceso
  supabase.ts                    ← Solo lo importa dataService
  blobAudit.ts                   ← Solo lo importa dataService
  blobFiles.ts                   ← Solo lo importa dataService
  pgMigrate.ts                   ← Solo lo importa /api/system/bootstrap
  seedReader.ts                  ← Solo lo importa dataService en modo seed
  genealogyService.ts            ← Lógica anti-ciclos y construcción del árbol
  dateUtils.ts

supabase/
  migrations/
    0001_init_users.sql
    0002_init_sheds.sql
    0003_init_cattle.sql
    0004_init_milk_production.sql
    0005_init_vaccinations.sql
    0006_init_reproductive.sql

data/
  config.json
  seed.json
  README.md

doc/
  PLAN_SIGBOVINO.md
  PROMPTS_SIGBOVINO.md
  ESTADO_EJECUCION_SIGBOVINO.md
```

### Patrón de acceso a datos

```
[Componente React (client)]
         ↓  fetch('/api/...')
[API Route]
         ↓  withAuth + withRole → valida JWT y rol
         ↓  llama
[lib/dataService.ts]
         ├─→ Postgres (datos de dominio)        vía supabase.ts
         ├─→ Vercel Blob (auditoría)            vía blobAudit.ts
         └─→ Vercel Blob (fotos, certificados)  vía blobFiles.ts
```

> El frontend nunca importa servicios. Todo pasa por API Routes.
> Las API Routes nunca importan `supabase`, `blobAudit` ni `blobFiles` directamente. Todo pasa por `dataService`.

---

## 15. Requerimientos no funcionales

### Rendimiento

| ID | Requerimiento |
|---|---|
| RNF-01 | El listado de animales debe cargar en menos de 3 segundos para hatos de hasta 500 cabezas. |
| RNF-02 | El registro de producción debe completarse en menos de 1 segundo por animal. |
| RNF-03 | La generación de reportes en PDF/Excel no debe tardar más de 8 segundos. |
| RNF-04 | El bootstrap completo (migrations + seed) debe completarse en menos de 30 segundos. |

### Usabilidad

| ID | Requerimiento |
|---|---|
| RNF-05 | El operario debe poder registrar la producción de 50 animales en menos de 10 minutos. |
| RNF-06 | La interfaz debe ser totalmente funcional en celulares (uso en campo). |
| RNF-07 | Los formularios deben mantener los datos ingresados si la validación falla. |

### Seguridad

| ID | Requerimiento |
|---|---|
| RNF-08 | Las contraseñas deben hashearse con bcrypt antes de guardarse. |
| RNF-09 | Las sesiones deben gestionarse con JWT en cookie HttpOnly, nunca en localStorage. |
| RNF-10 | Cada operación de escritura debe validar el rol del usuario antes de ejecutarse. |
| RNF-11 | Toda modificación a un animal debe registrarse en auditoría en Blob (RN-08). |
| RNF-12 | El endpoint de bootstrap requiere sesión admin **y** verificación de `ADMIN_BOOTSTRAP_SECRET`. |
| RNF-13 | Los archivos en Blob (fotos, certificados) son privados. Solo se sirven al cliente vía `/api/files` con autenticación y autorización por rol. |

### Compatibilidad

| ID | Requerimiento |
|---|---|
| RNF-14 | El sistema debe funcionar en Chrome, Firefox, Safari y Edge actualizados. |
| RNF-15 | La interfaz debe ser usable desde 360px de ancho. |

---

## 16. Flujos de usuario y de trabajo

### Flujo de bootstrap (primera vez del admin)

| Paso | Pantalla | Acción |
|---|---|---|
| 1 | Login | Sistema en modo `seed`. Admin ingresa con credenciales del `data/seed.json` (ej: `admin@sigbovino.app` / `admin123`). |
| 2 | Dashboard del admin | Ve banner persistente: "El sistema está en modo seed. Ejecuta el bootstrap desde Configuración del sistema." |
| 3 | /admin/db-setup | Admin ve diagnóstico: Supabase OK, Blob OK, 0 migrations aplicadas, 6 pendientes. |
| 4 | /admin/db-setup | Admin hace clic en "Ejecutar bootstrap". Confirma con modal. |
| 5 | Procesando | Sistema corre las 6 migrations + carga el seed (admin + catálogo de vacunas). |
| 6 | Completado | Modo cambia a `live`. Banner desaparece. Sistema operativo. |

### Flujo del operario en su jornada diaria

| Paso | Pantalla | Acción |
|---|---|---|
| 1 | Login | Ingresa correo y contraseña. |
| 2 | Dashboard del operario | Ve alertas pendientes y producción del día anterior. |
| 3 | Producción | Selecciona "Registrar producción", elige turno. |
| 4 | Selección | Lista de hembras activas ordenadas por bodega. |
| 5 | Captura | Para cada vaca, ingresa litros producidos y guarda. |
| 6 | Novedades | Si detecta una vaca en celo, navega a "Estado reproductivo" y registra. |
| 7 | Cierre | Repite en el ordeño de la tarde y cierra sesión. |

### Flujo de trabajo del registro de producción

| # | Responsable | Acción |
|---|---|---|
| 1 | Usuario | Selecciona "Registrar producción", elige el turno. |
| 2 | Frontend | Solicita /api/cattle?sex=hembra&status=activo. |
| 3 | Usuario | Ingresa litros y presiona Guardar. |
| 4 | Servidor | Valida con Zod (0–60 litros). |
| 5 | Servidor | Verifica que no exista duplicado (RN-11). |
| 6 | Servidor | `dataService.registerMilkProduction()` inserta en `milk_production`. |
| 7 | Servidor | Calcula promedio últimos 7 días. Si caída >20%, inserta en `production_alerts`. |
| 8 | Servidor | `dataService.recordAudit()` registra en Blob. |
| 9 | Frontend | Muestra confirmación con total del turno y notifica alertas generadas. |

---

## 17. Diseño de interfaz

### Identidad visual del Login

El login transmite seriedad, confianza y dominio agropecuario.

| Elemento | Especificación |
|---|---|
| **Layout** | Pantalla completa. Formulario centrado vertical y horizontalmente. |
| **Fondo** | Beige cálido (`#F5EFE0`) con textura sutil. En la parte inferior, silueta SVG de pastizal con vaca de perfil, baja opacidad. |
| **Tarjeta del formulario** | Fondo blanco hueso (`#FAF7F2`), `border-radius: 12px`, sombra media (`0 8px 32px rgba(45, 80, 22, 0.12)`), franja superior decorativa de 4px en verde campo (`#2D5016`), padding generoso. |
| **Logo** | SVG inline de cabeza de res estilizada en verde campo, 56×56px, centrado. |
| **Nombre del sistema** | "SIG Bovino" en Inter Bold 30px, color verde campo oscuro (`#1F3A0D`). |
| **Tagline** | "Control completo de su hato ganadero." en Inter Regular 13px, color tierra (`#6B5635`). |
| **Campos** | Inputs con borde tierra claro, focus en verde campo, labels en tierra oscuro. |
| **Botón principal** | "Ingresar al sistema" — verde campo `#2D5016`, texto blanco, `border-radius: 6px`, hover `#1F3A0D`. |
| **Pie** | Texto pequeño: "Sistema de Inventario Bovino — v3.0". Sin link de "crear cuenta" — los usuarios los crea el admin. |
| **Animación de entrada** | Framer Motion: tarjeta con `opacity: 0→1` y `scale: 0.96→1`, duración 0.5s, ease `easeOut`. |

### Paleta de colores (modo claro, único soportado en v1)

| Elemento | Hex |
|---|---|
| Fondo principal | `#F5EFE0` |
| Fondo de tarjetas | `#FAF7F2` |
| Fondo alterno | `#FFFFFF` |
| Primario (verde campo) | `#2D5016` |
| Primario oscuro | `#1F3A0D` |
| Secundario (tierra) | `#8B6F47` |
| Acento (verde pasto) | `#7BA05B` |
| Texto principal | `#2C2416` |
| Texto secundario | `#6B5635` |
| Alerta (vacuna próxima) | `#D97706` |
| Error / animal en peligro | `#B91C1C` |
| Éxito / saludable | `#15803D` |
| Bordes | `#D4C7B0` |
| Bordes suaves | `#E8DFC9` |
| **Banner modo seed** | Fondo `#FEF3C7`, texto `#92400E`, borde `#F59E0B` |

### Tipografía

| Elemento | Fuente | Tamaño | Peso |
|---|---|---|---|
| Títulos principales | Inter | 26px | Bold 700 |
| Títulos de sección | Inter | 18px | SemiBold 600 |
| Cuerpo | Inter | 14px | Regular 400 |
| Secundario | Inter | 12px | Regular 400 |
| Datos numéricos | Inter | 16px | Medium 500 |
| Códigos de animales | JetBrains Mono | 14px | Medium 500 |

### Componentes clave

| Componente | Descripción |
|---|---|
| `CattleCard` | Tarjeta con código (monoespaciada), nombre, sexo (♂/♀), edad calculada, bodega, badge de estado. |
| `CattleTable` | Tabla densa para listas largas con búsqueda y filtros. |
| `GenealogyTree` | Árbol con padres/abuelos (2 niveles arriba) y crías directas (1 nivel abajo). |
| `VaccinationAlert` | Banner naranja con animales con vacuna próxima a vencer (≤7 días). |
| `MilkChart` | Gráfica de líneas (Recharts) comparando producción entre dos períodos. |
| `ProductionDropAlert` | Alerta en dashboard del admin para vacas con caída >20%. |
| `MassVaccinationForm` | Selección por bodega o checkbox múltiple, una sola fecha y vacuna. |
| `SeedModeBanner` | Banner amarillo persistente cuando el sistema está sin bootstrapear. Solo admin. |
| `AuditViewer` | Tabla de auditoría con filtros por mes, usuario y entidad. |

### Diseño responsivo

| Dispositivo | Comportamiento |
|---|---|
| Computador (≥1024px) | Sidebar fijo + tabla densa. |
| Tablet (768–1023px) | Sidebar colapsable + tabla con scroll horizontal. |
| Celular (<768px) | Bottom navigation + cards apiladas. Captura de producción optimizada para celular. |

---

## 18. Plan de fases de implementación

### Fase 1 — Bootstrap, Login y `dataService` base
> Rol: Ingeniero Fullstack Senior — Arquitecto del sistema y seguridad
> Reemplaza el "Hola Mundo". Esta fase establece la arquitectura completa de persistencia.

| # | Tarea |
|---|---|
| 1.1 | Instalar: `bcryptjs jose @supabase/supabase-js @vercel/blob pg @types/bcryptjs @types/pg` |
| 1.2 | Crear proyecto en Supabase. Crear Blob Store privado en Vercel. Configurar todas las variables de entorno. |
| 1.3 | Crear estructura `data/`: `config.json`, `seed.json` con admin inicial (password `admin123` hasheado) y placeholder vacío para `vaccine_types`, `README.md`. |
| 1.4 | Crear `supabase/migrations/0001_init_users.sql` con tabla `users` (con campo `must_change_password`) y `_migrations`. |
| 1.5 | Crear `lib/supabase.ts`: cliente para server con service role. |
| 1.6 | Crear `lib/blobAudit.ts`: `appendAudit`, `readAuditMonth`, `withFileLock`, `getBlobToken()` lazy. Usar `get()` del SDK. |
| 1.7 | Crear `lib/blobFiles.ts`: `uploadFile`, `readFile`, `deleteFile`. |
| 1.8 | Crear `lib/pgMigrate.ts`: aplica migrations pendientes leyendo archivos y comparando con `_migrations`. |
| 1.9 | Crear `lib/seedReader.ts`: lee `data/seed.json` y `data/config.json`. |
| 1.10 | Crear `lib/dataService.ts` con la API pública para auth y usuarios, `getSystemMode`, `recordAudit`. En modo `seed` enruta a `seedReader`; en `live` a Supabase. Cada escritura llama `recordAudit`. |
| 1.11 | Crear `lib/auth.ts`: `hashPassword`, `verifyPassword`, `createJWT`, `verifyJWT`, `getTokenFromCookie`, `setSessionCookie`, `clearSessionCookie`. |
| 1.12 | Crear `lib/withAuth.ts` y `lib/withRole.ts`. `withAuth` agrega header `Cache-Control: no-store`. |
| 1.13 | Crear `next.config.ts` con headers `no-store` para `/api/:path*`. |
| 1.14 | Crear `lib/types.ts` y `lib/schemas.ts` con tipos y schemas Zod de auth y auditoría. |
| 1.15 | Crear API Routes: `POST /api/system/bootstrap`, `GET /api/system/diagnose`, `GET /api/system/mode`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/change-password`. |
| 1.16 | Crear `app/login/page.tsx` con la identidad visual de SIG Bovino: paleta beige/verde campo, logo de cabeza de res, animación. |
| 1.17 | Actualizar `app/page.tsx`: redirige a `/dashboard` si hay sesión, a `/login` si no. |
| 1.18 | `npm run typecheck` sin errores. Probar: login con admin del seed → `/api/system/mode` retorna `seed` → verificar cookie HttpOnly. |

---

### Fase 2 — Dashboard, Layout base y página de bootstrap
> Rol: Diseñador Frontend Obsesivo + Ingeniero de Sistemas

| # | Tarea |
|---|---|
| 2.1 | Crear componentes UI base en `components/ui/`: Button, Card, Badge, Toast, Modal, EmptyState, Table. |
| 2.2 | Configurar variables CSS de la paleta en `globals.css`. Configurar Inter y JetBrains Mono con `next/font`. |
| 2.3 | Crear `components/layout/AppLayout.tsx`: sidebar (desktop), bottom nav (mobile), header con nombre y rol. El sidebar filtra ítems según rol. |
| 2.4 | Crear `app/admin/db-setup/page.tsx` con tabs Diagnóstico y Bootstrap. Llama a `/api/system/diagnose` y muestra estado completo. Botón ejecutar bootstrap con confirmación. |
| 2.5 | Crear `components/admin/SeedModeBanner.tsx`: banner amarillo persistente cuando el sistema está en modo seed. Solo visible para admin. |
| 2.6 | Crear `GET /api/dashboard`: retorna datos según rol (admin ve todo, veterinario ve sanitarias, operario ve pendientes de producción). En modo seed retorna estructura vacía con flag. |
| 2.7 | Crear `app/dashboard/page.tsx`: tarjetas según rol, banner de modo seed, placeholders para alertas. |
| 2.8 | Crear `middleware.ts`: protege rutas privadas. Verifica sesión y rol para `/admin/*`. |
| 2.9 | Probar flujo: login admin → ver banner → ir a /admin/db-setup → ejecutar bootstrap → verificar que banner desaparece y modo cambia a `live`. |

---

### Fase 3 — Gestión de Bodegas
> Rol: Ingeniero Fullstack Senior

| # | Tarea |
|---|---|
| 3.1 | Crear `supabase/migrations/0002_init_sheds.sql`. Aplicar desde `/admin/db-setup` (re-ejecutar bootstrap). |
| 3.2 | Tipo `Shed`, `ShedWithCount` y schemas Zod. |
| 3.3 | Extender `dataService`: `getSheds` (con conteo en tiempo real de animales activos), `createShed`, `updateShed`, `deactivateShed`. Cada escritura llama `recordAudit`. |
| 3.4 | API Routes: `GET/POST /api/sheds`, `GET/PUT/DELETE /api/sheds/[id]` con `withRole(['admin'])` para escritura. |
| 3.5 | Página `app/sheds/page.tsx`: lista con conteo actual / capacidad, badge si está al límite. Modal para crear/editar. |
| 3.6 | Validar antes de eliminar: si tiene animales asignados, soft delete (is_active=false) y mostrar advertencia. |

---

### Fase 4 — Registro y Gestión de Animales
> Rol: Ingeniero Fullstack Senior — Modelo central del sistema
> Esta es la fase más extensa. El módulo de animales es el corazón del sistema.

| # | Tarea |
|---|---|
| 4.1 | Crear `supabase/migrations/0003_init_cattle.sql`. Aplicar desde `/admin/db-setup`. |
| 4.2 | Tipos `Cattle`, `CattleWithRelations`, `GenealogyTree` y schemas Zod completos. |
| 4.3 | Crear `lib/genealogyService.ts`: `validateNoCycle` (RN-09 — verificación recursiva), `buildGenealogyTree` (2 niveles arriba, 1 abajo). |
| 4.4 | Extender `dataService`: `getCattle` (con filtros), `getCattleById` (con materia y árbol), `createCattle`, `updateCattle`, `changeCattleStatus`, `getGenealogyTree`, `uploadCattlePhoto`. Cada escritura llama `recordAudit` con el diff de campos cambiados. |
| 4.5 | Implementar todas las validaciones críticas en el servidor: código único (RN-01), animal de baja sin escrituras (RN-03), fecha de nacimiento de cría posterior a la madre (RN-04), capacidad de bodega (RN-05), no ciclos en genealogía (RN-09). |
| 4.6 | API Routes: `GET/POST /api/cattle`, `GET/PUT/DELETE /api/cattle/[id]`, `GET /api/cattle/[id]/genealogy`, `POST /api/cattle/[id]/photo`. |
| 4.7 | API Route `GET /api/files?path=...`: descarga autorizada de archivos de Blob. Valida sesión y permisos por path. |
| 4.8 | Crear `app/cattle/page.tsx`: tabla con búsqueda por código y nombre, filtros por sexo, bodega, estado, edad. Códigos en JetBrains Mono. |
| 4.9 | Crear `app/cattle/new/page.tsx` con formulario completo. Selector de madre/padre con búsqueda. |
| 4.10 | Crear `app/cattle/[id]/page.tsx`: ficha con tabs (Información, Producción, Vacunación, Reproducción, Genealogía, Bitácora). En esta fase implementar Información, Genealogía y Bitácora; los demás tabs como placeholders. |
| 4.11 | Crear `components/cattle/GenealogyTree.tsx`. |
| 4.12 | Crear `app/admin/audit/page.tsx`: visualizador leyendo de Blob por mes. Filtros por usuario y entidad. Solo admin. |
| 4.13 | API Route `GET /api/audit?month=YYYYMM&userId=...&entity=...`: lee de `dataService.readAuditMonth()` y filtra. |
| 4.14 | Subida de foto del animal: comprimir cliente → POST a `/api/cattle/[id]/photo` → `dataService.uploadCattlePhoto` → guarda path en `cattle.photo_path`. Mostrar foto vía `/api/files`. |

---

### Fase 5 — Producción de Leche
> Rol: Ingeniero Fullstack — Lógica operacional y captura en campo

| # | Tarea |
|---|---|
| 5.1 | Crear `supabase/migrations/0004_init_milk_production.sql`. Aplicar desde `/admin/db-setup`. |
| 5.2 | Tipos `MilkProduction`, `ProductionAlert`, `ProductionCompareReport` y schemas Zod. |
| 5.3 | Extender `dataService`: `getMilkProduction`, `registerMilkProduction` (con validación RN-02, RN-03, RN-11), `getCompareProductionReport` (RN-10). Cada escritura llama `recordAudit`. |
| 5.4 | Implementar RN-12 dentro de `registerMilkProduction`: post-insert calcula promedio últimos 7 días; si caída >20%, inserta en `production_alerts`. Hacer asíncrono para no bloquear respuesta. |
| 5.5 | API Routes: `GET/POST /api/milk`, `GET /api/milk/summary`, `GET /api/milk/compare`. |
| 5.6 | Crear `app/milk/page.tsx`: vista optimizada para celular. Lista de hembras activas filtrable por bodega. Inputs con `inputMode="decimal"`, autoguardado al blur. |
| 5.7 | Crear `app/milk/history/page.tsx`: historial con filtros. |
| 5.8 | Integrar tab Producción en ficha del animal con `MilkChart` (últimos 30 días). |
| 5.9 | Mostrar `ProductionDropAlert` en dashboard del admin. Permitir marcar como resuelto. |

---

### Fase 6 — Vacunación y Alertas
> Rol: Ingeniero Fullstack — Sanidad animal y normativa

| # | Tarea |
|---|---|
| 6.1 | Crear `supabase/migrations/0005_init_vaccinations.sql`. Aplicar desde `/admin/db-setup`. |
| 6.2 | **Importante:** Actualizar `data/seed.json` con el catálogo inicial de vacunas (Aftosa periodicidad 180 días mandatory, Brucelosis 365 mandatory allowed_sex='hembra', Carbunco 365, IBR/DVB 365, Rabia 365). Re-ejecutar bootstrap para que el seedReader inserte el catálogo. |
| 6.3 | Tipos `VaccineType`, `Vaccination`, `VaccinationWithCattle`, `MassVaccinationRequest`, `MassVaccinationResult`, `VaccinationAlert` y schemas Zod. |
| 6.4 | Extender `dataService`: `getVaccineTypes`, `getVaccinations`, `registerVaccination` (con validación RN-14: si vaccine_type.allowed_sex está definido, validar contra cattle.sex), `registerMassVaccination` (atómica), `getUpcomingVaccinationAlerts` (next_dose_date ≤ NOW + 7 días), `uploadVaccinationCertificate`. Cada escritura llama `recordAudit`. |
| 6.5 | Cálculo automático de `next_dose_date` = `applied_date + vaccine_types.periodicity_days` en el servidor. |
| 6.6 | En `registerMassVaccination`: si algún animal seleccionado no es activo o no cumple `allowed_sex`, excluirlo de la operación y reportar en la respuesta cuáles se omitieron. |
| 6.7 | API Routes: `GET/POST /api/vaccinations`, `GET /api/vaccinations/alerts`, `GET /api/vaccinations/types`, `POST /api/vaccinations/[id]/certificate`. |
| 6.8 | Crear `app/vaccinations/page.tsx`: dashboard con alertas + historial. |
| 6.9 | Crear `app/vaccinations/new/page.tsx`: selector "Individual / Masiva". Modo masivo permite seleccionar todos los animales de una bodega o checkboxes individuales. |
| 6.10 | Subida de certificado a Blob (validar PDF, máx 5MB) y mostrar enlace de descarga vía `/api/files`. |
| 6.11 | Integrar `VaccinationAlert` en dashboard de admin y veterinario. |
| 6.12 | Integrar tab Vacunación en ficha del animal. |

---

### Fase 7 — Estado Reproductivo
> Rol: Ingeniero Fullstack

| # | Tarea |
|---|---|
| 7.1 | Crear `supabase/migrations/0006_init_reproductive.sql`. Aplicar desde `/admin/db-setup`. |
| 7.2 | Tipos `ReproductiveEvent` y schemas Zod. |
| 7.3 | Extender `dataService`: `getReproductiveEvents`, `registerReproductiveEvent` (validar RN-02 y RN-03), `getCurrentReproductiveStatus` (deduce del último evento). Cada escritura llama `recordAudit`. |
| 7.4 | En eventos de tipo `preñez`, calcular automáticamente `expected_birth = event_date + 283 días`. Permitir ajuste manual. |
| 7.5 | API Routes: `GET/POST /api/reproduction` con `withRole(['admin', 'veterinario'])`. |
| 7.6 | Crear `app/reproduction/page.tsx`: lista de hembras con estado actual deducido + botón "Registrar evento". |
| 7.7 | Integrar tab Reproducción en ficha del animal: timeline con iconos por tipo de evento. |

---

### Fase 8 — Reportes y Exportación
> Rol: Ingeniero Backend Senior — Reportes oficiales

| # | Tarea |
|---|---|
| 8.1 | Instalar: `jspdf jspdf-autotable xlsx`. |
| 8.2 | Crear `lib/reportService.ts`: `generateProductionReport`, `generateSanitaryReport` (formato ICA), `generateInventoryReport` (valorado fiscal). |
| 8.3 | API Routes: `GET /api/reports/production`, `GET /api/reports/sanitary`, `GET /api/reports/inventory`. Cada uno con `withRole` apropiado y filtros por período/formato. |
| 8.4 | Validar RN-10 en producción comparativo: cada período mínimo 7 días → 400 si no cumple. |
| 8.5 | El reporte sanitario incluye: datos de la finca, listado de animales con vacunas aplicadas, fecha, dosis, veterinario. Formato pensado para presentación al ICA. |
| 8.6 | El reporte fiscal incluye: código, sexo, edad calculada, raza, peso, valor estimado, subtotales por categoría (terneros, novillas/novillos, vacas/toros), total general. |
| 8.7 | Crear `app/reports/page.tsx`: centro de reportes con tarjetas según rol. |
| 8.8 | Crear sub-páginas con filtros específicos. |
| 8.9 | Sin datos en período → 404 con mensaje claro. Spinner durante generación. |

---

### Fase 9 — Administración de Usuarios
> Rol: Ingeniero Fullstack Senior — Gestión y credenciales temporales

| # | Tarea |
|---|---|
| 9.1 | API Routes con `withRole(['admin'])`: `GET/POST /api/users`, `GET/PUT/DELETE /api/users/[id]`. |
| 9.2 | El POST genera contraseña temporal aleatoria de 12 caracteres alfanuméricos. La hashea con bcrypt. Marca `must_change_password=true`. La retorna EN CLARO una sola vez en la respuesta. |
| 9.3 | Modal de creación con asignación de rol. La respuesta muestra la contraseña en un modal con botón "Copiar" y advertencia de que es la única vez que se verá. |
| 9.4 | En el flujo de login, si `must_change_password=true`, redirigir a `/change-password` antes del dashboard. Después del cambio, marcar `must_change_password=false`. |
| 9.5 | Crear `app/admin/users/page.tsx`: tabla con nombre, email, rol, estado, último acceso. Acciones: editar, suspender, eliminar. |
| 9.6 | El admin no puede eliminar su propia cuenta — verificación explícita. |
| 9.7 | Las FKs en cattle, milk_production, vaccinations, reproductive_events ya tienen ON DELETE SET NULL, así que eliminar usuarios mantiene la trazabilidad. |

---

### Fase 10 — Pulido final y Deploy
> Rol: Diseñador Frontend Obsesivo + Ingeniero Fullstack

| # | Tarea |
|---|---|
| 10.1 | Auditoría de empty states en todos los módulos según el rol del usuario. |
| 10.2 | Manejo de errores global: red, 401 (sesión expirada), 403 (sin permisos), 500. Toasts apropiados. |
| 10.3 | Optimización de listado de animales: paginación servidor 50 por página, búsqueda con debounce 300ms, filtros como query params persistentes. |
| 10.4 | Verificar que cada acción del veterinario y operario está limitada con `withRole` en backend, no solo ocultando botones en frontend. |
| 10.5 | Revisión responsive en 360px, 768px y 1280px. Especial atención al módulo de producción en celular. |
| 10.6 | `npm run typecheck`, `npm run lint`, `npm run build` — cero errores y cero warnings. |
| 10.7 | Verificar que ningún componente cliente importa `dataService`, `supabase`, `blobAudit`, `blobFiles` ni variables privadas. |
| 10.8 | Deploy en Vercel con todas las variables de entorno. Probar en producción con los 3 roles. |

---

## 19. Estrategia de seguridad

### Flujo de login

```
1. Validar body con Zod (loginSchema)
2. dataService.getUserByEmail(email)  ← enruta a seed o Postgres
3. Verificar is_active y password con bcrypt.compare()
4. Si must_change_password=true, generar JWT con flag y retornar redirect a /change-password
5. Generar JWT (payload: { userId, role, email }, expira 24h)
6. Establecer cookie HttpOnly, Secure, SameSite=Strict
7. dataService.recordAudit({ action: 'login', ... })
8. Retornar SafeUser
```

### Protección por rol

```typescript
// lib/withRole.ts
export async function withRole(
  request: Request,
  allowedRoles: Array<'admin' | 'veterinario' | 'operario'>,
  handler: (user: SafeUser) => Promise<Response>
): Promise<Response> {
  return withAuth(request, async (user) => {
    if (!allowedRoles.includes(user.role)) {
      return Response.json({ error: 'Sin permisos para esta acción' }, { status: 403 });
    }
    return handler(user);
  });
}
```

### Auditoría obligatoria

Cada operación de escritura sobre dominio se canaliza por `dataService` que llama internamente a `recordAudit()` antes de retornar. La auditoría falla en silencio si Blob no responde — no rompe la operación principal.

### Validación anti-ciclos genealógicos (RN-09)

```typescript
// lib/genealogyService.ts
async function validateNoCycle(cattleId: string, parentId: string): Promise<boolean> {
  // Recorre recursivamente los descendientes de cattleId
  // Si parentId aparece entre los descendientes, retorna false (habría ciclo)
}
```

### Seguridad del bootstrap

`POST /api/system/bootstrap` requiere **dos condiciones simultáneas**:
1. Sesión válida con `role='admin'`
2. Header `x-bootstrap-secret` igual a `ADMIN_BOOTSTRAP_SECRET`

### Headers de cache

```typescript
// next.config.ts
async headers() {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
      { key: 'Pragma', value: 'no-cache' },
    ],
  }];
}
```

`withAuth` agrega los mismos headers a cada respuesta como triple defensa.

### Privacidad de archivos en Blob

Los archivos en Blob son privados. Solo se sirven al cliente vía `GET /api/files?path=...` con autenticación y autorización por path. Nunca se expone una URL directa de Blob al cliente.

---

## 20. Reportes oficiales

### Reporte de producción comparativo

Compara dos períodos (cada uno mínimo 7 días). Incluye totales por período, promedio diario, diferencia absoluta y porcentual, gráfica con evolución día a día, top 10 animales más productivos.

### Reporte sanitario para ICA

Formato pensado para presentación oficial. Incluye datos de la finca y propietario, listado de animales con vacunas aplicadas en el período, fecha de aplicación, vacuna, dosis, veterinario responsable, total de cabezas vacunadas vs total del hato.

### Reporte de inventario valorado (fiscal)

Para declaración de renta. Incluye código (monoespaciada), sexo, edad calculada, raza, peso, valor estimado por cabeza, subtotales por categoría (terneros <1 año, novillas/novillos 1-2 años, vacas/toros >2 años), total general.

---

## 21. Glosario

| Término | Definición |
|---|---|
| **Bootstrap** | Proceso inicial donde el admin aplica migrations y carga el seed para activar Supabase. |
| **Modo seed** | Estado del sistema antes del bootstrap. Solo permite login admin. |
| **Modo live** | Estado normal del sistema, persistiendo en Supabase. |
| **Migration** | Archivo SQL versionado en `supabase/migrations/` que evoluciona el esquema. |
| **Seed** | Datos iniciales en `data/seed.json`. Admin + catálogo de vacunas. |
| **dataService** | Único punto de acceso a datos. Encapsula Supabase, Blob (auditoría), Blob (archivos) y seed reader. |
| **Auditoría** | Registro append-only de cada escritura. Persiste en Vercel Blob particionada por mes. |
| **Hato** | Conjunto de animales bovinos de una finca. |
| **Cabeza** | Cada unidad animal del hato. |
| **Bodega** | Espacio físico de la finca: pastizal, establo, corral. |
| **Ordeño** | Acción de extraer leche. Dos turnos: mañana y tarde. |
| **Linaje / Genealogía** | Vínculo familiar de un animal con padres, abuelos y crías. |
| **Estado reproductivo** | Condición fisiológica de una hembra: vacía, en celo, preñada, en parto, en lactancia. |
| **Vacuna obligatoria** | Vacunas requeridas por entidades sanitarias (Aftosa, Brucelosis). |
| **Periodicidad** | Cada cuántos días se aplica la dosis de refuerzo. |
| **ICA** | Instituto Colombiano Agropecuario. Regula sanidad animal en Colombia. |
| **Inventario valorado** | Listado del hato con valor estimado por cabeza, para declaración de renta. |
| **JWT** | JSON Web Token — credencial firmada en cookie HttpOnly. |
| **Vercel Blob** | Servicio de Vercel para almacenar archivos. Aquí guarda auditoría, fotos y certificados. |

---

> Última actualización: Mayo 2026
> Sergio Palma — Doc: 1082937565
> Curso: Lógica y Programación — SIST0200
