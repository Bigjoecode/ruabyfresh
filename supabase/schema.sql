-- ============================================================
-- Ruaby Fresh — Supabase schema
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run
-- ============================================================

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id           text primary key,
  name         text not null,
  variety      text,
  tagline      text,
  category     text not null check (category in ('Parfait','Yoghurt')),
  price        integer not null,
  launch_price integer not null,
  bulk_price   integer not null,
  size         text not null,
  image        text,
  colors       jsonb   not null default '["#ffffff","#f0a8c0","#8bc63f"]',
  badge        text,
  ingredients  jsonb   not null default '[]',
  benefits     jsonb   not null default '[]',
  sort_order   integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ---------- SETTINGS (single JSON row: hero, offers, launch date, etc.) ----------
create table if not exists public.settings (
  id         integer primary key default 1,
  data       jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
insert into public.settings (id, data) values (1, '{}') on conflict (id) do nothing;

-- ---------- ORDERS / BOOKINGS ----------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  reference      text unique not null,
  customer_name  text,
  customer_phone text,
  fulfilment     text,
  address        text,
  note           text,
  items          jsonb   not null default '[]',
  total          integer not null default 0,
  bulk           boolean not null default false,
  receipt_url    text,
  status         text    not null default 'new',
  created_at     timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.products enable row level security;
alter table public.settings enable row level security;
alter table public.orders   enable row level security;

-- Anyone may READ products + settings (the public storefront).
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (true);

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);

-- Signed-in admins may do everything with products + settings.
drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write settings" on public.settings;
create policy "admin write settings" on public.settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Orders: only signed-in admins may read/update. (Inserts happen server-side
-- with the service-role key, which bypasses RLS — so no public insert policy.)
drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders" on public.orders for select using (auth.role() = 'authenticated');

drop policy if exists "admin update orders" on public.orders;
create policy "admin update orders" on public.orders for update using (auth.role() = 'authenticated');

-- ---------- Storage buckets ----------
-- receipts are PRIVATE (viewed via short-lived signed URLs in the admin).
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false) on conflict (id) do update set public = false;
-- product/hero images are public (shown on the storefront).
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('hero-images', 'hero-images', true) on conflict (id) do nothing;

-- Public read of the image buckets only; receipts + all writes use the
-- service-role key (which bypasses these policies).
drop policy if exists "public read buckets" on storage.objects;
create policy "public read buckets" on storage.objects for select
  using (bucket_id in ('product-images','hero-images'));

-- Done. Now create your admin login: Authentication → Users → Add user
-- (email + password), and add the env vars from .env.example to Vercel.
