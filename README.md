# Rodriguez Alberghini | Portal Inmobiliario

Portal inmobiliario completo para Rodriguez Alberghini - Negocios Inmobiliarios, Balcarce, Buenos Aires.

## Stack Tecnologico

- **Framework:** Next.js 16 (App Router)
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage)
- **Estilos:** Tailwind CSS v4
- **Lenguaje:** TypeScript
- **UI:** Radix UI, Lucide Icons, Sonner (toasts)
- **Formularios:** React Hook Form + Zod
- **Media:** Swiper, React Player, React Dropzone

## Setup Local

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd portal-inmobiliario-JDA
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar `.env.example` a `.env.local` y completar con tus credenciales de Supabase:

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configurar Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com)
2. Ir a SQL Editor y ejecutar el contenido de `supabase/schema.sql`
3. Crear el primer usuario superadmin (ver abajo)

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Crear primer usuario Superadmin

1. En Supabase Dashboard, ir a **Authentication > Users > Add User**
2. Crear un usuario con email y password
3. Copiar el UUID del usuario creado
4. En SQL Editor, ejecutar:

```sql
INSERT INTO admin_users (id, email, nombre, rol)
VALUES ('[uuid-del-usuario-creado]', 'email@ejemplo.com', 'Nombre Admin', 'superadmin');
```

5. Acceder al panel admin en `/admin/login`

## Deploy en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar las variables de entorno en Vercel (las mismas de `.env.local`)
3. Deploy automatico con cada push a `main`

## Estructura del Proyecto

```
src/
├── app/                    # Rutas de la aplicacion
│   ├── page.tsx           # Home
│   ├── buscador/          # Buscador de propiedades
│   ├── destacados/        # Propiedades destacadas
│   ├── quienes-somos/     # Pagina institucional
│   ├── propiedades/[slug] # Landing de propiedad
│   └── admin/             # Panel de administracion
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y clientes
└── middleware.ts          # Proteccion de rutas admin
```
