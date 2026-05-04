# 🛠️ Scripts Utilities

Scripts de automatización y mantenimiento para el proyecto.

---

## 📋 Scripts Disponibles

### 🌱 seed-blob.ts

Migra datos JSON locales a Vercel Blob Storage.

**Uso:**
```bash
npx ts-node scripts/seed-blob.ts
```

**Qué hace:**
1. Lee `data/home.json` y `data/config.json`
2. Valida los datos contra los schemas de Zod
3. Carga los datos a Vercel Blob Storage
4. Muestra un reporte de migración

**Requisitos:**
- `BLOB_READ_WRITE_TOKEN` en `.env.local`
- Archivos `data/home.json` y `data/config.json` deben existir
- TypeScript debe estar instalado

**Ejemplo de salida:**
```
🌱 Iniciando seed a Vercel Blob...

📂 Leyendo home.json desde: data/home.json
   ✅ home.json leído (5 campos)
📂 Leyendo config.json desde: data/config.json
   ✅ config.json leído (3 campos)

📤 Subiendo a Vercel Blob...
   Escribiendo home.json...
   ✅ home.json guardado en Vercel Blob
   Escribiendo config.json...
   ✅ config.json guardado en Vercel Blob

✅ Migración completada exitosamente!

📊 Datos migrados:
   • home.json
   • config.json
```

---

## 🔐 Variables de Entorno Requeridas

Asegúrate que `.env.local` (NO `.env.example`) contiene:

```env
BLOB_READ_WRITE_TOKEN=eyJ1c2VyX2lkIjoiLi4uIn0=
```

Para obtenerlo:
1. Ve a https://vercel.com/account/storage
2. Selecciona tu Blob store
3. Copia el token BLOB_READ_WRITE_TOKEN

---

## 📚 Más Scripts

> Nuevos scripts pueden ser agregados aquí según evolucione el proyecto.

- Database migrations
- Data backups
- Performance analysis
- Version management
