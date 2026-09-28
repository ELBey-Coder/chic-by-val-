-- Run this once in Supabase > SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Dresses',
  price numeric(10,2) not null check (price >= 0),
  description text not null,
  sizes text,
  material text,
  image_url text not null,
  stripe_link text,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
drop policy if exists "Public reads active products" on public.products;
create policy "Public reads active products" on public.products for select using (active = true or auth.role() = 'authenticated');
drop policy if exists "Authenticated owner inserts products" on public.products;
create policy "Authenticated owner inserts products" on public.products for insert to authenticated with check (true);
drop policy if exists "Authenticated owner updates products" on public.products;
create policy "Authenticated owner updates products" on public.products for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated owner deletes products" on public.products;
create policy "Authenticated owner deletes products" on public.products for delete to authenticated using (true);
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "Public reads product images" on storage.objects;
create policy "Public reads product images" on storage.objects for select using (bucket_id='product-images');
drop policy if exists "Authenticated owner uploads product images" on storage.objects;
create policy "Authenticated owner uploads product images" on storage.objects for insert to authenticated with check (bucket_id='product-images');
drop policy if exists "Authenticated owner updates product images" on storage.objects;
create policy "Authenticated owner updates product images" on storage.objects for update to authenticated using (bucket_id='product-images') with check (bucket_id='product-images');
drop policy if exists "Authenticated owner deletes product images" on storage.objects;
create policy "Authenticated owner deletes product images" on storage.objects for delete to authenticated using (bucket_id='product-images');

-- Safe for an existing catalog: run before publishing the new owner form.
alter table public.products add column if not exists colors text;
