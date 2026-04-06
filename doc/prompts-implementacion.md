# 📜 Prompts de Implementación por Fases
## Sistema Fullstack TypeScript + Next.js + Vercel + JSON DB

> **Archivo:** `prompts-implementacion.md`
> **Propósito:** Colección de prompts listos para copiar y pegar, uno por fase/tarea. Cada prompt lee los documentos base, define un skill, registra su inicio y cierre en `estado-ejecucion.md`, y al finalizar la fase genera un archivo de resumen independiente.
> **Uso:** Copiar el prompt completo y pegarlo en una sesión nueva de Claude.

---

## 📋 Instrucciones de Uso

1. **Siempre ejecutar los prompts en orden** — cada fase depende de la anterior.
2. **Una sesión por prompt** — cada prompt abre una conversación nueva con Claude.
3. **Adjuntar los tres documentos base** al inicio de cada sesión antes de pegar el prompt:
   - `plan-infraestructura-fullstack.md`
   - `plan-implementacion-fases.md`
   - `estado-ejecucion.md`
4. **Al finalizar cada prompt**, copiar el contenido actualizado de `estado-ejecucion.md` que Claude genere y reemplazar el archivo original.
5. **Al finalizar cada fase**, guardar el archivo de resumen que Claude genere.

---

## 🗂️ Índice de Prompts

