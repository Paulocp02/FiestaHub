# 🌟 Martes con Alegría

Experiencia digital interactiva para la convivencia de los voluntarios del martes. Una sola página donde los voluntarios pueden escribir mensajes de agradecimiento, explorar el photobooth, subir fotos y ver la galería de recuerdos.

## Características

| Sección | Funcionalidad |
|---|---|
| 💬 Mensajes | Formulario con tipos de destinatario + muro en tiempo real (Supabase Realtime) |
| 📸 Photobooth | Guía paso a paso + subida de fotos integrada |
| 🖼️ Galería | Fotos de la convivencia con lightbox, actualización en tiempo real |
| 📲 QR | QR generado dinámicamente, descargable y con copia de enlace |

## Stack tecnológico

- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS v3
- **Animaciones**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Storage + Realtime)
- **QR**: qrcode.react
- **Hosting**: Vercel

---

## Instalación

```bash
git clone <repo-url>
cd martes-con-alegria
npm install
```

---

## Variables de entorno

Crea el archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Llena los valores con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

> Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` las encuentras en tu proyecto de Supabase: **Settings > API**.

---

## Configuración de Supabase

Consulta la guía completa en **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**.

Resumen:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/migrations/001_create_event_schema.sql`
3. Verifica que el bucket **event-photos** exista en Storage
4. Verifica que Realtime esté activo para las tablas `messages` y `photos`

---

## Ejecutar localmente

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

```bash
# Build de producción
npm run build

# Previsualizar el build
npm run preview
```

---

## Desplegar en Vercel

### Opción 1 — Vercel CLI

```bash
npm install -g vercel
vercel
```

Agrega las variables de entorno cuando te lo solicite, o configúralas después en el Dashboard.

### Opción 2 — Interfaz web

1. Sube el proyecto a GitHub.
2. Importa el repositorio en [vercel.com](https://vercel.com).
3. En **Settings > Environment Variables**, agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Haz clic en **Deploy**.

Una vez desplegado, la URL de producción es la que el QR genera automáticamente dentro de la app.

---

## Checklist antes del evento

- [ ] `.env` con credenciales reales de Supabase
- [ ] Migración SQL ejecutada (tablas `messages` y `photos` creadas)
- [ ] Bucket `event-photos` creado y público en Supabase Storage
- [ ] Realtime activo para ambas tablas
- [ ] App desplegada en Vercel con variables de entorno correctas
- [ ] QR generado e impreso para colocar en el evento

---

## Esquema de base de datos

### Tabla `messages`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Clave primaria |
| `sender_name` | text | Nombre de quien escribe |
| `recipient_type` | text | `all`, `specific` o `anonymous` |
| `recipient_name` | text | Nombre del destinatario (si es `specific`) |
| `message` | text | Contenido del mensaje |
| `created_at` | timestamptz | Fecha y hora de creación |

### Tabla `photos`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Clave primaria |
| `uploader_name` | text | Nombre de quien sube la foto |
| `description` | text | Descripción opcional |
| `image_url` | text | URL pública de la imagen en Storage |
| `storage_path` | text | Ruta interna en el bucket |
| `created_at` | timestamptz | Fecha y hora de creación |

---

## Estructura de carpetas

```
martes-con-alegria/
├── supabase/
│   └── migrations/
│       └── 001_create_event_schema.sql  # Schema completo con RLS y Storage
├── public/
├── src/
│   ├── components/
│   │   ├── Hero.jsx              # Bienvenida y botones principales
│   │   ├── MessageForm.jsx       # Formulario de mensajes → Supabase
│   │   ├── MessageWall.jsx       # Muro en tiempo real → Supabase Realtime
│   │   ├── PhotoboothSection.jsx # Guía + subida de fotos → Supabase Storage
│   │   ├── PhotoGallery.jsx      # Galería en tiempo real → Supabase Realtime
│   │   ├── QRShare.jsx           # QR generado + descarga
│   │   └── Footer.jsx
│   ├── lib/
│   │   └── supabase.js           # Cliente Supabase inicializado
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── SUPABASE_SETUP.md             # Guía detallada de configuración
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

Hecho con cariño para los voluntarios del martes 💛
