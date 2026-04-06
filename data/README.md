# 📁 Capa de Datos — JSON como Base de Datos

## Propósito

La carpeta `/data` almacena archivos JSON que actúan como fuente de verdad para la aplicación. Estos archivos son leídos únicamente desde el servidor (Server Components o Route Handlers) usando el módulo `fs` de Node.js.

## Regla de Oro

⚠️ **Los archivos JSON en `/data` NUNCA son accedidos directamente desde el cliente browser**. Toda lectura ocurre en:
- Server Components (`app/page.tsx` sin "use client")
- Route Handlers (`app/api/*/route.ts`)

## Archivos Disponibles

### `config.json`
Configuración global de la aplicación.
- `appName` (string): Nombre de la aplicación
- `version` (string): Versión actual
- `locale` (string): Código de localización (ej: "es-CO")
- `theme` (enum): "light" | "dark"

### `home.json`
Contenido de la página Home con animación.
- `hero.title` (string): Título principal
- `hero.subtitle` (string): Subtítulo
- `hero.description` (string): Descripción del sistema
- `hero.animationStyle` (enum): "typewriter" | "fadeIn" | "slideUp"
- `meta.pageTitle` (string): Título para SEO
- `meta.description` (string): Descripción para SEO

## Cómo Agregar Nuevos Archivos JSON

1. Crear el archivo en esta carpeta: `/data/mi-recurso.json`
2. Definir su interfaz TypeScript en `/lib/types.ts`
3. Crear su schema Zod de validación en `/lib/validators.ts`
4. Agregar función tipada en `/lib/dataService.ts` para leerlo
5. Usar en Server Components o Route Handlers

## Lectura de Datos

```typescript
// En un Server Component o Route Handler
import { readHomeData } from '@/lib/dataService';

const data = readHomeData(); // Tipado y validado
```

## Validación

Todos los datos leídos son validados contra sus respectivos schemas Zod antes de ser usados.
