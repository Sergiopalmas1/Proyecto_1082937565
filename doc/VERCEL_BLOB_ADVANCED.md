# 🎯 Patrones Avanzados — Vercel Blob Integration

**Patrones y mejores prácticas para trabajar con Vercel Blob**

---

## 📋 Tabla de Contenidos

1. [Caché y Revalidación](#caché-y-revalidación)
2. [Manejo de Errores](#manejo-de-errores)
3. [Validación de Datos](#validación-de-datos)
4. [Migraciones y Versionado](#migraciones-y-versionado)
5. [Testing](#testing)

---

## 🔄 Caché y Revalidación

### Usar Next.js Cache (Recomendado)

```typescript
// lib/dataService.ts
import { unstable_cache } from 'next/cache';

/**
 * Lee home.json con caché automático
 * Revalida cada hora (3600 segundos)
 */
export const getCachedHomeData = unstable_cache(
  async () => await readHomeData(),
  ['home-data'],
  { 
    revalidate: 3600,  // 1 hora
    tags: ['home']     // Para invalidación manual
  }
);

/**
 * Lee config.json con caché de 30 minutos
 */
export const getCachedAppConfig = unstable_cache(
  async () => await readAppConfig(),
  ['app-config'],
  { 
    revalidate: 1800,  // 30 minutos
    tags: ['config']
  }
);
```

### Usar en Route Handlers

```typescript
import { getCachedHomeData, getCachedAppConfig } from '@/lib/dataService';

export async function GET() {
  // Estos datos se cachean automáticamente
  const home = await getCachedHomeData();
  const config = await getCachedAppConfig();
  
  return Response.json({ home, config });
}
```

### Invalidar Caché Manualmente

```typescript
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const data = await req.json();
  
  // Escribe datos
  await writeHomeData(data);
  
  // Invalida caché
  revalidateTag('home');
  
  return Response.json({ success: true });
}
```

### Strategy: Cache-First

Para datos que no cambian frecuentemente:

```typescript
const getCriticalData = unstable_cache(
  async () => await readAppConfig(),
  ['critical-config'],
  { 
    revalidate: 86400  // 24 horas
  }
);
```

---

## 🛡️ Manejo de Errores

### Patrón: Try-Catch con Fallback

```typescript
async function safeReadHomeData() {
  try {
    return await readHomeData();
  } catch (error) {
    console.error('Error leyendo home.json:', error);
    
    // Retornar datos por defecto
    return {
      title: 'Default Title',
      description: 'App description',
      features: []
    };
  }
}
```

### Patrón: Retry Logic

```typescript
async function readWithRetry<T>(
  filename: string,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await readJsonFile<T>(filename);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff: 100ms, 200ms, 400ms
      const delay = Math.pow(2, i) * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed to read ${filename} after ${maxRetries} retries`);
}
```

### En Route Handlers

```typescript
export async function GET() {
  try {
    const data = await readWithRetry('home.json');
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    return Response.json(
      { 
        error: 'Failed to fetch data',
        details: process.env.NODE_ENV === 'development' ? message : undefined
      },
      { status: 500 }
    );
  }
}
```

---

## ✅ Validación de Datos

### Patrón: Validación + Transformación

Extender los ejemplos de [lib/validators.ts](../lib/validators.ts):

```typescript
import { z } from 'zod';

// Dato entrante
export const CreateHomeDataSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(1000),
  features: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      icon: z.string().optional()
    })
  ).min(1)
});

