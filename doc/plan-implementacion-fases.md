# 🚀 Plan de Implementación por Fases
## Sistema Fullstack TypeScript + Next.js + Vercel + JSON DB

> **Proyecto:** Sistema Fullstack TypeScript  
> **Versión del Plan:** 1.0.0  
> **Referencia:** Plan de Infraestructura Fullstack v1.0.0  
> **Metodología:** Entrega incremental por fases validadas

---

## 📋 Resumen Ejecutivo

| Fase | Nombre | Duración Estimada | Entregable Principal |
|---|---|---|---|
| **0** | Preparación del Entorno | 2–4 horas | Entorno local listo y repositorio creado |
| **1** | Fundación del Proyecto | 4–6 horas | Proyecto Next.js inicializado y estructurado |
| **2** | Capa de Datos JSON | 2–3 horas | JSON DB funcional con tipos TypeScript |
| **3** | Home "Hola Mundo" | 3–5 horas | Página animada y validada en local |
| **4** | Despliegue en Vercel | 1–2 horas | URL de producción activa |
| **5** | Validación Final | 2–3 horas | Sistema certificado y documentado |

**Duración total estimada:** 14–23 horas de trabajo efectivo

---

## ⚠️ Prerequisitos Globales

Antes de iniciar cualquier fase, confirmar que se cuenta con:

```
[ ] Cuenta activa en GitHub (github.com)
[ ] Cuenta activa en Vercel (vercel.com) vinculada a GitHub
[ ] Node.js 20.x LTS instalado
[ ] npm 10.x instalado
[ ] Git 2.40+ instalado y configurado con usuario/email
[ ] VS Code instalado (recomendado)
[ ] Terminal de línea de comandos disponible
```

Verificación rápida:
```bash
node --version    # debe mostrar v20.x.x
npm --version     # debe mostrar 10.x.x
git --version     # debe mostrar 2.40+
```

---

## 🔵 FASE 0 — Preparación del Entorno

**Duración estimada:** 2–4 horas  
**Objetivo:** Tener todas las herramientas, cuentas y configuraciones listas antes de escribir una sola línea de código.

---

### 0.1 Configuración de Git Global

```bash
# Configurar identidad de Git (si no está hecha)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Configurar rama principal como 'main'
git config --global init.defaultBranch main

# Verificar configuración
git config --global --list
```

**✅ Criterio de éxito:** `git config --global --list` muestra nombre y email correctos.

---

### 0.2 Creación del Repositorio en GitHub

```
1. Ir a github.com → botón "New repository"
2. Configurar:
   - Repository name: mi-proyecto-fullstack
   - Visibility: Public (recomendado para Vercel gratuito)
   - ✅ Add a README file
   - .gitignore template: Node
   - License: MIT (opcional)
3. Clic en "Create repository"
4. Copiar la URL del repositorio (HTTPS o SSH)
```

**✅ Criterio de éxito:** Repositorio visible en `github.com/tu-usuario/mi-proyecto-fullstack`

---

### 0.3 Vinculación de Vercel con GitHub

```
1. Ir a vercel.com → Log in with GitHub
2. Autorizar permisos de Vercel a GitHub
3. Verificar que el dashboard de Vercel muestra tu cuenta
4. NO crear proyecto aún — eso se hace en Fase 4
```

**✅ Criterio de éxito:** Dashboard de Vercel accesible y vinculado a GitHub.

---

### 0.4 Instalación de Extensiones VS Code

Abrir VS Code → Extensions (Ctrl+Shift+X) → instalar:

```
- Tailwind CSS IntelliSense    (bradlc.vscode-tailwindcss)
- ESLint                       (dbaeumer.vscode-eslint)
- Prettier                     (esbenp.prettier-vscode)
- TypeScript Next              (ms-vscode.vscode-typescript-next)
- Auto Rename Tag              (formulahendry.auto-rename-tag)
- GitLens                      (eamodio.gitlens)
```

**✅ Criterio de éxito:** Todas las extensiones instaladas y activas.

---

### 0.5 Configuración de VS Code para el Proyecto

Crear archivo `.vscode/settings.json` (después de inicializar el proyecto):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

**✅ Criterio de éxito:** VS Code formatea automáticamente al guardar archivos `.ts` y `.tsx`.

