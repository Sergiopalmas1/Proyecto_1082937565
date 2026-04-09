# Resumen Fase 6 — CI/CD

## Objetivo
Configurar la canalización de integración continua y despliegue para el proyecto Next.js.

## Cambios realizados
- Creado `vercel.json` para describir cómo se debe desplegar el proyecto en Vercel.
- Creado `.github/workflows/validate.yml` para ejecutar validaciones automáticas en GitHub Actions.
- Agregado `.gitignore` para excluir `node_modules/`, `.next/`, archivos de entorno y logs.

## Detalles de la configuración
- `vercel.json`
  - Framework: `nextjs`
  - Build: `npm run build`
  - Install: `npm install`
  - Output directory: `.next`
  - Región: `iad1`
- `.github/workflows/validate.yml`
  - Disparadores: `push` en `main`, `develop`, `master`; `pull_request` a `main` y `master`.
  - Jobs:
    - `typecheck`: instala dependencias y ejecuta `npm run typecheck`
    - `lint`: instala dependencias y ejecuta `npm run lint`

## Resultados actuales
- Commit local generado y enviado a `origin` en la rama `master`.
- El flujo de GitHub Actions está listo para ejecutarse en la rama `master`.
- No se ha completado la vinculación con Vercel ni se ha obtenido una URL de producción.
- La validación del workflow depende de un push o PR futuro en GitHub.

## Observaciones
- El repositorio usa actualmente la rama `master`; la configuración se adaptó para incluirla.
- La etapa de despliegue final queda pendiente hasta la vinculación de Vercel y la ejecución del pipeline.