// Guardar con timestamp automático
export const HomeDataStorageSchema = CreateHomeDataSchema.extend({
  updatedAt: z.string().datetime(),
  version: z.number().default(1)
});
```

### Usar en POST

```typescript
import { CreateHomeDataSchema, HomeDataStorageSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validar inputs
    const validated = CreateHomeDataSchema.parse(body);
    
    // Agregar metadata
    const withMetadata = HomeDataStorageSchema.parse({
      ...validated,
      updatedAt: new Date().toISOString(),
      version: 1
    });
    
    // Guardar
    await writeJsonFile('home.json', withMetadata);
    
    return Response.json({ success: true, data: withMetadata });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🔄 Migraciones y Versionado

### Patrón: Versionado de Datos

```typescript
interface VersionedData {
  version: number;
  data: any;
  migratedFrom?: string;
  migratedAt?: string;
}

// Definir versiones
const DATA_VERSIONS = {
  HOME: 2,
  CONFIG: 1
};

// Función de migración
function migrateHomeData(data: any): void {
  if (data.version === 1) {
    // Migrar de v1 a v2
    data.features = data.items?.map((item: any) => ({
      name: item.title,
      description: item.desc
    })) ?? [];
    
    delete data.items;
    data.version = 2;
  }
}

// Usar en lectura
export async function readHomeDataWithMigration() {
  let data = await readHomeData();
  
  if (data.version && data.version < DATA_VERSIONS.HOME) {
    migrateHomeData(data);
    // Guardar versión migrada
    await writeHomeData(data);
  }
  
  return data;
}
```

### Script de Migración

```typescript
// scripts/migrate-data.ts
import { readHomeData, writeHomeData } from '../lib/dataService';

async function migrateAll() {
  console.log('🔄 Iniciando migraciones...');
  
  // Migración 1: Actualizar estructura de features
  const home = await readHomeData();
  home.version = 2;
  await writeHomeData(home);
  
  console.log('✅ Migraciones completadas');
}

migrateAll().catch(console.error);
```

---

## 🧪 Testing

### Patrón: Mock de dataService

```typescript
// lib/__tests__/dataService.test.ts
import { readHomeData, writeHomeData } from '../dataService';
import * as dataService from '../dataService';

// Mock @vercel/blob
jest.mock('@vercel/blob', () => ({
  get: jest.fn(),
  put: jest.fn(),
  list: jest.fn()
}));

describe('dataService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read and validate home data', async () => {
    const mockData = {
      title: 'Test',
      description: 'A test app'
    };
    
    // Mock la respuesta
    const { get } = require('@vercel/blob');
    get.mockResolvedValue({
      arrayBuffer: async () => new TextEncoder().encode(JSON.stringify(mockData))
    });
    
    const result = await readHomeData();
    
    expect(result).toEqual(mockData);
    expect(get).toHaveBeenCalledWith('home.json', expect.any(Object));
  });

  it('should validate data on write', async () => {
    const invalidData = { title: '' };  // title es requerido
    
    await expect(writeHomeData(invalidData)).rejects.toThrow();
  });
});
```

### Test de Integration

```typescript
// tests/e2e/api.test.ts
import { describe, it, expect } from 'vitest';

describe('API Endpoints', () => {
  it('GET /api/data should return home data', async () => {
    const response = await fetch('http://localhost:3000/api/data');
    const data = await response.json();
    
    expect(response.ok).toBe(true);
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('description');
  });

  it('GET /api/config should return app config', async () => {
    const response = await fetch('http://localhost:3000/api/config');
    const data = await response.json();
    
    expect(response.ok).toBe(true);
    expect(data).toHaveProperty('siteName');
  });

  it('POST /api/data should validate input', async () => {
    const response = await fetch('http://localhost:3000/api/data', {
      method: 'POST',
      body: JSON.stringify({ title: '' })  // Inválido
    });
    
    expect(response.status).toBe(400);
  });
});
```

---

## 📊 Comparativa de Patrones

| Patrón | Casos de Uso | Ventajas | Desventajas |
|--------|-------------|----------|------------|
| **Cache-First** | Datos estáticos | Muy rápido | No actualizado en tiempo real |
| **Try-Catch Fallback** | Datos críticos | Resilencia | Puede mostrar datos default |
| **Retry Logic** | Red inestable | Robustez | Latencia adicional |
| **Validación Estricta** | Integridad de datos | Seguridad | Rechaza datos parciales |
| **Versionado** | Datos evolutivos | Migración smooth | Complejidad extra |

---

## 🔗 Referencias

- [Documentación Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Cache](https://nextjs.org/docs/app/building-your-application/data-fetching/caching)
- [Zod Validación](https://zod.dev)
