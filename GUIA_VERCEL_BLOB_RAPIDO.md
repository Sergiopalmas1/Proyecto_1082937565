# 🚀 GUÍA RÁPIDA: Activar Vercel Blob en 5 Minutos

## PASO 1: Crear Vercel Blob Store (2 minutos)

### Abre esta URL exacta en tu navegador:
```
https://vercel.com/account/storage
```

### Sigue estos clics exactos:
1. **Click azul:** "Create" o "Create Database"
2. **Selecciona:** "Blob"
3. **Nombre del Store:** (copia y pega)
   ```
   proyecto-fullstack
   ```
4. **Región:** Selecciona `us-east-1` (o la más cercana a ti)
5. **Click:** "Create" (botón azul final)

✅ **Espera a que se cree (5-10 segundos)**

---

## PASO 2: Copiar el Token (1 minuto)

### Ya en la página del Blob Store creado:

1. **Busca la sección "Settings"** (arriba a la derecha o en tab)
2. **Localiza el campo:** `BLOB_READ_WRITE_TOKEN`
3. **Copia TODO el valor** (es un texto largo que comienza con `eyJ...`)
4. **Pégalo en un editor de texto** (Notepad, VS Code, etc.) temporalmente

**Ejemplo de cómo se ve:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiLi4u...
```

---

## PASO 3: Agregar Variable a Vercel Dashboard (1 minuto)

### Abre esta URL:
```
https://vercel.com/dashboard
```

### Clics exactos:

1. **Click en tu proyecto:** "Proyecto_1082937565"
2. **Tab superior:** "Settings"
3. **Menú izquierdo:** "Environment Variables"
4. **Click:** "Add New..." o "+"

### Completa el formulario:

| Campo | Valor |
|-------|-------|
| **Name** | `BLOB_READ_WRITE_TOKEN` |
| **Value** | (pega el token del paso anterior) |
| **Environments** | ✅ Production ✅ Preview ✅ Development |

### Finalmente:
- **Click:** "Save" (botón gris)
- **Espera confirmación** (página se refresca)

---

## PASO 4: Verificar en Local (Opcional)

### En tu terminal:
```bash
cd c:\Users\estudiante\Desktop\Proyecto_1082937565

# Crear archivo local .env.local
copy .env.example .env.local

# Editar .env.local y pegar el token:
# BLOB_READ_WRITE_TOKEN=eyJ... (tu token)
```

### Luego instalar y probar:
```bash
npm install
npm run dev
```

---

## ✅ VERIFICACIÓN FINAL

### Vercel redeploy automático:
1. Va a tu dashboard: https://vercel.com/dashboard
2. Proyecto debe estar en "Ready"
3. Si no, click en última versión → "Redeploy"

### Resultado esperado:
```
✅ Build successful
✅ Blob variables configured
✅ App running on: https://tu-url.vercel.app
```

---

## 🆘 Si algo falla:

- **Error de dependencias:** Verificar que `package.json` tiene `@vercel/blob@^0.21.0`
- **Token inválido:** Copiar de nuevo el token exacto (sin espacios)
- **Build falla:** Revisar logs en Vercel Dashboard → Deployments → últim intento

---

**⏱️ Tiempo total: ~5 minutos**
