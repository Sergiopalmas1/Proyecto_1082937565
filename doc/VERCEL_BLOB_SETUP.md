# 📦 Vercel Blob Storage — Guía de Configuración

> **Fecha**: 20/04/2026  
> **Estado**: Implementado  
> **Responsable**: Ingeniero Fullstack Senior

---

## 🎯 Resumen Ejecutivo

El proyecto ha sido migrado a usar **Vercel Blob** como base de datos persistente en lugar de archivos JSON locales. Todos los datos (home.json, config.json, etc.) ahora se almacenan de forma segura en Vercel Blob con versionado automático.

### Ventajas
✅ Persistencia automática entre deployments  
✅ Escalable y sin servidor (serverless)  
✅ Integración nativa con Vercel  
✅ Sin costos adicionales en Free tier  
✅ Seguridad con tokens de lectura/escritura  

---

## 🔧 Configuración Inicial

### 1. Crear un Vercel Blob Store

```bash
# En el dashboard de Vercel:
# 1. Ir a https://vercel.com/account/storage
# 2. Hacer clic en "Create Database"
# 3. Seleccionar "Blob"
# 4. Ingresar nombre: "proyecto-fullstack"
# 5. Seleccionar región (us-east-1 recomendado)
```

### 2. Configurar Variables de Entorno

Vercel te proporcionará automáticamente:
- **BLOB_READ_WRITE_TOKEN** - Token completo de lectura/escritura

```env
# .env.local (NUNCA commits esta variable)
BLOB_READ_WRITE_TOKEN=eyJ1c2VyX2lkIjoiLi4uIn0=
```

### 3. Incluir en .env.local

```bash
# Copiar .env.example a .env.local
cp .env.example .env.local

# Editar .env.local con tus valores reales
# (esta variable NO debe estar en git)
```

---

## 📝 Estructura de Datos

### Archivos JSON en Vercel Blob

```
Vercel Blob Storage/
├── home.json          # Datos de la página home
├── config.json        # Configuración global de la app
└── [otros archivos]   # Agregar más según sea necesario
```

### Ejemplo: home.json

```json
{
  "title": "Mi Aplicación",
  "description": "Descripción de mi app",
  "features": [
    { "name": "Feature 1", "description": "..." },
    { "name": "Feature 2", "description": "..." }
  ]
}
```

---

## 💻 API de dataService

### Leer Datos

```typescript
import { readHomeData, readAppConfig } from '@/lib/dataService';

// En un Route Handler o Server Component
export async function GET() {
  const homeData = await readHomeData();    // Lee y valida home.json
  const config = await readAppConfig();     // Lee y valida config.json
  
  return homeData;
}
```

### Escribir Datos

```typescript
import { writeHomeData, writeAppConfig } from '@/lib/dataService';

// Escribe datos ya validados automáticamente por Zod
export async function POST(req: Request) {
  const newData = await req.json();
  
  // Escribe y valida contra el schema
  await writeHomeData(newData);
  
  return Response.json({ success: true });
}
```

### Leer Archivos Genéricos

```typescript
import { readJsonFile } from '@/lib/dataService';

const customData = await readJsonFile('custom-file.json');
```

### Escribir Archivos Genéricos

```typescript
import { writeJsonFile } from '@/lib/dataService';

await writeJsonFile('custom-file.json', { /* data */ });
```

### Listar Archivos (Debug)

```typescript
import { listBlobFiles } from '@/lib/dataService';

const files = await listBlobFiles();
console.log('Archivos en Vercel Blob:', files);
```

---

## 🔄 Migrando Datos Locales a Vercel Blob

### Paso 1: Crear Seed Script

Crear `scripts/seed-blob.ts`:

```typescript
import { writeHomeData, writeAppConfig } from '../lib/dataService';
import fs from 'fs';
import path from 'path';

async function seedBlob() {
  try {
    // Leer archivos locales
    const homeLocalPath = path.join('data', 'home.json');
    const configLocalPath = path.join('data', 'config.json');
    
    const homeData = JSON.parse(fs.readFileSync(homeLocalPath, 'utf-8'));
    const configData = JSON.parse(fs.readFileSync(configLocalPath, 'utf-8'));
    
    // Escribir a Vercel Blob
    await writeHomeData(homeData);
    await writeAppConfig(configData);
    
    console.log('✅ Datos migrados exitosamente a Vercel Blob');
  } catch (error) {
    console.error('❌ Error durante migración:', error);
    process.exit(1);
  }
}

seedBlob();
```

### Paso 2: Ejecutar la Migración

```bash
# Asegurarse que BLOB_READ_WRITE_TOKEN esté configurado
npx ts-node scripts/seed-blob.ts
```

### Paso 3: Verificar en Dashboard

```bash
# O en la CLI de Vercel
vercel list-blobs

# Debería mostrar:
# home.json
# config.json
```

---

## 🧪 Testing

### Con URL Local

```bash
# Iniciar servidor dev
npm run dev

# Probar endpoints
curl http://localhost:3000/api/data
curl http://localhost:3000/api/config
```

### Variables de Entorno en Testing

Asegúrate que `.env.local` está configurado:

```bash
# Verificar que la variable está cargada
node -e "console.log(process.env.BLOB_READ_WRITE_TOKEN)"
```

---

## 📊 Monitoreo

### Dashboard de Vercel

```
https://vercel.com/account/storage → Blob → proyecto-fullstack
```

**Métricas disponibles:**
- Almacenamiento usado
- Cantidad de archivos
- Última actualización
- Historial de cambios

### Logs en Producción

```bash
# Vercel CLI
vercel logs --follow

# Buscar errores de Blob
vercel logs --filter="Vercel Blob"
```

---

## 🚨 Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not defined"

**Solución:**
1. Verificar que `.env.local` contiene el token
2. Reiniciar el servidor (`npm run dev`)
3. Confirmar que el ambiente es de desarrollo (NODE_ENV=development)

```bash
# Verificar
cat .env.local | grep BLOB_READ_WRITE_TOKEN
```

### Error: "Archivo no encontrado: home.json"

**Solución:**
1. Verificar que el archivo existe en Vercel Blob
2. Correr el script de seed: `npx ts-node scripts/seed-blob.ts`
3. Confirmación en el dashboard de Vercel

### Performance Lento

**Optimization:**
```typescript
// Implementar caché (Redis está planeado para fase 8)
import { unstable_cache } from 'next/cache';

export const getCachedHomeData = unstable_cache(
  async () => await readHomeData(),
  ['home-data'],
  { revalidate: 3600 } // Revalidar cada hora
);
```

---

## 📋 Checklist de Deploy

- [ ] `.env.local` creado y configurado (NO en git)
- [ ] `BLOB_READ_WRITE_TOKEN` correctamente establecido
- [ ] Archivos JSON migrados a Vercel Blob
- [ ] `npm install` ejecutado (incluye @vercel/blob)
- [ ] `npm run build` sin errores
- [ ] Rutas API testadas localmente
- [ ] Deploy a Vercel (automático desde GitHub)
- [ ] Variables de entorno en Vercel dashboard configuradas
- [ ] Monitoreo activo en dashboard

---

## 🔐 Seguridad

### Tokens

- ✅ **BLOB_READ_WRITE_TOKEN** - Nunca commitear a git
- ✅ Agregar a `.gitignore`: `.env.local`
- ✅ Configurar en Vercel dashboard: Settings → Environment Variables

### Access Control

```
Private: archivos no accesibles siempre que sea posible
Public: solo si es necesario
```

---

## 📚 Referencias

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Archivos próximos pasos](#roadmap)
- Proyecto: `Proyecto_1082937565`
- Fecha última actualización: 20/04/2026