---

### 📍 Checkpoint Fase 0

```
[ ] Git configurado con nombre y email
[ ] Repositorio creado en GitHub
[ ] Vercel vinculado con GitHub
[ ] VS Code con extensiones instaladas
[ ] Node.js 20.x, npm 10.x y Git 2.40+ verificados
```

> **Si todos los items están marcados → proceder a Fase 1.**

---

## 🟢 FASE 1 — Fundación del Proyecto

**Duración estimada:** 4–6 horas  
**Objetivo:** Inicializar el proyecto Next.js con TypeScript, establecer la estructura de carpetas definida en el plan de infraestructura y configurar todas las herramientas de calidad de código.

---

### 1.1 Inicialización con Create Next App

```bash
# Clonar el repositorio vacío creado en Fase 0
git clone https://github.com/tu-usuario/mi-proyecto-fullstack.git
cd mi-proyecto-fullstack

# Inicializar Next.js dentro del repositorio
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

> El flag `--no-turbopack` garantiza mayor estabilidad en el build de Vercel por ahora.

**✅ Criterio de éxito:** La instalación termina sin errores y existe la carpeta `/src/app`.

---

### 1.2 Instalación de Dependencias del Proyecto

```bash
# Dependencias de producción
npm install framer-motion

# Dependencias de desarrollo
npm install -D prettier eslint-config-prettier @types/node
```

**✅ Criterio de éxito:** `node_modules` actualizado, sin errores en `npm install`.

---

### 1.3 Configuración de TypeScript Estricto

Reemplazar el contenido de `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Verificación:**
```bash
npx tsc --noEmit
# Resultado esperado: sin output (0 errores)
```

**✅ Criterio de éxito:** `tsc --noEmit` retorna sin errores.

---

### 1.4 Configuración de ESLint

Reemplazar `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "prefer-const": "error"
  }
}
```

**✅ Criterio de éxito:** `npm run lint` pasa sin errores.

---

### 1.5 Configuración de Prettier

Crear `.prettierrc` en la raíz:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": []
}
```

Crear `.prettierignore`:

```
node_modules
.next
out
public
*.json
```

**✅ Criterio de éxito:** `npx prettier --check "src/**/*.{ts,tsx}"` pasa limpio.

---

### 1.6 Actualizar `.gitignore`

Verificar que `.gitignore` incluye las siguientes entradas (añadir si faltan):

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# Vercel
.vercel

# Variables de entorno — NUNCA subir al repositorio
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
```

---

### 1.7 Crear la Estructura de Carpetas

```bash
# Crear carpetas del proyecto
mkdir -p src/components
mkdir -p src/lib
mkdir -p src/styles
mkdir -p data
mkdir -p public
mkdir -p .vscode

# Crear archivos vacíos placeholder
touch src/components/.gitkeep
touch src/lib/.gitkeep
touch data/.gitkeep
```

**Estructura resultante verificada:**
```
/mi-proyecto-fullstack
├── /src
│   ├── /app
│   │   ├── layout.tsx       ← generado por create-next-app
│   │   ├── page.tsx         ← generado por create-next-app
│   │   └── globals.css      ← generado por create-next-app
│   ├── /components          ← creado manualmente
│   └── /lib                 ← creado manualmente
├── /data                    ← creado manualmente
├── /public
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── .eslintrc.json
├── .prettierrc
└── .gitignore
```

---

### 1.8 Crear Archivos de Configuración de Despliegue

**`vercel.json`** en la raíz:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["gru1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, max-age=0" }
      ]
    }
  ]
}
```

**`.env.example`** en la raíz:

```bash
# Copiar este archivo como .env.local y completar los valores
NEXT_PUBLIC_APP_NAME=Mi Proyecto Fullstack
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**`.env.local`** en la raíz (NO subir al repo):

```bash
NEXT_PUBLIC_APP_NAME=Mi Proyecto Fullstack
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

### 1.9 Actualizar Scripts en `package.json`

Agregar scripts adicionales en la sección `"scripts"`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "validate": "npm run type-check && npm run lint"
  }
}
```

---

### 1.10 Primer Commit

