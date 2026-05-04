# ✅ Implementation Checklist — Vercel Blob Storage

**Guía de verificación para implementar Vercel Blob en tu proyecto**

---

## 📋 Phase 1: Setup Inicial

- [ ] **Crear Vercel Blob Store**
  ```
  Dashboard: https://vercel.com/account/storage
  Botón: "Create Database" → "Blob"
  Nombre: "proyecto-fullstack"
  ```

- [ ] **Obtener Token**
  ```
  Storage Dashboard → Blob Store → Settings
  Copiar: BLOB_READ_WRITE_TOKEN
  ```

- [ ] **Instalar Dependencia**
  ```bash
  npm install @vercel/blob
  ```

- [ ] **Configurar Variables Locales**
  ```bash
  cp .env.example .env.local
  # EDITAR .env.local con BLOB_READ_WRITE_TOKEN
  ```

---

## 📦 Phase 2: Código Base

- [ ] ✅ `package.json` — Dependencia `@vercel/blob` agregada
- [ ] ✅ `lib/dataService.ts` — Migrado a async/await con @vercel/blob
- [ ] ✅ `app/api/config/route.ts` — Actualizado para usar await
- [ ] ✅ `app/api/data/route.ts` — Actualizado para usar await
- [ ] ✅ `.env.example` — Variable BLOB_READ_WRITE_TOKEN agregada
- [ ] ✅ `.gitignore` — `.env.local` ya está ignorado

---

## 📚 Phase 3: Documentación

- [ ] ✅ `doc/VERCEL_BLOB_SETUP.md` — Guía completa (17 secciones)
- [ ] ✅ `doc/VERCEL_BLOB_ADVANCED.md` — Patrones avanzados
- [ ] ✅ `doc/RESUMEN_VERCEL_BLOB.md` — Resumen técnico
- [ ] ✅ `VERCEL_BLOB_QUICKSTART.md` — Guía rápida 5 pasos
- [ ] ✅ `scripts/README.md` — Documentación de scripts
- [ ] ✅ `scripts/seed-blob.ts` — Script de migración

---

## 🚀 Phase 4: Ejecución Local

### A) Preparar el Ambiente

- [ ] **Verificar Node.js**
  ```bash
  node --version  # v18+ recomendado
  npm --version   # v8+
  ```

- [ ] **Instalar Dependencias**
  ```bash
  npm install
  ```

- [ ] **Verificar .env.local**
  ```bash
  cat .env.local | grep BLOB_READ_WRITE_TOKEN
  # Debe retornar el token (sin salida = error)
  ```

### B) Migrar Datos

- [ ] **Ejecutar Script de Seed**
  ```bash
  npx ts-node scripts/seed-blob.ts
  
  # Esperado:
  # 🌱 Iniciando seed a Vercel Blob...
  # ✅ Migración completada exitosamente!
  ```

- [ ] **Verificar en Dashboard Vercel**
  ```
  https://vercel.com/account/storage
  Debería mostrar:
  • home.json
  • config.json
  ```

### C) Testear Localmente

- [ ] **Iniciar Servidor Dev**
  ```bash
  npm run dev
  # Esperado: listening on http://localhost:3000
  ```

- [ ] **Probar /api/data**
  ```bash
  curl http://localhost:3000/api/data
  # Debe retornar JSON con home data
  ```

- [ ] **Probar /api/config**
  ```bash
  curl http://localhost:3000/api/config
  # Debe retornar JSON con configuración
  ```

- [ ] **Verificar Navegador**
  ```
  http://localhost:3000
  Debe cargar normalmente con datos del Blob
  ```

---

## 🌐 Phase 5: Deploy a Vercel

### A) Preparación

- [ ] **Verificar .gitignore**
  ```bash
  grep ".env.local" .gitignore
  # Debe retornar ".env.local"
  ```

- [ ] **Commit en Git**
  ```bash
  git add -A
  git commit -m "feat: migrate to vercel blob storage"
  git push origin main
  ```

### B) Deploy

- [ ] **Vercel Dashboard**
  ```
  https://vercel.com
  Deploy automático desde GitHub
  Esperar a que Build complete
  ```

