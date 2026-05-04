# 🚀 Quick Start — Vercel Blob Integration

**Guía rápida para empezar a usar Vercel Blob en 5 minutos**

---

## ⚡ Setup en 5 Pasos

### 1️⃣ Crear el Blob Store (Vercel Dashboard)
```
https://vercel.com/account/storage → Create Database → Blob
Nombre: proyecto-fullstack
```

### 2️⃣ Copiar el Token
```
Vercel Dashboard → Your Blob Store → Settings
Copiar: BLOB_READ_WRITE_TOKEN
```

### 3️⃣ Configurar Variables Locales
```bash
cp .env.example .env.local
# Editar .env.local:
# BLOB_READ_WRITE_TOKEN=eyJ1c2VyX2lkIjoiLi4uIn0=
```

### 4️⃣ Instalar Dependencias
```bash
npm install
```

### 5️⃣ Migrar Datos
```bash
npx ts-node scripts/seed-blob.ts
```

✅ **¡Listo!** Tu aplicación ahora usa Vercel Blob

---

## 📖 Usar Datos en tu Código

### Leer desde Vercel Blob

```typescript
// En Route Handlers o Server Components
import { readHomeData, readAppConfig } from '@/lib/dataService';

export async function GET() {
  // Leer datos
  const home = await readHomeData();
  const config = await readAppConfig();
  
  return Response.json({ home, config });
}
```

### Escribir a Vercel Blob

```typescript
import { writeHomeData } from '@/lib/dataService';

export async function POST(req: Request) {
  const data = await req.json();
  
  // Escribe y valida automáticamente
  await writeHomeData(data);
  
  return Response.json({ success: true });
}
```

---

## 🔍 Verificar que Funciona

```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Probar API
curl http://localhost:3000/api/data
curl http://localhost:3000/api/config
```

**Esperado:** Recibir JSON con tus datos

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| `BLOB_READ_WRITE_TOKEN is undefined` | Copia el token en `.env.local` y reinicia |
| `Archivo no encontrado` | Ejecuta `npx ts-node scripts/seed-blob.ts` |
| Request lento | Espera y reintenta (primeros tiempos pueden ser lentos) |

---

## 📚 Documentación Completa

Para más detalle, ver:
- **Setup**: [doc/VERCEL_BLOB_SETUP.md](../doc/VERCEL_BLOB_SETUP.md)
- **Resumen**: [doc/RESUMEN_VERCEL_BLOB.md](../doc/RESUMEN_VERCEL_BLOB.md)

---

## 🎯 Propósito

- 🟢 Datos persistentes entre deployments
- ⚡ Sin servidor, sin mantenimiento
- 🔒 Seguridad integrada
- 📊 Escalable automáticamente
- 💰 Free tier disponible en Vercel