```bash
git add .
git commit -m "chore: initialize Next.js project with TypeScript, Tailwind and tooling"
git push origin main
```

**✅ Criterio de éxito:** Commit visible en GitHub con toda la estructura del proyecto.

---

### 📍 Checkpoint Fase 1

```
[ ] create-next-app ejecutado sin errores
[ ] framer-motion instalado
[ ] tsconfig.json con modo strict habilitado
[ ] npm run type-check → 0 errores
[ ] npm run lint → 0 errores
[ ] Estructura de carpetas creada (/src/components, /src/lib, /data)
[ ] vercel.json creado
[ ] .env.example creado
[ ] .gitignore actualizado (incluye .env.local)
[ ] Primer commit subido a GitHub
```

> **Si todos los items están marcados → proceder a Fase 2.**

---

## 🟡 FASE 2 — Capa de Datos JSON

**Duración estimada:** 2–3 horas  
**Objetivo:** Implementar la "base de datos" JSON, definir los tipos TypeScript correspondientes y crear el módulo de acceso a datos que será utilizado por los componentes del servidor.

---

### 2.1 Crear el Archivo de Datos Principal

Crear `/data/config.json`:

```json
{
  "app": {
    "name": "Mi Proyecto Fullstack",
    "version": "1.0.0",
    "description": "Sistema TypeScript con Next.js, Vercel y JSON DB",
    "homeMessage": "Hola Mundo",
    "theme": "dark"
  },
  "meta": {
    "createdAt": "2025-01-01",
    "updatedAt": "2025-01-01"
  }
}
```

---

### 2.2 Crear el Archivo de Documentación de Datos

Crear `/data/README.md`:

```markdown
# 🗄️ Carpeta /data — Base de Datos JSON

Esta carpeta contiene los archivos JSON que actúan como fuente de datos del sistema.

## Reglas

1. Todos los archivos deben tener extensión `.json`
2. Cada archivo debe corresponder a un tipo TypeScript definido en `/src/lib/types.ts`
3. Los archivos JSON son de **solo lectura en producción (Vercel)**
4. Para modificar datos en producción, editar el JSON y hacer commit + push

## Archivos

| Archivo | Descripción | Tipo TypeScript |
|---|---|---|
| `config.json` | Configuración global de la aplicación | `AppConfig` |

## Esquema config.json

\`\`\`typescript
interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    homeMessage: string;
    theme: 'light' | 'dark';
  };
  meta: {
    createdAt: string;
    updatedAt: string;
  };
}
\`\`\`
```

---

### 2.3 Definir los Tipos TypeScript

Crear `/src/lib/types.ts`:

```typescript
// ============================================================
// Tipos globales del sistema
// Cada tipo debe corresponder a la estructura de un JSON en /data
// ============================================================

/**
 * Estructura de /data/config.json
 */
export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    homeMessage: string;
    theme: 'light' | 'dark';
  };
  meta: {
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Props comunes reutilizables
 */
export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}
```

---

### 2.4 Implementar el Módulo `jsonDb.ts`

Crear `/src/lib/jsonDb.ts`:

```typescript
/**
 * jsonDb.ts — Capa de abstracción para la base de datos JSON
 *
 * IMPORTANTE: Este módulo solo puede ejecutarse en el servidor.
 * Usar únicamente en:
 *   - Server Components (page.tsx, layout.tsx sin 'use client')
 *   - API Routes (route.ts)
 *
 * En Vercel, el sistema de archivos es de solo lectura en runtime.
 * Los archivos JSON en /data son fuente de verdad estática.
 */

import fs from 'fs';
import path from 'path';

// Ruta absoluta a la carpeta /data
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Lee un archivo JSON de /data y lo retorna tipado.
 *
 * @param filename - Nombre del archivo (ej: 'config.json')
 * @returns El contenido del archivo parseado con el tipo T
 * @throws Error si el archivo no existe o el JSON es inválido
 */
export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[jsonDb] Archivo no encontrado: ${filename}\n` +
      `Ruta buscada: ${filePath}`
    );
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(
      `[jsonDb] Error al parsear ${filename}: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
}

/**
 * Escribe o reemplaza un archivo JSON en /data.
 *
 * ADVERTENCIA: Solo funciona en entorno local.
 * En Vercel (producción/preview) el filesystem es readonly.
 *
 * @param filename - Nombre del archivo destino (ej: 'config.json')
 * @param data - Objeto a serializar y guardar
 */
export function writeJsonFile<T>(filename: string, data: T): void {
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[jsonDb] writeJsonFile no tiene efecto en producción (Vercel filesystem es readonly)'
    );
    return;
  }

  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Lista todos los archivos .json disponibles en /data
 *
 * @returns Array de nombres de archivos JSON
 */
export function listJsonFiles(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
}
```

---

### 2.5 Crear la API Route para Exponer Datos

Crear `/src/app/api/data/route.ts`:

```typescript
/**
 * GET /api/data
 * Endpoint de ejemplo que expone la configuración pública de la app.
 * Demuestra el uso de jsonDb.ts desde una API Route.
 */

import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/jsonDb';
import type { AppConfig } from '@/lib/types';

export async function GET() {
  try {
    const config = readJsonFile<AppConfig>('config.json');

    // Solo exponer datos públicos — nunca datos sensibles
    return NextResponse.json({
      success: true,
      data: {
        name: config.app.name,
        version: config.app.version,
        description: config.app.description,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno',
      },
      { status: 500 }
    );
  }
}
```

---

### 2.6 Verificar la Capa de Datos

```bash
# Iniciar servidor de desarrollo
npm run dev

# En otra terminal o en el navegador, verificar el endpoint:
curl http://localhost:3000/api/data
# Respuesta esperada:
# {"success":true,"data":{"name":"Mi Proyecto Fullstack","version":"1.0.0",...}}
```

**✅ Criterio de éxito:** El endpoint `/api/data` retorna los datos del JSON correctamente.

---

### 2.7 Verificar TypeScript en la Capa de Datos

```bash
npm run type-check
# Resultado esperado: sin output (0 errores)
```

---

### 2.8 Commit de la Capa de Datos

```bash
git add .
git commit -m "feat: implement JSON database layer with types and jsonDb module"
git push origin main
```

---

### 📍 Checkpoint Fase 2

```
[ ] /data/config.json creado con estructura correcta
[ ] /data/README.md documentando el esquema
[ ] /src/lib/types.ts con interfaz AppConfig definida
[ ] /src/lib/jsonDb.ts con readJsonFile, writeJsonFile y listJsonFiles
[ ] /src/app/api/data/route.ts respondiendo en GET /api/data
[ ] curl http://localhost:3000/api/data retorna datos del JSON
[ ] npm run type-check → 0 errores
[ ] Commit subido a GitHub
```

> **Si todos los items están marcados → proceder a Fase 3.**

---

## 🟠 FASE 3 — Home "Hola Mundo"

**Duración estimada:** 3–5 horas  
**Objetivo:** Implementar la página principal con el mensaje "Hola Mundo" centrado, con el efecto visual elegante definido en el plan de infraestructura, leyendo el mensaje dinámicamente desde el JSON.

---

### 3.1 Limpiar Archivos Generados por Create Next App

Los archivos generados por defecto deben limpiarse antes de implementar los propios:

```bash
# Eliminar el CSS de ejemplo
# Reemplazar globals.css con versión limpia (ver paso 3.2)

# Eliminar el contenido de page.tsx
# Reemplazar con versión propia (ver paso 3.4)
```

---

### 3.2 Implementar Estilos Globales

Reemplazar `/src/app/globals.css` completamente:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Variables CSS del sistema */
:root {
  --color-bg: #030712;
  --color-fg: #f9fafb;
  --color-accent: #6366f1;
}

/* Reset y base */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-fg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Utilidad para gradiente de texto */
.gradient-text {
  background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

### 3.3 Implementar el Layout Raíz

Reemplazar `/src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Mi Proyecto Fullstack',
  description: 'Sistema TypeScript con Next.js, Vercel y JSON DB',
  keywords: ['TypeScript', 'Next.js', 'Vercel', 'Fullstack'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

### 3.4 Implementar el Componente de Texto Animado

Crear `/src/components/AnimatedText.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
}

/**
 * Divide el texto en caracteres y los anima individualmente
 * para un efecto de entrada elegante letra por letra.
 */
export default function AnimatedText({ text }: AnimatedTextProps) {
  const characters = text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.3,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="inline-flex flex-wrap justify-center gap-x-[0.02em]"
      aria-label={text}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={charVariants}
          className={char === ' ' ? 'w-4' : ''}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
```

---

### 3.5 Implementar el Componente Principal HolaMundo

Crear `/src/components/HolaMundo.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import AnimatedText from './AnimatedText';

interface HolaMundoProps {
  message: string;
  version: string;
}

export default function HolaMundo({ message, version }: HolaMundoProps) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-8 text-center px-6">

      {/* Capa 1: Halo de luz de fondo — efecto de profundidad */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '520px',
          height: '520px',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(167,139,250,0.06) 50%, transparent 75%)',
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Capa 2: Anillo orbital decorativo */}
      <motion.div
        className="absolute rounded-full border border-indigo-500/10 pointer-events-none"
        style={{ width: '420px', height: '420px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Capa 3: Título principal — "Hola Mundo" */}
      <motion.h1
        className="relative text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight gradient-text"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <AnimatedText text={message} />
      </motion.h1>

      {/* Capa 4: Subtítulo del stack */}
      <motion.p
        className="relative text-gray-500 text-sm sm:text-base font-light tracking-[0.3em] uppercase"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
      >
        TypeScript · Next.js · Vercel
      </motion.p>

      {/* Capa 5: Separador con degradado animado */}
      <motion.div
        className="relative h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(99,102,241,0.7), rgba(167,139,250,0.7), transparent)',
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '240px', opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.2, ease: 'easeOut' }}
      />

      {/* Capa 6: Badges de validación */}
      <motion.div
        className="relative flex flex-col sm:flex-row items-center gap-3 mt-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease: 'easeOut' }}
      >
        {/* Badge TypeScript */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full
                     border border-indigo-500/25 bg-indigo-500/8
                     backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-indigo-300 text-xs font-mono tracking-wide">
            TypeScript ✓ validado
          </span>
        </div>

        {/* Badge versión */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full
                     border border-purple-500/25 bg-purple-500/8
                     backdrop-blur-sm"
        >
          <span className="text-purple-300 text-xs font-mono tracking-wide">
            v{version}
          </span>
        </div>
      </motion.div>

    </div>
  );
}
```

---

### 3.6 Implementar la Página Home

Reemplazar `/src/app/page.tsx` completamente:

```typescript
/**
 * Home — Página principal
 *
 * Server Component: lee datos del JSON en el servidor
 * y los pasa al Client Component para la animación.
 */

import { readJsonFile } from '@/lib/jsonDb';
import type { AppConfig } from '@/lib/types';
import HolaMundo from '@/components/HolaMundo';

export default function HomePage() {
  // Lectura directa del JSON en el servidor (sin fetch, sin API)
  const config = readJsonFile<AppConfig>('config.json');

  return (
    <main className="min-h-screen bg-[#030712] flex items-center justify-center overflow-hidden">
      <HolaMundo
        message={config.app.homeMessage}
        version={config.app.version}
      />
    </main>
  );
}
```

---

### 3.7 Verificar en Entorno Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador:
# http://localhost:3000
```

**Verificar visualmente:**
```
[ ] "Hola Mundo" aparece centrado vertical y horizontalmente
[ ] Las letras se animan de abajo hacia arriba con efecto blur
[ ] El halo de luz indigo pulsa suavemente en el fondo
[ ] El anillo orbital rota lentamente
[ ] La línea separadora aparece con animación de expansión
[ ] Los badges de validación aparecen al final de la secuencia
[ ] El diseño es responsive en móvil (< 640px)
```

---

### 3.8 Verificar TypeScript y Lint

```bash
# Sin errores de tipo
npm run type-check

# Sin advertencias de lint
npm run lint

# Build de producción limpio
npm run build
```

**✅ Criterio de éxito:**
- `type-check` → 0 errores
- `lint` → 0 errores
- `build` → "✓ Compiled successfully"

---

### 3.9 Probar Cambio de Datos desde JSON

```bash
# Editar /data/config.json — cambiar homeMessage
# Ejemplo: "homeMessage": "¡Funciona!"

# Con npm run dev activo, el hot-reload debería reflejar el cambio
# (o reiniciar el servidor si es Server Component)

# Restaurar a "Hola Mundo" antes del commit
```

**✅ Criterio de éxito:** El mensaje en pantalla refleja el valor del JSON.

---

### 3.10 Commit del Home

```bash
git add .
git commit -m "feat: implement Home page with Hola Mundo animation and JSON data binding"
git push origin main
```

---

### 📍 Checkpoint Fase 3

```
[ ] globals.css limpio sin estilos de ejemplo
[ ] layout.tsx con metadatos correctos
[ ] AnimatedText.tsx con animación letra por letra
[ ] HolaMundo.tsx con todos los efectos visuales
[ ] page.tsx leyendo datos de config.json vía jsonDb
[ ] http://localhost:3000 muestra "Hola Mundo" centrado con animación
[ ] Efecto halo, anillo, separador y badges visibles
[ ] Responsive en móvil verificado
[ ] npm run type-check → 0 errores
[ ] npm run lint → 0 errores
[ ] npm run build → exitoso
[ ] Commit subido a GitHub
```

> **Si todos los items están marcados → proceder a Fase 4.**

---

## 🔴 FASE 4 — Despliegue en Vercel

**Duración estimada:** 1–2 horas  
**Objetivo:** Conectar el repositorio GitHub con Vercel y conseguir la URL de producción activa con el Home funcionando.

---

### 4.1 Importar el Proyecto en Vercel

```
1. Ir a vercel.com → Dashboard → "Add New..." → "Project"
2. En "Import Git Repository" → seleccionar "mi-proyecto-fullstack"
3. Configurar el proyecto:
   - Framework Preset: Next.js (se detecta automáticamente)
   - Root Directory: ./ (dejar por defecto)
   - Build Command: npm run build (dejar por defecto)
   - Output Directory: .next (dejar por defecto)
4. Expandir "Environment Variables" → agregar:
   - NEXT_PUBLIC_APP_NAME = Mi Proyecto Fullstack
   - NEXT_PUBLIC_APP_VERSION = 1.0.0
5. Clic en "Deploy"
```

---

### 4.2 Monitorear el Build Inicial

En el dashboard de Vercel, observar el log de build en tiempo real:

```
✅ Cloning github.com/tu-usuario/mi-proyecto-fullstack
✅ Installing dependencies
✅ Running "npm run build"
   ✅ TypeScript check passed
   ✅ Linting passed
   ✅ Compiled successfully
✅ Deploying to Edge Network
✅ Deployment complete
```

**Si hay errores:** Ver la sección de Solución de Problemas al final de esta fase.

---

### 4.3 Verificar la URL de Producción

```
1. Vercel muestra la URL: https://mi-proyecto-fullstack.vercel.app
2. Abrir la URL en el navegador
3. Verificar:
   [ ] La página carga correctamente
   [ ] "Hola Mundo" aparece centrado
   [ ] Las animaciones funcionan igual que en local
   [ ] No hay errores en la consola del navegador (F12)
```

---

### 4.4 Configurar el Dominio de Producción (Opcional)

```
Vercel Dashboard → Project → Settings → Domains
→ Agregar dominio personalizado si se dispone de uno
→ Seguir instrucciones de DNS que indica Vercel
```

---

### 4.5 Verificar el Pipeline Automático

Para confirmar que el despliegue automático funciona:

```bash
# Hacer un cambio menor — ej: actualizar la versión en config.json
# Editar /data/config.json → "version": "1.0.1"

git add data/config.json
git commit -m "chore: bump version to 1.0.1"
git push origin main
```

**Verificar en Vercel Dashboard:** Debe aparecer un nuevo deployment automáticamente.  
**Verificar en producción:** La URL debe mostrar `v1.0.1` en el badge de versión.

---

### 4.6 Solución de Problemas Comunes en Build

| Error | Causa probable | Solución |
|---|---|---|
| `Cannot find module 'framer-motion'` | Dependencia no instalada | `npm install framer-motion` y push |
| `Type error: ...` | Error de TypeScript | Correr `npm run type-check` local y corregir |
| `fs is not defined` | Uso de `readJsonFile` en Client Component | Mover la llamada a un Server Component |
| `ENOENT: no such file` | Ruta del JSON incorrecta | Verificar que `/data/config.json` existe en el repo |
| `Module not found: @/*` | Paths de tsconfig no reconocidos | Verificar `tsconfig.json` → `paths` configurado |

---

### 4.7 Commit de Configuración Final

```bash
git add .
git commit -m "chore: add vercel.json and env configuration for production"
git push origin main
```

---

### 📍 Checkpoint Fase 4

```
[ ] Proyecto importado en Vercel desde GitHub
[ ] Variables de entorno configuradas en Vercel Dashboard
[ ] Build inicial exitoso (sin errores en el log)
[ ] URL de producción accesible: https://mi-proyecto.vercel.app
[ ] "Hola Mundo" visible en producción con animaciones
[ ] Sin errores en consola del navegador (producción)
[ ] Pipeline automático verificado (push → build → deploy)
[ ] URL de producción documentada
```

> **Si todos los items están marcados → proceder a Fase 5.**

---

## 🟣 FASE 5 — Validación Final y Documentación

**Duración estimada:** 2–3 horas  
**Objetivo:** Certificar que el sistema completo funciona correctamente en todos los entornos y documentar el proyecto para futuros desarrollos.

---

### 5.1 Validación Cross-Browser

Verificar la URL de producción en los siguientes navegadores:

```
[ ] Google Chrome (versión actual)
[ ] Mozilla Firefox (versión actual)
[ ] Safari (macOS / iOS)
[ ] Edge (Windows)
```

Para cada navegador verificar:
```
[ ] La página carga sin errores
[ ] Las animaciones de Framer Motion funcionan correctamente
[ ] El gradiente de texto es visible
[ ] El layout está centrado
[ ] La consola no muestra errores JavaScript
```

---

### 5.2 Validación Responsive

Usar las DevTools del navegador (F12 → Toggle device toolbar):

```
[ ] Mobile S (320px) — "Hola Mundo" visible y centrado
[ ] Mobile M (375px) — animaciones funcionando
[ ] Mobile L (425px) — badges visibles
[ ] Tablet (768px)   — layout correcto
[ ] Laptop (1024px)  — diseño completo
[ ] Desktop (1440px) — sin desbordamientos
```

---

### 5.3 Validación del Ciclo de Datos JSON

Confirmar el flujo completo de datos:

```bash
# 1. Editar el mensaje en el JSON
# /data/config.json → "homeMessage": "¡Sistema Validado!"

# 2. Hacer commit y push
git add data/config.json
git commit -m "test: validate JSON data binding in production"
git push origin main

# 3. Esperar el build de Vercel (1-2 min)
# 4. Verificar en la URL de producción que el mensaje cambió
# 5. Restaurar "Hola Mundo"
git add data/config.json
git commit -m "chore: restore homeMessage to Hola Mundo"
git push origin main
```

**✅ Criterio de éxito:** El cambio en el JSON se refleja en producción tras el despliegue.

---

### 5.4 Validación del Endpoint API

```bash
# Verificar API en producción
curl https://mi-proyecto-fullstack.vercel.app/api/data

# Respuesta esperada:
# {
#   "success": true,
#   "data": {
#     "name": "Mi Proyecto Fullstack",
#     "version": "1.0.0",
#     "description": "Sistema TypeScript con Next.js, Vercel y JSON DB"
#   }
# }
```

**✅ Criterio de éxito:** El endpoint responde con los datos del JSON en producción.

---

### 5.5 Revisión Final de Calidad de Código

```bash
# Ejecutar suite completa de validación
npm run validate

# Verificar que el build de producción pasa limpio
npm run build

# Verificar que no hay archivos temporales subidos al repo
git status
# Resultado esperado: "nothing to commit, working tree clean"
```

---

### 5.6 Actualizar el README del Proyecto

Actualizar `/README.md` del repositorio:

```markdown
# Mi Proyecto Fullstack

Sistema web fullstack construido con TypeScript, Next.js y desplegado en Vercel.
Utiliza archivos JSON como capa de persistencia de datos.

## 🚀 URL de Producción

https://mi-proyecto-fullstack.vercel.app

## 🛠️ Stack

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript 5 (modo estricto)
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Hosting:** Vercel
- **Datos:** JSON files en /data

## 📦 Instalación Local

\`\`\`bash
git clone https://github.com/tu-usuario/mi-proyecto-fullstack.git
cd mi-proyecto-fullstack
npm install
cp .env.example .env.local
npm run dev
\`\`\`

Abrir http://localhost:3000

## 🗄️ Base de Datos JSON

Los datos se gestionan en archivos `.json` dentro de `/data`.
Ver `/data/README.md` para el esquema completo.

## 📋 Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run lint` | Verificar ESLint |
| `npm run validate` | type-check + lint |

## 🚢 Despliegue

Automático: cualquier push a `main` despliega en Vercel.
```

---

### 5.7 Commit y Tag de Versión

```bash
git add README.md
git commit -m "docs: update README with project documentation and production URL"
git push origin main

# Crear tag de versión estable
git tag -a v1.0.0 -m "feat: first stable release — Home Hola Mundo"
git push origin v1.0.0
```

---

### 5.8 Checklist de Certificación Final

```
INFRAESTRUCTURA
[ ] Repositorio GitHub activo y actualizado
[ ] Vercel conectado al repositorio
[ ] Pipeline automático de CI/CD funcionando
[ ] Variables de entorno configuradas en Vercel

TYPESCRIPT
[ ] Modo strict habilitado en tsconfig.json
[ ] npm run type-check → 0 errores en local
[ ] Build de producción compila TypeScript sin errores

DATOS
[ ] /data/config.json con estructura correcta
[ ] jsonDb.ts funcionando con tipos genéricos
[ ] API Route GET /api/data respondiendo en producción

HOME
[ ] "Hola Mundo" centrado vertical y horizontalmente
[ ] Animación elegante letra por letra funcionando
[ ] Halo de luz, anillo orbital y separador animados
[ ] Badges de validación visibles
[ ] Mensaje proviene dinámicamente del JSON

CALIDAD
[ ] ESLint → 0 errores
[ ] Prettier configurado y activo
[ ] .gitignore correcto (.env.local no subido)
[ ] README actualizado con URL de producción
[ ] Tag v1.0.0 creado en el repositorio

VALIDACIÓN
[ ] Cross-browser: Chrome, Firefox, Safari, Edge
[ ] Responsive: mobile, tablet, desktop
[ ] Ciclo JSON → producción verificado
[ ] Endpoint /api/data funciona en producción
```

---

### 📍 Checkpoint Fase 5 — Sistema Certificado

```
[ ] Todos los items del Checklist de Certificación Final marcados
[ ] URL de producción documentada en el README
[ ] Tag v1.0.0 creado y subido a GitHub
[ ] Sistema funciona correctamente en producción
```

> **✅ IMPLEMENTACIÓN COMPLETADA EXITOSAMENTE**

---

## 📊 Resumen del Plan por Fases

```
FASE 0 — Preparación        ████░░░░░░  2-4h   Git, GitHub, Vercel, VS Code
FASE 1 — Fundación          ████████░░  4-6h   Next.js, TypeScript, estructura
FASE 2 — Capa de Datos      ████░░░░░░  2-3h   JSON DB, tipos, API Route
FASE 3 — Home Hola Mundo    ███████░░░  3-5h   Componentes, animaciones, validación
FASE 4 — Despliegue Vercel  ███░░░░░░░  1-2h   Import, build, producción activa
FASE 5 — Validación Final   ████░░░░░░  2-3h   Cross-browser, docs, certificación
                            ────────────────────────────────
                            TOTAL:      14-23h de trabajo efectivo
```

---

## 🔮 Siguientes Pasos (Post-Implementación)

Una vez completadas las 5 fases, el sistema está listo para escalar con:

```
→ Nuevas páginas y rutas bajo /src/app
→ Nuevos archivos JSON en /data para más entidades de datos
→ Componentes reutilizables en /src/components
→ Autenticación con NextAuth.js o Clerk
→ Integración con base de datos externa (PlanetScale, Supabase)
  si el volumen de datos supera la capacidad del JSON DB
→ Tests con Vitest o Jest + Testing Library
→ Internacionalización con next-intl
```

---

*Plan de Implementación por Fases — Sistema Fullstack TypeScript v1.0.0*