- [ ] **Configurar Variables en Vercel**
  ```
  Project Settings → Environment Variables
  Agregar: BLOB_READ_WRITE_TOKEN = [tu token]
  Disponible en todas las funciones (Production, Preview, Development)
  ```

- [ ] **Verificar Deploy**
  ```
  Vercel Dashboard → Deployments
  Estado: Ready (verde)
  ```

### C) Testear en Producción

- [ ] **Probar URL de Producción**
  ```
  https://[tu-proyecto].vercel.app/api/data
  https://[tu-proyecto].vercel.app/api/config
  ```

- [ ] **Verificar Logs**
  ```
  Vercel Dashboard → Deployments → Logs
  No debe haber errores sobre BLOB_READ_WRITE_TOKEN
  ```

---

## 🔍 Phase 6: Verificación Final

- [ ] **Todos los endpoints responden**
  - [ ] GET /api/data
  - [ ] GET /api/config
  - [ ] GET / (home page)

- [ ] **Datos persisten entre reloads**
  ```bash
  Reload en navegador → Mismos datos retornados
  ```

- [ ] **No hay errores en console**
  ```
  DevTools Console (F12) → No red errors
  Next.js logs → No warnings
  ```

- [ ] **Build sin errores**
  ```bash
  npm run build
  ```

---

## 📊 Summary Table

| Fase | Tarea | Estado | Comandos |
|------|-------|--------|----------|
| **Init** | Crear Blob Store | ⬜ Manual | vercel.com/account/storage |
| **Init** | Copiar Token | ⬜ Manual | Dashboard → Settings |
| **Setup** | Instalar deps | ⬜ | `npm install` |
| **Setup** | Config .env | ⬜ | `cp .env.example .env.local` |
| **Code** | DataService actualizado | ✅ | Automático |
| **Docs** | Documentación completa | ✅ | Automático |
| **Data** | Seed a Blob | ⬜ | `npx ts-node scripts/seed-blob.ts` |
| **Test** | Dev server | ⬜ | `npm run dev` |
| **Test** | Probar APIs | ⬜ | `curl http://localhost:3000/api/...` |
| **Deploy** | Commit a Git | ⬜ | `git push origin main` |
| **Deploy** | Deploy Vercel | ⬜ Manual | vercel.com → Auto |
| **Verify** | Produção OK | ⬜ | Verificar URLs |

---

## 🆘 Troubleshooting Rápido

### Error: BLOB_READ_WRITE_TOKEN undefined

```bash
# Solución
cat .env.local | grep BLOB_READ_WRITE_TOKEN
# Si está vacío, copiar desde Vercel Dashboard
```

### Error: File not found: home.json

```bash
# Solución
npx ts-node scripts/seed-blob.ts
# Verifica que data/home.json y data/config.json existen
```

### Error: Invalid token

```bash
# Solución
# 1. Verificar token en Vercel Dashboard
# 2. Copiar exactamente (sin espacios extra)
# 3. Reiniciar servidor: npm run dev
```

### Endpoint retorna 500

```bash
# Solución
# 1. Ver logs del servidor: npm run dev
# 2. Verificar NODE_ENV=development
# 3. Aumentar logs en dataService.ts
```

---

## 📚 Documentación Referenciada

| Archivo | Propósito |
|---------|-----------|
| `VERCEL_BLOB_QUICKSTART.md` | Inicio rápido 5 min |
| `doc/VERCEL_BLOB_SETUP.md` | Setup completo detallado |
| `doc/VERCEL_BLOB_ADVANCED.md` | Patrones y mejores prácticas |
| `doc/RESUMEN_VERCEL_BLOB.md` | Cambios técnicos realizados |
| `scripts/README.md` | Documentación de scripts |

---

## ✨ Resultado Esperado

Después de completar este checklist:

✅ Datos JSON almacenados en Vercel Blob  
✅ No hay archivos JSON locales  
✅ APIs funcionan en desarrollo y producción  
✅ Datos persisten entre resets y deployments  
✅ Seguridad: tokens protegidos en .env  
✅ Escalabilidad: sin límite de almacenamiento  

---

**Última actualización**: 20/04/2026  
**Responsable**: Ingeniero Fullstack Senior
