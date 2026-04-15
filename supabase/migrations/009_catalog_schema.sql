create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_category_id uuid references public.categories(id) on delete set null,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  status text not null default 'draft',
  product_type text not null default 'simple',
  base_price numeric(12,2),
  compare_price numeric(12,2),
  stock_quantity integer,
  sku text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_status_check check (status in ('published', 'draft', 'out_of_stock')),
  constraint products_type_check check (product_type in ('simple', 'variable'))
);

create table if not exists public.product_attributes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  values text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  sku text,
  price numeric(12,2),
  stock_quantity integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint variants_status_check check (status in ('active', 'inactive'))
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  cta_text text,
  cta_link text,
  placement text not null,
  status text not null default 'draft',
  image_url text,
  priority integer not null default 1,
  schedule_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint banners_status_check check (status in ('draft', 'active', 'scheduled'))
);

create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_product_attributes_product_id on public.product_attributes(product_id);
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);