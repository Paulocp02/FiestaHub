-- ============================================================
-- Martes con Alegría — Supabase Schema
-- 001_create_event_schema.sql
--
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- O con Supabase CLI: supabase db push
-- ============================================================


-- ── Tabla: messages ─────────────────────────────────────────
create table if not exists public.messages (
  id             uuid        primary key default gen_random_uuid(),
  sender_name    text        not null,
  recipient_type text        not null,
  recipient_name text        null,
  message        text        not null,
  created_at     timestamptz not null default now(),

  -- sender_name: entre 1 y 80 caracteres
  constraint messages_sender_name_length
    check (char_length(trim(sender_name)) between 1 and 80),

  -- recipient_type: solo valores válidos
  constraint messages_recipient_type_valid
    check (recipient_type in ('all', 'specific', 'anonymous')),

  -- recipient_name: null o máximo 80 caracteres
  constraint messages_recipient_name_length
    check (recipient_name is null or char_length(trim(recipient_name)) <= 80),

  -- message: entre 1 y 500 caracteres
  constraint messages_message_length
    check (char_length(trim(message)) between 1 and 500),

  -- si recipient_type = 'specific', recipient_name debe tener valor
  constraint messages_specific_needs_recipient
    check (
      recipient_type <> 'specific'
      or (recipient_name is not null and trim(recipient_name) <> '')
    )
);

create index if not exists idx_messages_created_at
  on public.messages (created_at desc);


-- ── Tabla: photos ────────────────────────────────────────────
create table if not exists public.photos (
  id            uuid        primary key default gen_random_uuid(),
  uploader_name text        not null,
  description   text        null,
  image_url     text        not null,
  storage_path  text        not null,
  created_at    timestamptz not null default now(),

  -- uploader_name: entre 1 y 80 caracteres
  constraint photos_uploader_name_length
    check (char_length(trim(uploader_name)) between 1 and 80),

  -- description: null o máximo 200 caracteres
  constraint photos_description_length
    check (description is null or char_length(description) <= 200),

  -- image_url y storage_path no pueden estar vacíos
  constraint photos_image_url_not_empty
    check (trim(image_url) <> ''),
  constraint photos_storage_path_not_empty
    check (trim(storage_path) <> '')
);

create index if not exists idx_photos_created_at
  on public.photos (created_at desc);


-- ── Row Level Security ───────────────────────────────────────
alter table public.messages enable row level security;
alter table public.photos    enable row level security;

-- Messages: lectura y escritura pública
create policy "messages_public_read"
  on public.messages for select
  using (true);

create policy "messages_public_insert"
  on public.messages for insert
  with check (true);

-- Photos: lectura y escritura pública
create policy "photos_public_read"
  on public.photos for select
  using (true);

create policy "photos_public_insert"
  on public.photos for insert
  with check (true);


-- ── Realtime ─────────────────────────────────────────────────
-- Habilita eventos INSERT en tiempo real para ambas tablas.
-- Si ya existe la publicación, este comando la actualiza.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.photos;


-- ── Storage: bucket event-photos ────────────────────────────
-- Crea el bucket con acceso público y límite de 5 MB.
-- Si prefieres hacerlo desde el Dashboard, ve a Storage > New bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-photos',
  'event-photos',
  true,        -- público para lectura
  5242880,     -- 5 MB en bytes
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;

-- Storage RLS: lectura pública en event-photos
create policy "event_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'event-photos');

-- Storage RLS: cualquier usuario puede subir a event-photos
create policy "event_photos_public_insert"
  on storage.objects for insert
  with check (bucket_id = 'event-photos');
