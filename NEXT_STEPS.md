# 🚀 Próximos Pasos — Vercel Blob Implementation

**Guía secuencial para activar Vercel Blob en tu proyecto**

---

## ⏱️ Tiempo Total Estimado: ~45 minutos

```
Setup:        5 minutos
Config:       10 minutos
Migration:    5 minutos
Testing:      10 minutos
Deploy:       15 minutos (automático)
```

---

## 📋 Paso 1: Crear Vercel Blob Store (5 minutos)

### A) Ir al Dashboard

```
1. Abre: https://vercel.com/account/storage
2. Click en: "Create Database"
3. Selecciona: "Blob"
4. Nombre: "proyecto-fullstack"
5. Región: us-east-1 (o la más cercana)
6. Click: "Create"
```

### B) Copiar el Token

```
1. Entra al Blob que acabas de crear
2. Click en: "Settings"
3. Localiza: "BLOB_READ_WRITE_TOKEN"
4. Copia todo el token (es largo, comienza con "eyJ...")
5. Guarda en un lugar seguro (solo para este paso)
```

---

## 🔐 Paso 2: Configurar Variables de Entorno (10 minutos)

### A) Crear archivo .env.local

```bash
# En tu terminal, en la raíz del proyecto
cp .env.example .env.local
```

### B) Editar .env.local

```bash
# Abre el archivo con tu editor
# Busca la línea:
# BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# Reemplázala con:
# BLOB_READ_WRITE_TOKEN=eyJ1c2VyX2lkIjoiLi4uIn0= (tu token real)
```

### C) Verificar que está bien

```bash
# En terminal, verifica:
cat .env.local | grep BLOB_READ_WRITE_TOKEN

# Debe mostrar tu token (no "your_vercel_blob_token_here")
```

### ⚠️ MUY IMPORTANTE

```bash
# Este archivo NUNCA debe estar en git
# Verifica que .gitignore tiene:
grep ".env.local" .gitignore

# Debe mostrar ".env.local"
# Si no lo muestra, fue agregado automáticamente
```

---

## 💾 Paso 3: Instalar Dependencias (1 minuto)

```bash
# En la raíz del proyecto
npm install

# Verifica que @vercel/blob fue instalado:
npm list @vercel/blob

# Debe mostrar: @vercel/blob@0.21.0 (o versión similar)
```

---

## 🌱 Paso 4: Migrar Datos a Vercel Blob (5 minutos)

### A) Ejecutar el script de seed

```bash
# En la raíz del proyecto
npx ts-node scripts/seed-blob.ts

# Esperado: Debería mostrar algo como:
# 🌱 Iniciando seed a Vercel Blob...
# 📂 Leyendo home.json desde: data/home.json
#    ✅ home.json leído (5 campos)
# 📂 Leyendo config.json desde: data/config.json
#    ✅ config.json leído (3 campos)
# 📤 Subiendo a Vercel Blob...
#    Escribiendo home.json...
#    ✅ home.json guardado en Vercel Blob
#    Escribiendo config.json...
#    ✅ config.json guardado en Vercel Blob
# ✅ Migración completada exitosamente!
```

### B) Verificar en Dashboard Vercel

```
1. Ve a: https://vercel.com/account/storage
2. Entra en tu Blob store "proyecto-fullstack"
3. Debe mostrar:
   - home.json
   - config.json

Si no ves los archivos:
- Reverifica que el token está bien en .env.local
- Ejecuta el seed de nuevo
```

---

## 🧪 Paso 5: Testear Localmente (10 minutos)

### A) Iniciar el servidor

```bash
# En la raíz del proyecto
npm run dev

# Esperado: algo como
# ▲ Next.js (build: v16.2.2)
# - local:        http://localhost:3000
```

### B) Probar API endpoints

```bash
# En otra terminal:

# Test 1: GET /api/data
curl http://localhost:3000/api/data

# Esperado: JSON con tus datos de home.json
# {
#   "title": "Mi App",
#   "description": "...",
#   ...
# }

# Test 2: GET /api/config
curl http://localhost:3000/api/config

# Esperado: JSON con tu configuración
# {
#   "siteName": "...",
#   ...
# }
```

### C) Probar en navegador

```
http://localhost:3000

Debe cargar la página normalmente
Abre DevTools (F12) → Console
No debe haber errores rojos
```

### D) Hacer cambios (test de persistencia)

```
1. Edita algo en Vercel Blob manualmente (si es posible)
2. O modifica data/home.json, ejecuta seed de nuevo
3. Reload en navegador
4. Change debe reflejarse
```

---

## 🌐 Paso 6: Deploy a Vercel (15 minutos automáticos)

### A) Commit a Git

```bash
# En la raíz del proyecto
git add -A
git commit -m "feat: integrate vercel blob storage for persistence"
git push origin main
```