| Prompt | Fase | Skill | Tarea Principal |
|---|---|---|---|
| [0.1](#prompt-01--inicio-de-fase-0) | 0 | Ingeniero DevOps | Verificación del entorno y prerequisitos |
| [0.2](#prompt-02--cierre-de-fase-0) | 0 | Ingeniero DevOps | Validación y resumen de Fase 0 |
| [1.1](#prompt-11--inicio-de-fase-1) | 1 | Ingeniero Fullstack Senior | Inicialización del proyecto Next.js |
| [1.2](#prompt-12--configuración-de-calidad) | 1 | Ingeniero Fullstack Senior | TypeScript estricto, ESLint y Prettier |
| [1.3](#prompt-13--estructura-y-cierre-de-fase-1) | 1 | Ingeniero Fullstack Senior | Estructura de carpetas y cierre de Fase 1 |
| [2.1](#prompt-21--inicio-de-fase-2) | 2 | Ingeniero Backend TypeScript | JSON DB, tipos e interfaces |
| [2.2](#prompt-22--módulo-jsondb-y-api-route) | 2 | Ingeniero Backend TypeScript | Módulo jsonDb y API Route |
| [2.3](#prompt-23--cierre-de-fase-2) | 2 | Ingeniero Backend TypeScript | Validación y cierre de Fase 2 |
| [3.1](#prompt-31--inicio-de-fase-3) | 3 | Diseñador UX/UI + Ingeniero Frontend | Estilos globales y layout |
| [3.2](#prompt-32--componentes-de-animación) | 3 | Diseñador UX/UI + Ingeniero Frontend | AnimatedText y HolaMundo |
| [3.3](#prompt-33--página-home-y-cierre-de-fase-3) | 3 | Diseñador UX/UI + Ingeniero Frontend | Page.tsx, validación y cierre de Fase 3 |
| [4.1](#prompt-41--inicio-de-fase-4) | 4 | Ingeniero DevOps + Cloud | Despliegue en Vercel |
| [4.2](#prompt-42--verificación-y-cierre-de-fase-4) | 4 | Ingeniero DevOps + Cloud | Pipeline y cierre de Fase 4 |
| [5.1](#prompt-51--inicio-de-fase-5) | 5 | Ingeniero QA + Fullstack | Validación cross-browser y responsive |
| [5.2](#prompt-52--certificación-y-cierre-de-fase-5) | 5 | Ingeniero QA + Fullstack | Certificación final y documentación |

---

---

# FASE 0 — Preparación del Entorno

---

## Prompt 0.1 — Inicio de Fase 0

> **Skill:** Ingeniero DevOps  
> **Objetivo:** Verificar y configurar el entorno de desarrollo  
> **Acción en estado:** Marca Fase 0 como 🔄 En progreso

---

```
Actúa como Ingeniero DevOps especializado en entornos de desarrollo Node.js, Git y plataformas cloud.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Antes de hacer cualquier cosa, lee cuidadosamente los tres documentos que te adjunto:
1. `plan-infraestructura-fullstack.md` — La arquitectura y decisiones técnicas del sistema.
2. `plan-implementacion-fases.md` — El plan detallado por fases con criterios de éxito.
3. `estado-ejecucion.md` — El estado actual de la implementación.

Confirma que los leíste resumiendo en 3 líneas el objetivo principal de cada documento.

PASO 2 — REGISTRO DE INICIO EN ESTADO DE EJECUCIÓN:
Actualiza `estado-ejecucion.md` con lo siguiente:
- En la tabla "Tracker de Fases": Fase 0 → Estado: 🔄 En progreso, Inicio: [fecha y hora actual]
- En "Estado Global": Estado actual → 🔄 En progreso, Fase activa → Fase 0, Inicio del proyecto → [fecha actual]
- En "Historial de Ejecución" → sección FASE 0 → Evento de Inicio: registrar fecha/hora y que fue iniciado por Prompt 0.1
- Muéstrame el bloque actualizado del estado de ejecución.

PASO 3 — EJECUCIÓN DE LA FASE 0:
Ejecuta todas las tareas del paso 0 del plan de implementación:

3.1 — Configuración de Git Global:
Genera los comandos exactos para configurar Git con nombre, email y rama principal 'main'. Explica brevemente cada comando.

3.2 — Creación del Repositorio en GitHub:
Proporciona las instrucciones paso a paso para crear el repositorio en GitHub con las configuraciones correctas definidas en el plan.

3.3 — Vinculación de Vercel con GitHub:
Explica el proceso de vinculación de Vercel con GitHub, qué permisos se necesitan y qué verificar al final.

3.4 — Configuración de VS Code:
Lista las extensiones a instalar con sus IDs exactos para buscarlas en el marketplace.

3.5 — Verificación del Entorno:
Genera un script de verificación que el usuario pueda correr en su terminal para confirmar que Node.js, npm y Git están en las versiones correctas.

PASO 4 — REGISTRO DE ACTIVIDADES:
En `estado-ejecucion.md`, en la sección "FASE 0 → Registro de Actividades", documenta:
- Cada tarea ejecutada (3.1 a 3.5) con su descripción y resultado esperado.

PASO 5 — CHECKLIST INTERACTIVO:
Presenta al usuario el checklist de cierre de Fase 0 del plan de implementación para que lo complete manualmente. Indícale que cuando todos los items estén marcados, ejecute el Prompt 0.2.

Muéstrame el documento `estado-ejecucion.md` completo y actualizado al finalizar.
```

---

## Prompt 0.2 — Cierre de Fase 0

> **Skill:** Ingeniero DevOps  
> **Objetivo:** Validar Fase 0 y generar resumen independiente  
> **Acción en estado:** Marca Fase 0 como ✅ Completada y genera `resumen-fase-0.md`

---

```
Actúa como Ingeniero DevOps especializado en entornos de desarrollo Node.js, Git y plataformas cloud.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos en este orden:
1. `plan-infraestructura-fullstack.md`
2. `plan-implementacion-fases.md`
3. `estado-ejecucion.md`

Confirma qué tareas de la Fase 0 están registradas como completadas en el estado de ejecución.

PASO 2 — VALIDACIÓN FINAL DE FASE 0:
Revisa el checklist completo de la Fase 0 en el plan de implementación. Para cada item:
- ✅ Indica qué evidencia confirmaría que está completo.
- ❓ Si algún item no está claro, formula una pregunta específica al usuario.

Pregunta al usuario si todos los items del checkpoint de Fase 0 están marcados antes de continuar.

PASO 3 — CIERRE EN ESTADO DE EJECUCIÓN:
Actualiza `estado-ejecucion.md`:
- Tracker de Fases: Fase 0 → Estado: ✅ Completada, Cierre: [fecha/hora], Resumen generado: resumen-fase-0.md
- Estado Global: Fases completadas → 1/6, Porcentaje → 17%, Fase activa → Fase 1 (próxima)
- Historial FASE 0 → Evento de Cierre: registrar fecha, resultado: ✅ Exitoso, listar todos los archivos modificados.
- En "Inventario de Archivos": agregar .gitignore, .env.example, vercel.json si se crearon.

PASO 4 — GENERAR RESUMEN INDEPENDIENTE:
Crea el archivo `resumen-fase-0.md` con la siguiente estructura:

---
# Resumen de Ejecución — Fase 0: Preparación del Entorno
**Fecha de inicio:** [del estado de ejecución]
**Fecha de cierre:** [fecha actual]
**Estado:** ✅ Completada
**Ejecutor:** Ingeniero DevOps (Claude)

## Objetivo de la Fase
[Describir el objetivo en 2-3 líneas]

## Tareas Ejecutadas
[Listar cada tarea con su resultado]

## Decisiones Tomadas
[Cualquier decisión de configuración relevante]

## Herramientas Configuradas
[Lista de herramientas y versiones]

## Criterios de Éxito Verificados
[Checklist completo con ✅]

## Notas para la Fase Siguiente
[Qué debe tener listo el usuario antes de iniciar Fase 1]
---

PASO 5 — INSTRUCCIÓN FINAL:
Indica al usuario:
1. Que guarde el archivo `resumen-fase-0.md` generado.
2. Que copie y reemplace el contenido de `estado-ejecucion.md` con la versión actualizada.
3. Que puede proceder al Prompt 1.1 para iniciar la Fase 1.
```

---

---

# FASE 1 — Fundación del Proyecto

---

## Prompt 1.1 — Inicio de Fase 1

> **Skill:** Ingeniero Fullstack Senior  
> **Objetivo:** Inicializar el proyecto Next.js con TypeScript  
> **Acción en estado:** Marca Fase 1 como 🔄 En progreso

---

```
Actúa como Ingeniero Fullstack Senior especializado en Next.js, TypeScript y arquitectura de aplicaciones web modernas.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos en este orden:
1. `plan-infraestructura-fullstack.md` — Presta especial atención a la sección 3 (Estructura del Repositorio) y sección 6 (Requisitos Técnicos).
2. `plan-implementacion-fases.md` — Enfócate en la Fase 1 completa (pasos 1.1 a 1.10).
3. `estado-ejecucion.md` — Verifica que la Fase 0 está marcada como ✅ Completada antes de continuar. Si no lo está, detente e indícalo al usuario.

Confirma la lectura y el estado de la Fase 0.

PASO 2 — REGISTRO DE INICIO EN ESTADO DE EJECUCIÓN:
Actualiza `estado-ejecucion.md`:
- Tracker de Fases: Fase 1 → Estado: 🔄 En progreso, Inicio: [fecha/hora actual]
- Estado Global: Fase activa → Fase 1, Última actividad → [fecha/hora]
- Historial FASE 1 → Evento de Inicio: fecha/hora, iniciado por Prompt 1.1
- Muéstrame el bloque actualizado.

PASO 3 — EJECUCIÓN PASO 1.1: Inicialización con Create Next App:
Proporciona el comando exacto de `npx create-next-app@latest` con todos los flags del plan. Explica qué hace cada flag. Incluye el comando de clonación del repositorio previo.

PASO 4 — EJECUCIÓN PASO 1.2: Instalación de Dependencias:
Proporciona los comandos de instalación de dependencias de producción y desarrollo. Explica por qué se necesita cada una.

PASO 5 — REGISTRO DE ACTIVIDADES:
En `estado-ejecucion.md` → FASE 1 → Registro de Actividades, documenta:
- Tarea 1.1: create-next-app ejecutado, flags usados, resultado esperado.
- Tarea 1.2: dependencias instaladas (framer-motion, prettier, eslint-config-prettier, @types/node).

PASO 6 — INSTRUCCIÓN AL USUARIO:
Indica al usuario que ejecute los comandos en su terminal y que cuando la instalación esté completa, ejecute el Prompt 1.2 para continuar con la configuración de calidad de código.

Muéstrame el `estado-ejecucion.md` completo y actualizado.
```

---

## Prompt 1.2 — Configuración de Calidad

> **Skill:** Ingeniero Fullstack Senior  
> **Objetivo:** Configurar TypeScript estricto, ESLint, Prettier y scripts  
> **Acción en estado:** Agrega actividades a Fase 1

---

```
Actúa como Ingeniero Fullstack Senior especializado en configuración de herramientas de calidad de código TypeScript.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Sección 6 (Requisitos Técnicos) y sección 12 (Convenciones).
2. `plan-implementacion-fases.md` — Pasos 1.3 al 1.9 de la Fase 1.
3. `estado-ejecucion.md` — Confirma que la Fase 1 está en estado 🔄 En progreso.

PASO 2 — EJECUCIÓN PASO 1.3: TypeScript Estricto:
Proporciona el contenido completo del `tsconfig.json` definido en el plan. Explica las opciones más importantes, especialmente por qué `"strict": true` es fundamental. Indica el comando de verificación.

PASO 3 — EJECUCIÓN PASO 1.4: Configuración de ESLint:
Proporciona el contenido de `.eslintrc.json`. Explica cada regla y por qué se incluye.

PASO 4 — EJECUCIÓN PASO 1.5: Configuración de Prettier:
Proporciona el contenido de `.prettierrc` y `.prettierignore`. Explica cómo Prettier y ESLint trabajan juntos sin conflicto.

PASO 5 — EJECUCIÓN PASO 1.6 y 1.7: .gitignore y Estructura de Carpetas:
- Proporciona las entradas que deben verificarse/agregarse al `.gitignore`.
- Proporciona los comandos `mkdir` y `touch` para crear la estructura de carpetas completa.

PASO 6 — EJECUCIÓN PASO 1.8 y 1.9: Archivos de Configuración y Scripts:
- Proporciona el contenido de `vercel.json`, `.env.example` y `.env.local`.
- Proporciona los scripts actualizados para `package.json`.
- Proporciona el contenido de `.vscode/settings.json`.

PASO 7 — REGISTRO DE ACTIVIDADES:
En `estado-ejecucion.md` → FASE 1 → Registro de Actividades, agrega:
- Tarea 1.3: tsconfig.json configurado en modo strict.
- Tarea 1.4: ESLint configurado con reglas TypeScript y Prettier.
- Tarea 1.5: Prettier configurado.
- Tarea 1.6: .gitignore actualizado.
- Tarea 1.7: Estructura de carpetas creada (/src/components, /src/lib, /data).
- Tarea 1.8: vercel.json, .env.example y .env.local creados.
- Tarea 1.9: Scripts de package.json actualizados.
- En "Inventario de Archivos": agregar todos los archivos creados/modificados.

PASO 8 — VERIFICACIÓN:
Proporciona los tres comandos de verificación del plan y el resultado esperado de cada uno:
```bash
npx tsc --noEmit
npm run lint
npm run build
```

Indica al usuario que ejecute estos comandos y que cuando los tres pasen, ejecute el Prompt 1.3 para el cierre de la Fase 1.
```

---

## Prompt 1.3 — Estructura y Cierre de Fase 1

> **Skill:** Ingeniero Fullstack Senior  
> **Objetivo:** Primer commit, validar estructura y cerrar Fase 1  
> **Acción en estado:** Marca Fase 1 como ✅ Completada y genera `resumen-fase-1.md`

---

```
Actúa como Ingeniero Fullstack Senior especializado en arquitectura de proyectos Next.js y TypeScript.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Sección 3 (Estructura del Repositorio).
2. `plan-implementacion-fases.md` — Paso 1.10 y el Checkpoint de Fase 1.
3. `estado-ejecucion.md` — Revisa todas las actividades registradas de la Fase 1.

PASO 2 — VALIDACIÓN DE ESTRUCTURA:
Verifica con el usuario que la estructura de carpetas del proyecto coincide exactamente con la definida en la sección 3 del plan de infraestructura. Presenta el árbol de carpetas esperado y pide confirmación.

PASO 3 — EJECUCIÓN PASO 1.10: Primer Commit:
Proporciona los comandos exactos de Git para el primer commit:
```bash
git add .
git commit -m "chore: initialize Next.js project with TypeScript, Tailwind and tooling"
git push origin main
```
Explica la convención de Conventional Commits usada.

PASO 4 — CHECKLIST DE CIERRE:
Presenta el checklist completo del Checkpoint de Fase 1 del plan. Para cada item, indica cómo verificarlo. Pide al usuario confirmación de cada uno.

PASO 5 — CIERRE EN ESTADO DE EJECUCIÓN:
Actualiza `estado-ejecucion.md`:
- Tracker: Fase 1 → ✅ Completada, Cierre: [fecha/hora], Resumen generado: resumen-fase-1.md
- Estado Global: Fases completadas → 2/6, Porcentaje → 33%
- Historial FASE 1 → Evento de Cierre: fecha, resultado ✅ Exitoso, archivos creados (tsconfig.json, .eslintrc.json, .prettierrc, .prettierignore, vercel.json, .env.example, .vscode/settings.json), commit: "chore: initialize Next.js project..."
- Inventario de Archivos: actualizar con todos los archivos del proyecto.

PASO 6 — GENERAR RESUMEN INDEPENDIENTE:
Crea el archivo `resumen-fase-1.md` con la siguiente estructura:

---
# Resumen de Ejecución — Fase 1: Fundación del Proyecto
**Fecha de inicio:** [del estado de ejecución]
**Fecha de cierre:** [fecha actual]
**Estado:** ✅ Completada
**Ejecutor:** Ingeniero Fullstack Senior (Claude)

## Objetivo de la Fase
## Stack Instalado y Versiones
## Archivos Creados
## Archivos Modificados
## Configuraciones Aplicadas
## Comandos de Verificación y Resultados
## Commit Realizado
## Criterios de Éxito Verificados
## Notas para la Fase Siguiente
---

PASO 7 — INSTRUCCIÓN FINAL:
Indica al usuario que puede proceder al Prompt 2.1 para iniciar la Fase 2.
```

---

---

# FASE 2 — Capa de Datos JSON

---

## Prompt 2.1 — Inicio de Fase 2

> **Skill:** Ingeniero Backend TypeScript  
> **Objetivo:** Crear JSON DB, tipos e interfaces  
> **Acción en estado:** Marca Fase 2 como 🔄 En progreso

---

```
Actúa como Ingeniero Backend especializado en TypeScript, arquitecturas sin base de datos convencional y sistemas de persistencia con archivos JSON en entornos serverless.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Sección 4 completa (Capa de Datos JSON) con especial atención a la subsección 4.1 (Filosofía de Diseño) y la advertencia sobre Vercel readonly.
2. `plan-implementacion-fases.md` — Fase 2 completa (pasos 2.1 a 2.8).
3. `estado-ejecucion.md` — Verifica que la Fase 1 está ✅ Completada.

Confirma la lectura y el estado antes de continuar.

PASO 2 — REGISTRO DE INICIO:
Actualiza `estado-ejecucion.md`:
- Tracker: Fase 2 → 🔄 En progreso, Inicio: [fecha/hora]
- Estado Global: Fase activa → Fase 2
- Historial FASE 2 → Evento de Inicio.

PASO 3 — EJECUCIÓN PASO 2.1: Archivo de Datos Principal:
Proporciona el contenido completo de `/data/config.json` con la estructura definida en el plan. Explica cada campo y su propósito en el sistema.

PASO 4 — EJECUCIÓN PASO 2.2: Documentación de Datos:
Proporciona el contenido completo de `/data/README.md` incluyendo la tabla de archivos y el esquema de tipos.

PASO 5 — EJECUCIÓN PASO 2.3: Tipos TypeScript:
Proporciona el contenido completo de `/src/lib/types.ts` con:
- La interfaz `AppConfig` tipada y documentada.
- Las interfaces auxiliares `WithClassName` y `WithChildren`.
- Comentarios JSDoc en cada interfaz explicando su uso.

PASO 6 — REGISTRO DE ACTIVIDADES:
En `estado-ejecucion.md` → FASE 2 → Registro de Actividades:
- Tarea 2.1: /data/config.json creado con campos app y meta.
- Tarea 2.2: /data/README.md con esquema documentado.
- Tarea 2.3: /src/lib/types.ts con interfaz AppConfig y auxiliares.
- Inventario: agregar los tres archivos nuevos.

PASO 7 — INSTRUCCIÓN:
Pide al usuario que cree los archivos con el contenido proporcionado y ejecute el Prompt 2.2 para continuar con el módulo jsonDb.
```

---

## Prompt 2.2 — Módulo jsonDb y API Route

> **Skill:** Ingeniero Backend TypeScript  
> **Objetivo:** Implementar jsonDb.ts y la API Route  
> **Acción en estado:** Agrega actividades a Fase 2

---

```
Actúa como Ingeniero Backend especializado en TypeScript, Node.js filesystem API y Next.js API Routes en entornos serverless.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Secciones 4.3 (módulo jsonDb) y 5 (Arquitectura).
2. `plan-implementacion-fases.md` — Pasos 2.4 y 2.5 de la Fase 2.
3. `estado-ejecucion.md` — Confirma Fase 2 en 🔄 En progreso.

PASO 2 — EJECUCIÓN PASO 2.4: Módulo jsonDb.ts:
Proporciona el contenido completo de `/src/lib/jsonDb.ts` con:
- La función `readJsonFile<T>` con manejo de errores robusto.
- La función `writeJsonFile<T>` con la advertencia de producción.
- La función `listJsonFiles`.
- Comentarios JSDoc detallados en cada función.
- Una nota de advertencia al inicio del archivo sobre su uso exclusivo en el servidor.

Explica por qué este módulo solo puede usarse en Server Components y API Routes, y qué error ocurriría si se intentara usar en un Client Component.

PASO 3 — EJECUCIÓN PASO 2.5: API Route:
Proporciona el contenido completo de `/src/app/api/data/route.ts` con:
- El handler GET que usa readJsonFile.
- Manejo de errores con respuestas HTTP apropiadas.
- Comentario explicando qué datos se exponen y por qué solo los públicos.

PASO 4 — VERIFICACIÓN:
Proporciona el comando para iniciar el servidor y la instrucción para verificar el endpoint:
```bash
npm run dev
curl http://localhost:3000/api/data
```
Muestra la respuesta JSON esperada exacta.

PASO 5 — REGISTRO DE ACTIVIDADES:
En `estado-ejecucion.md` → FASE 2 → Registro de Actividades:
- Tarea 2.4: /src/lib/jsonDb.ts implementado con readJsonFile, writeJsonFile, listJsonFiles.
- Tarea 2.5: /src/app/api/data/route.ts creado y respondiendo en GET /api/data.
- Inventario: agregar los dos archivos nuevos.

PASO 6 — INSTRUCCIÓN:
Pide al usuario que cree los archivos, inicie el servidor, verifique el endpoint y luego ejecute el Prompt 2.3 para el cierre de la Fase 2.
```

---

## Prompt 2.3 — Cierre de Fase 2

> **Skill:** Ingeniero Backend TypeScript  
> **Objetivo:** Validar capa de datos, commit y generar resumen  
> **Acción en estado:** Marca Fase 2 como ✅ Completada y genera `resumen-fase-2.md`

---

```
Actúa como Ingeniero Backend especializado en TypeScript y sistemas de datos serverless.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Sección 4 y 5.
2. `plan-implementacion-fases.md` — Pasos 2.6, 2.7, 2.8 y Checkpoint de Fase 2.
3. `estado-ejecucion.md` — Revisa actividades registradas de Fase 2.

PASO 2 — VALIDACIÓN TÉCNICA:
Presenta los comandos de verificación y el resultado esperado:
```bash
npm run type-check   # 0 errores
curl http://localhost:3000/api/data  # JSON con datos de config.json
```
Pregunta al usuario si ambas verificaciones pasaron correctamente.

PASO 3 — COMMIT:
Proporciona el comando de commit:
```bash
git add .
git commit -m "feat: implement JSON database layer with types and jsonDb module"
git push origin main
```

PASO 4 — CIERRE EN ESTADO DE EJECUCIÓN:
Actualiza `estado-ejecucion.md`:
- Tracker: Fase 2 → ✅ Completada, Cierre: [fecha/hora], Resumen: resumen-fase-2.md
- Estado Global: Fases completadas → 3/6, Porcentaje → 50%
- Historial FASE 2 → Evento de Cierre con archivos creados.

PASO 5 — GENERAR RESUMEN INDEPENDIENTE:
Crea el archivo `resumen-fase-2.md`:

---
# Resumen de Ejecución — Fase 2: Capa de Datos JSON
**Fecha de inicio:** [del estado]
**Fecha de cierre:** [actual]
**Estado:** ✅ Completada
**Ejecutor:** Ingeniero Backend TypeScript (Claude)

## Objetivo de la Fase
## Arquitectura de Datos Implementada
## Archivos Creados
## Interfaz AppConfig — Esquema Completo
## Funciones del Módulo jsonDb
## Endpoints API Disponibles
## Consideraciones de Producción (Vercel readonly)
## Criterios de Éxito Verificados
## Commit Realizado
## Notas para la Fase Siguiente
---

PASO 6 — INSTRUCCIÓN FINAL:
Indica que la mitad del proyecto está completa (50%) y que puede proceder al Prompt 3.1 para iniciar la Fase 3, la más visual del proyecto.
```

---

---

# FASE 3 — Home "Hola Mundo"

---

## Prompt 3.1 — Inicio de Fase 3

> **Skill:** Diseñador UX/UI + Ingeniero Frontend  
> **Objetivo:** Estilos globales y layout raíz  
> **Acción en estado:** Marca Fase 3 como 🔄 En progreso

---

```
Actúa como Diseñador UX/UI Senior con profundo conocimiento en sistemas de diseño, animaciones web y como Ingeniero Frontend especializado en React, Next.js y Tailwind CSS. Tu enfoque es crear interfaces elegantes, accesibles y con animaciones que transmitan calidad profesional.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Sección 8 completa (Implementación del Home) con especial atención al boceto visual en 8.5.
2. `plan-implementacion-fases.md` — Fase 3 completa (pasos 3.1 a 3.10), enfocándote en la experiencia visual esperada.
3. `estado-ejecucion.md` — Verifica que la Fase 2 está ✅ Completada.

Como Diseñador UX/UI, describe en 3 líneas la experiencia visual que vas a crear y por qué las decisiones de diseño (colores, animaciones, tipografía) son correctas para un sistema de validación técnica.

PASO 2 — REGISTRO DE INICIO:
Actualiza `estado-ejecucion.md`:
- Tracker: Fase 3 → 🔄 En progreso, Inicio: [fecha/hora]
- Estado Global: Fase activa → Fase 3
- Historial FASE 3 → Evento de Inicio.

PASO 3 — EJECUCIÓN PASO 3.1: Limpieza de Archivos de Ejemplo:
Explica qué archivos generados por create-next-app deben limpiarse y por qué. Lista exactamente qué contenido eliminar de `page.tsx` y `globals.css`.

PASO 4 — EJECUCIÓN PASO 3.2: Estilos Globales:
Proporciona el contenido completo de `/src/app/globals.css`. Como Diseñador UX/UI, explica:
- Por qué el color de fondo `#030712` crea la atmósfera correcta.
- La utilidad `.gradient-text` y por qué el degradado indigo→purple→pink funciona visualmente.
- La importancia del `-webkit-font-smoothing: antialiased` para la calidad tipográfica.

PASO 5 — EJECUCIÓN PASO 3.3: Layout Raíz:
Proporciona el contenido completo de `/src/app/layout.tsx`. Explica la elección de la fuente Inter y cómo el metadata impacta en SEO.

PASO 6 — REGISTRO DE ACTIVIDADES:
En `estado-ejecucion.md` → FASE 3 → Registro de Actividades:
- Tarea 3.1: archivos de ejemplo de create-next-app limpiados.
- Tarea 3.2: globals.css implementado con paleta oscura y utilidades.
- Tarea 3.3: layout.tsx con fuente Inter y metadata.

PASO 7 — INSTRUCCIÓN:
Indica que los estilos base están listos y que ejecute el Prompt 3.2 para los componentes de animación, la parte más visual del proyecto.
```

---

## Prompt 3.2 — Componentes de Animación

> **Skill:** Diseñador UX/UI + Ingeniero Frontend  
> **Objetivo:** Crear AnimatedText.tsx y HolaMundo.tsx  
> **Acción en estado:** Agrega actividades a Fase 3

---

```
Actúa como Diseñador UX/UI Senior y como Ingeniero Frontend especializado en animaciones con Framer Motion, React y TypeScript. Tu misión es crear componentes que sean visualmente impactantes, técnicamente correctos y que transmitan calidad profesional.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Secciones 8.3 (HolaMundo), 8.4 (AnimatedText) y 8.5 (Vista Final Esperada).
2. `plan-implementacion-fases.md` — Pasos 3.4 y 3.5 de la Fase 3.
3. `estado-ejecucion.md` — Confirma Fase 3 en 🔄 En progreso.

Como Diseñador UX/UI, describe la secuencia de animación completa que el usuario verá, de principio a fin, en términos de experiencia y emoción.

PASO 2 — EJECUCIÓN PASO 3.4: Componente AnimatedText:
Proporciona el contenido completo de `/src/components/AnimatedText.tsx`.
Como Diseñador UX/UI, explica:
- Por qué animar letra por letra genera una sensación premium.
- El papel del blur en la entrada (blur: 8px → 0px) como efecto de enfoque.
- El timing staggerChildren: 0.06 y por qué ese valor específico se siente natural.
Como Ingeniero Frontend, explica:
- La estructura de variants en Framer Motion (containerVariants y charVariants).
- El manejo del espacio en blanco con '\u00A0'.
- La importancia del atributo `aria-label` para accesibilidad.

PASO 3 — EJECUCIÓN PASO 3.5: Componente HolaMundo:
Proporciona el contenido completo de `/src/components/HolaMundo.tsx`.
Como Diseñador UX/UI, explica cada una de las 6 capas visuales:
- Capa 1: Halo de luz — profundidad y atmósfera.
- Capa 2: Anillo orbital — movimiento sutil permanente.
- Capa 3: Título principal — el elemento de máximo peso visual.
- Capa 4: Subtítulo — jerarquía tipográfica y tracking amplio.
- Capa 5: Separador — ritmo visual y respiro.
- Capa 6: Badges — validación técnica como elemento de diseño.
Como Ingeniero Frontend, explica el timing de la secuencia de delays y por qué cada elemento aparece en ese orden específico.

PASO 4 — REGISTRO DE ACTIVIDADES:
En `estado-ejecucion.md` → FASE 3 → Registro de Actividades:
- Tarea 3.4: AnimatedText.tsx con animación staggered letra por letra.
- Tarea 3.5: HolaMundo.tsx con 6 capas visuales y secuencia de animación.
- Inventario: agregar los dos componentes.

PASO 5 — INSTRUCCIÓN:
Indica que los componentes visuales están listos y que ejecute el Prompt 3.3 para la página final, la validación y el cierre de Fase 3.
```

---

## Prompt 3.3 — Página Home y Cierre de Fase 3

> **Skill:** Diseñador UX/UI + Ingeniero Frontend  
> **Objetivo:** Page.tsx, validación visual, commit y resumen  
> **Acción en estado:** Marca Fase 3 como ✅ Completada y genera `resumen-fase-3.md`

---

```
Actúa como Diseñador UX/UI Senior y como Ingeniero Frontend, con foco en la integración final de componentes y la validación de la experiencia de usuario completa.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Secciones 8.2 (page.tsx), 8.5 (Vista Final) y 5 (Arquitectura Server/Client).
2. `plan-implementacion-fases.md` — Pasos 3.6 al 3.10 y el Checkpoint de Fase 3.
3. `estado-ejecucion.md` — Verifica las actividades de Fase 3 registradas.

PASO 2 — EJECUCIÓN PASO 3.6: Página Home:
Proporciona el contenido completo de `/src/app/page.tsx`.
Explica con precisión la separación de responsabilidades:
- Por qué page.tsx es un Server Component (no tiene 'use client').
- Cómo `readJsonFile` se ejecuta en el servidor, no en el cliente.
- Cómo los datos del JSON llegan al Client Component como props.
- Por qué esta arquitectura es más segura y performante que fetching desde el cliente.

PASO 3 — EJECUCIÓN PASO 3.7: Prueba Visual Local:
Proporciona el checklist de validación visual:
```
[ ] "Hola Mundo" aparece centrado vertical y horizontalmente
[ ] Las letras se animan de abajo hacia arriba con efecto blur
[ ] El halo de luz indigo pulsa suavemente en el fondo
[ ] El anillo orbital rota lentamente
[ ] La línea separadora aparece con animación de expansión
[ ] Los badges de validación aparecen al final de la secuencia
[ ] El diseño es responsive en móvil (< 640px)
```
Pide confirmación de cada item al usuario.

PASO 4 — EJECUCIÓN PASO 3.8: Verificación TypeScript y Build:
Proporciona los comandos y resultado esperado:
```bash
npm run type-check  # 0 errores
npm run lint        # 0 errores
npm run build       # ✓ Compiled successfully
```

PASO 5 — EJECUCIÓN PASO 3.9: Prueba de Ciclo de Datos:
Instruye al usuario para cambiar el `homeMessage` en `config.json` a otro texto, verificar el cambio en el navegador (reiniciando el servidor si necesario) y restaurar "Hola Mundo".

PASO 6 — COMMIT:
```bash
git add .
git commit -m "feat: implement Home page with Hola Mundo animation and JSON data binding"
git push origin main
```

PASO 7 — CIERRE EN ESTADO DE EJECUCIÓN:
Actualiza `estado-ejecucion.md`:
- Tracker: Fase 3 → ✅ Completada, Cierre: [fecha/hora], Resumen: resumen-fase-3.md
- Estado Global: Fases completadas → 4/6, Porcentaje → 67%
- Historial FASE 3 → Evento de Cierre.

PASO 8 — GENERAR RESUMEN INDEPENDIENTE:
Crea el archivo `resumen-fase-3.md`:

---
# Resumen de Ejecución — Fase 3: Home "Hola Mundo"
**Fecha de inicio:** [del estado]
**Fecha de cierre:** [actual]
**Estado:** ✅ Completada
**Ejecutor:** Diseñador UX/UI + Ingeniero Frontend (Claude)

## Objetivo de la Fase
## Experiencia Visual Implementada
## Componentes Creados
## Arquitectura Server/Client Component
## Capas de Animación y Efectos
## Paleta de Colores y Decisiones de Diseño
## Validación Visual — Checklist
## Ciclo de Datos JSON Verificado
## Criterios de Éxito Verificados
## Commit Realizado
## Notas para la Fase Siguiente
---

PASO 9 — INSTRUCCIÓN FINAL:
Felicita al usuario: el frontend está completo y funcional. Indica que puede proceder al Prompt 4.1 para el despliegue en Vercel.
```

---

---

# FASE 4 — Despliegue en Vercel

---

## Prompt 4.1 — Inicio de Fase 4

> **Skill:** Ingeniero DevOps + Cloud  
> **Objetivo:** Conectar GitHub con Vercel y ejecutar primer despliegue  
> **Acción en estado:** Marca Fase 4 como 🔄 En progreso

---

```
Actúa como Ingeniero DevOps y Cloud especializado en plataformas serverless, CI/CD pipelines y despliegue de aplicaciones Next.js en Vercel.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Secciones 7.4 (vercel.json), 9 (Pipeline de Despliegue) completo.
2. `plan-implementacion-fases.md` — Fase 4 completa (pasos 4.1 a 4.7).
3. `estado-ejecucion.md` — Verifica que la Fase 3 está ✅ Completada.

Confirma el estado y describe en 2 líneas qué va a ocurrir en el pipeline de Vercel cuando se haga el primer despliegue.

PASO 2 — REGISTRO DE INICIO:
Actualiza `estado-ejecucion.md`:
- Tracker: Fase 4 → 🔄 En progreso, Inicio: [fecha/hora]
- Estado Global: Fase activa → Fase 4
- Historial FASE 4 → Evento de Inicio.

PASO 3 — EJECUCIÓN PASO 4.1: Importar Proyecto en Vercel:
Proporciona las instrucciones detalladas paso a paso para importar el repositorio en Vercel, incluyendo:
- Cómo navegar al dashboard de Vercel.
- Qué configuraciones verificar en el wizard de importación.
- Qué variables de entorno agregar y con qué valores.
- Qué NO cambiar (dejar por defecto).

PASO 4 — EJECUCIÓN PASO 4.2: Monitorear el Build:
Explica cómo leer el log de build de Vercel en tiempo real. Proporciona los indicadores de éxito esperados y una tabla de los errores más comunes con sus causas y soluciones (del paso 4.6 del plan).

PASO 5 — EJECUCIÓN PASO 4.3: Verificación de URL de Producción:
Proporciona el checklist de verificación post-despliegue:
```
[ ] URL de producción accesible en el navegador
[ ] "Hola Mundo" visible con animaciones
[ ] Sin errores en consola del navegador (F12)
[ ] Badge "TypeScript ✓ validado" visible
[ ] Endpoint /api/data respondiendo
```

PASO 6 — REGISTRO DE ACTIVIDADES:
En `estado-ejecucion.md` → FASE 4 → Registro de Actividades:
- Tarea 4.1: Proyecto importado en Vercel.
- Tarea 4.2: Build inicial monitoreado.
- Tarea 4.3: URL de producción verificada.
- Indicar que se registre la URL de producción cuando esté disponible.

PASO 7 — INSTRUCCIÓN:
Una vez que el usuario confirme que la URL de producción funciona, indícale que ejecute el Prompt 4.2 para verificar el pipeline automático y cerrar la Fase 4.
```

---

## Prompt 4.2 — Verificación y Cierre de Fase 4

> **Skill:** Ingeniero DevOps + Cloud  
> **Objetivo:** Verificar pipeline automático, commit final y resumen  
> **Acción en estado:** Marca Fase 4 como ✅ Completada y genera `resumen-fase-4.md`

---

```
Actúa como Ingeniero DevOps y Cloud especializado en CI/CD pipelines y validación de despliegues en producción.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Sección 9 (Pipeline) con especial atención a 9.2 y 9.3 (ambientes).
2. `plan-implementacion-fases.md` — Pasos 4.4, 4.5, 4.6, 4.7 y Checkpoint de Fase 4.
3. `estado-ejecucion.md` — Revisa actividades de Fase 4.

PASO 2 — EJECUCIÓN PASO 4.4: Configuración de Dominio (Opcional):
Explica brevemente cómo agregar un dominio personalizado en Vercel si el usuario lo desea, sin entrar en detalles de DNS específicos del proveedor.

PASO 3 — EJECUCIÓN PASO 4.5: Verificar Pipeline Automático:
Proporciona los comandos exactos para hacer un cambio menor que dispare el pipeline:
```bash
# El usuario debe editar /data/config.json → "version": "1.0.1"
git add data/config.json
git commit -m "chore: bump version to 1.0.1"
git push origin main
```
Explica qué observar en el Vercel Dashboard y cómo confirmar que el despliegue automático ocurrió. Indica que restaure la versión a "1.0.0" después.

PASO 4 — VERIFICACIÓN DEL ENDPOINT EN PRODUCCIÓN:
Proporciona el comando curl con la URL real de producción:
```bash
curl https://[tu-proyecto].vercel.app/api/data
```
Muestra la respuesta esperada y pide confirmación.

PASO 5 — EJECUCIÓN PASO 4.7: Commit Final de Fase:
```bash
git add .
git commit -m "chore: add vercel.json and finalize production deployment configuration"
git push origin main
```

PASO 6 — CIERRE EN ESTADO DE EJECUCIÓN:
Actualiza `estado-ejecucion.md`:
- Tracker: Fase 4 → ✅ Completada, Cierre: [fecha/hora], Resumen: resumen-fase-4.md
- Estado Global: Fases completadas → 5/6, Porcentaje → 83%
- Historial FASE 4 → Evento de Cierre, URL de producción registrada.
- Inventario: agregar URL de producción como referencia.

PASO 7 — GENERAR RESUMEN INDEPENDIENTE:
Crea el archivo `resumen-fase-4.md`:

---
# Resumen de Ejecución — Fase 4: Despliegue en Vercel
**Fecha de inicio:** [del estado]
**Fecha de cierre:** [actual]
**Estado:** ✅ Completada
**Ejecutor:** Ingeniero DevOps + Cloud (Claude)

## Objetivo de la Fase
## URL de Producción
## Configuración de Vercel Aplicada
## Variables de Entorno Configuradas
## Pipeline CI/CD — Flujo Verificado
## Ambientes de Despliegue Activos
## Build Log — Resumen
## Errores Encontrados y Resoluciones
## Criterios de Éxito Verificados
## Commits Realizados
## Notas para la Fase Siguiente
---

PASO 8 — INSTRUCCIÓN FINAL:
El sistema está en producción. Solo queda la Fase 5 de certificación. Indica que puede proceder al Prompt 5.1.
```

---

---

# FASE 5 — Validación Final y Documentación

---

## Prompt 5.1 — Inicio de Fase 5

> **Skill:** Ingeniero QA + Fullstack  
> **Objetivo:** Validación cross-browser, responsive y ciclo de datos  
> **Acción en estado:** Marca Fase 5 como 🔄 En progreso

---

```
Actúa como Ingeniero QA (Quality Assurance) Senior con experiencia en testing de aplicaciones web, validación cross-browser, pruebas de responsividad y verificación de pipelines de datos. Complementado con conocimiento Fullstack para entender los detalles técnicos de lo que se está probando.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Sección 10 (Validación y Pruebas) completa.
2. `plan-implementacion-fases.md` — Fase 5 completa (pasos 5.1 a 5.8).
3. `estado-ejecucion.md` — Verifica que la Fase 4 está ✅ Completada y que existe una URL de producción registrada.

Como Ingeniero QA, describe en 3 líneas qué riesgos está cubriendo esta fase de validación y por qué cada prueba es necesaria.

PASO 2 — REGISTRO DE INICIO:
Actualiza `estado-ejecucion.md`:
- Tracker: Fase 5 → 🔄 En progreso, Inicio: [fecha/hora]
- Estado Global: Fase activa → Fase 5
- Historial FASE 5 → Evento de Inicio.

PASO 3 — EJECUCIÓN PASO 5.1: Validación Cross-Browser:
Presenta el plan de prueba cross-browser completo:
- Lista de navegadores a probar.
- Para cada navegador, el checklist exacto de qué verificar.
- Cómo acceder a las DevTools en cada navegador.
- Qué constituiría un fallo de prueba y cómo documentarlo en el estado de ejecución.

PASO 4 — EJECUCIÓN PASO 5.2: Validación Responsive:
Presenta el plan de prueba responsive:
- Los breakpoints exactos a probar.
- Cómo activar el modo responsive en Chrome DevTools.
- El checklist para cada tamaño de pantalla.
- Qué elementos son críticos en móvil vs desktop.

PASO 5 — EJECUCIÓN PASO 5.3: Ciclo de Datos JSON:
Proporciona las instrucciones exactas para ejecutar el ciclo de validación:
```bash
# 1. Editar config.json
# 2. Commit y push
git add data/config.json
git commit -m "test: validate JSON data binding in production"
git push origin main
# 3. Esperar build de Vercel (~1-2 min)
# 4. Verificar en producción
# 5. Restaurar y hacer commit final
git add data/config.json
git commit -m "chore: restore homeMessage to Hola Mundo"
git push origin main
```

PASO 6 — EJECUCIÓN PASO 5.4: Validación del Endpoint API:
Proporciona el comando curl con la URL de producción y la respuesta esperada. Incluye prueba de error (qué pasa si el JSON tiene un error de sintaxis).

PASO 7 — REGISTRO DE ACTIVIDADES:
En `estado-ejecucion.md` → FASE 5 → Registro de Actividades:
- Tarea 5.1: Cross-browser iniciado (navegadores probados / pendientes).
- Tarea 5.2: Pruebas responsive iniciadas.
- Tarea 5.3: Ciclo de datos JSON ejecutado.
- Tarea 5.4: Endpoint API validado en producción.

PASO 8 — INSTRUCCIÓN:
Una vez que todas las pruebas pasen, ejecutar el Prompt 5.2 para la certificación final y el cierre del proyecto.
```

---

## Prompt 5.2 — Certificación y Cierre de Fase 5

> **Skill:** Ingeniero QA + Fullstack  
> **Objetivo:** Certificación final, README, tag y resumen de cierre  
> **Acción en estado:** Marca Fase 5 como ✅ Completada y genera `resumen-fase-5.md` y `resumen-proyecto-final.md`

---

```
Actúa como Ingeniero QA Senior y Arquitecto de Software. Tu rol en este prompt es certificar formalmente que el sistema cumple todos los criterios de aceptación definidos en el plan y documentar el proyecto completo para futuros desarrolladores.

PASO 1 — LECTURA OBLIGATORIA DE DOCUMENTOS BASE:
Lee los tres documentos adjuntos:
1. `plan-infraestructura-fullstack.md` — Secciones 10 (Validación), 11 (Roadmap) y 12 (Convenciones). Es la última vez que este documento se leerá como referencia de este proyecto.
2. `plan-implementacion-fases.md` — Pasos 5.5 al 5.8 y el Checklist de Certificación Final completo.
3. `estado-ejecucion.md` — Lee el historial COMPLETO de todas las fases para redactar el resumen final.

PASO 2 — EJECUCIÓN PASO 5.5: Revisión Final de Calidad:
Proporciona los comandos y resultado esperado:
```bash
npm run validate  # type-check + lint: 0 errores
npm run build     # ✓ Compiled successfully
git status        # nothing to commit, working tree clean
```

PASO 3 — EJECUCIÓN PASO 5.6: Actualizar README del Proyecto:
Proporciona el contenido completo del `README.md` del repositorio GitHub con:
- URL de producción (pedir al usuario que la complete).
- Stack completo con versiones.
- Instrucciones de instalación local.
- Sección sobre la JSON DB.
- Tabla de scripts.
- Sección de despliegue.

PASO 4 — EJECUCIÓN PASO 5.7: Tag de Versión:
```bash
git add README.md
git commit -m "docs: update README with project documentation and production URL"
git push origin main

git tag -a v1.0.0 -m "feat: first stable release — Home Hola Mundo"
git push origin v1.0.0
```
Explica la importancia del tag semántico para el control de versiones.

PASO 5 — CHECKLIST DE CERTIFICACIÓN FINAL:
Presenta el checklist completo de la sección 5.8 del plan de implementación, organizado en categorías (Infraestructura, TypeScript, Datos, Home, Calidad, Validación). Para cada item, indica si está verificado basándose en el historial del estado de ejecución.

PASO 6 — CIERRE EN ESTADO DE EJECUCIÓN:
Actualiza `estado-ejecucion.md` por última vez:
- Tracker: Fase 5 → ✅ Completada, Cierre: [fecha/hora], Resumen: resumen-fase-5.md
- Estado Global: Estado actual → ✅ Proyecto Completado, Fases completadas → 6/6, Porcentaje → 100%
- Historial FASE 5 → Evento de Cierre completo.
- Agrega una sección final al documento:

```markdown
## 🏁 Cierre del Proyecto
**Fecha de finalización:** [fecha]
**Estado final:** ✅ Sistema implementado, validado y desplegado en producción
**URL de producción:** https://[tu-proyecto].vercel.app
**Tag de versión:** v1.0.0
**Total de commits:** [número aproximado]
**Duración total:** [calcular desde inicio Fase 0 hasta ahora]
```

PASO 7 — GENERAR RESUMEN DE FASE 5:
Crea el archivo `resumen-fase-5.md`:

---
# Resumen de Ejecución — Fase 5: Validación Final y Documentación
**Fecha de inicio:** [del estado]
**Fecha de cierre:** [actual]
**Estado:** ✅ Completada
**Ejecutor:** Ingeniero QA + Fullstack (Claude)

## Objetivo de la Fase
## Pruebas Cross-Browser — Resultados
## Pruebas Responsive — Resultados
## Validación del Ciclo de Datos JSON
## Validación del Endpoint API en Producción
## Calidad de Código — Resultados Finales
## Documentación Generada
## Tag de Versión
## Criterios de Éxito Verificados
## Commits Realizados
---

PASO 8 — GENERAR RESUMEN FINAL DEL PROYECTO:
Crea el archivo `resumen-proyecto-final.md`:

---
# 🏆 Resumen Final del Proyecto
## Sistema Fullstack TypeScript + Next.js + Vercel + JSON DB
**Versión:** 1.0.0
**Fecha de inicio:** [Fase 0]
**Fecha de finalización:** [Fase 5]
**URL de Producción:** https://[tu-proyecto].vercel.app

## Resumen Ejecutivo
[3-4 párrafos describiendo qué se construyó, cómo funciona y qué se logró]

## Stack Tecnológico Final
## Arquitectura Implementada
## Fases Ejecutadas y Duración
## Archivos del Proyecto — Inventario Completo
## Decisiones Técnicas Clave
## Lo que Funciona en Producción
## Siguientes Pasos Recomendados
## Skills de Claude Utilizados por Fase
---

PASO 9 — MENSAJE FINAL:
Felicita al usuario por completar el proyecto. Resume en 5 líneas lo que se logró: un sistema fullstack TypeScript con Next.js desplegado en Vercel, con una JSON DB funcional, un Home animado con "Hola Mundo" y un pipeline de CI/CD automático entre GitHub y Vercel — todo en TypeScript estricto y sin errores.
```

---

---

## 📌 Referencia Rápida — Archivos Generados por Fase

| Fase | Archivo de Resumen | Contenido |
|---|---|---|
| 0 | `resumen-fase-0.md` | Entorno configurado, herramientas verificadas |
| 1 | `resumen-fase-1.md` | Proyecto Next.js, TypeScript, herramientas de calidad |
| 2 | `resumen-fase-2.md` | JSON DB, tipos, módulo jsonDb, API Route |
| 3 | `resumen-fase-3.md` | Componentes, animaciones, Home completo |
| 4 | `resumen-fase-4.md` | URL de producción, pipeline CI/CD activo |
| 5 | `resumen-fase-5.md` | Validaciones, documentación, certificación |
| — | `resumen-proyecto-final.md` | Resumen completo del proyecto (generado en Fase 5) |
| — | `estado-ejecucion.md` | Historial acumulativo de toda la implementación |

---

*prompts-implementacion.md — Documento de referencia para la ejecución del plan. No modificar durante la implementación.*
