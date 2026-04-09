# Resumen Fase 4 — API Route Handler

Fecha: 09/04/2026

## Objetivo
Crear endpoints serverless en Next.js App Router para exponer los datos de `/data/home.json` y `/data/config.json` mediante Route Handlers en `/api/data` y `/api/config`.

## Endpoints creados

### `GET /api/data`
Ruta: `app/api/data/route.ts`
Código completo:
```ts
import { NextResponse } from 'next/server';
import { readHomeData } from '../../../lib/dataService';
import { HomeDataSchema } from '../../../lib/validators';

export async function GET() {
  try {
    const data = readHomeData();
    const validated = HomeDataSchema.parse(data);

    return NextResponse.json(validated, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Error reading home data',
        details: message,
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
```

### `GET /api/config`
Ruta: `app/api/config/route.ts`
Código completo:
```ts
import { NextResponse } from 'next/server';
import { readAppConfig } from '../../../lib/dataService';
import { AppConfigSchema } from '../../../lib/validators';

export async function GET() {
  try {
    const config = readAppConfig();
    const validated = AppConfigSchema.parse(config);

    return NextResponse.json(validated, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Error reading app config',
        details: message,
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
```

## Manejo de errores implementado

- Cada endpoint captura errores durante la lectura o la validación.
- Si ocurre un fallo, se retorna `500` con un JSON de error y `details` explícitos.
- Las respuestas exitosas usan `Content-Type: application/json`.

## Pruebas locales documentadas

Comandos planeados para prueba local:
- `curl http://localhost:3000/api/data`
- `curl http://localhost:3000/api/config`

Resultados:
- No se pudo iniciar el servidor de desarrollo local ni ejecutar las pruebas porque `node`/`npm` no están disponibles en esta terminal.
- Los endpoints se crearon correctamente y la sintaxis fue validada por el editor sin errores.

## Resultado de typecheck

- `npm run typecheck` no pudo ejecutarse localmente por falta de `npm` en el entorno.
- Se verificó la validez de los archivos `app/api/data/route.ts` y `app/api/config/route.ts` usando los diagnósticos del editor: no se encontraron errores.

## Notas sobre patrón Server-only

- Los datos se leen exclusivamente desde el servidor usando `readHomeData()` y `readAppConfig()`.
- Ningún JSON de `/data` se expone directamente al cliente.
- La validación Zod se ejecuta antes de retornar los datos, asegurando que el payload cumple la estructura esperada.

## Estado final
CON OBSERVACIONES

## Próxima fase
UI / Home — Hola Mundo
