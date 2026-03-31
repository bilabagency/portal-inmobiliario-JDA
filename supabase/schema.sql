-- Tabla configuración del sitio
create table if not exists site_config (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);

-- Tabla propiedades
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  precio numeric,
  moneda text default 'ARS',
  tipologia text not null,
  operacion text not null,
  dormitorios integer,
  banos integer,
  superficie_total numeric,
  superficie_cubierta numeric,
  barrio text,
  direccion text,
  destacado boolean default false,
  activo boolean default true,
  slug text unique,
  landing_tipo text default 'visual',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla media de propiedades
create table if not exists property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  url text not null,
  tipo text not null,
  orden integer default 0,
  es_principal boolean default false,
  created_at timestamptz default now()
);

-- Tabla consultas
create table if not exists consultas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  email text,
  mensaje text,
  property_id uuid references properties(id) on delete set null,
  leida boolean default false,
  created_at timestamptz default now()
);

-- Tabla usuarios admin
create table if not exists admin_users (
  id uuid primary key references auth.users(id),
  email text not null,
  nombre text,
  rol text default 'editor',
  created_at timestamptz default now()
);

-- RLS
alter table properties enable row level security;
alter table property_media enable row level security;
alter table consultas enable row level security;
alter table site_config enable row level security;
alter table admin_users enable row level security;

create policy "Public read active properties" on properties for select using (activo = true);
create policy "Admin all properties" on properties for all using (auth.uid() in (select id from admin_users));
create policy "Public read media" on property_media for select using (true);
create policy "Admin all media" on property_media for all using (auth.uid() in (select id from admin_users));
create policy "Public insert consultas" on consultas for insert with check (true);
create policy "Admin read consultas" on consultas for select using (auth.uid() in (select id from admin_users));
create policy "Admin update consultas" on consultas for update using (auth.uid() in (select id from admin_users));
create policy "Admin delete consultas" on consultas for delete using (auth.uid() in (select id from admin_users));
create policy "Public read config" on site_config for select using (true);
create policy "Admin all config" on site_config for all using (auth.uid() in (select id from admin_users));
create policy "Admin read users" on admin_users for select using (auth.uid() in (select id from admin_users));
create policy "Superadmin manage users" on admin_users for all using (auth.uid() in (select id from admin_users where rol = 'superadmin'));

-- Storage
insert into storage.buckets (id, name, public) values ('property-media', 'property-media', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('site-assets', 'site-assets', true) on conflict do nothing;

create policy "Public read property-media" on storage.objects for select using (bucket_id = 'property-media');
create policy "Admin upload property-media" on storage.objects for insert with check (bucket_id = 'property-media' and auth.uid() in (select id from admin_users));
create policy "Admin delete property-media" on storage.objects for delete using (bucket_id = 'property-media' and auth.uid() in (select id from admin_users));
create policy "Public read site-assets" on storage.objects for select using (bucket_id = 'site-assets');
create policy "Admin upload site-assets" on storage.objects for insert with check (bucket_id = 'site-assets' and auth.uid() in (select id from admin_users));
create policy "Admin delete site-assets" on storage.objects for delete using (bucket_id = 'site-assets' and auth.uid() in (select id from admin_users));

-- Trigger slug automático
create or replace function set_property_slug()
returns trigger as $$
begin
  if NEW.slug is null or NEW.slug = '' then
    NEW.slug := lower(regexp_replace(NEW.titulo, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(NEW.id::text, 1, 8);
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger property_slug_trigger
  before insert on properties
  for each row execute function set_property_slug();

-- Config inicial del sitio
insert into site_config (key, value) values
  ('meta_pixel_id', ''),
  ('hero_titulo_negro', 'Encontra el lugar'),
  ('hero_titulo_rojo', 'ideal para tu familia'),
  ('hero_subtitulo', 'Acompañamos tus proyectos inmobiliarios con transparencia, experiencia y el mejor trato humano.'),
  ('hero_imagen_url', ''),
  ('about_titulo', 'Conocemos nuestra ciudad.'),
  ('about_texto1', 'Somos Rodriguez Alberghini, una inmobiliaria con arraigo y vision de futuro en Balcarce.'),
  ('about_texto2', 'Trabajamos cada dia para unir familias con sus hogares ideales, priorizando siempre la honestidad y la transparencia.'),
  ('about_mision', 'Nuestra mision es cuidar tu patrimonio como si fuera el nuestro.'),
  ('about_imagen_url', ''),
  ('contacto_whatsapp', ''),
  ('contacto_email', ''),
  ('contacto_direccion', 'Balcarce, Buenos Aires'),
  ('seo_titulo', 'Rodriguez Alberghini | Negocios Inmobiliarios'),
  ('seo_descripcion', 'Inmobiliaria en Balcarce, Buenos Aires. Propiedades en venta y alquiler.')
on conflict (key) do nothing;
