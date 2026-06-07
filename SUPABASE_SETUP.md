# Configuración de Supabase — Martes con Alegría

Esta guía explica cómo configurar Supabase como backend de la aplicación.

---

## 1. Crear el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y accede con tu cuenta.
2. Haz clic en **New Project**.
3. Nombre sugerido: `martes-con-alegria`
4. Elige una región cercana (Miami o US East para Guatemala).
5. Crea una contraseña segura para la base de datos (guárdala).
6. Espera a que el proyecto termine de inicializarse (~2 min).

---

## 2. Obtener las variables de entorno

En el Dashboard de Supabase:

1. Ve a **Settings > API** en el menú lateral.
2. Copia los siguientes valores:

| Variable | Dónde encontrarla |
|---|---|
| `VITE_SUPABASE_URL` | Campo **Project URL** |
| `VITE_SUPABASE_ANON_KEY` | Sección **Project API keys > anon public** |

3. Crea el archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Importante**: `VITE_SUPABASE_ANON_KEY` es una clave pública diseñada para usarse en el frontend. Es seguro incluirla en el código del cliente.

---

## 3. Ejecutar la migración SQL

### Opción A — SQL Editor (recomendado para empezar)

1. En Supabase Dashboard, ve a **SQL Editor**.
2. Haz clic en **New query**.
3. Copia y pega el contenido completo de:
   ```
   supabase/migrations/001_create_event_schema.sql
   ```
4. Haz clic en **Run** (Ctrl+Enter).
5. Verifica que no haya errores en el panel inferior.

### Opción B — Supabase CLI (para migraciones versionadas)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar sesión
supabase login

# Vincular con tu proyecto (obtén el ID en Dashboard > Settings > General)
supabase link --project-ref TU_PROJECT_ID

# Aplicar migraciones
supabase db push
```

---

## 4. Verificar tablas creadas

En **Table Editor** deberías ver:

- ✅ `messages` — con columnas: id, sender_name, recipient_type, recipient_name, message, created_at
- ✅ `photos` — con columnas: id, uploader_name, description, image_url, storage_path, created_at

---

## 5. Crear o verificar el bucket event-photos

La migración SQL intenta crear el bucket automáticamente. Para verificarlo:

1. Ve a **Storage** en el menú lateral.
2. Deberías ver el bucket **event-photos** con acceso **Public**.

Si no existe, créalo manualmente:
1. Haz clic en **New bucket**.
2. Nombre: `event-photos`
3. Marca **Public bucket** ✓
4. File size limit: `5 MB`
5. Allowed MIME types: `image/*`
6. Haz clic en **Save**.

---

## 6. Activar Realtime para las tablas

La migración ya ejecuta `alter publication supabase_realtime add table ...`. Para verificarlo:

1. Ve a **Database > Replication** en el menú lateral.
2. En la sección **supabase_realtime**, verifica que:
   - ✅ `messages` esté marcada
   - ✅ `photos` esté marcada

Si no están, actívalas desde ese panel o vuelve a ejecutar estas líneas en el SQL Editor:

```sql
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.photos;
```

---

## 7. Configurar variables de entorno en Vercel

1. Ve a tu proyecto en [vercel.com](https://vercel.com).
2. Ve a **Settings > Environment Variables**.
3. Agrega cada variable:

| Variable | Entornos |
|---|---|
| `VITE_SUPABASE_URL` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Production, Preview, Development |

4. Haz un redeploy para que tomen efecto.

---

## 8. Probar la app localmente

```bash
# Asegúrate de tener el .env con las credenciales
cp .env.example .env
# Edita .env con tus valores reales

# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) y prueba:

- [ ] Enviar un mensaje → debe aparecer en el muro
- [ ] El muro actualiza en tiempo real si abres otra pestaña y envías
- [ ] Subir una foto → debe aparecer en la galería
- [ ] La galería actualiza en tiempo real

---

## 9. Probar en producción

Después del deploy en Vercel:

1. Abre la URL de producción.
2. Envía un mensaje de prueba y verifica que aparece en el muro.
3. Sube una foto de prueba y verifica que aparece en la galería.
4. Abre la app en dos pestañas y verifica que los cambios en una se reflejan en la otra (Realtime).

---

## 10. Solución de problemas comunes

### "relation does not exist"
La migración no se ejecutó. Ve al SQL Editor y ejecuta `001_create_event_schema.sql`.

### "new row violates row-level security policy"
Las políticas RLS no se crearon. Vuelve a ejecutar la parte de RLS de la migración.

### Las fotos no se suben
- Verifica que el bucket `event-photos` exista y sea público.
- Verifica que las políticas de Storage estén creadas.
- Revisa la consola del navegador para ver el error específico de Supabase.

### El Realtime no funciona
- Verifica que las tablas estén en la publicación `supabase_realtime` (Database > Replication).
- Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` sean correctas.

### "Falta la variable de entorno VITE_SUPABASE_URL"
Asegúrate de que el archivo `.env` existe en la raíz del proyecto y tiene las variables correctas. Las variables `VITE_*` son necesarias para que Vite las exponga al frontend.
