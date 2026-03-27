# 🏗️ Plan de Infraestructura — Fullstack TypeScript + Vercel + JSON DB

> **Versión:** 1.0.0  
> **Arquitecto:** Asistente de Software  
> **Stack:** Next.js · TypeScript · Vercel · GitHub · JSON como base de datos

---

## 📋 Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estructura del Repositorio](#3-estructura-del-repositorio)
4. [Capa de Datos — JSON como Base de Datos](#4-capa-de-datos--json-como-base-de-datos)
5. [Arquitectura de la Aplicación](#5-arquitectura-de-la-aplicación)
6. [Requisitos Técnicos](#6-requisitos-técnicos)
7. [Configuración del Entorno](#7-configuración-del-entorno)
8. [Implementación del Home — "Hola Mundo"](#8-implementación-del-home--hola-mundo)
9. [Pipeline de Despliegue — GitHub + Vercel](#9-pipeline-de-despliegue--github--vercel)
10. [Validación y Pruebas](#10-validación-y-pruebas)
11. [Roadmap de Implementación](#11-roadmap-de-implementación)
12. [Convenciones y Estándares](#12-convenciones-y-estándares)

---

## 1. Visión General

Este documento define el plan de infraestructura para un sistema web **fullstack en TypeScript**, con las siguientes características fundamentales:

- **Frontend y Backend unificados** bajo Next.js (App Router)
- **Sin base de datos convencional**: toda la persistencia se gestiona a través de archivos `.json` dentro de una carpeta `/data`
- **Despliegue automático** mediante la integración nativa entre GitHub y Vercel
- **Validación inicial**: página Home con el mensaje "Hola Mundo" centrado y un efecto visual elegante como prueba de concepto del stack TypeScript

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                        DEVELOPER                            │
│                    (Local Machine)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │  git push
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                        │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │   /src      │  │   /data      │  │  /public          │  │
│  │  (App Code) │  │  (JSON DB)   │  │  (Static Assets)  │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │  Webhook trigger (push to main)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   VERCEL PLATFORM                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Build Pipeline                          │   │
│  │   npm install → tsc check → next build → deploy     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Edge Network (CDN Global)                  │   │
│  │         https://tu-proyecto.vercel.app               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión | Justificación |
|---|---|---|---|
| Framework | **Next.js** | 15.x | App Router, SSR/SSG, API Routes nativas |
| Lenguaje | **TypeScript** | 5.x | Tipado estático, autocompletado, seguridad |
| Estilos | **Tailwind CSS** | 3.x | Utilidades CSS, sin fricción con TS |
| Animaciones | **Framer Motion** | 11.x | Efectos elegantes declarativos en React |
| Runtime | **Node.js** | 20.x LTS | Compatibilidad con Vercel y ecosistema |
| Hosting | **Vercel** | — | Integración nativa Next.js, SSL automático |
| Control de Versiones | **GitHub** | — | CI/CD automático con Vercel |
| Linter | **ESLint** | 9.x | Calidad y consistencia del código |
| Formatter | **Prettier** | 3.x | Formato uniforme |

---

## 3. Estructura del Repositorio

```
/mi-proyecto
│
├── /src
│   ├── /app                          # Next.js App Router
│   │   ├── layout.tsx                # Layout raíz global
│   │   ├── page.tsx                  # Home — "Hola Mundo"
│   │   ├── globals.css               # Estilos globales
│   │   └── /api                      # API Routes (Backend)
│   │       └── /data
│   │           └── route.ts          # Endpoint de ejemplo para leer JSON
│   │
│   ├── /components                   # Componentes reutilizables
│   │   ├── HolaMundo.tsx             # Componente principal del Home
│   │   └── AnimatedText.tsx          # Componente de efecto elegante
│   │
│   ├── /lib                          # Utilidades y helpers
│   │   ├── jsonDb.ts                 # Capa de abstracción JSON DB
│   │   └── types.ts                  # Tipos e interfaces globales
│   │
│   └── /styles
│       └── animations.css            # Keyframes y estilos de animación
│
├── /data                             # 🗄️ Base de datos JSON
│   ├── config.json                   # Configuración global de la app
│   └── README.md                     # Documentación del esquema de datos
│
├── /public                           # Assets estáticos
│   └── favicon.ico
│
├── .env.local                        # Variables de entorno (local, NO subir)
├── .env.example                      # Plantilla de variables de entorno
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── next.config.ts                    # Configuración Next.js
├── tailwind.config.ts                # Configuración Tailwind
├── tsconfig.json                     # Configuración TypeScript
├── package.json
└── vercel.json                       # Configuración de despliegue Vercel
```

---

## 4. Capa de Datos — JSON como Base de Datos

### 4.1 Filosofía de Diseño

En lugar de una base de datos relacional o NoSQL, el sistema utiliza archivos `.json` dentro de `/data`. Esta decisión es adecuada para proyectos con:

- Datos relativamente estáticos o de bajo volumen
- Sin necesidad de transacciones concurrentes complejas
- Portabilidad total del proyecto (sin dependencias externas)

> ⚠️ **Consideración importante:** En Vercel (entorno serverless), el sistema de archivos es **de solo lectura** en tiempo de ejecución. Los archivos JSON en `/data` son ideales para **lectura** (datos de configuración, contenido estático, catálogos). Para escritura dinámica, se deberá usar una alternativa como Vercel KV o el propio repositorio como fuente de verdad mediante commits.

### 4.2 Estructura de Datos

```
/data
├── config.json          # Configuración y metadatos de la app
└── README.md            # Documentación del esquema
```

**`/data/config.json`** — Ejemplo inicial:

```json
{
  "app": {
    "name": "Mi Proyecto Fullstack",
    "version": "1.0.0",
    "description": "Sistema TypeScript con JSON DB",
    "homeMessage": "Hola Mundo",
    "theme": "dark"
  },
  "meta": {
    "createdAt": "2025-01-01",
    "updatedAt": "2025-01-01"
  }
}
```

### 4.3 Módulo `jsonDb.ts` — Capa de Abstracción

```typescript
// src/lib/jsonDb.ts

import fs from 'fs';
import path from 'path';

// Ruta base hacia la carpeta /data
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Lee un archivo JSON de la carpeta /data y lo devuelve tipado.
 * Solo disponible en el servidor (API Routes / Server Components).
 */
export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo no encontrado: ${filename}`);
  }
  
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/**
 * Escribe o actualiza un archivo JSON en /data.
 * NOTA: Solo funciona en entorno local. En Vercel es readonly.
 */
export function writeJsonFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
```

### 4.4 Tipos TypeScript para los Datos

```typescript
// src/lib/types.ts

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
```

---

## 5. Arquitectura de la Aplicación

### 5.1 Patrón Arquitectónico

Se adopta el patrón **Server Components + Client Components** de Next.js 15:

```
┌─────────────────────────────────────────────────┐
│              VERCEL SERVERLESS                  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │         Server Components (RSC)         │   │
│  │  - Leen archivos JSON directamente      │   │
│  │  - No exponen datos sensibles           │   │
│  │  - Renderizan HTML en el servidor       │   │
│  └────────────────┬────────────────────────┘   │
│                   │ props                        │
│  ┌────────────────▼────────────────────────┐   │
│  │         Client Components               │   │
│  │  - Efectos visuales (Framer Motion)     │   │
│  │  - Interactividad del usuario           │   │
│  │  - Estado local (useState, useEffect)   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │           API Routes (/api/*)           │   │
│  │  - Sirven datos JSON como REST endpoints│   │
│  │  - Lógica de negocio del servidor       │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 5.2 Flujo de Datos

```
Solicitud del Usuario
        │
        ▼
   Next.js Router
        │
        ▼
  Server Component (page.tsx)
        │
        ├─── Lee /data/config.json vía jsonDb.ts
        │
        ▼
  Renderiza HTML + Props al Client Component
        │
        ▼
  Client Component (HolaMundo.tsx)
        │
        ├─── Aplica animaciones con Framer Motion
        │
        ▼
  UI Final en el navegador
```

---

## 6. Requisitos Técnicos

### 6.1 Requisitos del Entorno de Desarrollo

| Requisito | Versión Mínima | Verificación |
|---|---|---|
| Node.js | 20.x LTS | `node --version` |
| npm | 10.x | `npm --version` |
| Git | 2.40+ | `git --version` |
| Cuenta GitHub | — | github.com |
| Cuenta Vercel | — | vercel.com (vinculada a GitHub) |
| Editor | VS Code recomendado | — |

### 6.2 Extensiones Recomendadas para VS Code

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

### 6.3 Requisitos de TypeScript

El archivo `tsconfig.json` debe garantizar el modo estricto:

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

---

## 7. Configuración del Entorno

### 7.1 Inicialización del Proyecto

```bash
# 1. Crear proyecto Next.js con TypeScript
npx create-next-app@latest mi-proyecto \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# 2. Entrar al directorio
cd mi-proyecto

# 3. Instalar dependencias adicionales
npm install framer-motion
npm install -D prettier eslint-config-prettier

# 4. Crear carpeta de datos
mkdir data
echo '{"app":{"name":"Mi Proyecto","version":"1.0.0","homeMessage":"Hola Mundo","theme":"dark"},"meta":{"createdAt":"2025-01-01","updatedAt":"2025-01-01"}}' > data/config.json
```

### 7.2 Variables de Entorno

```bash
# .env.example (subir al repo como plantilla)
NEXT_PUBLIC_APP_NAME=Mi Proyecto Fullstack
NEXT_PUBLIC_APP_VERSION=1.0.0

# .env.local (NUNCA subir al repo — agregar a .gitignore)
NEXT_PUBLIC_APP_NAME=Mi Proyecto Fullstack
```

### 7.3 Configuración de `.gitignore`

```gitignore
# Dependencies
node_modules/

# Next.js build
.next/
out/

# Vercel
.vercel

# Environment variables — NUNCA subir
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
```

### 7.4 `vercel.json` — Configuración de Despliegue

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

> `"regions": ["gru1"]` despliega en São Paulo (el más cercano a Colombia en Vercel).

---

## 8. Implementación del Home — "Hola Mundo"

### 8.1 Layout Raíz

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mi Proyecto Fullstack',
  description: 'Sistema TypeScript + Next.js + Vercel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 8.2 Página Home (Server Component)

```typescript
// src/app/page.tsx
import { readJsonFile } from '@/lib/jsonDb';
import type { AppConfig } from '@/lib/types';
import HolaMundo from '@/components/HolaMundo';

export default function HomePage() {
  // Leer datos desde el JSON en el servidor
  const config = readJsonFile<AppConfig>('config.json');

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <HolaMundo message={config.app.homeMessage} />
    </main>
  );
}
```

### 8.3 Componente HolaMundo (Client Component con animación)

```typescript
// src/components/HolaMundo.tsx
'use client';

import { motion } from 'framer-motion';

interface HolaMundoProps {
  message: string;
}

export default function HolaMundo({ message }: HolaMundoProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
      
      {/* Anillo de luz animado */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Texto principal con entrada elegante */}
      <motion.h1
        className="relative text-6xl md:text-8xl font-bold tracking-tight"
        initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <span
          className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 
                     bg-clip-text text-transparent"
        >
          {message}
        </span>
      </motion.h1>

      {/* Subtítulo con delay */}
      <motion.p
        className="relative text-gray-400 text-lg md:text-xl font-light tracking-widest uppercase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
      >
        TypeScript · Next.js · Vercel
      </motion.p>

      {/* Línea decorativa animada */}
      <motion.div
        className="relative h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '200px', opacity: 1 }}
        transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
      />

      {/* Badge de validación TypeScript */}
      <motion.div
        className="relative flex items-center gap-2 mt-2 px-4 py-2 
                   rounded-full border border-indigo-500/30 bg-indigo-500/10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.4, ease: 'backOut' }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-indigo-300 text-sm font-mono">
          TypeScript ✓ validado
        </span>
      </motion.div>
    </div>
  );
}
```

### 8.4 Estilos Globales

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #030712;
  --foreground: #f9fafb;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* Prevenir FOUC en animaciones */
* {
  box-sizing: border-box;
}
```

### 8.5 Vista Final Esperada

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│           ✦  [halo de luz difusa indigo]  ✦         │
│                                                     │
│          H o l a   M u n d o                        │
│         (gradiente indigo → purple → pink)          │
│                                                     │
│      T Y P E S C R I P T  ·  N E X T . J S         │
│                                                     │
│              ─────────────────                      │
│                                                     │
│         ● TypeScript ✓ validado                     │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
         Fondo: #030712 (negro azulado profundo)
```

---

## 9. Pipeline de Despliegue — GitHub + Vercel

### 9.1 Configuración Inicial (una sola vez)

```
1. Subir repositorio a GitHub
   └── git init → git add . → git commit -m "feat: initial commit" → git push

2. Conectar Vercel al repositorio
   └── vercel.com → New Project → Import Git Repository → Seleccionar repo

3. Configurar variables de entorno en Vercel Dashboard
   └── Project Settings → Environment Variables → Agregar las de .env.example

4. Primer despliegue automático al importar
   └── Vercel construye y despliega automáticamente
```

### 9.2 Flujo de Trabajo Continuo

```
Desarrollador                GitHub                    Vercel
     │                          │                         │
     │── git push origin main ──►│                         │
     │                          │── Webhook trigger ──────►│
     │                          │                         │── npm install
     │                          │                         │── tsc --noEmit
     │                          │                         │── next build
     │                          │                         │── Deploy to CDN
     │                          │◄── Status check ────────│
     │◄── Build status ─────────│                         │
     │                          │                         │
```

### 9.3 Ambientes de Despliegue

| Branch | Ambiente | URL |
|---|---|---|
| `main` | **Producción** | `https://tu-proyecto.vercel.app` |
| `develop` | **Preview** | `https://tu-proyecto-git-develop-tu-usuario.vercel.app` |
| `feature/*` | **Preview** | `https://tu-proyecto-git-feature-xxx.vercel.app` |

### 9.4 Scripts `package.json`

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

## 10. Validación y Pruebas

### 10.1 Checklist de Validación TypeScript

Antes de cada push, ejecutar:

```bash
# Verificar tipos TypeScript sin compilar
npm run type-check

# Ejecutar linter
npm run lint

# Build de producción local (detecta errores de build)
npm run build
```

### 10.2 Criterios de Aceptación del Home

| Criterio | Descripción | Cómo verificar |
|---|---|---|
| ✅ Centrado | El texto "Hola Mundo" está centrado vertical y horizontalmente | Visual en `/` |
| ✅ Efecto elegante | Animación de entrada con fade + blur + slide | Visual en `/` |
| ✅ TypeScript válido | Sin errores de tipo en compilación | `npm run type-check` |
| ✅ Build exitoso | Next.js construye sin errores | `npm run build` |
| ✅ Datos desde JSON | El mensaje proviene de `/data/config.json` | Cambiar JSON y hot-reload |
| ✅ Responsive | Funciona en móvil y escritorio | DevTools → mobile view |

### 10.3 Verificación del Pipeline Vercel

```bash
# Verificar que Vercel CLI está instalado (opcional pero útil)
npm install -g vercel

# Desplegar en preview desde local
vercel

# Desplegar en producción desde local
vercel --prod
```

---

## 11. Roadmap de Implementación

### Fase 1 — Fundación (Día 1–2)

```
[ ] Crear repositorio GitHub
[ ] Inicializar proyecto Next.js con TypeScript
[ ] Configurar ESLint + Prettier
[ ] Crear estructura de carpetas según este plan
[ ] Crear /data/config.json inicial
[ ] Implementar jsonDb.ts (capa de abstracción)
[ ] Definir tipos en types.ts
```

### Fase 2 — Home "Hola Mundo" (Día 2–3)

```
[ ] Implementar layout.tsx
[ ] Implementar page.tsx (Server Component con lectura de JSON)
[ ] Instalar Framer Motion
[ ] Implementar HolaMundo.tsx con animación
[ ] Configurar globals.css
[ ] Validar en entorno local (npm run dev)
[ ] Ejecutar npm run type-check → 0 errores
[ ] Ejecutar npm run build → exitoso
```

### Fase 3 — Despliegue (Día 3)

```
[ ] Push a GitHub (rama main)
[ ] Conectar repositorio en vercel.com
[ ] Configurar variables de entorno en Vercel
[ ] Verificar build automático exitoso
[ ] Acceder a https://tu-proyecto.vercel.app
[ ] Validar animación en producción
[ ] Documentar URL de producción
```

### Fase 4 — Validación Final (Día 4)

```
[ ] Test en múltiples navegadores (Chrome, Firefox, Safari)
[ ] Test responsivo en móvil
[ ] Modificar homeMessage en config.json → verificar reflejo en UI
[ ] Revisar métricas de performance en Vercel Analytics
[ ] Documentar estructura para futuros colaboradores
```

---

## 12. Convenciones y Estándares

### 12.1 Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `HolaMundo.tsx` |
| Utilidades/lib | camelCase | `jsonDb.ts` |
| Interfaces/Types | PascalCase con I opcional | `AppConfig`, `UserData` |
| Variables/funciones | camelCase | `readJsonFile`, `appConfig` |
| Archivos JSON | kebab-case | `config.json`, `user-data.json` |
| CSS classes | Tailwind utilities | `flex items-center justify-center` |
| Commits | Conventional Commits | `feat:`, `fix:`, `docs:`, `chore:` |

### 12.2 Reglas de Commits

```
feat: add home page with hola mundo animation
fix: correct json path resolution on windows
docs: update readme with setup instructions
chore: add prettier configuration
refactor: extract animation to separate component
```

### 12.3 Regla de Oro para JSON DB

```
✅ USAR JSON DB PARA:
   - Configuración de la aplicación
   - Contenido estático (textos, traducciones)
   - Catálogos pequeños (< 1000 items)
   - Datos de seed/demo

❌ NO USAR JSON DB PARA:
   - Datos que se escriben en tiempo de ejecución en Vercel
   - Autenticación de usuarios
   - Datos de más de 10MB
   - Consultas complejas o relaciones profundas
```

---

## 📎 Apéndice — Comandos de Referencia Rápida

```bash
# Desarrollo local
npm run dev              # Inicia servidor en localhost:3000

# Calidad de código
npm run type-check       # Verifica tipos TypeScript
npm run lint             # ESLint
npm run format           # Prettier
npm run validate         # type-check + lint juntos

# Build y despliegue
npm run build            # Build de producción local
vercel                   # Deploy preview
vercel --prod            # Deploy producción

# Git workflow
git checkout -b feature/mi-feature    # Nueva feature
git add . && git commit -m "feat: ..."
git push origin feature/mi-feature
# → Vercel crea Preview automáticamente

git checkout main && git merge feature/mi-feature
git push origin main
# → Vercel despliega en Producción automáticamente
```

---

*Plan de Infraestructura generado para implementación fullstack TypeScript — Versión 1.0.0*