### B) Deploy Automático

```
1. Vercel detecta el push automáticamente
2. Inicia build en Dashboard: https://vercel.com
3. Espera a que termine (usualmente 2-3 min)
4. Status debe ser: "Ready" (verde)
```

### C) Configurar Variables en Vercel

```
1. Ve a tu proyecto en Vercel: https://vercel.com/projects
2. Selecciona: Proyecto_1082937565
3. Ve a: Settings → Environment Variables
4. Agrega nueva variable:
   - Name: BLOB_READ_WRITE_TOKEN
   - Value: [Tu token del Blob Store]
   - Environments: Marcar todas las opciones
5. Click: "Save"
```

### D) Redeploy

```
1. Vuelve a: Deployments
2. Click en los 3 puntos del último deploy
3. Click: "Redeploy"
4. Espera a que termine (debe ser "Ready")
```

---

## ✅ Paso 7: Verificar en Producción (5 minutos)

### A) Probar URLs de Producción

```bash
# Replace "tu-proyecto" con el nombre real
https://tu-proyecto.vercel.app/api/data
https://tu-proyecto.vercel.app/api/config

# Ambas deben retornar JSON válido
```

### B) Ver Logs de Producción

```
1. Vercel Dashboard → Deployments
2. Click en el deploy más reciente
3. Tab: "Logs"
4. No debe haber errores en rojo
5. Busca "BLOB_READ_WRITE_TOKEN"
6. No debería mostrar "undefined"
```

### C) Probar desde Navegador

```
https://tu-proyecto.vercel.app

Debería:
- Cargar sin errores
- Mostrar tus datos
- Funcionar normalmente
```

---

## 🎉 ¡Completado! Verificación Final

```
✅ Vercel Blob Store creado
✅ Token configurado en .env.local
✅ Dependencia @vercel/blob instalada
✅ Datos migrados a Vercel Blob
✅ APIs funcionan en desarrollo
✅ Deploy en Vercel completado
✅ Variables configuradas en producción
✅ Verificado que funciona en producción
```

---

## 📊 Después de completar, tienes:

```
✅ Base de datos persistente (Vercel Blob)
✅ Datos no se pierden en resets
✅ Escalable automáticamente
✅ Sin costos adicionales (Free tier)
✅ Ready para Fase 8: Caching
✅ Ready para agregar más features
```

---

## 🆘 Si algo sale mal, ver:

- **Problem**: BLOB_READ_WRITE_TOKEN undefined
  → [VERCEL_BLOB_SETUP.md - Troubleshooting](./doc/VERCEL_BLOB_SETUP.md#-troubleshooting)

- **Problem**: Archivo no encontrado
  → Ejecutar seed de nuevo: `npx ts-node scripts/seed-blob.ts`

- **Problem**: 500 errors en API
  → Ver logs con `npm run dev` en desarrollo

- **Problem**: Deploy fallido
  → Ver Logs en Vercel Dashboard → Deployments

- **Más problemas**
  → [VERCEL_BLOB_SETUP.md - Sección Troubleshooting Completa](./doc/VERCEL_BLOB_SETUP.md#-troubleshooting)

---

## 📚 Documentación Disponible

Mientras ejecutas estos pasos, tienes disponible:

- **VERCEL_BLOB_QUICKSTART.md** — Resumen visual rápido
- **VERCEL_BLOB_SETUP.md** — Guía detallada de cada paso
- **VERCEL_BLOB_ADVANCED.md** — Patrones avanzados para después
- **IMPLEMENTATION_CHECKLIST.md** — Checklist para no olvidar pasos
- **VERCEL_BLOB_STATUS.md** — Estado actual de implementación
- **scripts/README.md** — Documentación de scripts

---

## ⏱️ Timeline de Trabajo

```
0-5 min:    Crear Blob Store en Vercel
5-15 min:   Configurar .env.local
15-20 min:  Instalar deps e migrar datos
20-30 min:  Testear localmente
30-45 min:  Deploy automático y verificación
```

---

## 🎯 Final Checklist

- [ ] Vercel Blob Store creado
- [ ] Token copiado en .env.local
- [ ] npm install ejecutado
- [ ] seed-blob.ts ejecutado sin errores
- [ ] Endpoints testean en localhost:3000
- [ ] Git commit y push
- [ ] Deploy en Vercel completado
- [ ] Variables de entorno configuradas en Vercel
- [ ] URLs de producción funcionan

---

**¡Listo para comenzar!** 🚀

Sigue estos pasos en orden y tu proyecto estará corriendo con Vercel Blob en ~45 minutos.

¿Necesitas ayuda en algún paso? Consulta la documentación referenciada.

**Última actualización**: 20/04/2026
